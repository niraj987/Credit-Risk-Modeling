import React, { useState } from 'react';
import { X, Search, BookOpen, ExternalLink, HelpCircle, ShieldCheck, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { searchRAG, StructuredRAGHit } from '../services/api';

interface RAGExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RAGExplorerModal: React.FC<RAGExplorerModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StructuredRAGHit[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    'Mandatory Adverse Action Reasons (ECOA § 1002.9)',
    'Four-Fifths Rule for Algorithmic Non-Discrimination',
    'Basel III Expected Loss Formula (PD × LGD × EAD)',
    'Credit Bureau Dispute & Accuracy Rights (FCRA § 615)',
    'Maximum Permissible Debt-To-Income (DTI) Ceilings',
  ];

  const handleSearch = async (searchQueryText?: string) => {
    const q = searchQueryText !== undefined ? searchQueryText : query;
    if (!q.trim()) return;
    setIsSearching(true);
    if (searchQueryText !== undefined) setQuery(searchQueryText);

    try {
      const res = await searchRAG(q);
      setResults(res.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-large rag-modal-glass animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="modal-header-icon-box bg-lime-tint">
              <ShieldCheck className="text-neonlime" size={24} />
            </div>
            <div>
              <h3 className="modal-title">Borrower Rights & Policy Explorer</h3>
              <span className="modal-subtitle">
                Real-time semantic retrieval over Basel III/IV, ECOA 12 CFR § 1002.9, FCRA & Fair Lending laws
              </span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* User-friendly quick explanation */}
        <div className="modal-plain-explainer">
          <HelpCircle size={16} className="text-neonlime" />
          <span>
            <b>Borrower Protection Guarantee:</b> Select any topic below or ask any regulatory question. Our AI scans embedded federal statutes to explain your legal rights in plain English.
          </span>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="rag-search-bar"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search regulations (e.g., Basel Expected Loss, ECOA Regulation B, DTI ceilings)..."
            className="rag-input"
          />
          <button type="submit" className="rag-btn-lime" disabled={isSearching}>
            <Search size={16} /> {isSearching ? 'Querying...' : 'Search Law'}
          </button>
        </form>

        {/* Quick Query Suggestions (Numbered Pills) */}
        <div className="rag-modal-chips-row">
          <span className="chips-label">Popular Topics:</span>
          {quickQuestions.map((qq, idx) => (
            <button
              key={idx}
              type="button"
              className="rag-quick-chip"
              onClick={() => handleSearch(qq)}
            >
              <span className="chip-idx">0{idx + 1}.</span>
              <span>{qq}</span>
            </button>
          ))}
        </div>

        {/* Results Container with Structured Cards */}
        <div className="rag-results-container">
          {results.length > 0 ? (
            results.map((hit, idx) => (
              <div key={idx} className="rag-hit-card-structured animate-fade-in-up">
                <div className="rag-hit-header">
                  <div className="flex items-center gap-2">
                    {hit.topic_number && <span className="topic-badge-number">{hit.topic_number}</span>}
                    <span className="rag-hit-title">{hit.title}</span>
                  </div>
                  <span className="rag-hit-badge">{hit.source_doc}</span>
                </div>

                {hit.plain_english_summary && (
                  <div className="modal-plain-english-box">
                    <span className="pe-label text-neonlime">💡 In Plain English:</span>
                    <p>{hit.plain_english_summary}</p>
                  </div>
                )}

                {hit.core_mandate_points && hit.core_mandate_points.length > 0 && (
                  <div className="modal-mandates-box">
                    <span className="box-section-lbl">Statutory Mandate & Requirements:</span>
                    <ul className="modal-mandate-list">
                      {hit.core_mandate_points.map((pt, pti) => (
                        <li key={pti} className="modal-mandate-item">
                          <CheckCircle2 size={13} className="text-neonlime flex-shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hit.mathematical_formula && (
                  <div className="modal-formula-box">
                    <span className="box-section-lbl">Operational / Mathematical Standard:</span>
                    <code className="text-neonlime text-xs font-mono">{hit.mathematical_formula}</code>
                  </div>
                )}

                {hit.regulatory_citations && hit.regulatory_citations.length > 0 && (
                  <div className="rag-hit-citations">
                    <span className="citation-label">Official Legal References:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {hit.regulatory_citations.map((c: string, ci: number) => (
                        <span key={ci} className="tag-pill-lime">
                          <ExternalLink size={11} /> {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rag-empty-enhanced">
              <Sparkles size={36} className="text-neonlime" />
              <h4>Ready to Query Regulatory Standards</h4>
              <p>Type a question above or click one of the numbered popular topics to see how federal lending laws protect you.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
