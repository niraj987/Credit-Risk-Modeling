import streamlit as st
import pandas as pd
import numpy as np
import joblib
import shap
import matplotlib.pyplot as plt
import os

# Set page configuration
st.set_page_config(page_title="Credit Risk Modeling Dashboard", layout="wide", page_icon="🏦")

st.title("🏦 Credit Risk & Loan Approval Dashboard")
st.markdown("""
This dashboard simulates a regulatory-compliant banking environment. 
It uses a LightGBM model trained on historical data to predict if an applicant will default on a loan.
It also uses **Explainable AI (SHAP)** to provide the underlying reasoning behind every approval/rejection.
""")

# Load the model
MODEL_PATH = 'lgb_model.pkl'

@st.cache_resource
def load_model():
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)
    else:
        return None

model = load_model()

if model is None:
    st.error("⚠️ Model file (lgb_model.pkl) not found. Please run the Jupyter Notebook first to generate the model.")
    st.stop()

# Sidebar for user inputs
st.sidebar.header("📝 Applicant Details")

# Helper function to get inputs
def get_user_input():
    # 'Age,Income,LoanAmount,CreditScore,MonthsEmployed,NumCreditLines,InterestRate,LoanTerm,DTIRatio,Education,EmploymentType,MaritalStatus,HasMortgage,HasDependents,LoanPurpose,HasCoSigner'
    Age = st.sidebar.slider("Age", 18, 90, 35)
    Income = st.sidebar.number_input("Income ($)", min_value=10000, max_value=500000, value=65000)
    MonthsEmployed = st.sidebar.slider("Months Employed", 0, 480, 60)
    Education = st.sidebar.selectbox("Education", ["High School", "Bachelor's", "Master's", "PhD"])
    EmploymentType = st.sidebar.selectbox("Employment Type", ["Full-time", "Part-time", "Self-employed", "Unemployed"])
    MaritalStatus = st.sidebar.selectbox("Marital Status", ["Single", "Married", "Divorced"])
    HasDependents = st.sidebar.selectbox("Has Dependents", ["Yes", "No"])
    
    st.sidebar.markdown("---")
    st.sidebar.subheader("Loan Details")
    LoanAmount = st.sidebar.number_input("Loan Amount ($)", min_value=1000, max_value=250000, value=15000)
    LoanTerm = st.sidebar.selectbox("Loan Term (Months)", [12, 24, 36, 48, 60])
    InterestRate = st.sidebar.slider("Interest Rate (%)", 1.0, 35.0, 11.5)
    LoanPurpose = st.sidebar.selectbox("Loan Purpose", ["Business", "Home", "Education", "Other", "Auto"])
    
    st.sidebar.markdown("---")
    st.sidebar.subheader("Credit History")
    CreditScore = st.sidebar.slider("Credit Score", 300, 850, 650)
    NumCreditLines = st.sidebar.slider("Number of Credit Lines", 1, 10, 3)
    HasMortgage = st.sidebar.selectbox("Has Mortgage", ["Yes", "No"])
    HasCoSigner = st.sidebar.selectbox("Has Co-Signer", ["Yes", "No"])
    
    # Custom DTIRatio derived from input or input manually
    estimated_monthly_payment = LoanAmount * (InterestRate/100/12) / (1 - (1 + InterestRate/100/12)**-LoanTerm) if InterestRate > 0 else LoanAmount / LoanTerm
    calculated_dti = estimated_monthly_payment / (Income/12)
    DTIRatio = st.sidebar.slider("DTI Ratio", 0.0, 1.0, float(min(calculated_dti, 1.0)))

    
    # Create DataFrame (must match the model's feature input exactly)
    data = {
        'Age': Age,
        'Income': Income,
        'LoanAmount': LoanAmount,
        'CreditScore': CreditScore,
        'MonthsEmployed': MonthsEmployed,
        'NumCreditLines': NumCreditLines,
        'InterestRate': InterestRate,
        'LoanTerm': LoanTerm,
        'DTIRatio': DTIRatio,
        'Education': Education,
        'EmploymentType': EmploymentType,
        'MaritalStatus': MaritalStatus,
        'HasMortgage': HasMortgage,
        'HasDependents': HasDependents,
        'LoanPurpose': LoanPurpose,
        'HasCoSigner': HasCoSigner
    }
    
    features = pd.DataFrame(data, index=[0])
    
    # Convert categoricals
    cat_cols = ['Education', 'EmploymentType', 'MaritalStatus', 'HasMortgage', 'HasDependents', 'LoanPurpose', 'HasCoSigner']
    for col in cat_cols:
        features[col] = features[col].astype('category')
        
    return features

input_df = get_user_input()

st.subheader("Selected Applicant Profile")
st.dataframe(input_df)

# Prediction and SHAP
if st.button("Calculate Risk & Make Decision", type="primary"):
    with st.spinner("Analyzing profile..."):
        # Predict probability of default
        pred_prob = model.predict(input_df)[0]
        
        # Risk thresholds
        THRESHOLD = 0.50
        risk_score = round(pred_prob * 100, 2)
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### Decision")
            if pred_prob < THRESHOLD:
                st.success("✅ **APPROVED**")
                st.write(f"The applicant shows a low risk profile.")
            else:
                st.error("❌ **REJECTED**")
                st.write(f"The applicant exceeds the maximum acceptable risk threshold.")
                
        with col2:
            st.markdown("### Risk Score")
            st.metric(label="Default Probability", value=f"{risk_score}%", delta=f"{risk_score - (THRESHOLD*100):.2f}% vs Threshold", delta_color="inverse")
            
        # SHAP Explainability
        st.markdown("---")
        st.subheader("🧠 Explainable AI (Why was this decision made?)")
        st.markdown("The chart below shows how different features pushed the model's risk score higher (red) or lower (blue).")
        
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(input_df)
        
        # Streamlit doesn't render JS force plots well directly sometimes, so matplotlib fallback
        shap.force_plot(
            explainer.expected_value[1] if isinstance(explainer.expected_value, list) else explainer.expected_value, 
            shap_values[1][0] if isinstance(shap_values, list) else shap_values[0], 
            input_df.iloc[0],
            matplotlib=True,
            show=False
        )
        st.pyplot(plt.gcf())
        plt.clf()
        
        st.info("**Compliance Note:** As part of fair lending regulations (e.g., Basel norms, ECOA), all automated decisions must provide reasoning points. This localized SHAP plot acts as the regulatory artifact for this applicant's decision.")

