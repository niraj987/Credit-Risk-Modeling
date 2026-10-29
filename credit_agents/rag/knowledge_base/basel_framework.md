# Basel Framework & Capital Adequacy Accords (Basel III / Basel IV)

## 1. Scope and Regulatory Foundations
Under the Basel Committee on Banking Supervision (BCBS) frameworks, financial institutions operating an Internal Ratings-Based (IRB) approach must quantify credit risk exposure using mathematically rigorous and auditable parameters:
- **Probability of Default (PD)**: The empirical likelihood that a counterparty defaults within a 1-year horizon.
- **Exposure at Default (EAD)**: The total gross dollar exposure when default occurs ($EAD = \text{Drawn Balance} + \text{Credit Conversion Factor} \times \text{Undrawn Commitment}$).
- **Loss Given Default (LGD)**: The economic loss percentage incurred if the borrower defaults. The Basel supervisory benchmark for senior unsecured retail consumer credits is established at **45.0%**.

## 2. Regulatory Expected Loss (EL) Calculation
The expected credit loss represents the anticipated cost of doing business and must be fully covered by loan loss provisions (IFRS 9 / CECL staging):
$$\text{Expected Loss (EL)} = \text{PD} \times \text{EAD} \times \text{LGD}$$

## 3. Risk-Weighted Assets (RWA) and Capital Conservation
- **Tier 1 Common Equity (CET1)**: Minimum 4.5% of risk-weighted assets.
- **Capital Conservation Buffer**: 2.5% of RWA consisting of common equity.
- **Countercyclical Capital Buffer (CCyB)**: 0% to 2.5% depending on system-wide credit growth cycles.

## 4. Underwriting Governance and Model Validation
- All predictive machine learning scoring algorithms must demonstrate non-zero monotonicity with respect to risk rankings.
- Backtesting requires annual validation of Gini Coefficient ($Gini \ge 0.45$) and Area Under the ROC Curve ($ROC\text{-}AUC \ge 0.75$).
- Calibration curves must not systematically underestimate default probabilities across any decile of predicted risk.
