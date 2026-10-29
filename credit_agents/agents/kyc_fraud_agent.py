from datetime import datetime
from typing import Dict, Any, List
from ..state import CreditUnderwritingState, AgentLogEntry


def run_kyc_fraud_agent(state: CreditUnderwritingState) -> Dict[str, Any]:
    """
    Layer 1 Agent: KYC, Identity Verification & Financial Data Anomaly Detection.
    Performs data consistency checks, sanity tests, and synthetic profile detection.
    """
    applicant = state["applicant_data"]
    timestamp = datetime.now().isoformat()
    
    flags: List[str] = []
    anomaly_points: float = 0.0

    age = applicant.get("Age", 35)
    months_employed = applicant.get("MonthsEmployed", 0)
    income = applicant.get("Income", 50000.0)
    loan_amount = applicant.get("LoanAmount", 10000.0)
    dti_ratio = applicant.get("DTIRatio", 0.3)
    num_credit_lines = applicant.get("NumCreditLines", 3)

    # 1. Age vs Employment plausibility
    working_years = months_employed / 12.0
    if (age - working_years) < 16:
        flags.append(f"Inconsistent tenure: Employed for {working_years:.1f} years at age {age}.")
        anomaly_points += 0.35

    # 2. Extreme DTI check
    if dti_ratio > 0.60:
        flags.append(f"Severe Debt-to-Income anomaly: DTI of {dti_ratio:.1%} exceeds normal bounds.")
        anomaly_points += 0.30
    elif dti_ratio < 0.02 and num_credit_lines > 5:
        flags.append(f"Suspect credit depth: {num_credit_lines} lines reported but DTI is under 2%.")
        anomaly_points += 0.15

    # 3. Loan-to-Income leverage ratio
    lti_ratio = loan_amount / max(income, 1.0)
    if lti_ratio > 3.0:
        flags.append(f"Excessive Loan-to-Income leverage: Loan is {lti_ratio:.1f}x annual income.")
        anomaly_points += 0.25

    # 4. Employment status vs reported income
    emp_type = applicant.get("EmploymentType", "Full-time")
    if emp_type == "Unemployed" and income > 80000.0:
        flags.append(f"Unverified income stream: High income (${income:,.0f}) claimed while listed as Unemployed.")
        anomaly_points += 0.30

    anomaly_score = min(1.0, round(anomaly_points, 3))
    
    if anomaly_score >= 0.50:
        kyc_status = "CRITICAL_FRAUD_ALERT"
    elif anomaly_score >= 0.25:
        kyc_status = "FLAGGED_FOR_REVIEW"
    else:
        kyc_status = "PASSED"

    findings = {
        "status": kyc_status,
        "anomaly_score": anomaly_score,
        "flags": flags,
        "loan_to_income_ratio": round(lti_ratio, 2),
        "kyc_verified": kyc_status == "PASSED",
        "timestamp": timestamp
    }

    log_entry: AgentLogEntry = {
        "timestamp": timestamp,
        "agent_name": "KYC_Anomaly_Agent",
        "layer": 1,
        "status": kyc_status,
        "summary": f"KYC Audit completed with status: {kyc_status} (Anomaly Score: {anomaly_score})",
        "details": findings
    }

    current_logs = list(state.get("agent_logs", []))
    current_logs.append(log_entry)

    return {
        "fraud_kyc_findings": findings,
        "agent_logs": current_logs
    }
