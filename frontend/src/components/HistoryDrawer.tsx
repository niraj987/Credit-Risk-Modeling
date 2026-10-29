import React from 'react';
import { X, Clock, Trash2, ArrowRight } from 'lucide-react';
import { SavedEvaluation } from '../services/db';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  records: SavedEvaluation[];
  onSelect: (record: SavedEvaluation) => void;
  onDelete: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  records,
  onSelect,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-cyan-400" />
            <h3>JS Database • Underwriting Audit Trail</h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="drawer-subtitle">
          Stored in browser IndexedDB with zero-latency offline persistence.
        </div>

        <div className="drawer-list">
          {records.length > 0 ? (
            records.map((r) => (
              <div key={r.id} className="drawer-item">
                <div className="item-main" onClick={() => onSelect(r)}>
                  <div className="item-title-row">
                    <span className="item-id">{r.id}</span>
                    <span
                      className={`pill-badge ${
                        r.decision === 'APPROVED' ? 'badge-success' : 'badge-danger'
                      }`}
                    >
                      {r.decision}
                    </span>
                  </div>
                  <div className="item-meta">
                    Score: <b>{r.creditScore}</b> • Loan: <b>₹{r.loanAmount.toLocaleString('en-IN')}</b> • PD: <b>{r.pdPercent}%</b>
                  </div>
                  <div className="item-time">
                    {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • APR: {r.recommendedApr}%
                  </div>
                </div>
                <div className="item-actions">
                  <button
                    onClick={() => onDelete(r.id)}
                    className="delete-btn"
                    title="Delete Record"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => onSelect(r)}
                    className="view-btn"
                    title="Load Application"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-drawer">No applications evaluated yet. Run an underwriting evaluation to persist records in the JS database.</div>
          )}
        </div>
      </div>
    </div>
  );
};
