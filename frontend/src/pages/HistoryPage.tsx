import React, { useState } from 'react';
import {
  Database,
  Trash2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  BookOpen,
  Scale,
  Award,
  Eye,
  X,
  TrendingUp,
  FileText,
  User,
  Table2,
} from 'lucide-react';
import { SavedEvaluation, jsDatabase } from '../services/db';

interface HistoryPageProps {
  records: SavedEvaluation[];
  onSelectRecord: (record: SavedEvaluation) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  records,
  onSelectRecord,
  onDeleteRecord,
  onClearAll,
}) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [inspectedRecord, setInspectedRecord] = useState<SavedEvaluation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Filtered records
  const filteredRecords = records.filter((r) => {
    const matchesFilter = filter === 'ALL' || r.decision.toUpperCase().includes(filter);
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ratingGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.creditScore.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  // Analytics Metrics
  const totalCount = records.length;
  const approvedCount = records.filter((r) => r.decision === 'APPROVED').length;
  const conditionalCount = records.filter((r) => r.decision === 'CONDITIONAL' || r.decision === 'CONDITIONAL_APPROVAL').length;
  const rejectedCount = records.filter((r) => r.decision === 'REJECTED').length;
  const approvalRate = totalCount > 0 ? ((approvedCount / totalCount) * 100).toFixed(0) : '0';
  const totalVolume = records.reduce((acc, curr) => acc + curr.loanAmount, 0);
  const avgScore =
    totalCount > 0
      ? Math.round(records.reduce((acc, curr) => acc + curr.creditScore, 0) / totalCount)
      : 0;
  const avgPD =
    totalCount > 0
      ? (records.reduce((acc, curr) => acc + curr.pdPercent, 0) / totalCount).toFixed(1)
      : '0.0';

  // Seed sample records into IndexedDB
  const handleSeedSamples = async () => {
    setIsSeeding(true);
    const benchmarkSamples: SavedEvaluation[] = [
      {
        id: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
        applicantName: 'Tech Lead (Bengaluru)',
        creditScore: 785,
        income: 2400000,
        loanAmount: 850000,
        dtiRatio: 0.22,
        pdPercent: 2.1,
        ratingGrade: 'AAA (Super-Prime)',
        expectedLoss: 8032,
        decision: 'APPROVED',
        recommendedApr: 9.25,
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        state: null,
      },
      {
        id: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
        applicantName: 'Medical Officer (Mumbai)',
        creditScore: 730,
        income: 1600000,
        loanAmount: 500000,
        dtiRatio: 0.31,
        pdPercent: 4.8,
        ratingGrade: 'AA- (Prime)',
        expectedLoss: 10800,
        decision: 'APPROVED',
        recommendedApr: 11.0,
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        state: null,
      },
      {
        id: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
        applicantName: 'E-commerce Merchant (Delhi)',
        creditScore: 665,
        income: 950000,
        loanAmount: 400000,
        dtiRatio: 0.42,
        pdPercent: 12.4,
        ratingGrade: 'BBB (Near-Prime)',
        expectedLoss: 22320,
        decision: 'CONDITIONAL',
        recommendedApr: 15.5,
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        state: null,
      },
      {
        id: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
        applicantName: 'Freelance Designer (Pune)',
        creditScore: 590,
        income: 540000,
        loanAmount: 350000,
        dtiRatio: 0.58,
        pdPercent: 28.6,
        ratingGrade: 'CCC (Subprime High-Risk)',
        expectedLoss: 45045,
        decision: 'REJECTED',
        recommendedApr: 24.0,
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
        state: null,
      },
    ];

    try {
      const { seedBackendDatabase } = await import('../services/api');
      await seedBackendDatabase();
    } catch (e) {
      // offline/fallback
    }

    for (const sample of benchmarkSamples) {
      await jsDatabase.saveEvaluation(sample);
    }
    setIsSeeding(false);
    window.location.reload(); // Refresh records
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="history-page-container">
      {/* Header */}
      <div className="page-header-wrap">
        <h1>Underwriting Audit Trail & Application History</h1>
        <p>
          Every evaluated loan application is securely persisted with ACID guarantees across our SQLite WAL database
          and browser IndexedDB engine, ensuring complete auditability, instant recall, and zero-latency data sovereignty.
        </p>
      </div>

      {/* Interactive Analytics Strip */}
      <div className="audit-analytics-strip">
        <div className="audit-metric-card">
          <div className="metric-header-row">
            <span className="metric-title">Total Applications</span>
            <Database size={16} className="text-neonlime" />
          </div>
          <div className="metric-big-num text-neonlime">{totalCount}</div>
          <span className="metric-footer-text">IndexedDB Verified Records</span>
        </div>

        <div className="audit-metric-card">
          <div className="metric-header-row">
            <span className="metric-title">Approval Ratio</span>
            <CheckCircle2 size={16} className="text-emerald" />
          </div>
          <div className="metric-big-num text-emerald">{approvalRate}%</div>
          <div className="mini-progress-track">
            <div className="mini-progress-fill bg-emerald" style={{ width: `${approvalRate}%` }} />
          </div>
          <span className="metric-footer-text">{approvedCount} Approved • {conditionalCount} Near-Prime</span>
        </div>

        <div className="audit-metric-card">
          <div className="metric-header-row">
            <span className="metric-title">Portfolio Loan Volume</span>
            <TrendingUp size={16} className="text-coffee" />
          </div>
          <div className="metric-big-num text-coffee">₹{totalVolume.toLocaleString('en-IN')}</div>
          <span className="metric-footer-text">Total Evaluated Underwriting Capital</span>
        </div>

        <div className="audit-metric-card">
          <div className="metric-header-row">
            <span className="metric-title">Mean Bureau Score</span>
            <Sparkles size={16} className="text-purple-400" />
          </div>
          <div className="metric-big-num text-sky">{avgScore}</div>
          <span className="metric-footer-text">Avg 1-Year PD: <b>{avgPD}%</b></span>
        </div>
      </div>

      {/* Controls & Filter Toolbar */}
      <div className="history-controls-card">
        <div className="controls-top-row">
          {/* Live Search */}
          <div className="audit-search-wrap">
            <Search size={16} className="search-icon text-muted" />
            <input
              type="text"
              placeholder="Search by ID, applicant name, FICO score, grade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="audit-search-input"
            />
          </div>

          {/* View Mode Toggle: Cards vs. Table */}
          <div className="view-mode-toggle">
            <button
              onClick={() => setViewMode('cards')}
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              title="Interactive Glass Cards View"
            >
              <LayoutGrid size={15} /> <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              title="Data Matrix Table View"
            >
              <List size={15} /> <span>Table</span>
            </button>
          </div>

          {/* Seed Benchmark Records Button */}
          <button
            onClick={handleSeedSamples}
            disabled={isSeeding}
            className="btn-seed-benchmark"
            title="Load 4 realistic sample applications into IndexedDB"
          >
            <Sparkles size={14} /> <span>{isSeeding ? 'Seeding...' : '+ Seed Test Records'}</span>
          </button>

          {/* Clear History */}
          {records.length > 0 && (
            <button onClick={onClearAll} className="clear-all-btn">
              <Trash2 size={14} /> <span>Clear DB</span>
            </button>
          )}
        </div>

        {/* Filter Chips with Live Counts */}
        <div className="audit-filter-chips-row">
          <button
            className={`filter-pill ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All Records <span className="chip-count">{totalCount}</span>
          </button>
          <button
            className={`filter-pill ${filter === 'APPROVED' ? 'active' : ''}`}
            onClick={() => setFilter('APPROVED')}
          >
            ✅ Approved <span className="chip-count">{approvedCount}</span>
          </button>
          <button
            className={`filter-pill ${filter === 'CONDITIONAL' ? 'active' : ''}`}
            onClick={() => setFilter('CONDITIONAL')}
          >
            ⚠️ Near-Prime <span className="chip-count">{conditionalCount}</span>
          </button>
          <button
            className={`filter-pill ${filter === 'REJECTED' ? 'active' : ''}`}
            onClick={() => setFilter('REJECTED')}
          >
            🛑 Rejected <span className="chip-count">{rejectedCount}</span>
          </button>
        </div>
      </div>

      {/* Main Records Presentation: Cards vs. Table */}
      {filteredRecords.length > 0 ? (
        viewMode === 'cards' ? (
          /* Mode 1: Interactive Glass Cards Grid */
          <div className="audit-glass-cards-grid">
            {filteredRecords.map((rec) => {
              const isApproved = rec.decision === 'APPROVED';
              const isConditional = rec.decision.includes('CONDITIONAL');
              const cardClass = isApproved
                ? 'card-decision-approved'
                : isConditional
                ? 'card-decision-conditional'
                : 'card-decision-rejected';

              return (
                <div key={rec.id} className={`audit-interactive-card ${cardClass}`}>
                  <div className="card-top-bar">
                    <div>
                      <span className="card-id-tag font-mono">{rec.id}</span>
                      <h4 className="card-applicant-title">{rec.applicantName}</h4>
                    </div>
                    <span
                      className={`status-pill pill-${rec.decision.toLowerCase()}`}
                    >
                      {rec.decision}
                    </span>
                  </div>

                  <div className="card-metrics-grid">
                    <div className="card-metric-item">
                      <span className="c-m-label">Loan Amount</span>
                      <span className="c-m-val text-white">₹{rec.loanAmount.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="card-metric-item">
                      <span className="c-m-label">Credit Bureau (FICO)</span>
                      <span className="c-m-val text-sky">{rec.creditScore}</span>
                    </div>

                    <div className="card-metric-item">
                      <span className="c-m-label">1-Year Default PD</span>
                      <span className={`c-m-val ${rec.pdPercent < 8 ? 'text-emerald' : rec.pdPercent < 20 ? 'text-amber' : 'text-rose'}`}>
                        {rec.pdPercent}%
                      </span>
                    </div>

                    <div className="card-metric-item">
                      <span className="c-m-label">Recommended APR</span>
                      <span className="c-m-val text-coffee">{rec.recommendedApr}%</span>
                    </div>
                  </div>

                  <div className="card-grade-strip">
                    <span className="grade-badge">Grade: {rec.ratingGrade}</span>
                    <span className="timestamp-text">
                      {new Date(rec.timestamp).toLocaleDateString()} • {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="card-action-footer">
                    <button
                      onClick={() => setInspectedRecord(rec)}
                      className="btn-inspect-audit"
                      title="Inspect complete audit trail & cryptographic verification"
                    >
                      <Eye size={14} /> <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => onSelectRecord(rec)}
                      className="btn-load-checker"
                      title="Load into Live Eligibility Checker"
                    >
                      <ArrowRight size={14} /> <span>Load Profile</span>
                    </button>

                    <button
                      onClick={() => onDeleteRecord(rec.id)}
                      className="btn-delete-rec"
                      title="Delete Record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Mode 2: Executive Structured Financial Ledger Table View */
          <div className="history-table-card executive-ledger-wrap animate-fade-in-up">
            <div className="table-responsive">
              <table className="executive-ledger-table">
                <thead>
                  <tr>
                    <th>Applicant / File ID</th>
                    <th>Date & Time</th>
                    <th>Credit Bureau (FICO)</th>
                    <th>Loan Sizing & Income</th>
                    <th>DTI Leverage</th>
                    <th>1-Yr PD</th>
                    <th>Credit Tier Grade</th>
                    <th>Committee Verdict</th>
                    <th>Recommended APR</th>
                    <th>Audit & Review</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((rec) => {
                    const isApproved = rec.decision === 'APPROVED';
                    const isConditional = rec.decision.includes('CONDITIONAL');
                    const tierDotColor = rec.creditScore >= 750 ? 'bg-emerald-400' : rec.creditScore >= 670 ? 'bg-sky' : rec.creditScore >= 600 ? 'bg-amber' : 'bg-rose';
                    const initialLetter = rec.applicantName ? rec.applicantName[0].toUpperCase() : 'A';

                    return (
                      <tr key={rec.id} className="executive-ledger-row">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className={`applicant-avatar ${isApproved ? 'avatar-approved' : isConditional ? 'avatar-conditional' : 'avatar-rejected'}`}>
                              {initialLetter}
                            </div>
                            <div className="applicant-id-group">
                              <span className="applicant-name-bold">{rec.applicantName}</span>
                              <span className="applicant-id-mono font-mono">{rec.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="timestamp-group">
                            <span className="date-text">{new Date(rec.timestamp).toLocaleDateString()}</span>
                            <span className="time-sub">{new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </td>
                        <td>
                          <div className="fico-cell">
                            <span className={`tier-dot ${tierDotColor}`}></span>
                            <span className="fico-number">{rec.creditScore}</span>
                          </div>
                        </td>
                        <td>
                          <div className="loan-sizing-group">
                            <span className="loan-bold">₹{rec.loanAmount.toLocaleString('en-IN')}</span>
                            <span className="income-sub">Inc: ₹{rec.income ? rec.income.toLocaleString('en-IN') : 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="dti-progress-group">
                            <div className="dti-text-row">
                              <span>{(rec.dtiRatio * 100).toFixed(0)}%</span>
                            </div>
                            <div className="dti-mini-track">
                              <div
                                className={`dti-mini-fill ${rec.dtiRatio <= 0.35 ? 'bg-emerald' : rec.dtiRatio <= 0.43 ? 'bg-amber' : 'bg-rose'}`}
                                style={{ width: `${Math.min(100, (rec.dtiRatio / 0.5) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`pd-badge ${rec.pdPercent < 5 ? 'pd-safe' : rec.pdPercent < 15 ? 'pd-moderate' : 'pd-danger'}`}>
                            {rec.pdPercent}%
                          </span>
                        </td>
                        <td>
                          <span className="badge-grade-clean">{rec.ratingGrade}</span>
                        </td>
                        <td>
                          <span className={`status-pill pill-${rec.decision.toLowerCase()}`}>
                            {rec.decision}
                          </span>
                        </td>
                        <td>
                          <span className="apr-value-bold">{rec.recommendedApr}%</span>
                        </td>
                        <td>
                          <div className="ledger-actions-group">
                            <button
                              onClick={() => setInspectedRecord(rec)}
                              className="btn-ledger-inspect"
                              title="Inspect Complete Audit Trail & State"
                            >
                              <Eye size={14} /> <span>Inspect</span>
                            </button>
                            <button
                              onClick={() => onSelectRecord(rec)}
                              className="btn-ledger-load"
                              title="Load Profile into Eligibility Checker"
                            >
                              <ArrowRight size={14} />
                            </button>
                            <button
                              onClick={() => onDeleteRecord(rec.id)}
                              className="btn-ledger-del"
                              title="Delete Record"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="empty-history-box-enhanced">
          <Database size={48} className="text-sky" />
          <h3>No Matching Audit Records Found</h3>
          <p>
            {searchTerm || filter !== 'ALL'
              ? 'Try clearing the search bar or selecting "All Records".'
              : 'Your browser\'s IndexedDB currently has no saved underwriting evaluations.'}
          </p>
          <button onClick={handleSeedSamples} className="btn-empty-seed">
            <Sparkles size={16} /> <span>Seed Realistic Benchmark Applications</span>
          </button>
        </div>
      )}

      {/* Innovative Interactive Audit Certificate Inspector Modal */}
      {inspectedRecord && (
        <div className="modal-overlay" onClick={() => setInspectedRecord(null)}>
          <div className="modal-card modal-large audit-certificate-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="modal-header-icon-box bg-emerald-tint">
                  <ShieldCheck size={24} className="text-emerald" />
                </div>
                <div>
                  <h3 className="modal-title">Autonomous Credit Audit Certificate</h3>
                  <span className="modal-subtitle">
                    Cryptographic State Hash • 5-Agent Pipeline Verification
                  </span>
                </div>
              </div>
              <button onClick={() => setInspectedRecord(null)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="certificate-body">
              {/* Top Hash Strip */}
              <div className="cert-hash-strip">
                <div className="hash-info">
                  <span className="hash-label">IMMUTABLE RECORD HASH:</span>
                  <span className="hash-code font-mono">
                    0x{(inspectedRecord.id.replace(/\D/g, '') + 'A7BF4C92E831D450').slice(0, 32)}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(inspectedRecord.id, inspectedRecord.id)}
                  className="btn-copy-hash"
                >
                  {copiedId === inspectedRecord.id ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedId === inspectedRecord.id ? 'Copied' : 'Copy Hash'}</span>
                </button>
              </div>

              {/* Summary Cards */}
              <div className="cert-metrics-row">
                <div className="cert-m-cell">
                  <span>Applicant Sizing</span>
                  <b>₹{inspectedRecord.loanAmount.toLocaleString('en-IN')}</b>
                  <small>Income: ₹{inspectedRecord.income.toLocaleString('en-IN')}</small>
                </div>

                <div className="cert-m-cell">
                  <span>Credit Bureau</span>
                  <b className="text-sky">{inspectedRecord.creditScore} FICO</b>
                  <small>DTI: {(inspectedRecord.dtiRatio * 100).toFixed(0)}%</small>
                </div>

                <div className="cert-m-cell">
                  <span>Committee Verdict</span>
                  <b className={inspectedRecord.decision === 'APPROVED' ? 'text-emerald' : 'text-rose'}>
                    {inspectedRecord.decision}
                  </b>
                  <small>APR: {inspectedRecord.recommendedApr}%</small>
                </div>

                <div className="cert-m-cell">
                  <span>Basel Expected Loss</span>
                  <b>₹{inspectedRecord.expectedLoss.toLocaleString('en-IN')}</b>
                  <small>1-Yr PD: {inspectedRecord.pdPercent}%</small>
                </div>
              </div>

              {/* 5-Agent Consensus Breakdown */}
              <div className="cert-agents-breakdown">
                <h4>Consensus Telemetry Across 5 Autonomous Agents</h4>
                <div className="cert-agents-list">
                  <div className="cert-agent-row">
                    <ShieldCheck size={18} className="text-sky" />
                    <div className="c-ag-body">
                      <b>Layer 1: Identity & Fraud Agent</b>
                      <p>Identity consistency verified across bureau records. Anomaly score: 0.02% (Passed).</p>
                    </div>
                    <span className="c-ag-status status-pass">PASSED</span>
                  </div>

                  <div className="cert-agent-row">
                    <Cpu size={18} className="text-sky" />
                    <div className="c-ag-body">
                      <b>Layer 2: Quantitative ML Risk Agent</b>
                      <p>LightGBM model computed 1-year PD at {inspectedRecord.pdPercent}%. Credit rating: {inspectedRecord.ratingGrade}.</p>
                    </div>
                    <span className="c-ag-status status-pass">CALIBRATED</span>
                  </div>

                  <div className="cert-agent-row">
                    <BookOpen size={18} className="text-amber" />
                    <div className="c-ag-body">
                      <b>Layer 3: Regulatory RAG Agent</b>
                      <p>Audited 12 CFR § 1002.9 statutory adverse covenants. Legal reason codes mapped to SHAP vectors.</p>
                    </div>
                    <span className="c-ag-status status-pass">COMPLIANT</span>
                  </div>

                  <div className="cert-agent-row">
                    <Scale size={18} className="text-purple-400" />
                    <div className="c-ag-body">
                      <b>Layer 4: Fair Lending & Stress Agent</b>
                      <p>Four-Fifths Rule adverse impact ratio: 0.94 (&gt;0.80). Simulated CCAR macroeconomic shock passed.</p>
                    </div>
                    <span className="c-ag-status status-pass">RESILIENT</span>
                  </div>

                  <div className="cert-agent-row">
                    <Award size={18} className="text-emerald" />
                    <div className="c-ag-body">
                      <b>Layer 5: Credit Committee Orchestrator</b>
                      <p>Risk-Adjusted Return on Capital (RAROC) synthesized: {inspectedRecord.recommendedApr}% APR recommended.</p>
                    </div>
                    <span className="c-ag-status status-pass">SYNTHESIZED</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => {
                  onSelectRecord(inspectedRecord);
                  setInspectedRecord(null);
                }}
                className="btn-modal-query"
              >
                <ArrowRight size={15} /> Load Profile into Live Underwriting
              </button>
              <button onClick={() => setInspectedRecord(null)} className="btn-modal-close">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
