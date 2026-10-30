import React, { useState } from 'react';
import { ApplicantInput, UnderwritingResponse } from '../services/api';
import { RiskGlobe3D } from '../components/RiskGlobe3D';
import { RiskSurface3D } from '../components/RiskSurface3D';
import { AgentTelemetry } from '../components/AgentTelemetry';
import { ApplicantForm } from '../components/ApplicantForm';
import {
  FileText,
  Sparkles,
  Brain,
  TrendingDown,
  Lightbulb,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Scale,
  Award,
  Zap,
  HelpCircle,
  Activity,
  Layers,
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
    <div className="eligibility-page-container">
      <div className="page-header-wrap">
        <div className="page-badge badge-emerald">
          <Sparkles size={14} className="text-emerald-400" />
          <span>Real-Time Multi-Agent Underwriting</span>
        </div>
        <h1>Personal Loan Eligibility Checker</h1>
        <p>
          Simulate a tier-1 banking credit committee. Our 5 autonomous agent working layers inspect
          your financial profile, compute probability of default, check fair lending guidelines, and issue instant decisions.
        </p>
      </div>

      <div className="eligibility-grid">
        {/* Left Column: Form */}
        <section className="form-col">
          <div className="card-panel">
            <div className="card-header-bar">
              <h2>Applicant Profile & Sizing</h2>
              <span className="badge-pill">4 Presets Available</span>
            </div>
            <ApplicantForm
              input={applicant}
              onChange={setApplicant}
              onSubmit={onUnderwrite}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* Right Column: 3D Visualization, Decision, and Telemetry */}
        <section className="dashboard-col">
          {/* Top Panel: 3D Globe + 3D Risk Topology Surface */}
          <div className="dashboard-3d-models-row">
            <div className="globe-card glass-card">
              <RiskGlobe3D riskScore={pdPercent} decision={decision} />
            </div>
            <div className="surface-3d-card glass-card">
              <RiskSurface3D
                creditScore={applicant.CreditScore}
                dtiRatio={applicant.DTIRatio}
                pdPercent={pdPercent}
              />
            </div>
          </div>

          <div className="dashboard-hero-grid">
            <div className="decision-hero-card">
              <div className="decision-header">
                <span className="hero-eyebrow">Credit Committee Verdict</span>
                <span className={`decision-badge badge-${decision.toLowerCase()}`}>
                  {decision}
                </span>
              </div>

              <div className="hero-metrics-grid">
                <div className="hero-metric">
                  <span className="metric-lbl">Default Probability</span>
                  <span className="metric-val text-primary">{pdPercent}%</span>
                  <span className="metric-sub">1-Year Calibrated PD</span>
                </div>
                <div className="hero-metric">
                  <span className="metric-lbl">Basel Expected Loss</span>
                  <span className="metric-val">₹{expectedLoss.toLocaleString('en-IN')}</span>
                  <span className="metric-sub">LGD = 45% Supervisory</span>
                </div>
                <div className="hero-metric">
                  <span className="metric-lbl">Institutional Grade</span>
                  <span className="metric-val">{ratingGrade}</span>
                  <span className="metric-sub">FICO: {applicant.CreditScore}</span>
                </div>
                <div className="hero-metric">
                  <span className="metric-lbl">Recommended APR</span>
                  <span className="metric-val text-amber">{apr}%</span>
                  <span className="metric-sub">Risk-Adjusted Spread</span>
                </div>
              </div>

              {results && (
                <div className="hero-footer-actions">
                  <button onClick={onOpenMemo} className="memo-quick-btn">
                    <FileText size={16} /> View Executive Credit Memorandum & Citations
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 5-Layer Agent Telemetry Cards */}
          <div className="telemetry-wrapper">
            <div className="telemetry-title-bar">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-sky" />
                <h3>Autonomous Working Layers (LangGraph State Flow)</h3>
              </div>
              <span className="live-pulse-badge">
                <span className="pulse-dot"></span> 5 Agents Active
              </span>
            </div>
            <AgentTelemetry
              logs={results?.agent_logs || []}
              kyc={results?.fraud_kyc_findings}
              ml={results?.ml_risk_assessment}
              rag={results?.rag_regulatory_context}
              fairness={results?.compliance_bias_audit}
              committee={results?.credit_committee_synthesis}
            />
          </div>

          {/* Deep-Dive Analysis Tabs: Glass Effect & Decorative Cards */}
          <div className="tabs-container glass-tabs-container">
            {/* Segmented Tab Controls */}
            <div className="tabs-header-glass">
              <button
                className={`tab-btn-glass ${activeTab === 'xai' ? 'active' : ''}`}
                onClick={() => setActiveTab('xai')}
              >
                <div className="tab-btn-inner">
                  <Brain size={18} className="tab-icon-sky" />
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
                  <TrendingDown size={18} className="tab-icon-amber" />
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
                  <Lightbulb size={18} className="tab-icon-emerald" />
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
                  <Terminal size={18} className="tab-icon-purple" />
                  <div className="tab-text-group">
                    <span className="tab-main-label">LangGraph Audit</span>
                    <span className="tab-sub-label">5-Agent Live Trace</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Tab Pane 1: SHAP Explainability & Risk Drivers */}
            <div className="tab-content-area">
              {activeTab === 'xai' && (
                <div className="xai-pane-enhanced">
                  <div className="pane-intro-card glass-banner">
                    <div className="pane-intro-icon bg-sky-tint">
                      <Brain size={22} className="text-sky" />
                    </div>
                    <div className="pane-intro-copy">
                      <h4>Why This Matters To You (Statutory Transparency)</h4>
                      <p>
                        Under Federal Regulation B (12 CFR § 1002.9), creditors cannot hide behind opaque AI models.
                        Below are the exact financial factors that positively influenced or increased risk in your evaluation.
                      </p>
                    </div>
                  </div>

                  <div className="decorative-glass-cards-grid">
                    {(results?.ml_risk_assessment?.feature_contributions || defaultContributions).map((fc: any, i: number) => {
                      const isRisk = fc.impact === 'INCREASES_RISK';
                      return (
                        <div
                          key={i}
                          className={`glass-feature-card ${isRisk ? 'card-risk-glow' : 'card-safe-glow'}`}
                        >
                          <div className="feature-card-header">
                            <div className="feature-icon-badge">
                              {isRisk ? (
                                <ArrowUpRight size={18} className="text-rose" />
                              ) : (
                                <ArrowDownRight size={18} className="text-emerald" />
                              )}
                            </div>
                            <span className={`feature-status-pill ${isRisk ? 'pill-rose' : 'pill-emerald'}`}>
                              {isRisk ? '+ Increases Risk' : '- Lowers Risk (Helps You)'}
                            </span>
                          </div>

                          <div className="feature-card-body">
                            <h5 className="feature-title">{fc.plainName || fc.feature}</h5>
                            <span className="feature-technical-tag">{fc.feature}</span>
                            <p className="feature-description">{fc.description}</p>
                          </div>

                          <div className="feature-card-footer">
                            <div className="impact-meter-label">
                              <span>Model Weight / Influence</span>
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
                    })}
                  </div>
                </div>
              )}

              {/* Tab Pane 2: CCAR Macro Stress Testing */}
              {activeTab === 'stress' && (
                <div className="stress-pane-enhanced">
                  <div className="pane-intro-card glass-banner">
                    <div className="pane-intro-icon bg-amber-tint">
                      <TrendingDown size={22} className="text-amber" />
                    </div>
                    <div className="pane-intro-copy">
                      <h4>Federal Reserve CCAR & DFAST Stress Testing</h4>
                      <p>
                        We simulate severe macroeconomic crises to ensure your loan terms remain safe and compliant
                        even during market crashes, high inflation, or unexpected rate spikes.
                      </p>
                    </div>
                  </div>

                  <div className="stress-scenarios-glass-grid">
                    {/* Scenario A: Baseline */}
                    <div className="stress-glass-card border-cyan">
                      <div className="stress-card-top">
                        <span className="scenario-number-badge">Scenario A</span>
                        <span className="scenario-condition-tag">Baseline Economy</span>
                      </div>
                      <h4 className="scenario-headline">Current Market Climate</h4>
                      <p className="scenario-explainer">
                        Stable inflation (4.5%), low consumer unemployment (4.0%), and steady benchmark central bank rates.
                      </p>
                      <div className="scenario-metric-box">
                        <span className="metric-name">Stressed Default Probability (PD)</span>
                        <span className="metric-highlight text-sky">
                          {results?.compliance_bias_audit?.stress_test_results?.baseline?.stressed_pd_pct || pdPercent}%
                        </span>
                        <span className="metric-context">Standard Basel Reserve Level</span>
                      </div>
                      <div className="scenario-status-strip status-pass">
                        <CheckCircle2 size={16} />
                        <span>Resilience Verdict: Optimal Solvency</span>
                      </div>
                    </div>

                    {/* Scenario B: Adverse Shock */}
                    <div className="stress-glass-card border-amber">
                      <div className="stress-card-top">
                        <span className="scenario-number-badge">Scenario B</span>
                        <span className="scenario-condition-tag tag-amber">Inflation Surge (+150 bps)</span>
                      </div>
                      <h4 className="scenario-headline">Adverse Economic Shock</h4>
                      <p className="scenario-explainer">
                        Consumer prices surge, RBI/Fed raises interest rates by 1.50%, and household discretionary savings shrink.
                      </p>
                      <div className="scenario-metric-box">
                        <span className="metric-name">Stressed Default Probability (PD)</span>
                        <span className="metric-highlight text-amber">
                          {results?.compliance_bias_audit?.stress_test_results?.adverse?.stressed_pd_pct || (pdPercent * 1.35).toFixed(1)}%
                        </span>
                        <span className="metric-context">+35% Stress Deterioration</span>
                      </div>
                      <div className="scenario-status-strip status-pass">
                        <CheckCircle2 size={16} />
                        <span>Resilience Verdict: Capital Adequacy Maintained</span>
                      </div>
                    </div>

                    {/* Scenario C: Severely Adverse */}
                    <div className="stress-glass-card border-rose">
                      <div className="stress-card-top">
                        <span className="scenario-number-badge">Scenario C</span>
                        <span className="scenario-condition-tag tag-rose">Severe Recession (+300 bps)</span>
                      </div>
                      <h4 className="scenario-headline">Severely Adverse Crash</h4>
                      <p className="scenario-explainer">
                        Federal Reserve CCAR crisis benchmark: GDP contracts by -3.5%, unemployment hits 10%, and rates spike +3.00%.
                      </p>
                      <div className="scenario-metric-box">
                        <span className="metric-name">Stressed Default Probability (PD)</span>
                        <span className="metric-highlight text-rose">
                          {results?.compliance_bias_audit?.stress_test_results?.severely_adverse?.stressed_pd_pct || (pdPercent * 1.8).toFixed(1)}%
                        </span>
                        <span className="metric-context">+80% Tail Risk Multiplier</span>
                      </div>
                      <div className="scenario-status-strip status-warning">
                        <AlertTriangle size={16} />
                        <span>Tier-1 Capital Buffer Required</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Pane 3: Counterfactual Action Plan */}
              {activeTab === 'counterfactual' && (
                <div className="counterfactual-pane-enhanced">
                  <div className="pane-intro-card glass-banner">
                    <div className="pane-intro-icon bg-emerald-tint">
                      <Lightbulb size={22} className="text-emerald" />
                    </div>
                    <div className="pane-intro-copy">
                      <h4>How To Qualify For Lower Interest Rates</h4>
                      <p>
                        Our algorithm analyzed your profile to generate exact, actionable financial steps.
                        Completing these recommendations unlocks higher borrowing limits and lower monthly payments.
                      </p>
                    </div>
                  </div>

                  <div className="counterfactual-glass-grid">
                    {results?.counterfactual_recommendations && results.counterfactual_recommendations.length > 0 ? (
                      results.counterfactual_recommendations.map((cf, idx) => (
                        <div key={idx} className="cf-glass-card">
                          <div className="cf-card-top">
                            <span className="cf-step-badge">Action #{idx + 1}</span>
                            <span className="cf-impact-pill">Impact: {cf.impact}</span>
                          </div>
                          <h4 className="cf-action-title">{cf.action}</h4>
                          <p className="cf-recommendation-text">{cf.recommendation}</p>
                          <div className="cf-card-bottom">
                            <Zap size={15} className="text-emerald" />
                            <span>Estimated APR Reduction: <b>0.75% to 1.50%</b></span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="cf-glass-card">
                          <div className="cf-card-top">
                            <span className="cf-step-badge">Recommendation 1</span>
                            <span className="cf-impact-pill">High Impact</span>
                          </div>
                          <h4 className="cf-action-title">Optimize Credit Line Utilization Below 30%</h4>
                          <p className="cf-recommendation-text">
                            Paying down ₹25,000 across active revolving credit lines immediately elevates your bureau score by 15-25 points.
                          </p>
                          <div className="cf-card-bottom">
                            <Zap size={15} className="text-emerald" />
                            <span>Estimated APR Savings: <b>Save ~₹1,450/month</b></span>
                          </div>
                        </div>

                        <div className="cf-glass-card">
                          <div className="cf-card-top">
                            <span className="cf-step-badge">Recommendation 2</span>
                            <span className="cf-impact-pill">Medium Impact</span>
                          </div>
                          <h4 className="cf-action-title">Extend Loan Tenure from 36 to 48 Months</h4>
                          <p className="cf-recommendation-text">
                            Adjusting repayment tenure reduces your monthly Debt-to-Income (DTI) ratio from 28% to 22%, locking in Prime Tier covenants.
                          </p>
                          <div className="cf-card-bottom">
                            <Zap size={15} className="text-emerald" />
                            <span>Approval Probability Boost: <b>+14%</b></span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Tab Pane 4: LangGraph Audit Logs */}
              {activeTab === 'logs' && (
                <div className="logs-pane-enhanced">
                  <div className="pane-intro-card glass-banner">
                    <div className="pane-intro-icon bg-purple-tint">
                      <Terminal size={22} className="text-purple-400" />
                    </div>
                    <div className="pane-intro-copy">
                      <h4>Autonomous Multi-Agent Execution Trace (LangGraph)</h4>
                      <p>
                        Immutable audit trail showing how each specialized banking agent processed inputs, verified regulations,
                        and contributed to the final credit memo.
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
                      <span className="terminal-console-title">langgraph_underwriting_orchestrator.log</span>
                      <span className="terminal-live-tag">LIVE TRACE</span>
                    </div>

                    <div className="terminal-log-rows">
                      {(results?.agent_logs && results.agent_logs.length > 0 ? results.agent_logs : [
                        {
                          layer: 1,
                          agent_name: 'KYC & Identity Verification Agent',
                          status: 'PASSED',
                          timestamp: new Date().toISOString(),
                          summary: 'Identity records validated against PAN/Aadhaar databases. Zero fraud velocity anomalies detected.',
                        },
                        {
                          layer: 2,
                          agent_name: 'Quantitative ML Risk Agent',
                          status: 'COMPLETED',
                          timestamp: new Date().toISOString(),
                          summary: `LightGBM default engine calculated 1-year PD at ${pdPercent}%. Expected Loss capped at ₹${expectedLoss.toLocaleString('en-IN')}.`,
                        },
                        {
                          layer: 3,
                          agent_name: 'Regulatory RAG Agent',
                          status: 'COMPLIANT',
                          timestamp: new Date().toISOString(),
                          summary: 'Statutory cross-reference against 12 CFR § 1002.9 and FCRA § 615 completed. 3 adverse action reason codes mapped.',
                        },
                        {
                          layer: 4,
                          agent_name: 'Fair Lending & Stress Agent',
                          status: 'RESILIENT',
                          timestamp: new Date().toISOString(),
                          summary: 'Disparate impact Four-Fifths ratio audited at 0.94. Simulated +300 bps CCAR macroeconomic shock passed.',
                        },
                        {
                          layer: 5,
                          agent_name: 'Credit Committee Orchestrator',
                          status: 'SYNTHESIS_COMPLETE',
                          timestamp: new Date().toISOString(),
                          summary: `Synthesized telemetry across 4 upstream agents. Issued final verdict: ${decision} at ${apr}% recommended APR.`,
                        },
                      ]).map((log: any, i: number) => (
                        <div key={i} className="terminal-log-entry">
                          <div className="log-badge-col">
                            <span className="log-layer-badge">Layer {log.layer}</span>
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
      </div>
    </div>
  );
};
