import React, { useState } from 'react';
import { BookOpen, Search, ExternalLink, ShieldCheck, Scale, FileText } from 'lucide-react';
import { searchRAG } from '../services/api';

export const RegulationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState(
    'What are the mandatory adverse action reason code requirements under ECOA Regulation B?'
  );
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const sampleQueries = [
    'Adverse Action reason codes under 12 CFR 1002.9',
    'Basel III expected loss formula LGD standard',
    'Four-Fifths Rule disparate impact test in credit',
    'Maximum permissible Debt-To-Income (DTI) ceilings',
    'CCAR severely adverse macro interest rate shock',
  ];

  const handleSearch = async (queryText: string) => {
    setIsSearching(true);
    setSearchQuery(queryText);
    try {
      const res = await searchRAG(queryText);
      setResults(res.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="regulations-page-container">
      <div className="page-header-wrap">
        <div className="page-badge badge-purple">
          <BookOpen size={14} className="text-purple-400" />
          <span>Statutory Governance Engine</span>
        </div>
        <h1>Regulatory RAG Policy Knowledge Base</h1>
        <p>
          Our underwriting engine integrates real-time Retrieval-Augmented Generation (RAG) over
          federal lending laws, statutory adverse action requirements, and Basel Committee capital frameworks.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="reg-search-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchQuery);
          }}
          className="search-form"
        >
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search regulations (e.g., 12 CFR 1002.9, Basel expected loss, Four-Fifths rule)..."
              className="search-field"
            />
          </div>
          <button type="submit" className="search-submit-btn" disabled={isSearching}>
            {isSearching ? 'Retrieving Policies...' : 'Execute RAG Query'}
          </button>
        </form>

        <div className="quick-chips-row">
          <span className="chips-label">Quick Inquiries:</span>
          {sampleQueries.map((q, i) => (
            <button
              key={i}
              type="button"
              className="query-chip"
              onClick={() => handleSearch(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* RAG Results View */}
      {results.length > 0 && (
        <div className="results-section">
          <h3>Retrieved Policy Extracts ({results.length} matches)</h3>
          <div className="results-grid">
            {results.map((hit, idx) => (
              <div key={idx} className="result-card">
                <div className="result-header">
                  <h4>{hit.title}</h4>
                  <span className="result-source-badge">{hit.source_doc}</span>
                </div>
                <div className="result-body">{hit.content}</div>
                {hit.regulatory_citations && hit.regulatory_citations.length > 0 && (
                  <div className="result-footer">
                    <span className="citation-title">Legal Citations:</span>
                    <div className="citation-tags">
                      {hit.regulatory_citations.map((c: string, ci: number) => (
                        <span key={ci} className="tag-pill">
                          <ExternalLink size={11} /> {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statutory Pillar Cards */}
      <div className="pillars-grid">
        <div className="pillar-card">
          <div className="pillar-icon bg-cyan">
            <ShieldCheck size={22} />
          </div>
          <h3>ECOA Regulation B (12 CFR § 1002.9)</h3>
          <p>
            Mandates that creditors provide written statements specifying the top 4 principal
            reasons for denial within 30 days. Vague phrases like "internal score below benchmark"
            are legally prohibited.
          </p>
          <span className="pillar-tag">Adverse Action Notices</span>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon bg-blue">
            <Scale size={22} />
          </div>
          <h3>Basel III / IV IRB Capital Framework</h3>
          <p>
            Governs the mathematical calculation of Expected Loss ($EL = PD \times EAD \times LGD$)
            and requires banks to maintain Tier-1 Common Equity capital buffers against portfolio tail risks.
          </p>
          <span className="pillar-tag">Capital Adequacy & IRB</span>
        </div>

        <div className="pillar-card">
          <div className="pillar-icon bg-purple">
            <FileText size={22} />
          </div>
          <h3>FCRA Section 615 & Fair Lending</h3>
          <p>
            Enforces the 80% (Four-Fifths) Adverse Impact Ratio test across demographic cohorts to prevent
            algorithmic discrimination in automated underwriting systems.
          </p>
          <span className="pillar-tag">Four-Fifths Rule</span>
        </div>
      </div>
    </div>
  );
};
