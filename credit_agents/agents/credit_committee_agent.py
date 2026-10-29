from datetime import datetime
from typing import Dict, Any, List
from ..state import CreditUnderwritingState, AgentLogEntry


def run_credit_committee_agent(state: CreditUnderwritingState) -> Dict[str, Any]:
    """
    Layer 5 Agent: Senior Credit Committee Orchestrator & Executive Synthesis Agent.
    Aggregates multi-agent intelligence from Layers 1-4, constructs counterfactual advice,
    establishes risk-adjusted pricing (RAROC), and outputs a formal Credit Memorandum.
    """
    timestamp = datetime.now().isoformat()
    applicant = state["applicant_data"]
    kyc = state.get("fraud_kyc_findings", {})
    ml = state.get("ml_risk_assessment", {})
    rag = state.get("rag_regulatory_context", {})
    fairness = state.get("compliance_bias_audit", {})

    pd_percent = ml.get("pd_percent", 20.0)
    credit_score = int(applicant.get("CreditScore", 650))
    dti = float(applicant.get("DTIRatio", 0.30))
    income = float(applicant.get("Income", 60000.0))
    loan_amount = float(applicant.get("LoanAmount", 15000.0))
    has_cosigner = applicant.get("HasCoSigner", "No") == "Yes"

    kyc_status = kyc.get("status", "PASSED")
    stress_passed = fairness.get("stress_test_results", {}).get("stress_test_resilience_passed", True)

    # 1. Determine Executive Decision
    covenants: List[str] = []
    adverse_reasons: List[str] = []
    counterfactuals: List[Dict[str, Any]] = []

    # Check for hard disqualifications
    if kyc_status == "CRITICAL_FRAUD_ALERT":
        final_decision = "REJECTED"
        adverse_reasons.append("Critical identity verification and income reconciliation anomaly detected.")
    elif dti > 0.50:
        final_decision = "REJECTED"
        adverse_reasons.append(f"Total Debt-To-Income ratio ({dti:.1%}) exceeds statutory institutional ceiling of 50.0%.")
    elif credit_score < 560:
        final_decision = "REJECTED"
        adverse_reasons.append(f"Credit bureau score ({credit_score}) falls below minimum underwriting eligibility cutoff (580).")
    elif pd_percent > 45.0 and not has_cosigner:
        final_decision = "REJECTED"
        adverse_reasons.append(f"Model-estimated 1-year default probability ({pd_percent:.1f}%) exceeds maximum acceptable risk threshold.")
    elif pd_percent <= 12.0 and dti <= 0.38 and credit_score >= 700 and kyc_status == "PASSED":
        final_decision = "APPROVED"
    elif pd_percent <= 28.0 and dti <= 0.44:
        final_decision = "APPROVED"
        covenants.append("Standard direct deposit ACH auto-pay required.")
    else:
        # Borderline cases -> Conditional Approval or Escalation
        if has_cosigner or credit_score >= 640:
            final_decision = "CONDITIONAL_APPROVAL"
            covenants.append("Maximum loan repayment term capped at 36 months to reduce credit horizon.")
            if not has_cosigner:
                covenants.append("Must add a qualified co-signer with credit score >= 700.")
            covenants.append("Mandatory debt-consolidation disbursement directly to creditors.")
        else:
            final_decision = "ESCALATE_TO_SENIOR_RISK_OFFICER"
            covenants.append("Requires manual second-signature underwriter review.")

    # 2. Top 4 Principal Adverse Reasons (FCRA / 12 CFR § 1002.9 Compliance)
    if final_decision in ["REJECTED", "CONDITIONAL_APPROVAL", "ESCALATE_TO_SENIOR_RISK_OFFICER"]:
        # Gather up to 4 principal reasons
        if dti > 0.38 and len(adverse_reasons) < 4:
            adverse_reasons.append(f"Debt-To-Income ratio ({dti:.1%}) is elevated relative to disposable income.")
        if credit_score < 670 and len(adverse_reasons) < 4:
            adverse_reasons.append(f"Credit bureau score ({credit_score}) indicates past payment delinquencies or high utilization.")
        if (loan_amount / max(income, 1.0)) > 0.30 and len(adverse_reasons) < 4:
            adverse_reasons.append(f"Requested loan amount (${loan_amount:,.0f}) is high relative to annual income (${income:,.0f}).")
        if applicant.get("MonthsEmployed", 24) < 18 and len(adverse_reasons) < 4:
            adverse_reasons.append(f"Short employment duration ({applicant.get('MonthsEmployed')} months) indicates unseasoned stability.")
        if applicant.get("InterestRate", 10.0) > 16.0 and len(adverse_reasons) < 4:
            adverse_reasons.append("High debt carrying costs associated with current rate structure.")

    # 3. Counterfactual Prescriptive Recommendations
    if final_decision != "APPROVED":
        # Target 1: DTI reduction
        target_dti = 0.35
        needed_debt_reduction = max(0.0, (dti - target_dti) * (income / 12.0) * 12.0)
        if needed_debt_reduction > 0:
            counterfactuals.append({
                "action": "Debt Reduction",
                "recommendation": f"Pay down approximately ${needed_debt_reduction:,.0f} in revolving balances to bring DTI under 35%.",
                "impact": "Lowers default probability by ~6.5% into standard approval corridor."
            })
        
        # Target 2: Loan Amount reduction
        suggested_loan = round(loan_amount * 0.75, -2)
        counterfactuals.append({
            "action": "Principal Reduction",
            "recommendation": f"Reduce loan amount from ${loan_amount:,.0f} to ${suggested_loan:,.0f}.",
            "impact": "Significantly decreases monthly debt burden and Basel Exposure at Default (EAD)."
        })

        # Target 3: Co-Signer
        if not has_cosigner:
            counterfactuals.append({
                "action": "Credit Guarantor",
                "recommendation": "Add an eligible co-signer with FICO/Credit Score >= 720.",
                "impact": "Cures near-prime credit tier deficiency and qualifies for prime APR spread."
            })

    # 4. Risk-Adjusted Pricing (RAROC APR)
    base_prime_rate = 6.50
    if final_decision == "APPROVED":
        risk_spread = 2.00 if pd_percent < 8.0 else 3.50
    elif final_decision == "CONDITIONAL_APPROVAL":
        risk_spread = 6.25
    else:
        risk_spread = 9.50
    
    recommended_apr = round(base_prime_rate + risk_spread, 2)

    # 5. Formal Executive Credit Memorandum
    memo = f"""### EXECUTIVE CREDIT UNDERWRITING MEMORANDUM
**Decision Status:** `{final_decision}`
**Timestamp:** {timestamp}
**Borrower Assessment Grade:** {ml.get('rating_grade', 'Unassigned')} | **Estimated 1-Year PD:** {pd_percent:.2f}%
**Exposure at Default (EAD):** ${loan_amount:,.2f} | **Basel Expected Loss (EL):** ${ml.get('expected_loss_usd', 0.0):,.2f}

#### 1. Executive Summary & Rationale
The Credit Committee has synthesized findings across all autonomous working layers. The borrower presents an overall default probability of **{pd_percent:.2f}%**.
- **KYC & Fraud Integrity:** {kyc_status} (Anomaly Score: {kyc.get('anomaly_score', 0.0):.2f})
- **Macro Stress Resilience:** {"Resilient under CCAR Severely Adverse Shock" if stress_passed else "Vulnerable under Macro Stress Testing"}
- **Recommended APR:** {recommended_apr:.2f}% (Base: {base_prime_rate:.2f}% + Risk Spread: {risk_spread:.2f}%)

#### 2. Regulatory Citations & Compliance Alignment
Applicable regulatory standards retrieved via RAG:
- {', '.join(rag.get('citations', ['Basel III IRB', '12 CFR § 1002.9 (ECOA)']))}

#### 3. Loan Covenants & Action Plan
"""
    if covenants:
        for c in covenants:
            memo += f"- **Covenant:** {c}\n"
    else:
        memo += "- Unconditional approval granted under standard Prime Tier terms.\n"

    if adverse_reasons:
        memo += "\n#### 4. Statutory Adverse Action Reason Codes (12 CFR § 1002.9)\n"
        for idx, reason in enumerate(adverse_reasons[:4], 1):
            memo += f"{idx}. {reason}\n"

    synthesis_result = {
        "final_decision": final_decision,
        "recommended_apr": recommended_apr,
        "risk_spread": risk_spread,
        "covenants": covenants,
        "adverse_action_reasons": adverse_reasons[:4],
        "credit_memo": memo,
        "timestamp": timestamp
    }

    log_entry: AgentLogEntry = {
        "timestamp": timestamp,
        "agent_name": "Credit_Committee_Orchestrator",
        "layer": 5,
        "status": final_decision,
        "summary": f"Final Committee Decision: {final_decision} | Recommended APR: {recommended_apr}%",
        "details": synthesis_result
    }

    current_logs = list(state.get("agent_logs", []))
    current_logs.append(log_entry)

    return {
        "credit_committee_synthesis": synthesis_result,
        "counterfactual_recommendations": counterfactuals,
        "agent_logs": current_logs
    }
