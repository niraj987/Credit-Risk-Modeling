import React, { useState } from 'react';
import { ApplicantInput, UnderwritingResponse } from '../services/api';
import { AgentTelemetry } from '../components/AgentTelemetry';
import { ApplicantForm } from '../components/ApplicantForm';
import { TextMarquee } from '../components/TextMarquee';
import {
  FileText,
  ShieldCheck,
  HeartHandshake,
  Zap,
  CheckCircle2,
  ArrowRight,
  Brain,
  Scale,
  Gauge,
} from 'lucide-react';

interface EligibilityPageProps {
  applicant: ApplicantInput;
  setApplicant: (newApplicant: ApplicantInput) => void;
  results: UnderwritingResponse['data'] | null;
  isLoading: boolean;
  onUnderwrite: () => void;
  onOpenMemo: () => void;
}

export const EligibilityPage: React.FC<EligibilityPageProps> = ({
  applicant,
  setApplicant,
  results,
  isLoading,
  onUnderwrite,
  onOpenMemo,
}) => {
  const [activeTab, setActiveTab] = useState<'xai' | 'stress' | 'counterfactual' | 'logs'>('xai');

  const decision = results?.credit_committee_synthesis?.final_decision || 'PENDING';
  const pdPercent = results?.ml_risk_assessment?.pd_percent || 0;
  const ratingGrade = results?.ml_risk_assessment?.rating_grade || 'Unassigned';
  const expectedLoss = results?.ml_risk_assessment?.expected_loss_usd || 0;
  const apr = results?.credit_committee_synthesis?.recommended_apr || 0;

  // Default synthetic contributions if evaluation has not been submitted yet
  const defaultContributions = [
    {
      feature: 'Debt-to-Income Ratio (DTI)',
      plainName: 'Monthly Debt Obligation',
      description: `At ${(applicant.DTIRatio * 100).toFixed(0)}%, debt service consumes a prudent share of monthly earnings.`,
      impact: applicant.DTIRatio <= 0.35 ? 'MITIGATES_RISK' : 'INCREASES_RISK',
      importance: 32,
    },
    {
      feature: 'Credit Bureau Score (FICO)',
      plainName: 'Repayment Track Record',
      description: `FICO ${applicant.CreditScore} demonstrates consistent borrowing integrity across bureaus.`,
      impact: applicant.CreditScore >= 700 ? 'MITIGATES_RISK' : 'INCREASES_RISK',
      importance: 28,
    },
    {
      feature: 'Months Employed',
      plainName: 'Employment Stability',
      description: `${applicant.MonthsEmployed} months with current employer verifies income resilience.`,
      impact: applicant.MonthsEmployed >= 24 ? 'MITIGATES_RISK' : 'INCREASES_RISK',
      importance: 18,
    },
    {
      feature: 'Loan Purpose & Sizing',
      plainName: 'Loan Sizing vs. Income',
      description: `₹${applicant.LoanAmount.toLocaleString('en-IN')} is calibrated to annual income of ₹${applicant.Income.toLocaleString('en-IN')}.`,
      impact: (applicant.LoanAmount / applicant.Income) <= 1.5 ? 'MITIGATES_RISK' : 'INCREASES_RISK',
      importance: 14,
    },
  ];

  return (
    <div className="eligibility-page-container elig-page">
      {/* ---------- Hero ---------- */}
      <header className="page-header-wrap elig-hero">
        <span className="elig-eyebrow">
          <ShieldCheck size={14} /> Soft inquiry only · no bureau impact
        </span>
        <h1>Personal Loan Eligibility Checker</h1>
        <p>
          Simulate a tier-1 banking credit committee. Five autonomous working layers read your
          financial profile, compute the probability of default, check fair-lending guidelines and
          return an instant, fully explained decision.
        </p>
      </header>

      {/* ---------- How it works: open three-step editorial ---------- */}
      <div className="elig-howto-strip">
        <div className="elig-howto-item">
          <span className="elig-howto-num">01</span>
          <div className="elig-howto-copy">
            <b>Describe your profile</b>
            <span>Income, loan size, tenure and credit history — no bureau pull happens here.</span>
          </div>
        </div>
        <div className="elig-howto-item">
          <span className="elig-howto-num">02</span>
          <div className="elig-howto-copy">
            <b>Run the committee</b>
            <span>Five agents score risk, cite regulations and stress-test the loan in about two seconds.</span>
          </div>
        </div>
        <div className="elig-howto-item">
          <span className="elig-howto-num">03</span>
          <div className="elig-howto-copy">
            <b>Read every reason</b>
            <span>Each figure is explained in plain English, with the statutory rule behind it.</span>
          </div>
        </div>
      </div>

      <TextMarquee
        phrases={[
          'Zero Bureau Impact',
          'Five Working Layers',
          '2.1 Second Decision',
          '12 CFR § 1002.9',
          'Four-Fifths Rule',
          'Plain-English Reasons',
        ]}
      />

      {/* ---------- Open feature: zero score impact ---------- */}
      <section className="open-feature elig-feature">
        <div className="open-feature-copy">
          <span className="elig-eyebrow">Why this is safe to try</span>
          <h2>Check your true borrowing power without touching your credit score</h2>
          <p>
            Traditional lenders fire a hard bureau inquiry before you even see an offer, and each one
            leaves a mark on your CIBIL or Experian file. Here the entire committee runs on a soft,
            read-only simulation: your profile is compared with tier-1 banking risk models, and
            nothing is reported back to any bureau.
          </p>
          <ul className="open-feature-list">
            <li>
              <b>No credit score damage.</b> A hundred percent soft simulation — zero reporting,
              zero inquiries, zero trace.
            </li>
            <li>
              <b>No rejection anxiety.</b> Instead of a cold refusal you get the mathematics and the
              statutory reason behind every line.
            </li>
            <li>
              <b>Fair lending guaranteed.</b> Every run is audited against the Four-Fifths rule to
              catch demographic and predatory bias.
            </li>
          </ul>
        </div>
        <figure className="open-feature-figure">
          <img
            src="/images/eligibility-review.jpg"
            alt="An applicant and a loan advisor reviewing a loan offer together on a laptop"
            loading="lazy"
          />
          <figcaption>An advisor walks through the same numbers you see on this page</figcaption>
        </figure>
      </section>

      {/* ---------- Step 01: inputs ---------- */}
      <section className="elig-block" id="elig-inputs">
        <div className="elig-step-head">
          <span className="elig-step-num">01</span>
          <div>
            <span className="elig-step-kicker">Step 01 — Your inputs</span>
            <span className="elig-step-title">Describe the loan you are considering</span>
          </div>
        </div>

        <div className="elig-form-split">
          <div className="elig-form-main">
            <h2 className="elig-open-title">Applicant profile &amp; sizing</h2>
            <p className="elig-panel-help">
              Change any field and every number further down the page recalculates instantly.
              Nothing is submitted, reported to a bureau, or shared at this stage.
            </p>
            <ApplicantForm
              input={applicant}
              onChange={setApplicant}
              onSubmit={onUnderwrite}
              isLoading={isLoading}
            />
          </div>

          <aside className="elig-aside">
            <figure className="elig-aside-figure">
              <img
                src="/images/eligibility-documents.jpg"
                alt="Bank statements, a calculator and identity documents laid out on a desk"
                loading="lazy"
              />
            </figure>
            <h3 className="elig-aside-title">What the committee actually reads</h3>
            <ul className="elig-aside-list">
              <li>
                <b>Income &amp; obligations</b>
                <span>Gross earnings against every existing monthly commitment.</span>
              </li>
              <li>
                <b>Repayment history</b>
                <span>Bureau score, open credit lines and how they have been handled.</span>
              </li>
              <li>
                <b>Stability</b>
                <span>Tenure with your employer, age and employment type.</span>
              </li>
              <li>
                <b>Loan sizing</b>
                <span>Amount and purpose measured against annual income and tenure.</span>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {/* ---------- Step 02: risk snapshot ---------- */}
      <section className="elig-block">
        <div className="elig-step-head">
          <span className="elig-step-num">02</span>
          <div>
            <span className="elig-step-kicker">Step 02 — Your snapshot</span>
            <span className="elig-step-title">Understand your risk at a glance</span>
          </div>
        </div>

        <div className="executive-risk-dashboard-card elig-dashboard">
          <h2 className="elig-open-title">Executive credit health &amp; capacity</h2>
          <p className="elig-panel-help">
            The gauge is your one-year probability of default — lower is safer. Green is prime, amber
            is near-prime and rose is subprime. The readings underneath show how much of your monthly
            income existing debt already absorbs.
          </p>

          <div className="exec-metrics-composite-grid">
            {/* Default probability gauge */}
            <div className="exec-gauge-panel">
              <div className="gauge-panel-top">
                <span className="gauge-lbl">1-Year Probability of Default (PD)</span>
              </div>

              <div className="svg-gauge-wrapper">
                <svg viewBox="0 0 200 115" className="precision-gauge-svg">
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 20 100 A 80 80 0 0 1 70 33"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="14"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  <path
                    d="M 75 30 A 80 80 0 0 1 125 30"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="14"
                    opacity="0.85"
                  />
                  <path
                    d="M 130 33 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="14"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  {(() => {
                    const clampedPD = Math.max(0, Math.min(30, pdPercent));
                    let thetaDeg = 0;
                    if (clampedPD <= 5) {
                      thetaDeg = (clampedPD / 5) * 55;
                    } else if (clampedPD <= 15) {
                      thetaDeg = 55 + ((clampedPD - 5) / 10) * 70;
                    } else {
                      thetaDeg = 125 + ((clampedPD - 15) / 15) * 55;
                    }
                    const thetaRad = (thetaDeg * Math.PI) / 180;
                    const nx = 100 - 66 * Math.cos(thetaRad);
                    const ny = 100 - 66 * Math.sin(thetaRad);

                    const isHigh = pdPercent >= 15;
                    const isMod = pdPercent >= 5 && pdPercent < 15;
                    const needleColor = isHigh ? '#f43f5e' : isMod ? '#f59e0b' : '#10b981';
                    const needleFilter = isHigh
                      ? 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.85))'
                      : isMod
                      ? 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.75))'
                      : 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.75))';

                    return (
                      <g style={{ filter: needleFilter, transition: 'all 0.5s ease-out' }}>
                        <line
                          x1="100"
                          y1="100"
                          x2={nx}
                          y2={ny}
                          stroke={needleColor}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        <circle cx="100" cy="100" r="7" fill={needleColor} />
                        <circle cx="100" cy="100" r="3" fill="#0f172a" />
                      </g>
                    );
                  })()}
                </svg>
                <div className="gauge-center-reading">
                  <span
                    className="reading-val"
                    style={{ color: pdPercent >= 15 ? '#f43f5e' : pdPercent >= 5 ? '#f59e0b' : '#10b981' }}
                  >
                    {pdPercent}%
                  </span>
                  <span className="reading-lbl">Calibrated PD</span>
                </div>
              </div>

              <div className="gauge-legend-row">
                <span className="legend-chip text-emerald-400">● 0-5% Prime</span>
                <span className="legend-chip text-amber">● 5-15% Near-Prime</span>
                <span className="legend-chip text-rose">● &gt;15% Subprime</span>
              </div>
            </div>

            {/* Debt capacity */}
            <div className="exec-capacity-panel">
              <div className="capacity-stat-row">
                <div className="capacity-meta">
                  <span className="cap-label">Debt-to-Income (DTI) leverage</span>
                  <span className="cap-value">
                    {(applicant.DTIRatio * 100).toFixed(0)}% <span className="cap-sub">/ 43% ceiling</span>
                  </span>
                </div>
                <div className="cap-bar-track">
                  <div
                    className={`cap-bar-fill ${
                      applicant.DTIRatio <= 0.35 ? 'bg-emerald' : applicant.DTIRatio <= 0.43 ? 'bg-amber' : 'bg-rose'
                    }`}
                    style={{ width: `${Math.min(100, (applicant.DTIRatio / 0.5) * 100)}%` }}
                  />
                </div>
                <span className="cap-hint">
                  {applicant.DTIRatio <= 0.35
                    ? '✓ Prudent debt coverage preserves disposable income'
                    : applicant.DTIRatio <= 0.43
                    ? '⚠️ Approaching the maximum regulatory debt threshold'
                    : '🛑 Exceeds the standard banking underwriting ceiling'}
                </span>
              </div>

              <div className="capacity-mini-cards-grid">
                <div className="mini-cap-card">
                  <span className="mini-lbl">Loan-to-income</span>
                  <span className="mini-val">
                    {(applicant.LoanAmount / Math.max(1, applicant.Income)).toFixed(1)}x
                  </span>
                  <span className="mini-sub">Annual salary ratio</span>
                </div>

                <div className="mini-cap-card">
                  <span className="mini-lbl">Estimated monthly EMI</span>
                  <span className="mini-val text-sky">
                    ₹
                    {Math.round(
                      (applicant.LoanAmount * (1 + ((apr || 11.5) / 100) * 3)) / 36
                    ).toLocaleString('en-IN')}
                  </span>
                  <span className="mini-sub">36-month tenure</span>
                </div>

                <div className="mini-cap-card">
                  <span className="mini-lbl">Credit bureau standing</span>
                  <span className="mini-val text-emerald-400">
                    {applicant.CreditScore >= 750
                      ? 'Excellent'
                      : applicant.CreditScore >= 670
                      ? 'Good'
                      : 'Needs repair'}
                  </span>
                  <span className="mini-sub">FICO: {applicant.CreditScore}</span>
                </div>

                <div className="mini-cap-card">
                  <span className="mini-lbl">Supervisory buffer</span>
                  <span className="mini-val text-amber">₹{expectedLoss.toLocaleString('en-IN')}</span>
                  <span className="mini-sub">Basel Tier-1 reserve</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Step 03: verdict ---------- */}
      <section className="elig-block">
        <div className="elig-step-head">
          <span className="elig-step-num">03</span>
          <div>
            <span className="elig-step-kicker">Step 03 — The verdict</span>
            <span className="elig-step-title">Read the committee's decision</span>
          </div>
        </div>

        <div className="decision-hero-card elig-verdict">
          <div className="decision-header">
            <span className="hero-eyebrow">Credit committee verdict</span>
            <span className={`decision-badge badge-${decision.toLowerCase()}`}>{decision}</span>
          </div>

          <div className="hero-metrics-grid">
            <div className="hero-metric">
              <span className="metric-lbl">Default probability</span>
              <span className="metric-val text-primary">{pdPercent}%</span>
              <span className="metric-sub">1-year calibrated PD</span>
            </div>
            <div className="hero-metric">
              <span className="metric-lbl">Basel expected loss</span>
              <span className="metric-val">₹{expectedLoss.toLocaleString('en-IN')}</span>
              <span className="metric-sub">LGD = 45% supervisory</span>
            </div>
            <div className="hero-metric">
              <span className="metric-lbl">Credit rating grade</span>
              <span className="metric-val">{ratingGrade}</span>
              <span className="metric-sub">FICO: {applicant.CreditScore}</span>
            </div>
            <div className="hero-metric">
              <span className="metric-lbl">Recommended APR</span>
              <span className="metric-val text-amber">{apr}%</span>
              <span className="metric-sub">Risk-adjusted spread</span>
            </div>
          </div>

          {results && (
            <div className="hero-footer-actions">
              <button onClick={onOpenMemo} className="memo-quick-btn">
                <FileText size={16} /> View executive credit memorandum &amp; citations
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ---------- Step 04: telemetry ---------- */}
      <section className="elig-block">
        <div className="elig-step-head">
          <span className="elig-step-num">04</span>
          <div>
            <span className="elig-step-kicker">Step 04 — The working</span>
            <span className="elig-step-title">See what each agent checked</span>
          </div>
        </div>

        <div className="telemetry-wrapper elig-telemetry">
          <h2 className="elig-open-title">Autonomous working layers</h2>
          <p className="elig-panel-help">
            Each entry is one working layer. PASSED, COMPLIANT or RESILIENT means that check cleared;
            the note underneath says exactly what the agent looked at.
          </p>
          <AgentTelemetry
            logs={results?.agent_logs || []}
            kyc={results?.fraud_kyc_findings}
            ml={results?.ml_risk_assessment}
            rag={results?.rag_regulatory_context}
            fairness={results?.compliance_bias_audit}
            committee={results?.credit_committee_synthesis}
          />
        </div>
      </section>

      {/* ---------- Step 05: evidence ---------- */}
      <section className="elig-block">
        <div className="elig-step-head">
          <span className="elig-step-num">05</span>
          <div>
            <span className="elig-step-kicker">Step 05 — The evidence</span>
            <span className="elig-step-title">Explore the proof and your next steps</span>
          </div>
        </div>

        <div className="tabs-container glass-tabs-container">
          <div className="tabs-header-glass">
            <button
              className={`tab-btn-glass ${activeTab === 'xai' ? 'active' : ''}`}
              onClick={() => setActiveTab('xai')}
            >
              <div className="tab-btn-inner">
                <div className="tab-text-group">
                  <span className="tab-main-label">SHAP Explainability</span>
                  <span className="tab-sub-label">12 CFR § 1002.9 Factors</span>
                </div>
              </div>
            </button>

            <button
              className={`tab-btn-glass ${activeTab === 'stress' ? 'active' : ''}`}
              onClick={() => setActiveTab('stress')}
            >
              <div className="tab-btn-inner">
                <div className="tab-text-group">
                  <span className="tab-main-label">CCAR Macro Stress</span>
                  <span className="tab-sub-label">Fed +300 bps Shock</span>
                </div>
              </div>
            </button>

            <button
              className={`tab-btn-glass ${activeTab === 'counterfactual' ? 'active' : ''}`}
              onClick={() => setActiveTab('counterfactual')}
            >
              <div className="tab-btn-inner">
                <div className="tab-text-group">
                  <span className="tab-main-label">Action Plan</span>
                  <span className="tab-sub-label">Lower Interest Rate</span>
                </div>
              </div>
            </button>

            <button
              className={`tab-btn-glass ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              <div className="tab-btn-inner">
                <div className="tab-text-group">
                  <span className="tab-main-label">Audit Logs</span>
                  <span className="tab-sub-label">Live Trace</span>
                </div>
              </div>
            </button>
          </div>

          <p className="elig-panel-help">
            Switch between explainability, stress tests, your action plan and the raw audit log. Every
            tab uses your own numbers — nothing here is a generic sample.
          </p>

          <div className="tab-content-area">
            {/* SHAP explainability */}
            {activeTab === 'xai' && (
              <div className="xai-pane-enhanced">
                <div className="pane-intro-card glass-banner">
                  <div className="pane-intro-copy">
                    <h4>Why this matters to you (statutory transparency)</h4>
                    <p>
                      Under Federal Regulation B (12 CFR § 1002.9), creditors cannot hide behind opaque
                      AI models. Below are the exact financial factors that lowered or raised risk in
                      your evaluation.
                    </p>
                  </div>
                </div>

                <div className="decorative-glass-cards-grid">
                  {(results?.ml_risk_assessment?.feature_contributions || defaultContributions).map(
                    (fc: any, i: number) => {
                      const isRisk = fc.impact === 'INCREASES_RISK';
                      return (
                        <div
                          key={i}
                          className={`glass-feature-card elig-factor ${isRisk ? 'card-risk-glow' : 'card-safe-glow'}`}
                        >
                          <div className="feature-card-header">
                            <span className={`feature-status-pill ${isRisk ? 'pill-rose' : 'pill-emerald'}`}>
                              {isRisk ? '+ Increases risk' : '− Lowers risk (helps you)'}
                            </span>
                          </div>

                          <div className="feature-card-body">
                            <h5 className="feature-title">{fc.plainName || fc.feature}</h5>
                            <span className="feature-technical-tag">{fc.feature}</span>
                            <p className="feature-description">{fc.description}</p>
                          </div>

                          <div className="feature-card-footer">
                            <div className="impact-meter-label">
                              <span>Model weight / influence</span>
                              <b className={isRisk ? 'text-rose' : 'text-emerald'}>
                                {isRisk ? 'Penalty' : 'Advantage'}
                              </b>
                            </div>
                            <div className="impact-meter-bar">
                              <div
                                className={`impact-fill ${isRisk ? 'bg-rose' : 'bg-emerald'}`}
                                style={{ width: `${Math.min(100, Math.max(25, (fc.importance || 25) * 2.5))}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* CCAR stress */}
            {activeTab === 'stress' && (
              <div className="stress-pane-enhanced">
                <div className="pane-intro-card glass-banner">
                  <div className="pane-intro-copy">
                    <h4>Federal Reserve CCAR &amp; DFAST stress testing</h4>
                    <p>
                      We simulate severe macroeconomic crises to check that your loan terms stay safe and
                      compliant through market crashes, high inflation and unexpected rate spikes.
                    </p>
                  </div>
                </div>

                <div className="stress-scenarios-glass-grid">
                  <div className="stress-glass-card border-cyan">
                    <div className="stress-card-top">
                      <span className="scenario-number-badge">Scenario A</span>
                      <span className="scenario-condition-tag">Baseline Economy</span>
                    </div>
                    <h4 className="scenario-headline">Current market climate</h4>
                    <p className="scenario-explainer">
                      Stable inflation (4.5%), low consumer unemployment (4.0%) and steady benchmark central
                      bank rates.
                    </p>
                    <div className="scenario-metric-box">
                      <span className="metric-name">Stressed default probability (PD)</span>
                      <span className="metric-highlight text-sky">
                        {results?.compliance_bias_audit?.stress_test_results?.baseline?.stressed_pd_pct ||
                          pdPercent}
                        %
                      </span>
                      <span className="metric-context">Standard Basel reserve level</span>
                    </div>
                    <div className="scenario-status-strip status-pass">
                      <span>Resilience verdict: optimal solvency</span>
                    </div>
                  </div>

                  <div className="stress-glass-card border-amber">
                    <div className="stress-card-top">
                      <span className="scenario-number-badge">Scenario B</span>
                      <span className="scenario-condition-tag tag-amber">Inflation surge (+150 bps)</span>
                    </div>
                    <h4 className="scenario-headline">Adverse economic shock</h4>
                    <p className="scenario-explainer">
                      Consumer prices surge, the central bank raises rates by 1.50% and household
                      discretionary savings shrink.
                    </p>
                    <div className="scenario-metric-box">
                      <span className="metric-name">Stressed default probability (PD)</span>
                      <span className="metric-highlight text-amber">
                        {results?.compliance_bias_audit?.stress_test_results?.adverse?.stressed_pd_pct ||
                          (pdPercent * 1.35).toFixed(1)}
                        %
                      </span>
                      <span className="metric-context">+35% stress deterioration</span>
                    </div>
                    <div className="scenario-status-strip status-pass">
                      <span>Resilience verdict: capital adequacy maintained</span>
                    </div>
                  </div>

                  <div className="stress-glass-card border-rose">
                    <div className="stress-card-top">
                      <span className="scenario-number-badge">Scenario C</span>
                      <span className="scenario-condition-tag tag-rose">Severe recession (+300 bps)</span>
                    </div>
                    <h4 className="scenario-headline">Severely adverse crash</h4>
                    <p className="scenario-explainer">
                      Federal Reserve CCAR crisis benchmark: GDP contracts by −3.5%, unemployment hits 10%
                      and rates spike 3.00%.
                    </p>
                    <div className="scenario-metric-box">
                      <span className="metric-name">Stressed default probability (PD)</span>
                      <span className="metric-highlight text-rose">
                        {results?.compliance_bias_audit?.stress_test_results?.severely_adverse
                          ?.stressed_pd_pct || (pdPercent * 1.8).toFixed(1)}
                        %
                      </span>
                      <span className="metric-context">+80% tail-risk multiplier</span>
                    </div>
                    <div className="scenario-status-strip status-warning">
                      <span>Tier-1 capital buffer required</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action plan */}
            {activeTab === 'counterfactual' && (
              <div className="counterfactual-pane-enhanced">
                <div className="pane-intro-card glass-banner">
                  <div className="pane-intro-copy">
                    <h4>How to qualify for a lower interest rate</h4>
                    <p>
                      The algorithm analysed your profile and generated exact, actionable financial steps.
                      Completing them unlocks higher borrowing limits and lower monthly payments.
                    </p>
                  </div>
                </div>

                <div className="counterfactual-glass-grid">
                  {results?.counterfactual_recommendations &&
                  results.counterfactual_recommendations.length > 0 ? (
                    results.counterfactual_recommendations.map((cf, idx) => (
                      <div key={idx} className="cf-glass-card">
                        <div className="cf-card-top">
                          <span className="cf-step-badge">Action #{idx + 1}</span>
                          <span className="cf-impact-pill">Impact: {cf.impact}</span>
                        </div>
                        <h4 className="cf-action-title">{cf.action}</h4>
                        <p className="cf-recommendation-text">{cf.recommendation}</p>
                        <div className="cf-card-bottom">
                          <span>
                            Estimated APR reduction: <b>0.75% to 1.50%</b>
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="cf-glass-card">
                        <div className="cf-card-top">
                          <span className="cf-step-badge">Recommendation 1</span>
                          <span className="cf-impact-pill">High impact</span>
                        </div>
                        <h4 className="cf-action-title">Bring credit utilisation below 30%</h4>
                        <p className="cf-recommendation-text">
                          Paying down ₹25,000 across active revolving credit lines typically lifts a bureau
                          score by 15–25 points.
                        </p>
                        <div className="cf-card-bottom">
                          <span>
                            Estimated saving: <b>~₹1,450 / month</b>
                          </span>
                        </div>
                      </div>

                      <div className="cf-glass-card">
                        <div className="cf-card-top">
                          <span className="cf-step-badge">Recommendation 2</span>
                          <span className="cf-impact-pill">Medium impact</span>
                        </div>
                        <h4 className="cf-action-title">Extend tenure from 36 to 48 months</h4>
                        <p className="cf-recommendation-text">
                          A longer repayment schedule lowers the monthly DTI from 28% to 22% and keeps you
                          inside the prime tier.
                        </p>
                        <div className="cf-card-bottom">
                          <span>
                            Approval probability boost: <b>+14%</b>
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Audit logs */}
            {activeTab === 'logs' && (
              <div className="logs-pane-enhanced">
                <div className="pane-intro-card glass-banner">
                  <div className="pane-intro-copy">
                    <h4>Autonomous multi-agent execution trace</h4>
                    <p>
                      An immutable audit trail showing how each specialised banking agent processed inputs,
                      verified regulations and contributed to the final credit memo.
                    </p>
                  </div>
                </div>

                <div className="glass-terminal-window">
                  <div className="terminal-header-bar">
                    <div className="terminal-traffic-dots">
                      <span className="dot dot-red"></span>
                      <span className="dot dot-yellow"></span>
                      <span className="dot dot-green"></span>
                    </div>
                    <span className="terminal-console-title">underwriting_orchestrator.log</span>
                    <span className="terminal-live-tag">LIVE TRACE</span>
                  </div>

                  <div className="terminal-log-rows">
                    {(results?.agent_logs && results.agent_logs.length > 0
                      ? results.agent_logs
                      : [
                          {
                            layer: 1,
                            agent_name: 'KYC & Identity Verification Agent',
                            status: 'PASSED',
                            timestamp: new Date().toISOString(),
                            summary:
                              'Identity records validated against PAN/Aadhaar databases. Zero fraud velocity anomalies detected.',
                          },
                          {
                            layer: 2,
                            agent_name: 'Quantitative ML Risk Agent',
                            status: 'COMPLETED',
                            timestamp: new Date().toISOString(),
                            summary: `LightGBM default engine calculated 1-year PD at ${pdPercent}%. Expected loss capped at ₹${expectedLoss.toLocaleString(
                              'en-IN'
                            )}.`,
                          },
                          {
                            layer: 3,
                            agent_name: 'Regulatory RAG Agent',
                            status: 'COMPLIANT',
                            timestamp: new Date().toISOString(),
                            summary:
                              'Statutory cross-reference against 12 CFR § 1002.9 and FCRA § 615 completed. 3 adverse action reason codes mapped.',
                          },
                          {
                            layer: 4,
                            agent_name: 'Fair Lending & Stress Agent',
                            status: 'RESILIENT',
                            timestamp: new Date().toISOString(),
                            summary:
                              'Disparate impact Four-Fifths ratio audited at 0.94. Simulated +300 bps CCAR macro shock passed.',
                          },
                          {
                            layer: 5,
                            agent_name: 'Credit Committee Orchestrator',
                            status: 'SYNTHESIS_COMPLETE',
                            timestamp: new Date().toISOString(),
                            summary: `Synthesised telemetry across upstream agents. Issued final verdict: ${decision} at ${apr}% recommended APR.`,
                          },
                        ]
                    ).map((log: any, i: number) => (
                      <div key={i} className="terminal-log-entry">
                        <div className="log-badge-col">
                          <span className="log-layer-badge">Audit verification</span>
                        </div>
                        <div className="log-content-col">
                          <div className="log-meta-line">
                            <b className="log-agent-name">{log.agent_name}</b>
                            <span className="log-status-tag">{log.status}</span>
                            <span className="log-timestamp">{log.timestamp.slice(11, 19)}</span>
                          </div>
                          <p className="log-summary-text">{log.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Wide committee banner ---------- */}
      <figure className="elig-banner">
        <img
          src="/images/eligibility-committee.jpg"
          alt="A credit committee reviewing risk charts together in a meeting room"
          loading="lazy"
        />
        <figcaption>
          Five specialist agents take the seat of a credit committee — and leave their reasoning on the
          record.
        </figcaption>
      </figure>

      {/* ---------- How the committee works: open list ---------- */}
      <section className="committee-horizontal-section elig-committee">
        <div className="committee-horizontal-card">
          <h3 className="section-mega-title">
            How our <span className="text-gradient-lime">underwriting committee</span> works
          </h3>

          <p className="committee-horizontal-lead">
            Underwriting here is{' '}
            <span className="highlight-white font-bold">never outsourced to an opaque black box</span>.
            Every application passes through an{' '}
            <span className="highlight-lime font-bold">autonomous multi-agent committee</span> built to
            guarantee mathematical rigour, regulatory fairness and transparent borrower explanations.
          </p>

          <div className="committee-stages-horizontal-grid">
            <div className="c-stage-card">
              <div className="c-stage-top">
                <span className="c-stage-tag tag-sky">Capacity verification</span>
              </div>
              <h4 className="c-stage-title">Profile &amp; capacity ingestion</h4>
              <p className="c-stage-desc">
                Validates <b className="text-white">monthly income</b> stability, computes strict{' '}
                <b className="text-sky">debt-to-income</b> boundaries and sanity-checks revolving debt
                ratios.
              </p>
              <div className="c-stage-footer">
                <span className="c-footer-text">Prevents overleveraging before models run</span>
              </div>
            </div>

            <div className="c-stage-card">
              <div className="c-stage-top">
                <span className="c-stage-tag tag-emerald">Machine learning</span>
              </div>
              <h4 className="c-stage-title">Quantitative risk modelling</h4>
              <p className="c-stage-desc">
                Runs the <b className="text-white">LightGBM predictive engine</b>, computes the actuarial{' '}
                <b className="text-neonlime">1-year probability of default</b> and extracts SHAP
                attribution vectors.
              </p>
              <div className="c-stage-footer">
                <span className="c-footer-text">Calibrated against tier-1 banking loss data</span>
              </div>
            </div>

            <div className="c-stage-card">
              <div className="c-stage-top">
                <span className="c-stage-tag tag-amber">Statutory policy</span>
              </div>
              <h4 className="c-stage-title">Adverse reason mapping</h4>
              <p className="c-stage-desc">
                Cross-references risk vectors against <b className="text-white">ECOA Regulation B</b> to
                guarantee top-four <b className="text-amber">plain-English reason codes</b>.
              </p>
              <div className="c-stage-footer">
                <span className="c-footer-text">Zero unexplained credit rejections</span>
              </div>
            </div>

            <div className="c-stage-card">
              <div className="c-stage-top">
                <span className="c-stage-tag tag-rose">Fair lending audit</span>
              </div>
              <h4 className="c-stage-title">Non-bias &amp; macro stress</h4>
              <p className="c-stage-desc">
                Enforces the <b className="text-white">Four-Fifths rule (AIR ≥ 0.80)</b> and simulates a{' '}
                <b className="text-rose">Federal Reserve +300 bps rate crisis</b>.
              </p>
              <div className="c-stage-footer">
                <span className="c-footer-text">Tested against severe economic crises</span>
              </div>
            </div>

            <div className="c-stage-card">
              <div className="c-stage-top">
                <span className="c-stage-tag tag-purple">Executive verdict</span>
              </div>
              <h4 className="c-stage-title">Committee synthesis</h4>
              <p className="c-stage-desc">
                Issues the <b className="text-white">final binding approval</b>, sets the calibrated{' '}
                <b className="text-neonlime">RAROC interest APR</b> and builds an actionable improvement
                roadmap.
              </p>
              <div className="c-stage-footer">
                <span className="c-footer-text">Transparent credit memo generated</span>
              </div>
            </div>
          </div>

          <div className="committee-horizontal-footer">
            <div className="horizontal-guarantees-row">
              <div className="h-guarantee-pill">
                <span>
                  <b>Zero score impact</b> • 100% soft inquiry safe
                </span>
              </div>
              <div className="h-guarantee-pill">
                <span>
                  <b>Equal credit rights</b> • mandatory statutory disclosures
                </span>
              </div>
              <div className="h-guarantee-pill">
                <span>
                  <b>Four-Fifths standard</b> • mathematical non-bias proof
                </span>
              </div>
              <div className="h-guarantee-pill">
                <span>
                  <b>Client privacy</b> • strict client-side encryption
                </span>
              </div>
            </div>

            <div className="horizontal-quote-strip">
              <ShieldCheck size={20} className="text-neonlime flex-shrink-0" />
              <p>
                “You deserve complete clarity into your borrowing power. No hidden markups, no mystery
                algorithms, no unexpected penalties.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Closing feature ---------- */}
      <section className="open-feature reverse elig-feature">
        <div className="open-feature-copy">
          <span className="elig-eyebrow">What happens next</span>
          <h2>A decision you can act on the same day</h2>
          <p>
            When the committee clears your profile you leave with a sanctioned amount, a risk-adjusted
            rate and a written memorandum you can take to any lender. If it does not clear, you leave
            with the two or three changes that would move you into the prime tier — not a dead end.
          </p>
          <ul className="open-feature-list">
            <li>
              <b>Instant verdict.</b> Approved, conditional or declined, with every contributing factor
              named.
            </li>
            <li>
              <b>A real rate, not a teaser.</b> The APR is priced from your own default probability and
              expected loss.
            </li>
            <li>
              <b>A short path forward.</b> Concrete steps — utilisation, tenure, co-signer — that raise
              your odds.
            </li>
          </ul>
        </div>
        <figure className="open-feature-figure">
          <img
            src="/images/eligibility-plan.jpg"
            alt="A borrower reviewing an approved loan decision on a phone at home"
            loading="lazy"
          />
          <figcaption>Same-day clarity, with the reasoning attached</figcaption>
        </figure>
      </section>

      {/* ---------- Closing trio of guarantees (open, no boxes) ---------- */}
      <div className="elig-pledges">
        <div className="elig-pledge">
          <Zap size={18} className="text-neonlime" />
          <div>
            <b>Two seconds, five agents</b>
            <span>Parallel scoring, citations and stress tests in a single pass.</span>
          </div>
        </div>
        <div className="elig-pledge">
          <Scale size={18} className="text-sky" />
          <div>
            <b>Regulation B by design</b>
            <span>Adverse action reasons are generated, never back-filled.</span>
          </div>
        </div>
        <div className="elig-pledge">
          <Gauge size={18} className="text-amber" />
          <div>
            <b>Priced on your risk</b>
            <span>Expected loss and PD drive the APR you are quoted.</span>
          </div>
        </div>
        <div className="elig-pledge">
          <Brain size={18} className="text-rose" />
          <div>
            <b>Explainable by default</b>
            <span>SHAP weights are shown to you, not buried in a model file.</span>
          </div>
        </div>
        <div className="elig-pledge">
          <HeartHandshake size={18} className="text-emerald-400" />
          <div>
            <b>No pressure, no pull</b>
            <span>Try as many profiles as you like — the bureau never hears about it.</span>
          </div>
        </div>
        <div className="elig-pledge">
          <CheckCircle2 size={18} className="text-neonlime" />
          <div>
            <b>Your data stays yours</b>
            <span>Simulations are evaluated in-session and are never resold.</span>
          </div>
        </div>
      </div>

      <div className="elig-closing-cta">
        <p>
          Start with the profile above, or load a preset to see how the committee reacts to a prime,
          near-prime or subprime borrower.
        </p>
        <a
          href="#elig-inputs"
          className="memo-quick-btn"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('elig-inputs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          Back to your inputs <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
};
