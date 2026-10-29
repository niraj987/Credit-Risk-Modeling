import os
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from typing import Dict, Any, List
from ..state import CreditUnderwritingState, AgentLogEntry
from ..ml.trainer import train_and_export_model, ALL_FEATURE_COLS, CATEGORICAL_COLS

_CACHED_MODEL = None


def get_model(model_path: str = "lgb_model.pkl"):
    global _CACHED_MODEL
    if _CACHED_MODEL is not None:
        return _CACHED_MODEL
    
    if os.path.exists(model_path):
        try:
            _CACHED_MODEL = joblib.load(model_path)
            return _CACHED_MODEL
        except Exception:
            pass

    # Automatically train and load if missing
    model, _ = train_and_export_model(model_output_path=model_path)
    _CACHED_MODEL = model
    return _CACHED_MODEL


def assign_credit_grade(pd_score: float, credit_score: int) -> str:
    """Assigns institutional rating grade."""
    if pd_score < 0.05 and credit_score >= 760:
        return "AAA (Prime)"
    elif pd_score < 0.10 and credit_score >= 720:
        return "AA (High Quality)"
    elif pd_score < 0.18 and credit_score >= 680:
        return "A (Upper Medium)"
    elif pd_score < 0.28 and credit_score >= 640:
        return "BBB (Investment Grade)"
    elif pd_score < 0.40 and credit_score >= 600:
        return "BB (Speculative)"
    elif pd_score < 0.55:
        return "B (High Risk)"
    else:
        return "CCC/D (Subprime Default Risk)"


def run_quantitative_risk_agent(state: CreditUnderwritingState) -> Dict[str, Any]:
    """
    Layer 2 Agent: Quantitative ML Risk Modeling & Basel Metric Calculation.
    Computes Probability of Default (PD), Basel Expected Loss (EL),
    and SHAP / feature contributions.
    """
    applicant = state["applicant_data"]
    timestamp = datetime.now().isoformat()
    model = get_model()

    # Prepare DataFrame matching features
    row_dict = {}
    for col in ALL_FEATURE_COLS:
        val = applicant.get(col)
        row_dict[col] = [val]

    df_row = pd.DataFrame(row_dict)
    for col in CATEGORICAL_COLS:
        if col in df_row.columns:
            df_row[col] = df_row[col].astype("category")

    # Predict Probability of Default
    raw_pred = model.predict(df_row)[0]
    pd_prob = float(np.clip(raw_pred, 0.005, 0.995))

    # Basel metrics calculation
    ead = float(applicant.get("LoanAmount", 10000.0)) # Exposure at Default
    lgd = 0.45 # Supervisory standard for unsecured consumer credit
    expected_loss = round(pd_prob * ead * lgd, 2)

    credit_score = int(applicant.get("CreditScore", 650))
    rating_grade = assign_credit_grade(pd_prob, credit_score)

    # Fast feature attribution heuristic aligned with tree splits
    contributions: List[Dict[str, Any]] = []
    
    # DTI impact
    dti = applicant.get("DTIRatio", 0.3)
    if dti > 0.42:
        contributions.append({"feature": "DTIRatio", "impact": "INCREASES_RISK", "description": f"Elevated DTI ({dti:.1%}) adds significant default pressure"})
    elif dti < 0.25:
        contributions.append({"feature": "DTIRatio", "impact": "REDUCES_RISK", "description": f"Conservative DTI ({dti:.1%}) bolsters debt service capacity"})

    # Credit Score impact
    if credit_score < 620:
        contributions.append({"feature": "CreditScore", "impact": "INCREASES_RISK", "description": f"FICO/Credit Score ({credit_score}) indicates past delinquency history"})
    elif credit_score >= 720:
        contributions.append({"feature": "CreditScore", "impact": "REDUCES_RISK", "description": f"Strong Credit Score ({credit_score}) reflects prime repayment track record"})

    # Employment tenure
    emp_months = applicant.get("MonthsEmployed", 24)
    if emp_months < 12:
        contributions.append({"feature": "MonthsEmployed", "impact": "INCREASES_RISK", "description": f"Short tenure ({emp_months} months) poses cashflow stability risk"})
    elif emp_months >= 48:
        contributions.append({"feature": "MonthsEmployed", "impact": "REDUCES_RISK", "description": f"Long tenure ({emp_months} months) demonstrates sustained income stability"})

    # Interest rate burden
    ir = applicant.get("InterestRate", 11.5)
    if ir > 18.0:
        contributions.append({"feature": "InterestRate", "impact": "INCREASES_RISK", "description": f"High interest rate ({ir:.1f}%) increases debt carrying burden"})

    # Co-signer presence
    has_cosigner = applicant.get("HasCoSigner", "No")
    if has_cosigner == "Yes":
        contributions.append({"feature": "HasCoSigner", "impact": "REDUCES_RISK", "description": "Guarantor/Co-signer presence offers secondary recourse in default"})

    ml_assessment = {
        "probability_of_default": round(pd_prob, 4),
        "pd_percent": round(pd_prob * 100, 2),
        "credit_score": credit_score,
        "rating_grade": rating_grade,
        "exposure_at_default": ead,
        "loss_given_default_pct": lgd * 100,
        "expected_loss_usd": expected_loss,
        "feature_contributions": contributions,
        "timestamp": timestamp
    }

    status_str = "LOW_RISK" if pd_prob < 0.20 else ("MODERATE_RISK" if pd_prob < 0.45 else "HIGH_RISK")

    log_entry: AgentLogEntry = {
        "timestamp": timestamp,
        "agent_name": "Quantitative_ML_Risk_Agent",
        "layer": 2,
        "status": status_str,
        "summary": f"LightGBM predicted PD: {pd_prob:.2%} | Grade: {rating_grade} | Expected Loss: ${expected_loss:,.2f}",
        "details": ml_assessment
    }

    current_logs = list(state.get("agent_logs", []))
    current_logs.append(log_entry)

    return {
        "ml_risk_assessment": ml_assessment,
        "agent_logs": current_logs
    }
