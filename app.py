import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
import os
import json
from datetime import datetime

from credit_agents.workflow import run_underwriting_pipeline, LANGGRAPH_AVAILABLE
from credit_agents.rag.policy_retriever import PolicyRAGRetriever
from credit_agents.ml.trainer import train_and_export_model

# Page Configuration
st.set_page_config(
    page_title="FinRisk AI - Multi-Agent Credit Underwriting",
    page_icon="🏦",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling for Financial Executive Look & Feel
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        color: #1E3A8A;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #4B5563;
        margin-bottom: 1.2rem;
    }
    .badge-approved {
        background-color: #DEF7EC;
        color: #03543F;
        padding: 6px 14px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1.1rem;
        border: 1px solid #31C48D;
        display: inline-block;
    }
    .badge-conditional {
        background-color: #FEF08A;
        color: #854D0E;
        padding: 6px 14px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1.1rem;
        border: 1px solid #FACC15;
        display: inline-block;
    }
    .badge-rejected {
        background-color: #FDE8E8;
        color: #9B1C1C;
        padding: 6px 14px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 1.1rem;
        border: 1px solid #F98080;
        display: inline-block;
    }
    .agent-card {
        background-color: #F9FAFB;
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 12px;
        border-left: 5px solid #2563EB;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .metric-container {
        background-color: #FFFFFF;
        border-radius: 8px;
        padding: 12px 16px;
        border: 1px solid #E5E7EB;
        box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
</style>
""", unsafe_allow_html=True)


# Initialize Session State
if "last_results" not in st.session_state:
    st.session_state.last_results = None

# Header Banner
col_h1, col_h2 = st.columns([3, 1])
with col_h1:
    st.markdown('<div class="main-header">🏦 FinRisk AI: Multi-Agent Credit Underwriting</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="sub-header">Autonomous 5-Layer Working Agents • LangGraph Orchestration • RAG Regulatory Compliance (Basel III / ECOA) • XAI Explainability</div>',
        unsafe_allow_html=True
    )

with col_h2:
    st.markdown(f"""
    <div style="text-align: right; font-size: 0.85rem; color: #6B7280; padding-top: 10px;">
        <div><b>Orchestrator:</b> {'LangGraph' if LANGGRAPH_AVAILABLE else 'StateGraph Core'}</div>
        <div><b>Compliance:</b> 12 CFR § 1002.9</div>
        <div><b>Capital Std:</b> Basel III / IV IRB</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("---")

# Sidebar: Preset Profiles & Manual Controls
st.sidebar.title("🎛️ Borrower Profiles & Scenarios")

preset = st.sidebar.selectbox(
    "Quick Select Preset (Recruiter Demo)",
    [
        "Custom Configuration",
        "🌟 Preset 1: Prime Borrower (Tier 1 - Auto-Approve)",
        "⚠️ Preset 2: Near-Prime Borderline (Tier 2 - Conditional)",
        "🛑 Preset 3: Subprime High-DTI (Tier 4 - Rejection & FCRA Notice)",
        "🚨 Preset 4: Synthetic KYC Anomaly (Tenure Discrepancy)"
    ]
)

# Default values based on preset
if preset == "🌟 Preset 1: Prime Borrower (Tier 1 - Auto-Approve)":
    d_age, d_income, d_loan, d_score = 42, 125000.0, 20000.0, 785
    d_employed, d_lines, d_rate, d_term = 96, 5, 6.8, 36
    d_dti, d_edu, d_emp, d_cosigner = 0.18, "Master's", "Full-time", "No"
elif preset == "⚠️ Preset 2: Near-Prime Borderline (Tier 2 - Conditional)":
    d_age, d_income, d_loan, d_score = 31, 58000.0, 24000.0, 645
    d_employed, d_lines, d_rate, d_term = 28, 4, 14.5, 48
    d_dti, d_edu, d_emp, d_cosigner = 0.42, "Bachelor's", "Full-time", "Yes"
elif preset == "🛑 Preset 3: Subprime High-DTI (Tier 4 - Rejection & FCRA Notice)":
    d_age, d_income, d_loan, d_score = 27, 34000.0, 28000.0, 540
    d_employed, d_lines, d_rate, d_term = 8, 7, 24.0, 60
    d_dti, d_edu, d_emp, d_cosigner = 0.58, "High School", "Part-time", "No"
elif preset == "🚨 Preset 4: Synthetic KYC Anomaly (Tenure Discrepancy)":
    d_age, d_income, d_loan, d_score = 20, 110000.0, 45000.0, 680
    d_employed, d_lines, d_rate, d_term = 180, 6, 12.0, 36
    d_dti, d_edu, d_emp, d_cosigner = 0.32, "Bachelor's", "Unemployed", "No"
else:
    d_age, d_income, d_loan, d_score = 35, 65000.0, 15000.0, 660
    d_employed, d_lines, d_rate, d_term = 48, 3, 11.5, 36
    d_dti, d_edu, d_emp, d_cosigner = 0.28, "Bachelor's", "Full-time", "No"

st.sidebar.markdown("### 👤 Financial Demographics")
age = st.sidebar.slider("Age", 18, 90, d_age)
income = st.sidebar.number_input("Annual Income ($)", min_value=10000.0, max_value=500000.0, value=float(d_income), step=5000.0)
employment_type = st.sidebar.selectbox("Employment Type", ["Full-time", "Part-time", "Self-employed", "Unemployed"], index=["Full-time", "Part-time", "Self-employed", "Unemployed"].index(d_emp))
months_employed = st.sidebar.slider("Months Employed", 0, 480, d_employed)
education = st.sidebar.selectbox("Education Level", ["High School", "Bachelor's", "Master's", "PhD"], index=["High School", "Bachelor's", "Master's", "PhD"].index(d_edu))

st.sidebar.markdown("### 💳 Credit & Loan Parameters")
loan_amount = st.sidebar.number_input("Loan Amount ($)", min_value=1000.0, max_value=200000.0, value=float(d_loan), step=1000.0)
loan_term = st.sidebar.selectbox("Loan Term (Months)", [12, 24, 36, 48, 60], index=[12, 24, 36, 48, 60].index(d_term))
interest_rate = st.sidebar.slider("Contract Interest Rate (%)", 3.0, 35.0, float(d_rate), 0.5)
credit_score = st.sidebar.slider("FICO / Bureau Credit Score", 300, 850, d_score)
num_credit_lines = st.sidebar.slider("Number of Open Credit Lines", 1, 15, d_lines)
dti_ratio = st.sidebar.slider("Debt-To-Income (DTI) Ratio", 0.05, 1.0, float(d_dti), 0.01)
has_cosigner = st.sidebar.selectbox("Qualified Co-Signer Present", ["No", "Yes"], index=0 if d_cosigner == "No" else 1)
has_mortgage = st.sidebar.selectbox("Existing Mortgage", ["No", "Yes"], index=0)
has_dependents = st.sidebar.selectbox("Has Dependents", ["No", "Yes"], index=0)
loan_purpose = st.sidebar.selectbox("Loan Purpose", ["Auto", "Business", "Education", "Home", "Other"])
marital_status = st.sidebar.selectbox("Marital Status", ["Single", "Married", "Divorced"])

applicant_input = {
    "Age": age,
    "Income": income,
    "LoanAmount": loan_amount,
    "CreditScore": credit_score,
    "MonthsEmployed": months_employed,
    "NumCreditLines": num_credit_lines,
    "InterestRate": interest_rate,
    "LoanTerm": loan_term,
    "DTIRatio": dti_ratio,
    "Education": education,
    "EmploymentType": employment_type,
    "MaritalStatus": marital_status,
    "HasMortgage": has_mortgage,
    "HasDependents": has_dependents,
    "LoanPurpose": loan_purpose,
    "HasCoSigner": has_cosigner
}

# Run Underwriting Button
if st.button("🚀 Run Multi-Agent Underwriting Committee", type="primary", use_container_width=True):
    with st.spinner("Dispatching 5 Autonomous Agent Working Layers via LangGraph..."):
        results = run_underwriting_pipeline(applicant_input)
        st.session_state.last_results = results
        st.success("✅ Multi-Agent Credit Committee Underwriting Synthesis Complete!")

# Check if results are available
results = st.session_state.last_results

if results is None:
    st.info("👈 Select a borrower preset from the sidebar or customize parameters, then click **'Run Multi-Agent Underwriting Committee'** above to observe the autonomous working layers in action.")
    
    # Preview Architecture
    st.markdown("### 🏛️ Multi-Agent Architecture Overview")
    st.markdown("""
    This project deploys **5 collaborative autonomous agent working layers** to replicate modern Tier-1 banking risk infrastructure:
    - **Layer 1: Identity & KYC Anomaly Agent**: Detects synthetic identities, income inflation, and debt-to-income spikes.
    - **Layer 2: Quantitative ML & Risk Agent**: Generates calibrated Default Probability (PD), Basel Expected Loss ($EL = PD \\times EAD \\times LGD$), and SHAP feature attribution.
    - **Layer 3: Regulatory RAG & Policy Retrieval Agent**: Interrogates embedded institutional credit policy, Basel III/IV accords, and ECOA Regulation B (12 CFR § 1002.9).
    - **Layer 4: Fair Lending & Stress Testing Agent**: Validates the 4/5ths Adverse Impact Ratio rule and simulates CCAR Severely Adverse macroeconomic shocks (+300 bps interest rate hikes).
    - **Layer 5: Senior Credit Committee Orchestrator**: Synthesizes cross-agent telemetry, computes Risk-Adjusted Pricing (RAROC), determines loan covenants, and drafts the Credit Memorandum.
    """)
    st.stop()

# Multi-Agent Telemetry Summary Cards
st.markdown("### ⚡ Live Multi-Agent Telemetry")
c1, c2, c3, c4, c5 = st.columns(5)

kyc_res = results.get("fraud_kyc_findings", {})
ml_res = results.get("ml_risk_assessment", {})
rag_res = results.get("rag_regulatory_context", {})
fair_res = results.get("compliance_bias_audit", {})
comm_res = results.get("credit_committee_synthesis", {})

with c1:
    st.markdown(f"""
    <div class="agent-card">
        <b>Layer 1: KYC / Fraud</b><br>
        <span style="font-size: 1.1rem; font-weight: bold;">{kyc_res.get('status', 'N/A')}</span><br>
        <small>Anomaly: {kyc_res.get('anomaly_score', 0.0):.2f}</small>
    </div>
    """, unsafe_allow_html=True)

with c2:
    st.markdown(f"""
    <div class="agent-card">
        <b>Layer 2: ML Risk Model</b><br>
        <span style="font-size: 1.1rem; font-weight: bold;">PD: {ml_res.get('pd_percent', 0.0):.1f}%</span><br>
        <small>Grade: {ml_res.get('rating_grade', 'N/A')}</small>
    </div>
    """, unsafe_allow_html=True)

with c3:
    st.markdown(f"""
    <div class="agent-card">
        <b>Layer 3: RAG Policy</b><br>
        <span style="font-size: 1.1rem; font-weight: bold;">{'CLEARED' if rag_res.get('compliance_cleared') else 'BORDERLINE'}</span><br>
        <small>{len(rag_res.get('citations', []))} Citations</small>
    </div>
    """, unsafe_allow_html=True)

with c4:
    stress_pass = fair_res.get("stress_test_results", {}).get("stress_test_resilience_passed", True)
    st.markdown(f"""
    <div class="agent-card">
        <b>Layer 4: Fair & Stress</b><br>
        <span style="font-size: 1.1rem; font-weight: bold;">{'RESILIENT' if stress_pass else 'VULNERABLE'}</span><br>
        <small>AIR: {fair_res.get('fairness_audit', {}).get('adverse_impact_ratio', 1.0):.2f}</small>
    </div>
    """, unsafe_allow_html=True)

with c5:
    decision = comm_res.get("final_decision", "PENDING")
    badge_class = "badge-approved" if decision == "APPROVED" else ("badge-conditional" if "CONDITIONAL" in decision else "badge-rejected")
    st.markdown(f"""
    <div class="agent-card">
        <b>Layer 5: Committee</b><br>
        <span class="{badge_class}">{decision}</span><br>
        <small>APR: {comm_res.get('recommended_apr', 0.0):.2f}%</small>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# Main Multi-Tab Interface
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "📋 Executive Dossier & Credit Memo",
    "🤖 Multi-Agent Working Logs & Trace",
    "🧠 Quantitative ML & SHAP XAI",
    "📚 Regulatory RAG Policy Explorer",
    "⚡ Counterfactuals & CCAR Stress Test"
])

# TAB 1: EXECUTIVE DOSSIER
with tab1:
    col_t1, col_t2 = st.columns([2, 1])
    
    with col_t1:
        st.markdown("#### 📑 Formal Underwriting Credit Memorandum")
        st.markdown(comm_res.get("credit_memo", "No memo generated."))

        # Loan Covenants Display
        covenants = comm_res.get("covenants", [])
        if covenants:
            st.markdown("#### 🔒 Mandatory Loan Covenants & Risk Mitigants")
            for cov in covenants:
                st.warning(f"📌 {cov}")

        # Adverse Action Notices (If applicable)
        adverse_reasons = comm_res.get("adverse_action_reasons", [])
        if adverse_reasons:
            st.error("#### ⚠️ Statutory Adverse Action Reason Codes (12 CFR § 1002.9 / ECOA)")
            for i, reason in enumerate(adverse_reasons, 1):
                st.markdown(f"**Principal Reason {i}:** {reason}")

    with col_t2:
        st.markdown("#### 💰 Capital & Pricing Breakdown")
        
        # Risk gauge chart
        fig_gauge = go.Figure(go.Indicator(
            mode="gauge+number",
            value=ml_res.get("pd_percent", 15.0),
            title={'text': "Default Probability (PD %)"},
            gauge={
                'axis': {'range': [0, 100]},
                'bar': {'color': "#1E3A8A"},
                'steps': [
                    {'range': [0, 15], 'color': "#DEF7EC"},
                    {'range': [15, 35], 'color': "#FEF08A"},
                    {'range': [35, 100], 'color': "#FDE8E8"}
                ],
                'threshold': {
                    'line': {'color': "red", 'width': 4},
                    'thickness': 0.75,
                    'value': 40
                }
            }
        ))
        fig_gauge.update_layout(height=240, margin=dict(l=20, r=20, t=30, b=10))
        st.plotly_chart(fig_gauge, use_container_width=True)

        st.metric(
            label="Basel Expected Loss (EL)",
            value=f"${ml_res.get('expected_loss_usd', 0.0):,.2f}",
            help="EL = PD * EAD * LGD (Supervisory LGD = 45%)"
        )
        st.metric(
            label="Recommended APR",
            value=f"{comm_res.get('recommended_apr', 0.0):.2f}%",
            delta=f"+{comm_res.get('risk_spread', 0.0):.2f}% Spread over Prime Base",
            delta_color="off"
        )
        st.metric(
            label="Exposure at Default (EAD)",
            value=f"${ml_res.get('exposure_at_default', 0.0):,.2f}"
        )


# TAB 2: AGENT WORKING LOGS & TRACE
with tab2:
    st.markdown("#### 🕵️ Autonomous Agent Execution Logs & Audit Trail")
    st.markdown("Every automated decision in this pipeline is auditable and tracked across all 5 working layers.")

    logs = results.get("agent_logs", [])
    for log in logs:
        with st.expander(f"Layer {log.get('layer')}: {log.get('agent_name')} — Status: {log.get('status')}", expanded=True):
            st.markdown(f"**Timestamp:** `{log.get('timestamp')}`")
            st.markdown(f"**Summary:** {log.get('summary')}")
            st.json(log.get("details", {}))


# TAB 3: QUANTITATIVE ML & SHAP XAI
with tab3:
    st.markdown("#### 🔬 Model Inference & Feature Attribution")
    
    col_m1, col_m2 = st.columns([1, 1])
    
    with col_m1:
        st.markdown("##### 📈 Key Risk Drivers (SHAP Attribution)")
        contributions = ml_res.get("feature_contributions", [])
        
        if contributions:
            contrib_df = pd.DataFrame(contributions)
            for _, row in contrib_df.iterrows():
                if row["impact"] == "INCREASES_RISK":
                    st.error(f"🔴 **{row['feature']}**: {row['description']}")
                else:
                    st.success(f"🟢 **{row['feature']}**: {row['description']}")
        else:
            st.info("Feature contributions balanced across baseline bounds.")

    with col_m2:
        st.markdown("##### 📊 Borrower Risk Profile Radar")
        
        # Radar Chart of normalized applicant metrics
        categories = ['Credit Score', 'Income Ratio', 'DTI Health', 'Job Stability', 'Loan Leverage']
        
        norm_score = (applicant_input["CreditScore"] - 300) / 550.0 * 100
        norm_income = min(100, (applicant_input["Income"] / 150000.0) * 100)
        norm_dti = max(0, (1.0 - applicant_input["DTIRatio"]) * 100)
        norm_tenure = min(100, (applicant_input["MonthsEmployed"] / 120.0) * 100)
        norm_leverage = max(0, 100 - (applicant_input["LoanAmount"] / max(applicant_input["Income"], 1) * 100))

        radar_fig = go.Figure()
        radar_fig.add_trace(go.Scatterpolar(
            r=[norm_score, norm_income, norm_dti, norm_tenure, norm_leverage],
            theta=categories,
            fill='toself',
            name='Borrower Strength',
            line_color='#2563EB'
        ))
        radar_fig.update_layout(
            polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
            showlegend=False,
            height=300,
            margin=dict(l=30, r=30, t=20, b=20)
        )
        st.plotly_chart(radar_fig, use_container_width=True)


# TAB 4: REGULATORY RAG POLICY EXPLORER
with tab4:
    st.markdown("#### 📚 Regulatory & Policy RAG (Retrieval-Augmented Generation)")
    st.markdown("Explore how the policy retrieval agent indexes banking regulations and internal credit manuals.")

    retriever = PolicyRAGRetriever()
    
    rag_query = st.text_input(
        "🔎 Query the Regulatory Knowledge Base:",
        value="What are the adverse action notice requirements under ECOA Regulation B?"
    )

    if rag_query:
        hits = retriever.search(rag_query, top_k=3)
        st.markdown(f"**Found {len(hits)} relevant regulatory sections:**")
        
        for i, hit in enumerate(hits, 1):
            st.markdown(f"##### Section {i}: {hit.title} (`{hit.source_doc}`)")
            st.markdown(hit.content)
            if hit.regulatory_citations:
                st.caption(f"📌 **Citations:** {', '.join(hit.regulatory_citations)}")
            st.markdown("---")


# TAB 5: COUNTERFACTUALS & CCAR STRESS TESTING
with tab5:
    col_c1, col_c2 = st.columns([1, 1])
    
    with col_c1:
        st.markdown("#### 🔄 Actionable Counterfactual Advice")
        st.markdown("Algorithmic recommendations to transition a borderline or rejected application toward approval:")
        
        counterfactuals = results.get("counterfactual_recommendations", [])
        if counterfactuals:
            for cf in counterfactuals:
                st.info(f"💡 **{cf['action']}:** {cf['recommendation']}\n\n*Impact:* {cf['impact']}")
        else:
            st.success("🎉 Borrower currently meets Prime Tier standards without requiring remedial covenants.")

    with col_c2:
        st.markdown("#### 📉 CCAR / DFAST Macroeconomic Stress Shock Analysis")
        stress_data = fair_res.get("stress_test_results", {})
        
        scenarios = ["Baseline Macro", "Adverse (+150 bps)", "Severely Adverse (+300 bps)"]
        pd_vals = [
            stress_data.get("baseline", {}).get("stressed_pd_pct", 15.0),
            stress_data.get("adverse", {}).get("stressed_pd_pct", 22.0),
            stress_data.get("severely_adverse", {}).get("stressed_pd_pct", 35.0)
        ]
        
        fig_stress = px.bar(
            x=scenarios,
            y=pd_vals,
            labels={'x': 'Macroeconomic Scenario', 'y': 'Stressed Default Probability (%)'},
            title="Portfolio Stressed Default Probability Under Macro Shock",
            color=pd_vals,
            color_continuous_scale="Reds"
        )
        fig_stress.add_hline(y=55.0, line_dash="dash", line_color="black", annotation_text="CCAR Max Resilience Ceiling (55%)")
        fig_stress.update_layout(height=320, showlegend=False, margin=dict(l=20, r=20, t=40, b=20))
        st.plotly_chart(fig_stress, use_container_width=True)

st.markdown("---")
st.caption("🏦 FinRisk AI • Engineered for Institutional Credit Risk Modeling, Basel III/IV Capital Compliance, and Fair Lending Governance.")
