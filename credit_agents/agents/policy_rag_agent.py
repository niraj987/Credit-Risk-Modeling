from datetime import datetime
from typing import Dict, Any, List
from ..state import CreditUnderwritingState, AgentLogEntry
from ..rag.policy_retriever import PolicyRAGRetriever


_RETRIEVER = None


def get_retriever():
    global _RETRIEVER
    if _RETRIEVER is None:
        _RETRIEVER = PolicyRAGRetriever()
    return _RETRIEVER


def run_policy_rag_agent(state: CreditUnderwritingState) -> Dict[str, Any]:
    """
    Layer 3 Agent: Regulatory RAG & Policy Retrieval Agent.
    Interrogates the legal and underwriting knowledge base using RAG.
    Retrieves compliance guidelines, adverse action reason codes, and Basel capital standards.
    """
    timestamp = datetime.now().isoformat()
    retriever = get_retriever()
    applicant = state["applicant_data"]
    ml_eval = state.get("ml_risk_assessment", {})

    pd_percent = ml_eval.get("pd_percent", 20.0)
    dti = applicant.get("DTIRatio", 0.3)
    credit_score = applicant.get("CreditScore", 650)

    # Formulate targeted RAG search queries based on profile
    retrieved_sections: List[Dict[str, Any]] = []
    applicable_citations: List[str] = []

    # 1. Underwriting Tier Query
    tier_query = f"underwriting policy credit score {credit_score} DTI {dti} tier classification cutoff"
    tier_hits = retriever.search(tier_query, top_k=1, filter_category="underwriting")
    for hit in tier_hits:
        retrieved_sections.append({
            "topic": "Underwriting Tier Threshold",
            "source": hit.source_doc,
            "title": hit.title,
            "excerpt": hit.content[:320] + "...",
            "citations": hit.regulatory_citations
        })
        applicable_citations.extend(hit.regulatory_citations)

    # 2. Basel Framework Query
    basel_query = "Basel expected loss formula LGD standard unsecured retail"
    basel_hits = retriever.search(basel_query, top_k=1, filter_category="basel")
    for hit in basel_hits:
        retrieved_sections.append({
            "topic": "Capital Adequacy & Expected Loss",
            "source": hit.source_doc,
            "title": hit.title,
            "excerpt": hit.content[:320] + "...",
            "citations": hit.regulatory_citations
        })
        applicable_citations.extend(hit.regulatory_citations)

    # 3. Fair Lending / Adverse Action Query (If high or borderline risk)
    if pd_percent >= 25.0 or dti > 0.43:
        aa_query = "adverse action notice principal reasons regulation b 12 CFR 1002.9"
        aa_hits = retriever.search(aa_query, top_k=1, filter_category="ecoa")
        for hit in aa_hits:
            retrieved_sections.append({
                "topic": "Adverse Action Notice Mandate",
                "source": hit.source_doc,
                "title": hit.title,
                "excerpt": hit.content[:320] + "...",
                "citations": hit.regulatory_citations
            })
            applicable_citations.extend(hit.regulatory_citations)

    unique_citations = list(dict.fromkeys(applicable_citations))

    # Evaluate compliance checks against policy rules
    policy_checks = {
        "dti_ceiling_pass": dti <= 0.50,
        "credit_score_floor_pass": credit_score >= 580,
        "adverse_action_disclosure_required": pd_percent >= 35.0,
        "co_signer_override_eligible": applicant.get("HasCoSigner") == "Yes" and credit_score >= 560
    }

    regulatory_context = {
        "retrieved_policies": retrieved_sections,
        "citations": unique_citations,
        "policy_checks": policy_checks,
        "compliance_cleared": policy_checks["dti_ceiling_pass"] and policy_checks["credit_score_floor_pass"],
        "timestamp": timestamp
    }

    log_entry: AgentLogEntry = {
        "timestamp": timestamp,
        "agent_name": "Policy_RAG_Agent",
        "layer": 3,
        "status": "COMPLIANCE_ALIGNED",
        "summary": f"Retrieved {len(retrieved_sections)} regulatory policies with citations: {', '.join(unique_citations[:3])}",
        "details": regulatory_context
    }

    current_logs = list(state.get("agent_logs", []))
    current_logs.append(log_entry)

    return {
        "rag_regulatory_context": regulatory_context,
        "agent_logs": current_logs
    }
