import React, { useState } from 'react';
import { X, Search, BookOpen, ExternalLink, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { searchRAG } from '../services/api';

interface RAGExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RAGExplorerModal: React.FC<RAGExplorerModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('What are the adverse action notice requirements under ECOA?');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    'Can a bank reject my loan without reason?',
    'What is the Basel III Expected Loss formula?',
    'What is the Four-Fifths rule for AI fair lending?',
    'What are my rights under FCRA § 615?',
  ];

  const handleSearch = async (searchQueryText?: string) => {
    const q = searchQueryText || query;
    if (!q.trim()) return;
    setIsSearching(true);
    if (searchQueryText) setQuery(searchQueryText);

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
      <div className="modal-card modal-large rag-modal-glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="modal-header-icon-box bg-purple-tint">
              <BookOpen className="text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="modal-title">Regulatory RAG Policy Explorer</h3>
              <span className="modal-subtitle">
                Semantic retrieval over Basel III/IV, ECOA 12 CFR § 1002.9, FCRA & Fair Lending laws
              </span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* User-friendly quick explanation */}
        <div className="modal-plain-explainer">
          <HelpCircle size={16} className="text-sky" />
          <span>
            <b>Borrower Protection Guarantee:</b> Ask any regulatory question below. Our AI scans embedded federal statutes to explain your legal rights in plain English.
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
          <button type="submit" className="rag-btn" disabled={isSearching}>
            <Search size={16} /> {isSearching ? 'Querying...' : 'Search Law'}
          </button>
        </form>

        {/* Quick Query Suggestions */}
        <div className="rag-modal-chips-row">
          <span className="chips-label">Try Asking:</span>
          {quickQuestions.map((qq, idx) => (
            <button
              key={idx}
              type="button"
              className="rag-quick-chip"
              onClick={() => handleSearch(qq)}
            >
              {qq}
            </button>
          ))}
        </div>

        {/* Results Container with Pop-Up Tiles */}
        <div className="rag-results-container">
          {results.length > 0 ? (
            results.map((hit, idx) => (
              <div key={idx} className="rag-hit-card-enhanced">
                <div className="rag-hit-header">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-sky" />
                    <span className="rag-hit-title">{hit.title}</span>
                  </div>
                  <span className="rag-hit-badge">{hit.source_doc}</span>
                </div>

                <div className="rag-hit-content">{hit.content}</div>

                {hit.regulatory_citations && hit.regulatory_citations.length > 0 && (
                  <div className="rag-hit-citations">
                    <span className="citation-label">Official Legal References:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {hit.regulatory_citations.map((c: string, ci: number) => (
                        <span key={ci} className="citation-tag">
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
              <Sparkles size={36} className="text-sky" />
              <h4>Ready to Query Regulatory Standards</h4>
              <p>Type a question above or click one of the suggested prompts to see how federal lending laws protect you.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
