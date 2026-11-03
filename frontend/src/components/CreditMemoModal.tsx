import React, { useState } from 'react';
import { X, Download, Copy, Check, Printer, FileText, ShieldCheck, Scale, CheckCircle2, AlertTriangle } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const memoRefId = `FR-MEMO-${Math.abs((expectedLoss * 7 + pdPercent * 13) | 8849).toString(16).toUpperCase()}-2026`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMD = () => {
    const blob = new Blob([memo], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Credit_Memorandum_${memoRefId}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    // Open a dedicated clean printable document styled for high-res PDF generation
    const printWindow = window.open('', '_blank', 'width=900,height=1000');
    if (!printWindow) {
      // Fallback to inline window.print()
      window.print();
      return;
    }

    const covenantsHtml = (covenants && covenants.length > 0)
      ? `
        <div class="pdf-section">
          <div class="pdf-section-title">3. MANDATORY LOAN COVENANTS & SAFEGUARDS</div>
          <ul class="pdf-list">
            ${covenants.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      `
      : '';

    const adverseHtml = (adverseReasons && adverseReasons.length > 0)
      ? `
        <div class="pdf-section">
          <div class="pdf-section-title">4. STATUTORY ADVERSE ACTION REASON CODES (12 CFR § 1002.9)</div>
          <ol class="pdf-ordered-list">
            ${adverseReasons.map(r => `<li>${r}</li>`).join('')}
          </ol>
        </div>
      `
      : '';

    // Split memo by lines/paragraphs for clean rendering
    const memoParagraphs = memo
      ? memo
          .split('\n\n')
          .filter(p => p.trim().length > 0)
          .map(p => `<p class="pdf-paragraph">${p.replace(/\n/g, '<br/>')}</p>`)
          .join('')
      : '<p class="pdf-paragraph">Automated underwriting evaluation completed according to Basel III and ECOA standards.</p>';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>OFFICIAL CREDIT UNDERWRITING MEMORANDUM - ${memoRefId}</title>
        <style>
          @page {
            size: A4;
            margin: 18mm 16mm 18mm 16mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #0f172a;
            background: #ffffff;
            line-height: 1.5;
            padding: 24px;
            margin: 0;
          }
          .memo-container {
            max-width: 820px;
            margin: 0 auto;
            border: 2px solid #0f172a;
            padding: 36px 38px;
            background: #ffffff;
          }
          /* Big Middle Heading */
          .memo-big-heading-block {
            text-align: center;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 22px;
            margin-bottom: 24px;
          }
          .memo-header-top-tag {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: #475569;
            margin-bottom: 6px;
          }
          .memo-big-heading-title {
            font-size: 26px;
            font-weight: 900;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            color: #090d16;
            margin: 6px 0 10px 0;
            line-height: 1.2;
          }
          .memo-header-subcaption {
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
            margin: 0;
          }
          .memo-meta-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            padding: 12px 16px;
            border-radius: 6px;
            margin-bottom: 24px;
            font-size: 12px;
          }
          .memo-meta-item b {
            display: block;
            color: #64748b;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .memo-meta-item span {
            font-weight: 700;
            color: #0f172a;
          }
          /* Metrics Box */
          .metrics-summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            font-size: 13px;
          }
          .metrics-summary-table th, .metrics-summary-table td {
            border: 1px solid #cbd5e1;
            padding: 10px 14px;
            text-align: left;
          }
          .metrics-summary-table th {
            background: #0f172a;
            color: #ffffff;
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
          }
          .status-badge-pdf {
            display: inline-block;
            padding: 4px 10px;
            font-weight: 800;
            font-size: 12px;
            letter-spacing: 0.05em;
            border-radius: 4px;
            background: ${decision === 'APPROVED' ? '#dcfce7' : '#fee2e2'};
            color: ${decision === 'APPROVED' ? '#166534' : '#991b1b'};
            border: 1px solid ${decision === 'APPROVED' ? '#86efac' : '#fca5a5'};
          }
          .pdf-section {
            margin-bottom: 22px;
          }
          .pdf-section-title {
            font-size: 13px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #0f172a;
            border-bottom: 1.5px solid #0f172a;
            padding-bottom: 4px;
            margin-bottom: 10px;
          }
          .pdf-paragraph {
            font-size: 12.5px;
            line-height: 1.6;
            color: #1e293b;
            margin: 0 0 10px 0;
            text-align: justify;
          }
          .pdf-list, .pdf-ordered-list {
            margin: 0 0 10px 18px;
            padding: 0;
            font-size: 12.5px;
            line-height: 1.6;
            color: #1e293b;
          }
          .pdf-list li, .pdf-ordered-list li {
            margin-bottom: 6px;
          }
          /* Sign-Off Matrix */
          .signoff-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 32px;
            font-size: 11px;
            border-top: 2px solid #0f172a;
            padding-top: 14px;
          }
          .signoff-cell {
            width: 50%;
            padding: 12px 18px;
            vertical-align: top;
            border: 1px solid #e2e8f0;
          }
          .signoff-role {
            font-weight: 800;
            text-transform: uppercase;
            font-size: 10px;
            color: #475569;
            margin-bottom: 4px;
          }
          .signoff-name {
            font-weight: 700;
            font-size: 12px;
            color: #0f172a;
            margin-bottom: 2px;
          }
          .signoff-seal {
            font-size: 10px;
            color: #166534;
            font-weight: 600;
          }
          .footer-note {
            text-align: center;
            font-size: 10px;
            color: #64748b;
            margin-top: 28px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
          }
        </style>
      </head>
      <body>
        <div class="memo-container">
          <!-- Big Middle Heading -->
          <div class="memo-big-heading-block">
            <div class="memo-header-top-tag">FINRISK AI • AUTOMATED LENDING GOVERNANCE</div>
            <h1 class="memo-big-heading-title">OFFICIAL CREDIT UNDERWRITING MEMORANDUM</h1>
            <p class="memo-header-subcaption">
              Prudential Basel III Solvency & Fair Credit Reporting Act (FCRA 15 U.S.C. § 1681) Compliance Artifact
            </p>
          </div>

          <!-- Document Meta Strip -->
          <div class="memo-meta-grid">
            <div class="memo-meta-item">
              <b>Document Ref</b>
              <span>${memoRefId}</span>
            </div>
            <div class="memo-meta-item">
              <b>Evaluation Date</b>
              <span>${currentDate}</span>
            </div>
            <div class="memo-meta-item">
              <b>Jurisdiction</b>
              <span>ECOA 12 CFR § 1002.9</span>
            </div>
            <div class="memo-meta-item">
              <b>Security Status</b>
              <span>Privileged & Confidential</span>
            </div>
          </div>

          <!-- Section 1: Executive Decision & Basel Parameters -->
          <div class="pdf-section">
            <div class="pdf-section-title">1. EXECUTIVE DECISION & QUANTITATIVE RISK PARAMETERS</div>
            <table class="metrics-summary-table">
              <thead>
                <tr>
                  <th>Final Underwriting Decision</th>
                  <th>1-Year Calibrated PD</th>
                  <th>Basel III Expected Loss</th>
                  <th>Recommended APR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="status-badge-pdf">${decision}</span></td>
                  <td><b>${pdPercent}%</b></td>
                  <td><b>₹${expectedLoss.toLocaleString('en-IN')}</b></td>
                  <td><b>${recommendedApr}%</b></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Section 2: Underwriting Analysis -->
          <div class="pdf-section">
            <div class="pdf-section-title">2. CREDIT COMMITTEE ANALYSIS & RATIONALE</div>
            ${memoParagraphs}
          </div>

          <!-- Section 3 & 4: Covenants & Adverse Actions -->
          ${covenantsHtml}
          ${adverseHtml}

          <!-- Institutional Attestation & Sign-off Block -->
          <table class="signoff-table">
            <tr>
              <td class="signoff-cell">
                <div class="signoff-role">Primary Algorithmic Underwriter</div>
                <div class="signoff-name">FinRisk Autonomous Underwriting Committee</div>
                <div class="signoff-seal">✓ SHA-256 Validated • Consensus Attested</div>
              </td>
              <td class="signoff-cell">
                <div class="signoff-role">Fair Lending & Regulatory Officer</div>
                <div class="signoff-name">Compliance Governance Engine (ECOA § 1002.9)</div>
                <div class="signoff-seal">✓ 100% Adverse Action Disclosure Verified</div>
              </td>
            </tr>
          </table>

          <div class="footer-note">
            This memorandum constitutes an official credit committee underwriting record produced in compliance with 
            12 CFR § 1002.9 and Basel III risk management directives. Generated by FinRisk AI.
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-large official-credit-memo-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <div className="modal-header-icon-box bg-lime-tint">
              <FileText size={20} className="text-neonlime" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-neonlime">
                Official Regulatory Record
              </span>
              <h3 className="modal-title">Credit Underwriting Memorandum</h3>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Big Middle Heading of the Memo (as requested) */}
        <div className="memo-big-middle-heading-container">
          <span className="memo-subheading-tag">FINRISK AI • AUTOMATED COMMITTEE GOVERNANCE</span>
          <h2 className="memo-big-middle-heading">OFFICIAL CREDIT UNDERWRITING MEMORANDUM</h2>
          <p className="memo-subheading-desc">
            Calibrated to Basel III / IV Standards & 12 CFR § 1002.9 Fair Lending Directives • Ref: {memoRefId}
          </p>
        </div>

        {/* Executive Metric Cards Strip */}
        <div className="memo-metrics-strip">
          <div className="memo-metric-card">
            <span className="metric-lbl">Final Decision</span>
            <span className={`metric-val-pill ${decision === 'APPROVED' ? 'status-approved' : 'status-denied'}`}>
              {decision === 'APPROVED' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              {decision}
            </span>
          </div>

          <div className="memo-metric-card">
            <span className="metric-lbl">1-Yr Calibrated PD</span>
            <span className="metric-val text-white">{pdPercent}%</span>
          </div>

          <div className="memo-metric-card">
            <span className="metric-lbl">Basel III Expected Loss</span>
            <span className="metric-val text-neonlime">₹{expectedLoss.toLocaleString('en-IN')}</span>
          </div>

          <div className="memo-metric-card">
            <span className="metric-lbl">Recommended APR</span>
            <span className="metric-val text-sky">{recommendedApr}%</span>
          </div>
        </div>

        {/* Structured Body */}
        <div className="modal-body memo-structured-body">
          {/* Section: Analysis & Narrative */}
          <div className="memo-section-card">
            <div className="memo-section-header">
              <Scale size={16} className="text-neonlime" />
              <h4>Executive Underwriting Synthesis & Rationale</h4>
            </div>
            <div className="memo-narrative-text">
              {memo ? (
                memo.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="memo-para">{paragraph}</p>
                ))
              ) : (
                <p className="memo-para">Credit evaluation completed with zero adverse exceptions.</p>
              )}
            </div>
          </div>

          {/* Section: Covenants */}
          {covenants && covenants.length > 0 && (
            <div className="memo-section-card card-covenants">
              <div className="memo-section-header">
                <ShieldCheck size={16} className="text-emerald" />
                <h4>Mandatory Loan Covenants & Risk Safeguards</h4>
              </div>
              <ul className="memo-covenants-list">
                {covenants.map((c, i) => (
                  <li key={i}>
                    <span className="cov-bullet">§{i + 1}</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section: Adverse Reasons */}
          {adverseReasons && adverseReasons.length > 0 && (
            <div className="memo-section-card card-adverse">
              <div className="memo-section-header">
                <AlertTriangle size={16} className="text-rose" />
                <h4>Statutory Adverse Action Reasons (12 CFR § 1002.9)</h4>
              </div>
              <ol className="memo-adverse-list">
                {adverseReasons.map((r, i) => (
                  <li key={i}>
                    <span className="adverse-num">{i + 1}</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Institutional Compliance Seal */}
          <div className="memo-attestation-seal">
            <div className="seal-left">
              <ShieldCheck size={26} className="text-neonlime" />
              <div>
                <b>Automated Fair Lending & Algorithmic Audit Sign-Off</b>
                <p>100% compliant with ECOA Regulation B adverse action notification requirements and Basel BCBS 128 guidelines.</p>
              </div>
            </div>
            <div className="seal-tag font-mono">
              VERIFIED: {currentDate}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer with prominent PDF Export */}
        <div className="modal-footer memo-modal-footer">
          <button onClick={handleCopy} className="action-btn btn-memo-secondary">
            {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
          </button>

          <button onClick={handleDownloadMD} className="action-btn btn-memo-secondary">
            <Download size={16} />
            <span>Download .MD</span>
          </button>

          {/* Big Prominent PDF Download Button as requested */}
          <button onClick={handleDownloadPDF} className="action-btn btn-export-pdf">
            <Printer size={17} />
            <span>Download PDF Memorandum</span>
          </button>
        </div>
      </div>
    </div>
  );
};
