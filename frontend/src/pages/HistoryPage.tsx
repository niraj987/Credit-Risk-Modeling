import React, { useState } from 'react';
import { Database, Trash2, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';
import { SavedEvaluation } from '../services/db';

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

  const filteredRecords = records.filter((r) => {
    const matchesFilter = filter === 'ALL' || r.decision.toUpperCase().includes(filter);
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ratingGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.creditScore.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const totalCount = records.length;
  const approvedCount = records.filter((r) => r.decision === 'APPROVED').length;
  const approvalRate = totalCount > 0 ? ((approvedCount / totalCount) * 100).toFixed(0) : '0';
  const avgScore =
    totalCount > 0
      ? Math.round(records.reduce((acc, curr) => acc + curr.creditScore, 0) / totalCount)
      : 0;

  return (
    <div className="history-page-container">
      <div className="page-header-wrap">
        <div className="page-badge badge-cyan">
          <Database size={14} className="text-cyan-400" />
          <span>Client-Side JS Database (IndexedDB)</span>
        </div>
        <h1>Underwriting Audit Trail & Application History</h1>
        <p>
          Every evaluated loan application is securely persisted in your browser's IndexedDB engine,
          ensuring complete auditability, instant recall, and zero-latency client data sovereignty.
        </p>
      </div>

      {/* Analytics Summary Row */}
      <div className="history-stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Applications</span>
          <div className="stat-val">{totalCount}</div>
          <span className="stat-sub">IndexedDB Records</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Approval Rate</span>
          <div className="stat-val text-emerald-400">{approvalRate}%</div>
          <span className="stat-sub">{approvedCount} of {totalCount} Approved</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average FICO Score</span>
          <div className="stat-val text-blue-400">{avgScore}</div>
          <span className="stat-sub">Across All Evaluations</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="history-controls-bar">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by ID, score, rating grade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="history-search-input"
          />
        </div>

        <div className="filter-buttons-group">
          {['ALL', 'APPROVED', 'CONDITIONAL', 'REJECTED'].map((f) => (
            <button
              key={f}
              type="button"
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {records.length > 0 && (
          <button onClick={onClearAll} className="clear-all-btn">
            <Trash2 size={14} /> Clear History
          </button>
        )}
      </div>

      {/* Records Table */}
      <div className="history-table-card">
        {filteredRecords.length > 0 ? (
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Date & Time</th>
                  <th>FICO</th>
                  <th>Loan Sizing</th>
                  <th>DTI</th>
                  <th>1-Yr PD</th>
                  <th>Grade</th>
                  <th>Decision</th>
                  <th>APR</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec) => (
                  <tr key={rec.id}>
                    <td className="font-mono text-cyan">{rec.id}</td>
                    <td>{new Date(rec.timestamp).toLocaleString()}</td>
                    <td><b>{rec.creditScore}</b></td>
                    <td>${rec.loanAmount.toLocaleString()}</td>
                    <td>{(rec.dtiRatio * 100).toFixed(0)}%</td>
                    <td className="font-mono">{rec.pdPercent}%</td>
                    <td>{rec.ratingGrade}</td>
                    <td>
                      <span
                        className={`status-pill pill-${rec.decision.toLowerCase()}`}
                      >
                        {rec.decision}
                      </span>
                    </td>
                    <td><b>{rec.recommendedApr}%</b></td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => onSelectRecord(rec)}
                          className="load-rec-btn"
                          title="Load into Eligibility Checker"
                        >
                          <ArrowRight size={14} /> Load
                        </button>
                        <button
                          onClick={() => onDeleteRecord(rec.id)}
                          className="del-rec-btn"
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-history-box">
            <Database size={40} className="text-muted" />
            <p>No evaluations match the selected criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
