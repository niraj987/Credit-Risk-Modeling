import os
from typing import Dict, Any, List
from .state import CreditUnderwritingState
from .agents.kyc_fraud_agent import run_kyc_fraud_agent
from .agents.quantitative_risk_agent import run_quantitative_risk_agent
from .agents.policy_rag_agent import run_policy_rag_agent
from .agents.fairness_stress_agent import run_fairness_stress_agent
from .agents.credit_committee_agent import run_credit_committee_agent

try:
    from langgraph.graph import StateGraph, START, END
    LANGGRAPH_AVAILABLE = True
except ImportError:
    LANGGRAPH_AVAILABLE = False


def build_langgraph_workflow():
    """
    Constructs the 5-layer Multi-Agent Underwriting StateGraph using LangGraph.
    """
    if not LANGGRAPH_AVAILABLE:
        return None

    builder = StateGraph(CreditUnderwritingState)

    # 5 Specialized Agent Nodes
    builder.add_node("kyc_fraud_agent", run_kyc_fraud_agent)
    builder.add_node("quantitative_risk_agent", run_quantitative_risk_agent)
    builder.add_node("policy_rag_agent", run_policy_rag_agent)
    builder.add_node("fairness_stress_agent", run_fairness_stress_agent)
    builder.add_node("credit_committee_agent", run_credit_committee_agent)

    # Directed Sequential Multi-Agent Flow
    builder.add_edge(START, "kyc_fraud_agent")
    builder.add_edge("kyc_fraud_agent", "quantitative_risk_agent")
    builder.add_edge("quantitative_risk_agent", "policy_rag_agent")
    builder.add_edge("policy_rag_agent", "fairness_stress_agent")
    builder.add_edge("fairness_stress_agent", "credit_committee_agent")
    builder.add_edge("credit_committee_agent", END)

    return builder.compile()


def run_underwriting_pipeline(applicant_data: Dict[str, Any]) -> CreditUnderwritingState:
    """
    Executes the multi-agent credit underwriting layers end-to-end.
    Works seamlessly with LangGraph or direct deterministic agent dispatch.
    """
    initial_state: CreditUnderwritingState = {
        "applicant_data": applicant_data,
        "fraud_kyc_findings": {},
        "ml_risk_assessment": {},
        "rag_regulatory_context": {},
        "compliance_bias_audit": {},
        "counterfactual_recommendations": [],
        "credit_committee_synthesis": {},
        "agent_logs": [],
        "errors": []
    }

    graph = build_langgraph_workflow()
    if graph is not None:
        try:
            final_state = graph.invoke(initial_state)
            return final_state
        except Exception:
            pass

    # Direct sequential state-passing execution fallback
    state = dict(initial_state)
    
    # Layer 1
    out1 = run_kyc_fraud_agent(state) # type: ignore
    state.update(out1)

    # Layer 2
    out2 = run_quantitative_risk_agent(state) # type: ignore
    state.update(out2)

    # Layer 3
    out3 = run_policy_rag_agent(state) # type: ignore
    state.update(out3)

    # Layer 4
    out4 = run_fairness_stress_agent(state) # type: ignore
    state.update(out4)

    # Layer 5
    out5 = run_credit_committee_agent(state) # type: ignore
    state.update(out5)

    return state # type: ignore
