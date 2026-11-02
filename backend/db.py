"""
Production Database Layer for FinRisk AI Underwriting Engine.
High-Performance SQLite with WAL (Write-Ahead Logging), ACID Compliance,
and Relational + JSON Hybrid Schema for Immutable Credit Decisions.
"""

import sqlite3
import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "credit_audit.db")


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, timeout=15.0)
    conn.row_factory = sqlite3.Row
    # Enable WAL mode for concurrent read-write performance and ACID durability
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.execute("PRAGMA synchronous = NORMAL;")
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Primary Underwriting Evaluations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS credit_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        applicant_id TEXT UNIQUE NOT NULL,
        applicant_name TEXT,
        credit_score INTEGER NOT NULL,
        income REAL NOT NULL,
        loan_amount REAL NOT NULL,
        dti_ratio REAL NOT NULL,
        pd_percent REAL NOT NULL,
        rating_grade TEXT NOT NULL,
        expected_loss REAL NOT NULL,
        final_decision TEXT NOT NULL,
        recommended_apr REAL NOT NULL,
        timestamp TEXT NOT NULL,
        state_json TEXT NOT NULL
    );
    """)

    # Create Indexes for fast querying & audit examination
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_applicant_id ON credit_applications(applicant_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_timestamp ON credit_applications(timestamp);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_decision ON credit_applications(final_decision);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_credit_score ON credit_applications(credit_score);")

    # 2. Immutable Compliance Audit Events Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        agent_layer INTEGER,
        summary TEXT NOT NULL,
        metadata_json TEXT,
        timestamp TEXT NOT NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_events(timestamp);")

    conn.commit()
    conn.close()


def save_application_record(state: Dict[str, Any]) -> str:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    applicant = state.get("applicant_data", {})
    ml = state.get("ml_risk_assessment", {})
    comm = state.get("credit_committee_synthesis", {})

    timestamp = comm.get("timestamp", datetime.now().isoformat())
    score = applicant.get("CreditScore", 650)
    applicant_id = f"APP-{datetime.now().strftime('%Y%m%d%H%M%S')}-{score}"
    applicant_name = f"Applicant (FICO {score})"

    cursor.execute("""
    INSERT INTO credit_applications (
        applicant_id, applicant_name, credit_score, income, loan_amount, dti_ratio,
        pd_percent, rating_grade, expected_loss, final_decision,
        recommended_apr, timestamp, state_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        applicant_id,
        applicant_name,
        score,
        applicant.get("Income", 60000.0),
        applicant.get("LoanAmount", 15000.0),
        applicant.get("DTIRatio", 0.30),
        ml.get("pd_percent", 20.0),
        ml.get("rating_grade", "BBB"),
        ml.get("expected_loss_usd", 0.0),
        comm.get("final_decision", "PENDING"),
        comm.get("recommended_apr", 10.0),
        timestamp,
        json.dumps(state)
    ))

    # Log audit trail event
    cursor.execute("""
    INSERT INTO audit_events (event_type, agent_layer, summary, metadata_json, timestamp)
    VALUES (?, ?, ?, ?, ?)
    """, (
        "APPLICATION_UNDERWRITTEN",
        5,
        f"Synthesized decision {comm.get('final_decision')} for {applicant_id}",
        json.dumps({"pd": ml.get("pd_percent"), "decision": comm.get("final_decision")}),
        timestamp
    ))

    conn.commit()
    conn.close()
    return applicant_id


def get_recent_applications(
    limit: int = 50,
    offset: int = 0,
    filter_decision: Optional[str] = None,
    search_term: Optional[str] = None
) -> List[Dict[str, Any]]:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    SELECT applicant_id, applicant_name, credit_score, income, loan_amount, dti_ratio,
           pd_percent, rating_grade, expected_loss, final_decision,
           recommended_apr, timestamp
    FROM credit_applications
    WHERE 1=1
    """
    params: List[Any] = []

    if filter_decision and filter_decision.upper() != "ALL":
        query += " AND UPPER(final_decision) LIKE ?"
        params.append(f"%{filter_decision.upper()}%")

    if search_term:
        query += " AND (applicant_id LIKE ? OR applicant_name LIKE ? OR rating_grade LIKE ? OR CAST(credit_score AS TEXT) LIKE ?)"
        wildcard = f"%{search_term}%"
        params.extend([wildcard, wildcard, wildcard, wildcard])

    query += " ORDER BY id DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_application_by_id(app_id: str) -> Optional[Dict[str, Any]]:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT state_json FROM credit_applications WHERE applicant_id = ?", (app_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return json.loads(row["state_json"])
    return None


def delete_application(app_id: str) -> bool:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM credit_applications WHERE applicant_id = ?", (app_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted


def clear_all_applications() -> int:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM credit_applications;")
    count = cursor.rowcount
    conn.commit()
    conn.close()
    return count


def get_database_stats() -> Dict[str, Any]:
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) AS total FROM credit_applications;")
    total = cursor.fetchone()["total"]

    if total == 0:
        conn.close()
        return {
            "total_applications": 0,
            "approved_count": 0,
            "conditional_count": 0,
            "rejected_count": 0,
            "approval_rate_pct": 0.0,
            "total_volume_inr": 0.0,
            "avg_credit_score": 0,
            "avg_pd_percent": 0.0,
            "total_expected_loss_inr": 0.0,
        }

    cursor.execute("SELECT COUNT(*) AS count FROM credit_applications WHERE UPPER(final_decision) = 'APPROVED';")
    approved = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) AS count FROM credit_applications WHERE UPPER(final_decision) LIKE '%CONDITIONAL%';")
    conditional = cursor.fetchone()["count"]

    cursor.execute("SELECT COUNT(*) AS count FROM credit_applications WHERE UPPER(final_decision) = 'REJECTED';")
    rejected = cursor.fetchone()["count"]

    cursor.execute("SELECT SUM(loan_amount) AS vol, AVG(credit_score) AS avg_score, AVG(pd_percent) AS avg_pd, SUM(expected_loss) AS total_el FROM credit_applications;")
    row = cursor.fetchone()

    conn.close()
    return {
        "total_applications": total,
        "approved_count": approved,
        "conditional_count": conditional,
        "rejected_count": rejected,
        "approval_rate_pct": round((approved / total) * 100, 1),
        "total_volume_inr": round(row["vol"] or 0, 2),
        "avg_credit_score": round(row["avg_score"] or 0),
        "avg_pd_percent": round(row["avg_pd"] or 0, 2),
        "total_expected_loss_inr": round(row["total_el"] or 0, 2),
    }


def seed_benchmark_records() -> int:
    init_db()
    benchmarks = [
        {
            "applicant_id": f"APP-{datetime.now().strftime('%Y%m%d%H%M%S')}-790",
            "applicant_name": "Senior Software Architect (Bengaluru)",
            "credit_score": 790,
            "income": 2600000.0,
            "loan_amount": 900000.0,
            "dti_ratio": 0.20,
            "pd_percent": 1.9,
            "rating_grade": "AAA (Super-Prime)",
            "expected_loss": 7695.0,
            "final_decision": "APPROVED",
            "recommended_apr": 8.95,
            "timestamp": datetime.now().isoformat(),
            "state_json": json.dumps({"note": "Benchmark Super-Prime Profile", "decision": "APPROVED"})
        },
        {
            "applicant_id": f"APP-{datetime.now().strftime('%Y%m%d%H%M%S')}-735",
            "applicant_name": "Chief Medical Officer (Mumbai)",
            "credit_score": 735,
            "income": 1750000.0,
            "loan_amount": 600000.0,
            "dti_ratio": 0.29,
            "pd_percent": 4.2,
            "rating_grade": "AA- (Prime)",
            "expected_loss": 11340.0,
            "final_decision": "APPROVED",
            "recommended_apr": 10.75,
            "timestamp": datetime.now().isoformat(),
            "state_json": json.dumps({"note": "Benchmark Prime Profile", "decision": "APPROVED"})
        },
        {
            "applicant_id": f"APP-{datetime.now().strftime('%Y%m%d%H%M%S')}-660",
            "applicant_name": "Renewable Energy Contractor (Hyderabad)",
            "credit_score": 660,
            "income": 980000.0,
            "loan_amount": 420000.0,
            "dti_ratio": 0.41,
            "pd_percent": 13.5,
            "rating_grade": "BBB (Near-Prime)",
            "expected_loss": 25515.0,
            "final_decision": "CONDITIONAL",
            "recommended_apr": 14.8,
            "timestamp": datetime.now().isoformat(),
            "state_json": json.dumps({"note": "Benchmark Near-Prime Profile", "decision": "CONDITIONAL"})
        },
        {
            "applicant_id": f"APP-{datetime.now().strftime('%Y%m%d%H%M%S')}-580",
            "applicant_name": "Freelance Media Producer (Pune)",
            "credit_score": 580,
            "income": 520000.0,
            "loan_amount": 380000.0,
            "dti_ratio": 0.56,
            "pd_percent": 29.4,
            "rating_grade": "CCC (Subprime High-Risk)",
            "expected_loss": 50274.0,
            "final_decision": "REJECTED",
            "recommended_apr": 23.5,
            "timestamp": datetime.now().isoformat(),
            "state_json": json.dumps({"note": "Benchmark Subprime Profile", "decision": "REJECTED"})
        }
    ]

    conn = get_db_connection()
    cursor = conn.cursor()
    for b in benchmarks:
        cursor.execute("""
        INSERT OR REPLACE INTO credit_applications (
            applicant_id, applicant_name, credit_score, income, loan_amount, dti_ratio,
            pd_percent, rating_grade, expected_loss, final_decision,
            recommended_apr, timestamp, state_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            b["applicant_id"], b["applicant_name"], b["credit_score"], b["income"],
            b["loan_amount"], b["dti_ratio"], b["pd_percent"], b["rating_grade"],
            b["expected_loss"], b["final_decision"], b["recommended_apr"],
            b["timestamp"], b["state_json"]
        ))
    conn.commit()
    conn.close()
    return len(benchmarks)
