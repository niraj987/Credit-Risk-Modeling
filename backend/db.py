import sqlite3
import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "credit_audit.db")


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS credit_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        applicant_id TEXT UNIQUE,
        credit_score INTEGER,
        income REAL,
        loan_amount REAL,
        dti_ratio REAL,
        pd_percent REAL,
        rating_grade TEXT,
        expected_loss REAL,
        final_decision TEXT,
        recommended_apr REAL,
        timestamp TEXT,
        state_json TEXT
    )
    """)
    conn.commit()
    conn.close()


def save_application_record(state: Dict[str, Any]) -> str:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    applicant = state.get("applicant_data", {})
    ml = state.get("ml_risk_assessment", {})
    comm = state.get("credit_committee_synthesis", {})

    timestamp = state.get("credit_committee_synthesis", {}).get("timestamp", datetime.now().isoformat())
    applicant_id = f"APP-{datetime.now().strftime('%Y%m%d%H%M%S')}-{applicant.get('CreditScore', 650)}"

    cursor.execute("""
    INSERT INTO credit_applications (
        applicant_id, credit_score, income, loan_amount, dti_ratio,
        pd_percent, rating_grade, expected_loss, final_decision,
        recommended_apr, timestamp, state_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        applicant_id,
        applicant.get("CreditScore", 650),
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
    conn.commit()
    conn.close()
    return applicant_id


def get_recent_applications(limit: int = 15) -> List[Dict[str, Any]]:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("""
    SELECT applicant_id, credit_score, income, loan_amount, dti_ratio,
           pd_percent, rating_grade, expected_loss, final_decision,
           recommended_apr, timestamp
    FROM credit_applications
    ORDER BY id DESC
    LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_application_by_id(app_id: str) -> Optional[Dict[str, Any]]:
    init_db()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT state_json FROM credit_applications WHERE applicant_id = ?", (app_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return json.loads(row["state_json"])
    return None
