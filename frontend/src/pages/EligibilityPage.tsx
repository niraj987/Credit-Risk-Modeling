import React, { useState } from 'react';
import { ApplicantInput, UnderwritingResponse } from '../services/api';
import { RiskGlobe3D } from '../components/RiskGlobe3D';
import { AgentTelemetry } from '../components/AgentTelemetry';
import { ApplicantForm } from '../components/ApplicantForm';
import { FileText, Sparkles } from 'lucide-react';

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
          {/* Top Panel: 3D Globe + Hero Decision */}
          <div className="dashboard-hero-grid">
            <div className="globe-card">
              <RiskGlobe3D riskScore={pdPercent} decision={decision} />
            </div>

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
              <h3>Autonomous Working Layers (LangGraph State Flow)</h3>
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

          {/* Deep-Dive Analysis Tabs */}
          <div className="tabs-container">
            <div className="tabs-header">
              <button
                className={`tab-btn ${activeTab === 'xai' ? 'active' : ''}`}
                onClick={() => setActiveTab('xai')}
              >
                🧠 SHAP Explainability & Risk Drivers
              </button>
              <button
                className={`tab-btn ${activeTab === 'stress' ? 'active' : ''}`}
                onClick={() => setActiveTab('stress')}
              >
                📉 CCAR Macro Stress Testing
              </button>
              <button
                className={`tab-btn ${activeTab === 'counterfactual' ? 'active' : ''}`}
                onClick={() => setActiveTab('counterfactual')}
              >
                💡 Counterfactual Action Plan
              </button>
              <button
                className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
                onClick={() => setActiveTab('logs')}
              >
                🕵️ LangGraph Audit Logs
              </button>
            </div>

            <div className="tab-pane">
              {activeTab === 'xai' && (
                <div className="xai-pane">
                  <h4>Granular Feature Attribution & Reason Codes (12 CFR § 1002.9)</h4>
                  <div className="feature-contribs-list">
                    {results?.ml_risk_assessment?.feature_contributions?.map((fc, i) => (
                      <div
                        key={i}
                        className={`contrib-card ${
                          fc.impact === 'INCREASES_RISK' ? 'contrib-risk' : 'contrib-safe'
                        }`}
                      >
                        <span className="contrib-feature">{fc.feature}</span>
                        <span className="contrib-desc">{fc.description}</span>
                        <span className="contrib-badge">
                          {fc.impact === 'INCREASES_RISK' ? '+ Increases Risk' : '- Mitigates Risk'}
                        </span>
                      </div>
                    )) || (
                      <div className="empty-tab-hint">
                        Run an underwriting evaluation to generate SHAP risk feature attribution.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'stress' && (
                <div className="stress-pane">
                  <h4>Federal Reserve CCAR & DFAST Stress Shock Simulation</h4>
                  <div className="stress-scenarios-grid">
                    <div className="scenario-card">
                      <span className="scenario-badge">Scenario A</span>
                      <h5>Baseline Macro</h5>
                      <div className="scenario-pd">
                        {results?.compliance_bias_audit?.stress_test_results?.baseline?.stressed_pd_pct || pdPercent}% PD
                      </div>
                      <span className="scenario-sub">Current Economic Conditions</span>
                    </div>

                    <div className="scenario-card scenario-adverse">
                      <span className="scenario-badge">Scenario B</span>
                      <h5>Adverse Shock (+150 bps)</h5>
                      <div className="scenario-pd">
                        {results?.compliance_bias_audit?.stress_test_results?.adverse?.stressed_pd_pct || (pdPercent * 1.35).toFixed(1)}% PD
                      </div>
                      <span className="scenario-sub">Inflation & Rate Pressure</span>
                    </div>

                    <div className="scenario-card scenario-severe">
                      <span className="scenario-badge">Scenario C</span>
                      <h5>Severely Adverse (+300 bps)</h5>
                      <div className="scenario-pd">
                        {results?.compliance_bias_audit?.stress_test_results?.severely_adverse?.stressed_pd_pct || (pdPercent * 1.8).toFixed(1)}% PD
                      </div>
                      <span className="scenario-sub">Recessionary Crash & 10% Unemp</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'counterfactual' && (
                <div className="counterfactual-pane">
                  <h4>Algorithmic Prescription to Optimize Approval Terms</h4>
                  <div className="counterfactual-list">
                    {results?.counterfactual_recommendations && results.counterfactual_recommendations.length > 0 ? (
                      results.counterfactual_recommendations.map((cf, idx) => (
                        <div key={idx} className="cf-card">
                          <span className="cf-action">{cf.action}</span>
                          <p className="cf-rec">{cf.recommendation}</p>
                          <span className="cf-impact">Expected Impact: {cf.impact}</span>
                        </div>
                      ))
                    ) : (
                      <div className="cf-clean">
                        🎉 Applicant currently satisfies Prime Tier standards without requiring remedial covenants.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="logs-pane">
                  <h4>Autonomous Multi-Agent Thought & Action Trace</h4>
                  <div className="logs-list">
                    {results?.agent_logs?.map((log, i) => (
                      <div key={i} className="log-row">
                        <span className="log-layer">L{log.layer}</span>
                        <div className="log-body">
                          <div className="log-name-row">
                            <b>{log.agent_name}</b>
                            <span className="log-status">{log.status}</span>
                            <span className="log-time">{log.timestamp.slice(11, 19)}</span>
                          </div>
                          <p className="log-summary">{log.summary}</p>
                        </div>
                      </div>
                    )) || (
                      <div className="empty-tab-hint">No active execution logs. Run an applicant evaluation above.</div>
                    )}
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
