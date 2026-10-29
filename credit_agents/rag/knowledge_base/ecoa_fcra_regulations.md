# Fair Lending & Adverse Action Governance (ECOA Regulation B & FCRA)

## 1. Equal Credit Opportunity Act (ECOA) & CFPB Regulation B
Under 12 CFR § 1002, lenders are prohibited from discriminating against any applicant on a prohibited basis:
- Protected Characteristics: Race, color, religion, national origin, sex, marital status, age, or receipt of public assistance.
- **Model Disparate Impact (Four-Fifths / 80% Rule)**:
  An underwriting algorithm is considered prima facie discriminatory if the selection/approval rate for a protected class is less than 80% (or 4/5ths) of the selection rate for the group with the highest approval rate:
  $$\text{Adverse Impact Ratio (AIR)} = \frac{\text{Approval Rate}_{\text{Protected}}}{\text{Approval Rate}_{\text{Reference}}} \ge 0.80$$
  If $\text{AIR} < 0.80$, the lender must demonstrate strict business necessity and prove no alternative algorithm exists that achieves comparable risk discrimination with lesser disparate impact.

## 2. Mandatory Adverse Action Notice (12 CFR § 1002.9)
When an adverse action (denial or unfavorable modification of credit) is taken based in whole or in part on algorithmic scoring:
- The creditor must provide a written statement of specific reasons within 30 calendar days.
- **Principal Reason Code Requirement**: The notice must specify the top **4 principal factors** that adversely influenced the score (e.g., Excessive Debt-To-Income Ratio, Insufficient Credit History, High Loan-To-Income, High Interest Burden).
- Vague statements like "internal score below institutional benchmark" are unlawful.
- The applicant must be given the name and address of the federal supervisory agency regulating the creditor.

## 3. Fair Credit Reporting Act (FCRA Section 615)
- Requires disclosure of the numeric credit score used in the credit decision.
- Requires disclosure of the score range, the date the score was calculated, and the credit scoring agency contact details.
- Discloses the right of the consumer to obtain a free copy of their consumer report within 60 days.
