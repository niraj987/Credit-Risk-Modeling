import React from 'react';
import { ShieldCheck, Cpu, BookOpen, Scale, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';

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
  committee
}) => {
  const layers = [
    {
      num: 1,
      name: 'KYC & Anomaly Agent',
      icon: <ShieldCheck size={20} className="text-cyan-400" />,
      status: kyc?.status || 'IDLE',
      metric: `Score: ${kyc?.anomaly_score !== undefined ? kyc.anomaly_score : '0.00'}`,
      isSuccess: kyc?.status === 'PASSED',
    },
    {
      num: 2,
      name: 'Quantitative ML Risk',
      icon: <Cpu size={20} className="text-blue-400" />,
      status: ml?.rating_grade || 'IDLE',
      metric: `PD: ${ml?.pd_percent !== undefined ? ml.pd_percent + '%' : '0.0%'}`,
      isSuccess: (ml?.pd_percent || 0) < 30,
    },
    {
      num: 3,
      name: 'Regulatory RAG Agent',
      icon: <BookOpen size={20} className="text-purple-400" />,
      status: rag?.compliance_cleared ? 'COMPLIANT' : 'REVIEW',
      metric: `${rag?.citations?.length || 2} Citations`,
      isSuccess: rag?.compliance_cleared !== false,
    },
    {
      num: 4,
      name: 'Fair Lending & Stress',
      icon: <Scale size={20} className="text-amber-400" />,
      status: fairness?.stress_test_results?.stress_test_resilience_passed ? 'RESILIENT' : 'VULNERABLE',
      metric: `AIR: ${fairness?.fairness_audit?.adverse_impact_ratio !== undefined ? Number(fairness.fairness_audit.adverse_impact_ratio).toFixed(2) : '1.00'}`,
      isSuccess: fairness?.stress_test_results?.stress_test_resilience_passed !== false,
    },
    {
      num: 5,
      name: 'Committee Orchestrator',
      icon: <Award size={20} className="text-emerald-400" />,
      status: committee?.final_decision || 'READY',
      metric: `APR: ${committee?.recommended_apr ? committee.recommended_apr + '%' : 'N/A'}`,
      isSuccess: committee?.final_decision === 'APPROVED',
    },
  ];

  return (
    <div className="telemetry-grid">
      {layers.map((layer) => (
        <div key={layer.num} className="telemetry-card">
          <div className="telemetry-header">
            <div className="telemetry-icon-wrapper">{layer.icon}</div>
            <span className="telemetry-layer-tag">L{layer.num}</span>
          </div>
          <div className="telemetry-title">{layer.name}</div>
          <div className="telemetry-status-row">
            <span
              className={`telemetry-badge ${
                layer.isSuccess ? 'badge-success' : 'badge-warning'
              }`}
            >
              {layer.status}
            </span>
            <span className="telemetry-metric">{layer.metric}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
