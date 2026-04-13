# %% [markdown]
# # Credit Risk Modeling & Loan Default Prediction
# 
# ## End-to-End Machine Learning Pipeline
# This notebook builds an end-to-end Machine Learning pipeline for predicting loan default probability, incorporating regulatory-grade explainable AI (SHAP) and fairness testing (to simulate Basel norms/fair lending compliance).
# 
# ### Table of Contents
# 1. Data Loading (Provided Dataset)
# 2. Exploratory Data Analysis (EDA)
# 3. Feature Engineering
# 4. Model Training & Imbalance Handling (LightGBM)
# 5. Hyperparameter Tuning (Optuna)
# 6. Model Evaluation
# 7. Explainability (SHAP)
# 8. Fairness Analysis

# %%
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import lightgbm as lgb
import shap
import optuna
import joblib
import warnings
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.metrics import roc_auc_score, roc_curve
from sklearn.calibration import calibration_curve

warnings.filterwarnings('ignore')
sns.set_theme(style='whitegrid')
np.random.seed(42)

# %% [markdown]
# ## 1. Data Loading

# %%
data = pd.read_csv('Loan_default.csv')
print(data.info())
print(data.head())

# Drop LoanID as it's not a predictive feature
if 'LoanID' in data.columns:
    data = data.drop(columns=['LoanID'])

# %% [markdown]
# ## 2. Exploratory Data Analysis (EDA)

# %%
# Class distribution
plt.figure(figsize=(6,4))
sns.countplot(data=data, x='Default', palette='viridis')
plt.title('Distribution of Loan Status (0 = Repay, 1 = Default)')
plt.show()

print(f"Default Rate: {data['Default'].mean():.2%}")

# %%
# Missing values check
print("Missing values:")
print(data.isnull().sum()[data.isnull().sum() > 0])

# %%
# Correlation Matrix (numerical features only)
numeric_data = data.select_dtypes(include=[np.number])
plt.figure(figsize=(10,8))
corr = numeric_data.corr()
sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f", vmin=-1, vmax=1)
plt.title("Correlation Matrix of Numeric Features")
plt.show()


# %% [markdown]
# ## 3. Feature Engineering

# %%
df_fe = data.copy()

# 1. Fill missing values (if any exist)
for col in df_fe.select_dtypes(include=[np.number]).columns:
    df_fe[col] = df_fe[col].fillna(df_fe[col].median())

# 2. Categorical Encoding
cat_cols = ['Education', 'EmploymentType', 'MaritalStatus', 'HasMortgage', 'HasDependents', 'LoanPurpose', 'HasCoSigner']
# Keep raw categories for LightGBM, just convert to category type
for col in cat_cols:
    df_fe[col] = df_fe[col].astype('category')

# Features and Target
X = df_fe.drop('Default', axis=1)
y = df_fe['Default']

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print(f"Train Shape: {X_train.shape}, Test Shape: {X_test.shape}")


# %% [markdown]
# ## 4. Hyperparameter Tuning with Optuna & Model Training

# %%
def objective(trial):
    params = {
        'objective': 'binary',
        'metric': 'auc',
        'boosting_type': 'gbdt',
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.1),
        'num_leaves': trial.suggest_int('num_leaves', 20, 100),
        'max_depth': trial.suggest_int('max_depth', 4, 15),
        'min_child_samples': trial.suggest_int('min_child_samples', 20, 100),
        'subsample': trial.suggest_float('subsample', 0.6, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
        'scale_pos_weight': trial.suggest_float('scale_pos_weight', 1.0, 5.0), # Handling Class Imbalance
        'random_state': 42,
        'verbosity': -1,
        'n_jobs': -1
    }
    
    cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
    auc_scores = []
    
    for train_idx, val_idx in cv.split(X_train, y_train):
        X_tr, y_tr = X_train.iloc[train_idx], y_train.iloc[train_idx]
        X_val, y_val = X_train.iloc[val_idx], y_train.iloc[val_idx]
        
        train_data = lgb.Dataset(X_tr, label=y_tr)
        val_data = lgb.Dataset(X_val, label=y_val, reference=train_data)
        
        model = lgb.train(params, train_data, num_boost_round=300, callbacks=[
            lgb.early_stopping(stopping_rounds=30, verbose=False)
        ], valid_sets=[val_data])
        
        preds = model.predict(X_val)
        auc = roc_auc_score(y_val, preds)
        auc_scores.append(auc)
        
    return np.mean(auc_scores)

# Run Optuna Study (Fast execution locally)
study = optuna.create_study(direction='maximize')
# Fast-tracking trials for demonstration
study.optimize(objective, n_trials=5)
print('Best trial:', study.best_trial.params)


# %% [markdown]
# ## 5. Final Model Training

# %%
best_params = study.best_trial.params
best_params['objective'] = 'binary'
best_params['metric'] = 'auc'
best_params['random_state'] = 42
best_params['verbosity'] = -1

# Train Final Model
lgb_train = lgb.Dataset(X_train, y_train)
best_model = lgb.train(best_params, lgb_train, num_boost_round=150)

# Save model for Streamlit use
joblib.dump(best_model, 'lgb_model.pkl')
print("Model saved to lgb_model.pkl")

# Generate test predictions
y_pred_prob = best_model.predict(X_test)
# Convert probs to binary label based on threshold (e.g. 0.5)
y_pred = (y_pred_prob >= 0.5).astype(int)


# %% [markdown]
# ## 6. Model Evaluation (ROC-AUC, Gini, Calibration Plot)

# %%
# ROC-AUC & Gini
auc_score = roc_auc_score(y_test, y_pred_prob)
gini = 2 * auc_score - 1
print(f"Test ROC-AUC: {auc_score:.4f}")
print(f"Test Gini Coefficient: {gini:.4f}")

fpr, tpr, _ = roc_curve(y_test, y_pred_prob)
plt.figure(figsize=(6,4))
plt.plot(fpr, tpr, label=f'LightGBM (AUC = {auc_score:.2f})')
plt.plot([0,1], [0,1], linestyle='--', color='gray')
plt.title('Receiver Operating Characteristic (ROC)')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.legend()
plt.show()

# Calibration Plot for Regulatory Validity
prob_true, prob_pred = calibration_curve(y_test, y_pred_prob, n_bins=10)
plt.figure(figsize=(6,4))
plt.plot(prob_pred, prob_true, marker='o', label='LightGBM')
plt.plot([0,1], [0,1], linestyle='--', color='gray', label='Perfectly Calibrated')
plt.xlabel('Mean Predicted Probability')
plt.ylabel('Fraction of Positives')
plt.title('Calibration Curve (Reliability Diagram)')
plt.legend()
plt.show()


# %% [markdown]
# ## 7. Explainability using SHAP
# Global explanations (Feature Importance) and Local Explanations (Force/Waterfall for individuals).

# %%
# Global SHAP
explainer = shap.TreeExplainer(best_model)
# Sample to save time calculating SHAP
shap_sample = X_test.sample(1000, random_state=42)
shap_values = explainer.shap_values(shap_sample)

plt.title("Global Feature Importance (SHAP Summary Plot)")
shap.summary_plot(shap_values, shap_sample)

# %%
# Local Explanation (Force Plot for a single applicant who defaulted)
default_idx = y_test[y_test == 1].index[0]
sample_applicant = X_test.loc[[default_idx]]
shap_value_single = explainer.shap_values(sample_applicant)

# Initialize javascript for SHAP visuals in Jupyter
shap.initjs()
# SHAP local force plot. It shows what features increased/decreased risk.
shap.force_plot(
    explainer.expected_value[1] if isinstance(explainer.expected_value, list) else explainer.expected_value, 
    shap_value_single[1] if isinstance(shap_value_single, list) else shap_value_single, 
    sample_applicant,
    matplotlib=True # using matplotlib rather than JS inside pure python conversion
)


# %% [markdown]
# ## 8. Fairness & Disparate Impact Analysis
# Testing if the model creates disparate impact across protected classes (e.g. EmploymentType or Age limit).

# %%
# Add predictions to the test set for analysis
test_eval = X_test.copy()
test_eval['true_label'] = y_test
test_eval['pred_prob'] = y_pred_prob
test_eval['decision'] = (test_eval['pred_prob'] >= 0.5).astype(int)

# Analysis by EmploymentType (as proxy for fairness category in this dataset)
approval_rates = test_eval.groupby('EmploymentType')['decision'].mean() * 100
print("Approval Rates (Where 0 = Approved, 1 = Rejected/Default Pred)")
print("Approval implies decision == 0.")
approve_mask = (test_eval['decision'] == 0)
print(test_eval[approve_mask].groupby('EmploymentType').size() / test_eval.groupby('EmploymentType').size() * 100)

plt.figure(figsize=(8,4))
sns.barplot(
    x=test_eval.groupby('EmploymentType').size().index, 
    y=(test_eval[approve_mask].groupby('EmploymentType').size() / test_eval.groupby('EmploymentType').size() * 100)
)
plt.title("Approval Rate by Employment Type (Fairness Check)")
plt.ylabel("Approval Rate (%)")
plt.show()

