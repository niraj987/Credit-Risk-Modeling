import React, { useState } from 'react';
import { X, Search, BookOpen, ExternalLink } from 'lucide-react';
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

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await searchRAG(query);
      setResults(res.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-large">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <BookOpen className="text-purple-400" size={24} />
            <div>
              <h3 className="modal-title">Regulatory RAG Policy Knowledge Base</h3>
              <span className="modal-subtitle">Direct semantic retrieval over Basel III/IV, ECOA, FCRA & Underwriting Manuals</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSearch} className="rag-search-bar">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search regulations (e.g., Basel Expected Loss, ECOA Regulation B, DTI ceilings)..."
            className="rag-input"
          />
          <button type="submit" className="rag-btn" disabled={isSearching}>
            <Search size={16} /> {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="rag-results-container">
          {results.length > 0 ? (
            results.map((hit, idx) => (
              <div key={idx} className="rag-hit-card">
                <div className="rag-hit-header">
                  <span className="rag-hit-title">{hit.title}</span>
                  <span className="rag-hit-badge">{hit.source_doc}</span>
                </div>
                <div className="rag-hit-content">{hit.content}</div>
                {hit.regulatory_citations && hit.regulatory_citations.length > 0 && (
                  <div className="rag-hit-citations">
                    <span className="citation-label">Statutory Citations:</span>
                    {hit.regulatory_citations.map((c: string, ci: number) => (
                      <span key={ci} className="citation-tag">
                        <ExternalLink size={11} /> {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rag-empty">
              Click search above to query the embedded regulatory knowledge base.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
