import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  ShieldCheck,
  Scale,
  FileText,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Lock,
  DollarSign,
  AlertCircle,
  ChevronRight,
  X,
} from 'lucide-react';
import { searchRAG } from '../services/api';

export const RegulationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState(
    'What are the mandatory adverse action reason code requirements under ECOA Regulation B?'
  );
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedPillar, setSelectedPillar] = useState<any | null>(null);

  const sampleQueries = [
    'Adverse Action reason codes under 12 CFR 1002.9',
    'Basel III expected loss formula LGD standard',
    'Four-Fifths Rule disparate impact test in credit',
    'Maximum permissible Debt-To-Income (DTI) ceilings',
    'CCAR severely adverse macro interest rate shock',
  ];

  const pillars = [
    {
      id: 'ecoa',
      category: 'REJECTION_RIGHTS',
      title: 'ECOA Regulation B (12 CFR § 1002.9)',
      badge: 'Adverse Action Protection',
      colorClass: 'tile-sky',
      icon: <ShieldCheck size={26} className="text-sky" />,
      simpleExplanation:
        'Lenders cannot secretly deny your loan. They are legally mandated to provide the top 4 exact, plain-English reasons for any rejection or modified terms within 30 days.',
      statutoryDetails:
        'Prohibits discrimination based on race, color, religion, national origin, sex, marital status, or age. Imposes strict adverse action notice obligations requiring principal reasons derived from empirical scoring systems.',
      keyCitations: ['12 CFR § 1002.9(a)(2)', 'CFPB Circular 2022-03', 'ECOA Section 701'],
      userImpact: 'Guarantees you receive actionable feedback to fix your financial profile.',
    },
    {
      id: 'basel',
      category: 'SOLVENCY',
      title: 'Basel III & IV Capital Adequacy Framework',
      badge: 'Bank Safety & Solvency',
      colorClass: 'tile-emerald',
      icon: <Scale size={26} className="text-emerald" />,
      simpleExplanation:
        'Requires banks to calculate mathematically precise Expected Loss and maintain dedicated capital reserves for every loan, preventing financial system collapse.',
      statutoryDetails:
        'Internal Ratings-Based (IRB) approach governs Expected Loss: EL = PD × EAD × LGD. Mandates Tier-1 Common Equity cushions calibrated against portfolio tail-risk distributions.',
      keyCitations: ['Basel Committee BCBS 128', 'Dodd-Frank Act Title I', 'CRR II Art. 158'],
      userImpact: 'Ensures your loan interest rate reflects fair, actuarially sound risk pricing.',
    },
    {
      id: 'fcra',
      category: 'CREDIT_RIGHTS',
      title: 'Fair Credit Reporting Act (FCRA § 615)',
      badge: 'Credit Bureau Accuracy',
      colorClass: 'tile-amber',
      icon: <FileText size={26} className="text-amber" />,
      simpleExplanation:
        'Gives you the absolute right to know which credit bureau (CIBIL, Experian, Equifax) provided your data, and entitles you to free credit disclosure and dispute rights.',
      statutoryDetails:
        'Mandates that any user of a consumer report taking adverse action must notify the consumer, provide the contact details of the CRA, and disclose the credit score along with key factors adversely affecting it.',
      keyCitations: ['15 U.S.C. § 1681m', 'CFPB Bulletin 2012-09', 'FCRA § 609'],
      userImpact: 'Protects you from erroneous bureau entries and unauthorized credit checks.',
    },
    {
      id: 'fairlending',
      category: 'FAIRNESS',
      title: 'Four-Fifths Rule & Disparate Impact',
      badge: 'Algorithmic Non-Bias',
      colorClass: 'tile-rose',
      icon: <Lock size={26} className="text-rose" />,
      simpleExplanation:
        'Even if an AI credit model does not explicitly ask about protected traits, its approval rates across groups must pass the 80% (Four-Fifths) ratio test, guaranteeing algorithmic fairness.',
      statutoryDetails:
        '29 CFR § 1607.4(D) Uniform Guidelines on Employee Selection Procedures, adopted by CFPB and DOJ for credit scoring. Adverse Impact Ratio must meet or exceed 0.80 to rebut disparate impact presumptions.',
      keyCitations: ['29 CFR § 1607.4(D)', 'CFPB Supervisory Highlights', 'DOJ Fair Lending Guidelines'],
      userImpact: 'Ensures AI algorithms never discriminate against protected demographics.',
    },
    {
      id: 'tila',
      category: 'APR_TRANSPARENCY',
      title: 'Truth in Lending Act (TILA Regulation Z)',
      badge: 'APR Disclosure & Transparency',
      colorClass: 'tile-purple',
      icon: <DollarSign size={26} className="text-purple-400" />,
      simpleExplanation:
        'Lenders cannot hide fees, processing charges, or rate markups. They must state the all-inclusive Annual Percentage Rate (APR) and total finance charge upfront.',
      statutoryDetails:
        '12 CFR Part 1026 regulates consumer credit terms disclosure. Requires standard calculation of Annual Percentage Rate (APR), payment schedules, finance charges, and prepayment covenant terms.',
      keyCitations: ['12 CFR § 1026.18', 'TILA 15 U.S.C. § 1601', 'CFPB Reg Z Handbook'],
      userImpact: 'Protects you from hidden fees, sudden balloon payments, or predatory interest.',
    },
    {
      id: 'glba',
      category: 'PRIVACY',
      title: 'Gramm-Leach-Bliley Act (GLBA Safeguards)',
      badge: 'Financial Data Privacy',
      colorClass: 'tile-cyan',
      icon: <Sparkles size={26} className="text-cyan-400" />,
      simpleExplanation:
        'Guarantees your confidential financial data is encrypted and securely processed with client-side sovereignty, never leaked or sold to third-party telemarketers.',
      statutoryDetails:
        '16 CFR Part 314 Standards for Safeguarding Customer Information. Requires comprehensive administrative, technical, and physical safeguards for nonpublic personal financial information.',
      keyCitations: ['16 CFR § 314.3', '15 U.S.C. § 6801', 'FTC Safeguards Rule 2023'],
      userImpact: 'Guarantees your salary and PAN/Aadhaar data remains 100% private and encrypted.',
    },
  ];

  const filteredPillars = activeCategory === 'ALL'
    ? pillars
    : pillars.filter((p) => p.category === activeCategory);

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
      {/* Top Header */}
      <div className="page-header-wrap">
        <div className="page-badge badge-purple">
          <BookOpen size={14} className="text-purple-400" />
          <span>Statutory Governance Engine</span>
        </div>
        <h1>Regulatory RAG Knowledge Base</h1>
        <p>
          Our underwriting engine integrates real-time Retrieval-Augmented Generation (RAG) over
          federal lending laws, statutory adverse action requirements, and Basel Committee capital frameworks.
        </p>
      </div>

      {/* Plain-English Explainer for Common Users */}
      <div className="rag-user-guide-banner">
        <div className="guide-icon-box">
          <HelpCircle size={24} className="text-sky" />
        </div>
        <div className="guide-text-content">
          <h3>Why Does the Regulatory Knowledge Base Matter to You?</h3>
          <p>
            Banking laws aren't just dry legal documents—they are your <b>legal shield</b>. When you apply for a loan,
            these laws guarantee your right to know exact rejection reasons, prevent discriminatory algorithms, and protect you
            from hidden interest fees. Our AI inspects these rulebooks in real-time during your evaluation.
          </p>
        </div>
      </div>

      {/* Search Input Bar with Glass Effect */}
      <div className="reg-search-card-glass">
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
              placeholder="Ask anything in plain English (e.g., Can a bank deny me without giving reasons? What is Basel Expected Loss?)..."
              className="search-field"
            />
          </div>
          <button type="submit" className="search-submit-btn-sky" disabled={isSearching}>
            {isSearching ? 'Querying Law...' : 'Search Policy RAG'}
          </button>
        </form>

        <div className="quick-chips-row">
          <span className="chips-label">Popular Questions:</span>
          {sampleQueries.map((q, i) => (
            <button
              key={i}
              type="button"
              className="query-chip-pill"
              onClick={() => handleSearch(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* RAG Search Results */}
      {results.length > 0 && (
        <div className="results-section-enhanced">
          <div className="results-header-bar">
            <h3>Retrieved Policy Extracts ({results.length} matches found)</h3>
            <span className="results-badge">Semantic Vector Match</span>
          </div>

          <div className="results-pop-grid">
            {results.map((hit, idx) => (
              <div key={idx} className="result-pop-card">
                <div className="result-header">
                  <h4>{hit.title}</h4>
                  <span className="result-source-badge">{hit.source_doc}</span>
                </div>
                <div className="result-body">{hit.content}</div>
                {hit.regulatory_citations && hit.regulatory_citations.length > 0 && (
                  <div className="result-footer">
                    <span className="citation-title">Statutory Citations:</span>
                    <div className="citation-tags">
                      {hit.regulatory_citations.map((c: string, ci: number) => (
                        <span key={ci} className="tag-pill-sky">
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

      {/* Interactive Category Filter Bar */}
      <div className="pillar-filter-bar">
        <div className="filter-headline-wrap">
          <h2>Core Statutory Pillars Protecting Borrowers</h2>
          <p>Hover over or click any tile below to explore your rights and how our AI enforces them.</p>
        </div>

        <div className="filter-chips-cluster">
          {[
            { id: 'ALL', label: 'All Statutory Pillars' },
            { id: 'REJECTION_RIGHTS', label: '🛡️ Rejection Rights (ECOA)' },
            { id: 'SOLVENCY', label: '📊 Bank Safety (Basel III)' },
            { id: 'CREDIT_RIGHTS', label: '🔍 Credit Bureau (FCRA)' },
            { id: 'FAIRNESS', label: '⚖️ Non-Bias & Fair Lending' },
            { id: 'APR_TRANSPARENCY', label: '💰 APR Transparency (TILA)' },
            { id: 'PRIVACY', label: '🔒 Data Privacy (GLBA)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`pillar-chip ${activeCategory === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Decorative Pop-Up Pillar Tiles Grid with Background Colors and Rich Shadows */}
      <div className="pop-tiles-grid">
        {filteredPillars.map((pillar) => (
          <div
            key={pillar.id}
            className={`pop-tile-card ${pillar.colorClass}`}
            onClick={() => setSelectedPillar(pillar)}
          >
            <div className="tile-top-row">
              <div className="tile-icon-box">{pillar.icon}</div>
              <span className="tile-badge">{pillar.badge}</span>
            </div>

            <h3 className="tile-title">{pillar.title}</h3>

            {/* Plain English Highlight Box */}
            <div className="tile-plain-english-box">
              <span className="plain-english-tag">💡 In Plain English:</span>
              <p>{pillar.simpleExplanation}</p>
            </div>

            <p className="tile-legal-summary">{pillar.statutoryDetails}</p>

            <div className="tile-footer-row">
              <div className="tile-citations-summary">
                <span className="citation-count">{pillar.keyCitations.length} Citations</span>
              </div>
              <span className="tile-explore-link">
                <span>Inspect Law</span>
                <ChevronRight size={15} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Pillar Detail Modal */}
      {selectedPillar && (
        <div className="modal-overlay" onClick={() => setSelectedPillar(null)}>
          <div
            className={`modal-card modal-large ${selectedPillar.colorClass}-modal`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="modal-icon-wrap">{selectedPillar.icon}</div>
                <div>
                  <span className="modal-eyebrow">{selectedPillar.badge}</span>
                  <h3 className="modal-title">{selectedPillar.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedPillar(null)}
                className="modal-close-btn"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-dialog-body">
              <div className="modal-user-impact-card">
                <h4>🎯 What This Means for You as a Borrower</h4>
                <p>{selectedPillar.simpleExplanation}</p>
                <div className="user-benefit-highlight">
                  <b>Your Guarantee:</b> {selectedPillar.userImpact}
                </div>
              </div>

              <div className="modal-legal-card">
                <h4>📜 Statutory Architecture & Regulatory Text</h4>
                <p>{selectedPillar.statutoryDetails}</p>
              </div>

              <div className="modal-citations-card">
                <h4>🔗 Official Legal Codes & Handbook References</h4>
                <div className="citation-tags-list">
                  {selectedPillar.keyCitations.map((cite: string, idx: number) => (
                    <span key={idx} className="citation-tag-pill">
                      <ExternalLink size={12} /> {cite}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => {
                  setSearchQuery(`Detailed guidelines under ${selectedPillar.title}`);
                  setSelectedPillar(null);
                  handleSearch(`Detailed guidelines under ${selectedPillar.title}`);
                }}
                className="btn-modal-query"
              >
                <Search size={15} /> Run Semantic RAG Query for This Law
              </button>
              <button onClick={() => setSelectedPillar(null)} className="btn-modal-close">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
