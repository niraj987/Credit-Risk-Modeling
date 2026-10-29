import React, { useState, useEffect } from 'react';
import {
  ApplicantInput,
  UnderwritingResponse,
  submitUnderwriting,
} from './services/api';
import { jsDatabase, SavedEvaluation } from './services/db';
import { RiskGlobe3D } from './components/RiskGlobe3D';
import { AgentTelemetry } from './components/AgentTelemetry';
import { ApplicantForm } from './components/ApplicantForm';
import { CreditMemoModal } from './components/CreditMemoModal';
import { RAGExplorerModal } from './components/RAGExplorerModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import {
  ShieldAlert,
  FileText,
  Search,
  Database,
  TrendingUp,
  Scale,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [applicant, setApplicant] = useState<ApplicantInput>({
    Age: 35,
    Income: 65000,
    LoanAmount: 15000,
    CreditScore: 660,
    MonthsEmployed: 48,
    NumCreditLines: 3,
    InterestRate: 11.5,
    LoanTerm: 36,
    DTIRatio: 0.28,
    Education: "Bachelor's",
    EmploymentType: 'Full-time',
    MaritalStatus: 'Single',
    HasMortgage: 'No',
    HasDependents: 'No',
    LoanPurpose: 'Auto',
    HasCoSigner: 'No',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<UnderwritingResponse['data'] | null>(null);
  const [activeTab, setActiveTab] = useState<'xai' | 'stress' | 'counterfactual' | 'logs'>('xai');

  // Modals & Drawers
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [isRAGOpen, setIsRAGOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<SavedEvaluation[]>([]);

  // Load history from JS Database on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const list = await jsDatabase.getAllEvaluations();
    setHistoryRecords(list);
  };

  const handleUnderwrite = async () => {
    setIsLoading(true);
    try {
      const resp = await submitUnderwriting(applicant);
      setResults(resp.data);

      // Save to client-side JS Database
      const record: SavedEvaluation = {
        id: resp.application_id,
        applicantName: `Applicant (FICO ${applicant.CreditScore})`,
        creditScore: applicant.CreditScore,
        income: applicant.Income,
        loanAmount: applicant.LoanAmount,
        dtiRatio: applicant.DTIRatio,
        pdPercent: resp.data.ml_risk_assessment.pd_percent,
        ratingGrade: resp.data.ml_risk_assessment.rating_grade,
        expectedLoss: resp.data.ml_risk_assessment.expected_loss_usd,
        decision: resp.data.credit_committee_synthesis.final_decision,
        recommendedApr: resp.data.credit_committee_synthesis.recommended_apr,
        timestamp: new Date().toISOString(),
        state: resp.data,
      };
      await jsDatabase.saveEvaluation(record);
      await loadHistory();

      // Trigger confetti on approval
      if (resp.data.credit_committee_synthesis.final_decision === 'APPROVED') {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (rec: SavedEvaluation) => {
    if (rec.state) {
      setResults(rec.state);
      setApplicant(rec.state.applicant_data);
      setIsHistoryOpen(false);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    await jsDatabase.deleteEvaluation(id);
    await loadHistory();
  };

  const decision = results?.credit_committee_synthesis?.final_decision || 'PENDING';
  const pdPercent = results?.ml_risk_assessment?.pd_percent || 0;
  const ratingGrade = results?.ml_risk_assessment?.rating_grade || 'Unassigned';
  const expectedLoss = results?.ml_risk_assessment?.expected_loss_usd || 0;
  const apr = results?.credit_committee_synthesis?.recommended_apr || 0;

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="navbar-left">
          <div className="brand-logo">
            <span className="logo-icon">🏦</span>
            <div className="brand-text">
              <h1>FinRisk AI</h1>
              <span className="brand-tag">Autonomous Multi-Agent Underwriting Engine</span>
            </div>
          </div>
        </div>

        <div className="navbar-right">
          <button onClick={() => setIsRAGOpen(true)} className="nav-btn">
            <Search size={16} /> RAG Policy Knowledge Base
          </button>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="nav-btn btn-db"
            title="Stored in Client-Side JS Database"
          >
            <Database size={16} /> JS Database ({historyRecords.length})
          </button>
          {results && (
            <button onClick={() => setIsMemoOpen(true)} className="nav-btn btn-primary">
              <FileText size={16} /> Credit Memo
            </button>
          )}
        </div>
      </header>

      {/* Main Grid */}
      <main className="main-content">
        {/* Left Column: Applicant Form */}
        <section className="column-left">
          <div className="card-panel">
            <div className="card-header-bar">
              <h2>Borrower Assessment Form</h2>
              <span className="badge-pill">Interactive Presets</span>
            </div>
            <ApplicantForm
              input={applicant}
              onChange={setApplicant}
              onSubmit={handleUnderwrite}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* Right Column: 3D Globe, Live Telemetry & Deep-Dive Tabs */}
        <section className="column-right">
          {/* Top Panel: 3D Risk Globe & Executive Decision Card */}
          <div className="dashboard-hero-grid">
            <div className="globe-card">
              <RiskGlobe3D riskScore={pdPercent} decision={decision} />
            </div>

            <div className="decision-hero-card">
              <div className="decision-header">
                <span className="hero-eyebrow">Committee Synthesis</span>
                <span className={`decision-badge badge-${decision.toLowerCase()}`}>
                  {decision}
                </span>
              </div>

              <div className="hero-metrics-grid">
                <div className="hero-metric">
                  <span className="metric-lbl">Default Probability</span>
                  <span className="metric-val text-primary">{pdPercent}%</span>
                  <span className="metric-sub">1-Yr Calibrated PD</span>
                </div>
                <div className="hero-metric">
                  <span className="metric-lbl">Basel Expected Loss</span>
                  <span className="metric-val">${expectedLoss.toLocaleString()}</span>
                  <span className="metric-sub">LGD = 45% Supervisory</span>
                </div>
                <div className="hero-metric">
                  <span className="metric-lbl">Credit Tier Rating</span>
                  <span className="metric-val">{ratingGrade}</span>
                  <span className="metric-sub">FICO: {applicant.CreditScore}</span>
                </div>
                <div className="hero-metric">
                  <span className="metric-lbl">Recommended APR</span>
                  <span className="metric-val text-amber">{apr}%</span>
                  <span className="metric-sub">Base + Risk Spread</span>
                </div>
              </div>

              {results && (
                <div className="hero-footer-actions">
                  <button
                    onClick={() => setIsMemoOpen(true)}
                    className="memo-quick-btn"
                  >
                    <FileText size={16} /> View Executive Credit Memorandum & Citations
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 5-Layer Agent Telemetry Cards */}
          <div className="telemetry-wrapper">
            <div className="telemetry-title-bar">
              <h3>Autonomous Working Layers (LangGraph Flow)</h3>
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
                  <h4>Granular Feature Attribution & Reason Codes</h4>
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
                          {fc.impact === 'INCREASES_RISK' ? '+ Adds Risk' : '- Reduces Risk'}
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
      </main>

      {/* Modals & Drawers */}
      <CreditMemoModal
        isOpen={isMemoOpen}
        onClose={() => setIsMemoOpen(false)}
        memo={results?.credit_committee_synthesis?.credit_memo || ''}
        decision={decision}
        pdPercent={pdPercent}
        expectedLoss={expectedLoss}
        recommendedApr={apr}
        covenants={results?.credit_committee_synthesis?.covenants || []}
        adverseReasons={results?.credit_committee_synthesis?.adverse_action_reasons || []}
      />

      <RAGExplorerModal
        isOpen={isRAGOpen}
        onClose={() => setIsRAGOpen(false)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        records={historyRecords}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
      />
    </div>
  );
};
