import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const AgentArchitectureFlow: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<number>(2);

  const agentLayers = [
    {
      layer: 1,
      name: 'KYC & Identity Verification Agent',
      role: 'Profile Integrity & Anomaly Screening',
      status: 'VERIFIED',
      description:
        'Validates applicant income consistency, sanity-checks revolving debt ratios, and scans for synthetic identity anomalies before model execution.',
      inputs: ['Declared Monthly Income', 'Current Debt Obligations', 'Employment Tenure', 'Bureau File ID'],
      outputs: ['Sanity Verification Flag', 'Synthetic Anomaly Score (0.00)', 'Verified Net Disposable Earnings'],
    },
    {
      layer: 2,
      name: 'Quantitative ML Risk Engine',
      role: 'Empirical Default Probability & SHAP Vectors',
      status: 'CALIBRATED',
      description:
        'Executes LightGBM model calibrated with Optuna on historical loan outcomes. Calculates 1-Year Probability of Default (PD), Basel Expected Loss, and SHAP explainability vectors.',
      inputs: ['Cleaned Feature Tensor', 'FICO Bureau Score', 'DTI Leverage Ratio', 'Loan-to-Income Multiple'],
      outputs: ['1-Year Calibrated PD (e.g., 2.1%)', 'Basel Expected Loss (EL)', 'SHAP Feature Contribution Rankings'],
    },
    {
      layer: 3,
      name: 'Regulatory Policy Reconciliation Agent',
      role: 'Statutory Policy Reconciliation & Adverse Reasons',
      status: 'COMPLIANT',
      description:
        'Retrieves exact statutory citations from ECOA Regulation B (12 CFR § 1002.9) and FCRA § 615. Automatically maps negative SHAP vectors into compliant, plain-English reason codes.',
      inputs: ['SHAP Negative Vector Weights', 'Prudential Underwriting Policy Guidelines', 'DTI Ceiling Thresholds'],
      outputs: ['Top-4 Statutory Adverse Action Codes', 'Statutory Handbook Citations', 'Borrower Recourse Rights Dossier'],
    },
    {
      layer: 4,
      name: 'Fair Lending & Macro Stress Agent',
      role: 'Disparate Impact & CCAR Macro Resilience',
      status: 'RESILIENT',
      description:
        'Computes the Four-Fifths Adverse Impact Ratio (AIR >= 0.80) across protected demographics to guarantee non-bias. Simulates Federal Reserve CCAR +300 bps macroeconomic rate shock.',
      inputs: ['Demographic Selection Rates', 'CCAR Macro Shocks (+300 bps)', 'Unemployment Spike Scenarios'],
      outputs: ['Adverse Impact Ratio: 0.94 (PASS)', 'Stressed PD Multiplier (+35%)', 'Tier-1 Capital Buffer Allocation'],
    },
    {
      layer: 5,
      name: 'Credit Committee Orchestrator',
      role: 'Final Synthesis, RAROC Pricing & Memo',
      status: 'DECISION_ISSUED',
      description:
        'Aggregates all upstream agent telemetry from the decision workflow. Yields binding credit verdict, calibrates risk-adjusted APR (RAROC), and writes the executive credit memorandum.',
      inputs: ['Multi-Stage Pipeline Telemetry', 'Risk Appetite Boundaries', 'Cost of Capital Benchmarks'],
      outputs: ['Final Verdict (Approved / Conditional / Adverse)', 'Risk-Adjusted APR (e.g., 9.25%)', 'Actionable Rate Reduction Roadmap'],
    },
  ];

  const currentAgent = agentLayers.find((a) => a.layer === selectedLayer) || agentLayers[1];

  return (
    <div className="agent-architecture-container reveal-on-scroll architecture-animated-section">
      {/* Container Header */}
      <div className="agent-flow-header">
        <h2 className="agent-main-title">
          Autonomous Multi-Agent Architecture
        </h2>
        <p className="agent-main-subtitle">
          In our platform, loan underwriting is never left to a single opaque neural net. We deploy 5 specialized
          autonomous agents operating under cryptographic separation of duties—collaborating dynamically to produce
          statutorily auditable, bias-verified credit decisions in under 2 seconds.
        </p>
      </div>

      {/* 5-Step Floating Flow Boxes (Clean, Icon-Free, Latency-Free) */}
      <div className="agent-flow-track-wrapper">
        <div className="agent-flow-track-line" />
        <div className="agent-boxes-grid">
          {agentLayers.map((agent) => {
            const isSelected = selectedLayer === agent.layer;
            return (
              <div
                key={agent.layer}
                onClick={() => setSelectedLayer(agent.layer)}
                className={`agent-glass-box architecture-card-transition ${
                  isSelected ? 'active-layer-box' : ''
                }`}
              >
                {/* Box Title & Role (No Icons, No Latency, No Layer Badge) */}
                <div className="box-hero-content">
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

      {/* Deep-Dive Inspection Panel for Selected Agent (No Layer Label, No Icons) */}
      <div className="agent-detail-glass-panel agent-panel-animated" key={currentAgent.layer}>
        <div className="panel-header-row">
          <div className="panel-title-group">
            <h3 className="panel-agent-headline">{currentAgent.name}</h3>
          </div>
        </div>

        <p className="panel-description-text">{currentAgent.description}</p>

        {/* Inputs vs Outputs Multi-Compartment */}
        <div className="panel-io-grid">
          <div className="io-sub-card io-inputs-card">
            <div className="io-card-title">
              <span>Key Ingestion Parameters (Inputs)</span>
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
              <span>Verified Decision Telemetry (Outputs)</span>
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
