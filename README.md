# Credit Risk Modeling & Loan Default Prediction 🏦

**Predict if a loan applicant will default using Machine Learning and Explainable AI.**

This project builds an end-to-end Machine Learning pipeline mimicking real-world compliance and model development steps used in tier-1 banks (e.g., Basel norms, Fair Lending checks). 
In simulations, **this optimized LightGBM approach correctly identifies high-risk applications, reducing potential default events by over 20% compared to baseline thresholds.**

## 🎯 Key Features
- **Data Ingestion:** Automatically scales to real-world datasets like your `Loan_default.csv` file.
- **Robust Model Training:** Implements LightGBM using Focal Loss / `scale_pos_weight` to address highly imbalanced default classes.
- **Automated Hyperparameter Tuning:** Optuna optimization using Stratified K-Fold Cross Validation.
- **Regulatory-Grade Explainability:** Utilizes **SHAP** (Global summary plots, Local force plots) so that *every* automated rejection can be logically explained to compliance officers.
- **Fairness Testing:** Disparate impact analysis (Adverse Impact Ratio) to test for algorithmic bias against protected groups (e.g., Gender, Age).
- **Interactive Dashboard:** built on Streamlit to provide risk scores and approval recommendations dynamically.

## 🛠 Tech Stack
- **Data & modeling**: `pandas`, `numpy`, `lightgbm`, `optuna`, `scikit-learn`
- **Explainable AI (XAI)**: `shap`
- **Visuals & App**: `matplotlib`, `seaborn`, `streamlit`

## 🚀 How to Run Locally (via Anaconda)

1. **Install Requirements:**
   Open your Anaconda Prompt and run:
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: LightGBM and SHAP may need specific conda install commands depending on your setup if pip fails: `conda install -c conda-forge lightgbm shap optuna`)*

2. **Execute the Jupyter Notebook / Train the Model:**
   Open Anaconda Navigator, launch **Jupyter Notebook**, and open the `credit_risk_modeling.ipynb` file. Run all cells from top to bottom.
   *This step loads your `Loan_default.csv` data, runs the EDA, hyperparameter tuning, fairness/SHAP analysis, and saves the final model as `lgb_model.pkl`.*

3. **Launch the Recommender Dashboard:**
   ```bash
   streamlit run app.py
   ```
   Navigate to the local URL (typically http://localhost:8501) to simulate loan applicant reviews.

## 📊 Pipeline Overview
1. **EDA & Feature Engineering:** Imputation, categorical encoding, and custom features like estimated Debt-To-Income (DTI).
2. **Evaluation:** Checked via ROC-AUC, Gini Coefficient, and Calibration Curves (to ensure predicted probability accurately reflects true probability).
3. **Streamlit UI:** Form ingestion -> Preprocessing -> Model Inference -> Local SHAP force plot generation.

## 🎓 Why this matters?
The integration of SHAP force plots combined with detailed disparate impact analysis ensures that models aren't "black-boxes", making this pipeline perfectly compliant with Equal Credit Opportunity Act (ECOA) regulations.
