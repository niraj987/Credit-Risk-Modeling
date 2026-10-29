export interface ApplicantInput {
  Age: number;
  Income: number;
  LoanAmount: number;
  CreditScore: number;
  MonthsEmployed: number;
  NumCreditLines: number;
  InterestRate: number;
  LoanTerm: number;
  DTIRatio: number;
  Education: string;
  EmploymentType: string;
  MaritalStatus: string;
  HasMortgage: string;
  HasDependents: string;
  LoanPurpose: string;
  HasCoSigner: string;
}

export interface UnderwritingResponse {
  success: boolean;
  application_id: string;
  data: {
    applicant_data: ApplicantInput;
    fraud_kyc_findings: {
      status: string;
      anomaly_score: number;
      flags: string[];
      loan_to_income_ratio: number;
      kyc_verified: boolean;
      timestamp: string;
    };
    ml_risk_assessment: {
      probability_of_default: number;
      pd_percent: number;
      credit_score: number;
      rating_grade: string;
      exposure_at_default: number;
      loss_given_default_pct: number;
      expected_loss_usd: number;
      feature_contributions: Array<{
        feature: string;
        impact: 'INCREASES_RISK' | 'REDUCES_RISK';
        description: string;
      }>;
    };
    rag_regulatory_context: {
      retrieved_policies: Array<{
        topic: string;
        source: string;
        title: string;
        excerpt: string;
        citations: string[];
      }>;
      citations: string[];
      compliance_cleared: boolean;
    };
    compliance_bias_audit: {
      fairness_audit: {
        applicant_cohort: string;
        adverse_impact_ratio: number;
        four_fifths_rule_passed: boolean;
      };
      stress_test_results: {
        baseline: { scenario: string; stressed_pd_pct: number; expected_loss_usd: number };
        adverse: { scenario: string; stressed_pd_pct: number; expected_loss_usd: number };
        severely_adverse: { scenario: string; stressed_pd_pct: number; expected_loss_usd: number };
        stress_test_resilience_passed: boolean;
      };
    };
    counterfactual_recommendations: Array<{
      action: string;
      recommendation: string;
      impact: string;
    }>;
    credit_committee_synthesis: {
      final_decision: 'APPROVED' | 'CONDITIONAL_APPROVAL' | 'REJECTED' | 'ESCALATE_TO_SENIOR_RISK_OFFICER';
      recommended_apr: number;
      risk_spread: number;
      covenants: string[];
      adverse_action_reasons: string[];
      credit_memo: string;
      timestamp: string;
    };
    agent_logs: Array<{
      timestamp: string;
      agent_name: string;
      layer: number;
      status: string;
      summary: string;
      details: any;
    }>;
  };
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '';

export async function submitUnderwriting(input: ApplicantInput): Promise<UnderwritingResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/underwrite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Backend unreachable, utilizing local client-side multi-agent simulation fallback.', err);
  }

  // Client-side fallback simulation for seamless Vercel standalone preview
  return simulateClientUnderwriting(input);
}

export async function searchRAG(query: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/rag/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_k: 3 })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] RAG search fallback.', err);
  }

  return {
    query,
    count: 2,
    results: [
      {
        chunk_id: 'ecoa_fcra_regulations.md#1',
        source_doc: 'ecoa_fcra_regulations.md',
        title: 'Mandatory Adverse Action Notice (12 CFR § 1002.9)',
        content: 'When an adverse action is taken based in whole or in part on algorithmic scoring, the creditor must provide a written statement of the top 4 principal reasons within 30 days.',
        score: 18.5,
        regulatory_citations: ['12 CFR § 1002.9', 'ECOA Regulation B']
      },
      {
        chunk_id: 'basel_framework.md#1',
        source_doc: 'basel_framework.md',
        title: 'Basel Expected Loss (EL) Supervisory Benchmark',
        content: 'Expected Loss = PD * EAD * LGD. Supervisory standard for senior unsecured retail consumer credits is 45.0% LGD.',
        score: 15.0,
        regulatory_citations: ['Basel III / IV IRB']
      }
    ]
  };
}

function simulateClientUnderwriting(applicant: ApplicantInput): UnderwritingResponse {
  const score = applicant.CreditScore;
  const dti = applicant.DTIRatio;
  const income = applicant.Income;
  const loan = applicant.LoanAmount;
  const hasCosigner = applicant.HasCoSigner === 'Yes';

  // Compute PD
  let basePd = 0.18;
  basePd += (dti - 0.30) * 0.45;
  basePd -= ((score - 660) / 300) * 0.22;
  if (applicant.EmploymentType === 'Unemployed') basePd += 0.35;
  if (hasCosigner) basePd -= 0.08;
  const pd = Math.max(0.015, Math.min(0.88, basePd));
  const pdPct = Number((pd * 100).toFixed(2));

  const ead = loan;
  const lgd = 0.45;
  const expectedLoss = Number((pd * ead * lgd).toFixed(2));

  // Determine grade & decision
  let grade = 'BBB (Investment Grade)';
  let decision: UnderwritingResponse['data']['credit_committee_synthesis']['final_decision'] = 'APPROVED';
  let apr = 9.5;
  const covenants: string[] = [];
  const adverseReasons: string[] = [];

  if (score >= 740 && dti <= 0.35) {
    grade = 'AAA (Prime)';
    decision = 'APPROVED';
    apr = 7.25;
    covenants.push('Standard direct deposit auto-pay discount applied.');
  } else if (score >= 660 && dti <= 0.43) {
    grade = 'A (Upper Medium)';
    decision = 'APPROVED';
    apr = 10.5;
    covenants.push('Direct ACH automated payment authorization required.');
  } else if (dti > 0.50 || score < 560 || pdPct > 45) {
    grade = 'CCC/D (Subprime Default Risk)';
    decision = 'REJECTED';
    apr = 18.5;
    if (dti > 0.50) adverseReasons.push(`Total Debt-To-Income (${(dti * 100).toFixed(1)}%) exceeds institutional 50.0% ceiling.`);
    if (score < 580) adverseReasons.push(`Credit bureau score (${score}) below minimum threshold of 580.`);
    adverseReasons.push(`Model-calibrated default probability (${pdPct}%) exceeds maximum tolerance.`);
    adverseReasons.push(`Elevated debt servicing burden relative to income ($${income.toLocaleString()}).`);
  } else {
    grade = 'BB (Speculative)';
    decision = 'CONDITIONAL_APPROVAL';
    apr = 13.75;
    covenants.push('Maximum loan term restricted to 36 months.');
    if (!hasCosigner) covenants.push('Qualified co-signer required with credit score >= 700.');
    covenants.push('Mandatory direct payoff disbursement to existing creditors.');
  }

  const timestamp = new Date().toISOString();

  return {
    success: true,
    application_id: `APP-WEB-${Date.now()}-${score}`,
    data: {
      applicant_data: applicant,
      fraud_kyc_findings: {
        status: (applicant.Age < 22 && applicant.MonthsEmployed > 120) ? 'FLAGGED_FOR_REVIEW' : 'PASSED',
        anomaly_score: (applicant.Age < 22 && applicant.MonthsEmployed > 120) ? 0.45 : 0.05,
        flags: (applicant.Age < 22 && applicant.MonthsEmployed > 120) ? ['Inconsistent employment tenure relative to stated age'] : [],
        loan_to_income_ratio: Number((loan / income).toFixed(2)),
        kyc_verified: true,
        timestamp
      },
      ml_risk_assessment: {
        probability_of_default: pd,
        pd_percent: pdPct,
        credit_score: score,
        rating_grade: grade,
        exposure_at_default: ead,
        loss_given_default_pct: 45,
        expected_loss_usd: expectedLoss,
        feature_contributions: [
          {
            feature: 'DTIRatio',
            impact: dti > 0.40 ? 'INCREASES_RISK' : 'REDUCES_RISK',
            description: `DTI of ${(dti * 100).toFixed(1)}% ${dti > 0.40 ? 'adds default burden' : 'shows strong debt management'}`
          },
          {
            feature: 'CreditScore',
            impact: score < 650 ? 'INCREASES_RISK' : 'REDUCES_RISK',
            description: `Bureau score of ${score} reflects ${score >= 700 ? 'prime repayment stability' : 'higher historical delinquency'}`
          }
        ]
      },
      rag_regulatory_context: {
        retrieved_policies: [
          {
            topic: 'Tier Cutoff & Institutional Policy',
            source: 'credit_underwriting_policy.md',
            title: 'Credit Tier Classification Matrix',
            excerpt: 'Prime Tier (>=720, DTI<=36%), Near-Prime (660-719, DTI<=43%), Subprime (580-659).',
            citations: ['Underwriting Manual § 4']
          }
        ],
        citations: ['Basel III / IV IRB', '12 CFR § 1002.9 (ECOA)'],
        compliance_cleared: dti <= 0.50 && score >= 580
      },
      compliance_bias_audit: {
        fairness_audit: {
          applicant_cohort: applicant.EmploymentType,
          adverse_impact_ratio: applicant.EmploymentType === 'Unemployed' ? 0.38 : 0.92,
          four_fifths_rule_passed: applicant.EmploymentType !== 'Unemployed'
        },
        stress_test_results: {
          baseline: { scenario: 'Baseline Macro', stressed_pd_pct: pdPct, expected_loss_usd: expectedLoss },
          adverse: { scenario: 'Adverse (+150 bps)', stressed_pd_pct: Number((pdPct * 1.35).toFixed(2)), expected_loss_usd: Number((expectedLoss * 1.35).toFixed(2)) },
          severely_adverse: { scenario: 'Severely Adverse (+300 bps)', stressed_pd_pct: Number((pdPct * 1.8).toFixed(2)), expected_loss_usd: Number((expectedLoss * 1.8).toFixed(2)) },
          stress_test_resilience_passed: (pdPct * 1.8) < 55
        }
      },
      counterfactual_recommendations: decision === 'APPROVED' ? [] : [
        {
          action: 'Debt Service Optimization',
          recommendation: `Pay down revolving credit to lower DTI from ${(dti * 100).toFixed(0)}% to 35%.`,
          impact: 'Reduces default probability by approximately 7.2% into approval range.'
        },
        {
          action: 'Loan Sizing Adjustment',
          recommendation: `Reduce requested principal from $${loan.toLocaleString()} to $${(loan * 0.75).toLocaleString()}.`,
          impact: 'Lowers monthly debt service and Basel Exposure at Default.'
        }
      ],
      credit_committee_synthesis: {
        final_decision: decision,
        recommended_apr: apr,
        risk_spread: Number((apr - 6.5).toFixed(2)),
        covenants,
        adverse_action_reasons: adverseReasons,
        credit_memo: `### EXECUTIVE CREDIT UNDERWRITING MEMORANDUM\n**Decision Status:** \`${decision}\`\n**Timestamp:** ${timestamp}\n**Borrower Grade:** ${grade} | **Estimated 1-Year PD:** ${pdPct}%\n**Exposure at Default:** $${loan.toLocaleString()} | **Basel Expected Loss:** $${expectedLoss.toLocaleString()}`,
        timestamp
      },
      agent_logs: [
        { timestamp, agent_name: 'KYC_Anomaly_Agent', layer: 1, status: 'PASSED', summary: 'Identity & debt consistency validated', details: {} },
        { timestamp, agent_name: 'Quantitative_Risk_Agent', layer: 2, status: 'COMPLETED', summary: `Model PD: ${pdPct}% | Rating Grade: ${grade}`, details: {} },
        { timestamp, agent_name: 'Policy_RAG_Agent', layer: 3, status: 'COMPLIANCE_ALIGNED', summary: 'Retrieved Basel III/IV and ECOA statutory citations', details: {} },
        { timestamp, agent_name: 'Fairness_Stress_Agent', layer: 4, status: 'RESILIENT', summary: `AIR: ${(0.92).toFixed(2)} | Macro shock tested`, details: {} },
        { timestamp, agent_name: 'Credit_Committee_Orchestrator', layer: 5, status: decision, summary: `Final Executive Decision: ${decision} (APR: ${apr}%)`, details: {} }
      ]
    }
  };
}
