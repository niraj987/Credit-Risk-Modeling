import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  BookOpen,
  Scale,
  Award,
  CheckCircle2,
  Activity,
  Zap,
  ArrowRight,
  Lock,
  Layers,
  Sparkles,
  Terminal,
} from 'lucide-react';

export const AgentArchitectureFlow: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<number>(2);

  const agentLayers = [
    {
      layer: 1,
      name: 'KYC & Identity Verification Agent',
      codeName: 'kyc_fraud_agent',
      role: 'Profile Integrity & Anomaly Screening',
      badge: 'Layer 1: Ingestion Gate',
      latency: '142ms',
      status: 'VERIFIED',
      icon: <ShieldCheck size={22} className="text-neonlime" />,
      colorGlow: 'rgba(93, 214, 44, 0.25)',
      description:
        'Validates applicant income consistency, sanity-checks revolving debt ratios, and scans for synthetic identity anomalies before model execution.',
      inputs: ['Declared Monthly Income', 'Current Debt Obligations', 'Employment Tenure', 'Bureau File ID'],
      outputs: ['Sanity Verification Flag', 'Synthetic Anomaly Score (0.00)', 'Verified Net Disposable Earnings'],
      statute: 'USA PATRIOT Act § 326 & CIP Guidelines',
    },
    {
      layer: 2,
      name: 'Quantitative ML Risk Engine',
      codeName: 'quantitative_risk_agent',
      role: 'Empirical Default Probability & SHAP Vectors',
      badge: 'Layer 2: Quantitative Engine',
      latency: '218ms',
      status: 'CALIBRATED',
      icon: <Cpu size={22} className="text-neonlime" />,
      colorGlow: 'rgba(93, 214, 44, 0.35)',
      description:
        'Executes LightGBM model calibrated with Optuna on historical loan outcomes. Calculates 1-Year Probability of Default (PD), Basel Expected Loss, and SHAP explainability vectors.',
      inputs: ['Cleaned Feature Tensor', 'FICO Bureau Score', 'DTI Leverage Ratio', 'Loan-to-Income Multiple'],
      outputs: ['1-Year Calibrated PD (e.g., 2.1%)', 'Basel Expected Loss (EL)', 'SHAP Feature Contribution Rankings'],
      statute: 'Basel III Internal Ratings-Based (IRB) Accord',
    },
    {
      layer: 3,
      name: 'Regulatory RAG & Statutory Policy Agent',
      codeName: 'policy_rag_agent',
      role: 'Statutory Policy Reconciliation & Adverse Reasons',
      badge: 'Layer 3: Legal Knowledge Base',
      latency: '184ms',
      status: 'COMPLIANT',
      icon: <BookOpen size={22} className="text-neonlime" />,
      colorGlow: 'rgba(93, 214, 44, 0.25)',
      description:
        'Retrieves exact statutory citations from ECOA Regulation B (12 CFR § 1002.9) and FCRA § 615. Automatically maps negative SHAP vectors into compliant, plain-English reason codes.',
      inputs: ['SHAP Negative Vector Weights', 'Prudential Underwriting Policy Guidelines', 'DTI Ceiling Thresholds'],
      outputs: ['Top-4 Statutory Adverse Action Codes', 'Statutory Handbook Citations', 'Borrower Recourse Rights Dossier'],
      statute: 'ECOA Regulation B (12 CFR § 1002.9) & FCRA § 615',
    },
    {
      layer: 4,
      name: 'Fair Lending & Macro Stress Agent',
      codeName: 'compliance_fairness_agent',
      role: 'Disparate Impact & CCAR Macro Resilience',
      badge: 'Layer 4: Bias & Stress Audit',
      latency: '195ms',
      status: 'RESILIENT',
      icon: <Scale size={22} className="text-neonlime" />,
      colorGlow: 'rgba(93, 214, 44, 0.3)',
      description:
        'Computes the Four-Fifths Adverse Impact Ratio (AIR >= 0.80) across protected demographics to guarantee non-bias. Simulates Federal Reserve CCAR +300 bps macroeconomic rate shock.',
      inputs: ['Demographic Selection Rates', 'CCAR Macro Shocks (+300 bps)', 'Unemployment Spike Scenarios'],
      outputs: ['Adverse Impact Ratio: 0.94 (PASS)', 'Stressed PD Multiplier (+35%)', 'Tier-1 Capital Buffer Allocation'],
      statute: '29 CFR § 1607.4(D) & Fed CCAR / DFAST Guidelines',
    },
    {
      layer: 5,
      name: 'Credit Committee Orchestrator',
      codeName: 'credit_committee_agent',
      role: 'Final Synthesis, RAROC Pricing & Memo',
      badge: 'Layer 5: Decision Orchestration',
      latency: '125ms',
      status: 'DECISION_ISSUED',
      icon: <Award size={22} className="text-neonlime" />,
      colorGlow: 'rgba(93, 214, 44, 0.4)',
      description:
        'Aggregates all upstream agent telemetry from the LangGraph StateGraph. Yields binding credit verdict, calibrates risk-adjusted APR (RAROC), and writes the executive credit memorandum.',
      inputs: ['Layer 1-4 StateGraph State', 'Risk Appetite Boundaries', 'Cost of Capital Benchmarks'],
      outputs: ['Final Verdict (Approved / Conditional / Adverse)', 'Risk-Adjusted APR (e.g., 9.25%)', 'Actionable Rate Reduction Roadmap'],
      statute: 'OCC Bulletin 2011-12 & SR 11-7 Model Risk Management',
    },
  ];

  const currentAgent = agentLayers.find((a) => a.layer === selectedLayer) || agentLayers[1];

  return (
    <div className="agent-architecture-container reveal-on-scroll">
      {/* Container Header */}
      <div className="agent-flow-header">
        <div className="agent-eyebrow">
          <Sparkles size={14} className="text-neonlime" />
          <span>LangGraph Typed StateGraph Orchestration</span>
        </div>
        <h2 className="agent-main-title">
          Autonomous Multi-Agent Architecture <span className="text-neonlime">(LangGraph Flow)</span>
        </h2>
        <p className="agent-main-subtitle">
          In our platform, loan underwriting is never left to a single opaque neural net. We deploy 5 specialized
          autonomous agents operating under cryptographic separation of duties—collaborating through a typed state graph to produce
          statutorily auditable, bias-verified credit decisions in under 2 seconds.
        </p>
      </div>

      {/* 5-Step Floating Frosted Glass Flow Boxes */}
      <div className="agent-flow-track-wrapper">
        <div className="agent-flow-track-line" />
        <div className="agent-boxes-grid">
          {agentLayers.map((agent) => {
            const isSelected = selectedLayer === agent.layer;
            return (
              <div
                key={agent.layer}
                onClick={() => setSelectedLayer(agent.layer)}
                className={`agent-glass-box ${isSelected ? 'active-layer-box' : ''}`}
              >
                {/* Top Badge & Live Pulse */}
                <div className="box-top-row">
                  <span className="box-layer-pill">{agent.badge}</span>
                  <div className="box-live-indicator">
                    <span className="live-glow-dot" />
                    <span className="box-latency-text">{agent.latency}</span>
                  </div>
                </div>

                {/* Box Icon & Title */}
                <div className="box-hero-content">
                  <div className="box-icon-wrap">{agent.icon}</div>
                  <h4 className="box-agent-name">{agent.name}</h4>
                  <span className="box-role-tag">{agent.role}</span>
                </div>

                {/* Status Footprint */}
                <div className="box-status-footer">
                  <span className="box-status-chip">
                    <CheckCircle2 size={13} className="text-neonlime" />
                    <span>{agent.status}</span>
                  </span>
                  <span className="box-arrow-indicator">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Inspection Panel for Selected Layer */}
      <div className="agent-detail-glass-panel">
        <div className="panel-header-row">
          <div className="panel-title-group">
            <div className="panel-layer-tag">
              <span>Selected Inspection: Layer {currentAgent.layer}</span>
              <span className="panel-agent-codename">def {currentAgent.codeName}(state: UnderwritingState)</span>
            </div>
            <h3 className="panel-agent-headline">{currentAgent.name}</h3>
          </div>
          <div className="panel-meta-tags">
            <span className="meta-statute-pill">{currentAgent.statute}</span>
            <span className="meta-active-badge">StateGraph Node Active</span>
          </div>
        </div>

        <p className="panel-description-text">{currentAgent.description}</p>

        {/* Inputs vs Outputs Multi-Compartment Bento */}
        <div className="panel-io-grid">
          <div className="io-sub-card io-inputs-card">
            <div className="io-card-title">
              <Terminal size={15} className="text-slate-400" />
              <span>StateGraph Ingestion Parameters (Inputs)</span>
            </div>
            <ul className="io-list">
              {currentAgent.inputs.map((inp, idx) => (
                <li key={idx} className="io-list-item">
                  <span className="bullet-bullet" />
                  <span>{inp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="io-sub-card io-outputs-card">
            <div className="io-card-title">
              <Zap size={15} className="text-neonlime" />
              <span>Deterministic Synthesized Telemetry (Outputs)</span>
            </div>
            <ul className="io-list">
              {currentAgent.outputs.map((out, idx) => (
                <li key={idx} className="io-list-item">
                  <CheckCircle2 size={14} className="text-neonlime flex-shrink-0" />
                  <span className="text-white font-medium">{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

