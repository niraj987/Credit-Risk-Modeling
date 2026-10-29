from datetime import datetime
from typing import Dict, Any, List
from ..state import CreditUnderwritingState, AgentLogEntry


def run_fairness_stress_agent(state: CreditUnderwritingState) -> Dict[str, Any]:
    """
    Layer 4 Agent: Fair Lending Auditor & Macro Stress Testing Engine.
    Executes Disparate Impact (Four-Fifths Rule) validation and CCAR macro shock simulations.
    """
    timestamp = datetime.now().isoformat()
    applicant = state["applicant_data"]
    ml_eval = state.get("ml_risk_assessment", {})
    baseline_pd = ml_eval.get("probability_of_default", 0.15)
    loan_amount = float(applicant.get("LoanAmount", 10000.0))
    emp_type = applicant.get("EmploymentType", "Full-time")

    # 1. Fair Lending & Disparate Impact Benchmark (Four-Fifths / 80% Rule)
    # Benchmark empirical approval rates across cohorts
    cohort_benchmarks = {
        "Full-time": 0.84,
        "Part-time": 0.71,
        "Self-employed": 0.74,
        "Unemployed": 0.32
    }
    reference_rate = cohort_benchmarks["Full-time"]
    applicant_cohort_rate = cohort_benchmarks.get(emp_type, 0.70)
    adverse_impact_ratio = applicant_cohort_rate / reference_rate

    four_fifths_compliant = adverse_impact_ratio >= 0.80

    fairness_audit = {
        "applicant_cohort": emp_type,
        "cohort_approval_rate": applicant_cohort_rate,
        "reference_benchmark_rate": reference_rate,
        "adverse_impact_ratio": round(adverse_impact_ratio, 3),
        "four_fifths_rule_passed": four_fifths_compliant,
        "disparate_impact_verdict": "COMPLIANT" if four_fifths_compliant else "AUDIT_FLAG_MONITORING_REQUIRED"
    }

    # 2. CCAR Macroeconomic Stress Testing Scenarios
    # Scenario A: Baseline
    pd_baseline = baseline_pd
    el_baseline = round(pd_baseline * loan_amount * 0.45, 2)

    # Scenario B: Adverse (+150 bps rate shock, unemployment rise)
    pd_adverse = min(0.99, round(baseline_pd * 1.35, 4))
    el_adverse = round(pd_adverse * loan_amount * 0.45, 2)

    # Scenario C: Severely Adverse (+300 bps rate shock, deep recession)
    pd_severe = min(0.99, round(baseline_pd * 1.80, 4))
    el_severe = round(pd_severe * loan_amount * 0.45, 2)

    resilience_passed = pd_severe < 0.65

    stress_test_results = {
        "baseline": {
            "scenario": "Baseline Macro",
            "stressed_pd_pct": round(pd_baseline * 100, 2),
            "expected_loss_usd": el_baseline
        },
        "adverse": {
            "scenario": "Adverse Shock (+150 bps)",
            "stressed_pd_pct": round(pd_adverse * 100, 2),
            "expected_loss_usd": el_adverse
        },
        "severely_adverse": {
            "scenario": "Severely Adverse Crash (+300 bps, 10% unemp)",
            "stressed_pd_pct": round(pd_severe * 100, 2),
            "expected_loss_usd": el_severe
        },
        "stress_test_resilience_passed": resilience_passed
    }

    compliance_bias_audit = {
        "fairness_audit": fairness_audit,
        "stress_test_results": stress_test_results,
        "overall_layer4_cleared": four_fifths_compliant and resilience_passed,
        "timestamp": timestamp
    }

    log_entry: AgentLogEntry = {
        "timestamp": timestamp,
        "agent_name": "Fairness_Stress_Testing_Agent",
        "layer": 4,
        "status": "RESILIENT" if resilience_passed else "VULNERABLE_UNDER_STRESS",
        "summary": f"AIR: {adverse_impact_ratio:.2f} (Passed: {four_fifths_compliant}) | Severe Stress PD: {pd_severe:.1%}",
        "details": compliance_bias_audit
    }

    current_logs = list(state.get("agent_logs", []))
    current_logs.append(log_entry)

    return {
        "compliance_bias_audit": compliance_bias_audit,
        "agent_logs": current_logs
    }
