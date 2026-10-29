import React from 'react';
import { X, Download, Copy, Check } from 'lucide-react';

interface CreditMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  memo: string;
  decision: string;
  pdPercent: number;
  expectedLoss: number;
  recommendedApr: number;
  covenants: string[];
  adverseReasons: string[];
}

export const CreditMemoModal: React.FC<CreditMemoModalProps> = ({
  isOpen,
  onClose,
  memo,
  decision,
  pdPercent,
  expectedLoss,
  recommendedApr,
  covenants,
  adverseReasons,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([memo], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Credit_Memorandum_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Executive Credit Underwriting Memorandum</h3>
            <span className="modal-subtitle">Official Committee Regulatory Artifact (Basel III & ECOA)</span>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-summary-pills">
          <span className={`pill-badge ${decision === 'APPROVED' ? 'badge-success' : 'badge-danger'}`}>
            Status: {decision}
          </span>
          <span className="pill-badge">1-Yr PD: {pdPercent}%</span>
          <span className="pill-badge">Basel EL: ₹{expectedLoss.toLocaleString('en-IN')}</span>
          <span className="pill-badge">Recommended APR: {recommendedApr}%</span>
        </div>

        <div className="modal-body">
          <pre className="memo-content">{memo}</pre>

          {covenants && covenants.length > 0 && (
            <div className="covenants-box">
              <h4>Mandatory Loan Covenants</h4>
              <ul>
                {covenants.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {adverseReasons && adverseReasons.length > 0 && (
            <div className="adverse-box">
              <h4>Statutory Adverse Action Reason Codes (12 CFR § 1002.9)</h4>
              <ol>
                {adverseReasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={handleCopy} className="action-btn">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied to Clipboard' : 'Copy Memorandum'}
          </button>
          <button onClick={handleDownload} className="action-btn btn-primary">
            <Download size={16} /> Download .MD
          </button>
        </div>
      </div>
    </div>
  );
};
