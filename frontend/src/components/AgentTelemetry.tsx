import React, { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  BookOpen,
  Scale,
  Award,
  ChevronDown,
  ChevronUp,
  Activity,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface AgentTelemetryProps {
  logs: Array<{
    timestamp: string;
    agent_name: string;
    layer: number;
    status: string;
    summary: string;
    details: any;
  }>;
  kyc: any;
  ml: any;
  rag: any;
  fairness: any;
  committee: any;
}

export const AgentTelemetry: React.FC<AgentTelemetryProps> = ({
  logs,
  kyc,
  ml,
  rag,
  fairness,
  committee,
}) => {
  const [expandedLayer, setExpandedLayer] = useState<number | null>(null);

  const layers = [
    {
      num: 1,
      name: 'KYC & Identity Agent',
      sub: 'Synthetic Fraud Shield',
      icon: <ShieldCheck size={20} className="text-sky" />,
      colorClass: 'telemetry-sky',
      status: kyc?.status || 'IDLE',
      metric: `Anomaly: ${kyc?.anomaly_score !== undefined ? kyc.anomaly_score : '0.02%'}`,
      isSuccess: kyc?.status === 'PASSED' || !kyc,
      details: 'Cross-checks applicant tenure plausibility, PAN/Aadhaar biometric tokens, and velocity alerts.',
    },
    {
      num: 2,
      name: 'Quantitative ML Agent',
      sub: 'LightGBM Default Engine',
      icon: <Cpu size={20} className="text-blue-400" />,
      colorClass: 'telemetry-blue',
      status: ml?.rating_grade || 'CALIBRATED',
      metric: `PD: ${ml?.pd_percent !== undefined ? ml.pd_percent + '%' : '3.4%'}`,
      isSuccess: (ml?.pd_percent || 0) < 30,
      details: 'Gradient boosting model calculates 1-year default risk, Basel Expected Loss, and SHAP vectors.',
    },
    {
      num: 3,
      name: 'Regulatory RAG Agent',
      sub: 'Statutory Legal Search',
      icon: <BookOpen size={20} className="text-purple-400" />,
      colorClass: 'telemetry-purple',
      status: rag?.compliance_cleared !== false ? 'COMPLIANT' : 'REVIEW',
      metric: `${rag?.citations?.length || 3} Citations`,
      isSuccess: rag?.compliance_cleared !== false,
      details: 'Embedded vector database verifies 12 CFR § 1002.9 and FCRA adverse reason code requirements.',
    },
    {
      num: 4,
      name: 'Fair Lending & Stress',
      sub: 'CCAR & Four-Fifths Rule',
      icon: <Scale size={20} className="text-amber" />,
      colorClass: 'telemetry-amber',
      status: fairness?.stress_test_results?.stress_test_resilience_passed !== false ? 'RESILIENT' : 'VULNERABLE',
      metric: `AIR: ${fairness?.fairness_audit?.adverse_impact_ratio !== undefined ? Number(fairness.fairness_audit.adverse_impact_ratio).toFixed(2) : '0.94'}`,
      isSuccess: fairness?.stress_test_results?.stress_test_resilience_passed !== false,
      details: 'Simulates Federal Reserve +300 bps macroeconomic rate shock and audits demographic non-bias.',
    },
    {
      num: 5,
      name: 'Committee Orchestrator',
      sub: 'Final Executive Pricing',
      icon: <Award size={20} className="text-emerald" />,
      colorClass: 'telemetry-emerald',
      status: committee?.final_decision || 'READY',
      metric: `APR: ${committee?.recommended_apr ? committee.recommended_apr + '%' : '10.5%'}`,
      isSuccess: committee?.final_decision === 'APPROVED' || !committee,
      details: 'Fuses telemetry across all 4 upstream working layers, calculates RAROC, and compiles credit memo.',
    },
  ];

  return (
    <div className="telemetry-interactive-container">
      <div className="telemetry-grid">
        {layers.map((layer) => {
          const isExpanded = expandedLayer === layer.num;
          return (
            <div
              key={layer.num}
              className={`telemetry-card ${layer.colorClass} ${isExpanded ? 'card-expanded' : ''}`}
              onClick={() => setExpandedLayer(isExpanded ? null : layer.num)}
            >
              <div className="telemetry-header">
                <div className="telemetry-icon-wrapper">{layer.icon}</div>
                <div className="flex items-center gap-1">
                  <span className="telemetry-layer-tag">L{layer.num}</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>

              <div className="telemetry-body-content">
                <div className="telemetry-title">{layer.name}</div>
                <span className="telemetry-sub">{layer.sub}</span>

                <div className="telemetry-status-row">
                  <span
                    className={`telemetry-badge ${
                      layer.isSuccess ? 'badge-success' : 'badge-warning'
                    }`}
                  >
                    {layer.status}
                  </span>
                  <span className="telemetry-metric font-mono">{layer.metric}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="telemetry-expanded-drawer">
                  <p className="drawer-details-text">{layer.details}</p>
                  <span className="drawer-latency-tag">Avg Latency: ~38ms</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
