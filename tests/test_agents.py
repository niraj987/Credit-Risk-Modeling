import pytest
import os
from credit_agents.state import CreditUnderwritingState
from credit_agents.agents.kyc_fraud_agent import run_kyc_fraud_agent
from credit_agents.agents.quantitative_risk_agent import run_quantitative_risk_agent
from credit_agents.agents.policy_rag_agent import run_policy_rag_agent
from credit_agents.agents.fairness_stress_agent import run_fairness_stress_agent
from credit_agents.agents.credit_committee_agent import run_credit_committee_agent
from credit_agents.workflow import run_underwriting_pipeline
from credit_agents.rag.policy_retriever import PolicyRAGRetriever


@pytest.fixture
def sample_prime_applicant():
    return {
        "Age": 42,
        "Income": 125000.0,
        "LoanAmount": 20000.0,
        "CreditScore": 780,
        "MonthsEmployed": 96,
        "NumCreditLines": 5,
        "InterestRate": 6.8,
        "LoanTerm": 36,
        "DTIRatio": 0.18,
        "Education": "Master's",
        "EmploymentType": "Full-time",
        "MaritalStatus": "Married",
        "HasMortgage": "Yes",
        "HasDependents": "No",
        "LoanPurpose": "Home",
        "HasCoSigner": "No"
    }


@pytest.fixture
def sample_subprime_applicant():
    return {
        "Age": 24,
        "Income": 28000.0,
        "LoanAmount": 25000.0,
        "CreditScore": 520,
        "MonthsEmployed": 6,
        "NumCreditLines": 8,
        "InterestRate": 26.0,
        "LoanTerm": 60,
        "DTIRatio": 0.58,
        "Education": "High School",
        "EmploymentType": "Part-time",
        "MaritalStatus": "Single",
        "HasMortgage": "No",
        "HasDependents": "Yes",
        "LoanPurpose": "Other",
        "HasCoSigner": "No"
    }


def test_rag_retriever_indexing():
    retriever = PolicyRAGRetriever()
    assert len(retriever.chunks) > 0
    hits = retriever.search("adverse action reasons regulation b", top_k=2)
    assert len(hits) > 0
    assert any("ecoa" in h.source_doc.lower() for h in hits)


def test_kyc_fraud_agent_clean_profile(sample_prime_applicant):
    state: CreditUnderwritingState = {
        "applicant_data": sample_prime_applicant,
        "fraud_kyc_findings": {},
        "ml_risk_assessment": {},
        "rag_regulatory_context": {},
        "compliance_bias_audit": {},
        "counterfactual_recommendations": [],
        "credit_committee_synthesis": {},
        "agent_logs": [],
        "errors": []
    }
    result = run_kyc_fraud_agent(state)
    assert result["fraud_kyc_findings"]["status"] == "PASSED"
    assert result["fraud_kyc_findings"]["anomaly_score"] < 0.25


def test_kyc_fraud_agent_detects_anomaly():
    anomalous_applicant = {
        "Age": 20,
        "MonthsEmployed": 200, # 16+ years employed at age 20 -> impossible
        "Income": 120000.0,
        "LoanAmount": 50000.0,
        "DTIRatio": 0.68,
        "EmploymentType": "Unemployed"
    }
    state: CreditUnderwritingState = {
        "applicant_data": anomalous_applicant,
        "fraud_kyc_findings": {},
        "ml_risk_assessment": {},
        "rag_regulatory_context": {},
        "compliance_bias_audit": {},
        "counterfactual_recommendations": [],
        "credit_committee_synthesis": {},
        "agent_logs": [],
        "errors": []
    }
    result = run_kyc_fraud_agent(state)
    assert result["fraud_kyc_findings"]["status"] in ["FLAGGED_FOR_REVIEW", "CRITICAL_FRAUD_ALERT"]
    assert len(result["fraud_kyc_findings"]["flags"]) >= 2


def test_end_to_end_underwriting_pipeline(sample_prime_applicant):
    result = run_underwriting_pipeline(sample_prime_applicant)
    assert "credit_committee_synthesis" in result
    decision = result["credit_committee_synthesis"]["final_decision"]
    assert decision in ["APPROVED", "CONDITIONAL_APPROVAL"]
    assert len(result["agent_logs"]) >= 5


def test_subprime_rejection_and_adverse_action(sample_subprime_applicant):
    result = run_underwriting_pipeline(sample_subprime_applicant)
    decision = result["credit_committee_synthesis"]["final_decision"]
    assert decision in ["REJECTED", "ESCALATE_TO_SENIOR_RISK_OFFICER"]
    assert len(result["credit_committee_synthesis"]["adverse_action_reasons"]) > 0
    assert len(result["counterfactual_recommendations"]) > 0
