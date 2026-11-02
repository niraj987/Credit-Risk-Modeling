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
  Compass,
  ArrowRight,
  Gavel,
  Check,
} from 'lucide-react';
import { searchRAG } from '../services/api';

export const RegulationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedPillar, setSelectedPillar] = useState<any | null>(null);

  const sampleQueries = [
    'Mandatory Adverse Action Reasons (ECOA § 1002.9)',
    'Four-Fifths Rule for Algorithmic Non-Discrimination',
    'Basel III Expected Loss Formula (PD × LGD × EAD)',
    'Credit Bureau Dispute & Accuracy Rights (FCRA § 615)',
    'Maximum Permissible Debt-To-Income (DTI) Ceilings',
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
    if (!queryText.trim()) return;
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
          <span>Consumer Credit Protection & Legal Transparency</span>
        </div>
        <h1>Borrower Rights & Credit Regulations</h1>
        <p>
          Empowering borrowers with real-time statutory intelligence. Discover how federal credit laws,
          mandatory adverse action disclosures, and Basel capital frameworks legally protect you against unfair or opaque lending practices.
        </p>
      </div>

      {/* Plain-English Explainer for Common Users */}
      <div className="rag-user-guide-banner">
        <div className="guide-icon-box">
          <HelpCircle size={24} className="text-sky" />
        </div>
        <div className="guide-text-content">
          <h3>Why Do Credit Regulations & Borrower Rights Matter to You?</h3>
          <p>
            Credit laws aren't just dry legal textbooks—they are your <b>legal shield as a consumer</b>. When you apply for a loan,
            these laws guarantee your right to receive exact rejection reasons, prevent discriminatory algorithms, and protect you
            from hidden interest fees. Our AI validates each assessment against these rulebooks in real time.
          </p>
        </div>
      </div>

      {/* Spacious, Elegant Search Bar with Clear Inputs */}
      <div className="reg-search-card-glass">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchQuery);
          }}
          className="search-form"
        >
          <div className="search-input-wrapper">
            <Search className="search-icon text-muted" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search credit laws, adverse action rules, borrower rights, Basel formulas..."
              className="search-field"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="search-submit-btn-sky" disabled={isSearching}>
            {isSearching ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Querying Law...
              </span>
            ) : (
              'Search Knowledge Base'
            )}
          </button>
        </form>

        <div className="quick-chips-row">
          <span className="chips-label">Popular Topics:</span>
          {sampleQueries.map((q, i) => (
            <button
              key={i}
              type="button"
              className="query-chip-pill"
              onClick={() => handleSearch(q)}
            >
              <Sparkles size={13} className="text-sky" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Structured, High-Clarity Search Results with Smooth Transitions */}
      {results.length > 0 && (
        <div className="results-section-enhanced animate-fade-in-up">
          <div className="results-header-bar">
            <div>
              <h3>Retrieved Legal Provisions ({results.length} verified references)</h3>
              <p className="text-xs text-muted mt-0.5">Structured statutory guidance and consumer protections extracted for your query</p>
            </div>
            <span className="results-badge">Semantic Vector Match</span>
          </div>

          <div className="results-pop-grid">
            {results.map((hit, idx) => (
              <div key={idx} className="result-pop-card group hover:border-sky/50 transition-all duration-300">
                <div className="result-header">
                  <div className="flex items-center gap-2">
                    <Gavel size={18} className="text-sky" />
                    <h4>{hit.title}</h4>
                  </div>
                  <span className="result-source-badge">{hit.source_doc}</span>
                </div>

                {/* Structured Borrower Protection Box */}
                <div className="result-protection-callout">
                  <div className="callout-header">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    <span>Plain-English Borrower Protection</span>
                  </div>
                  <p className="callout-text">
                    Under this statute, lenders are strictly prohibited from issuing opaque decisions. You have the statutory right to full mathematical transparency and unmanipulated risk disclosures.
                  </p>
                </div>

                {/* Structured Body / Legal Provision */}
                <div className="result-body-structured">
                  <div className="section-label">Legal Mandate & Regulatory Text</div>
                  <div className="structured-text leading-relaxed text-sm text-slate-300">
                    {hit.content}
                  </div>
                </div>

                {/* Citations and Reference Pills */}
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
          <p>Click any pillar below to inspect how each regulation guarantees fair, transparent credit underwriting.</p>
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
            <p className="tile-summary">{pillar.simpleExplanation}</p>

            <div className="tile-user-impact">
              <span className="impact-tag">Your Protection:</span>
              <p>{pillar.userImpact}</p>
            </div>

            <div className="tile-bottom-action">
              <span className="action-hint">Click to inspect legal citations</span>
              <ChevronRight size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* Pillar Detail Modal */}
      {selectedPillar && (
        <div className="modal-overlay" onClick={() => setSelectedPillar(null)}>
          <div className="modal-card modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="modal-header-icon-box">{selectedPillar.icon}</div>
                <div>
                  <h3 className="modal-title">{selectedPillar.title}</h3>
                  <span className="modal-subtitle">{selectedPillar.badge}</span>
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

            <div className="pillar-detail-body">
              <div className="detail-section">
                <h4>What This Means for You as a Borrower</h4>
                <p className="detail-plain-text">{selectedPillar.simpleExplanation}</p>
              </div>

              <div className="detail-section">
                <h4>Statutory & Regulatory Details</h4>
                <p className="detail-legal-text">{selectedPillar.statutoryDetails}</p>
              </div>

              <div className="detail-section">
                <h4>Official Citations & Regulatory References</h4>
                <div className="citations-pills-row">
                  {selectedPillar.keyCitations.map((c: string, idx: number) => (
                    <span key={idx} className="citation-pill">
                      <ExternalLink size={12} /> {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-takeaway-box">
                <ShieldCheck size={20} className="text-emerald-400" />
                <div>
                  <b>Our AI Guarantee:</b>
                  <p>{selectedPillar.userImpact}</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => {
                  setSelectedPillar(null);
                  handleSearch(selectedPillar.title);
                }}
                className="btn-query-pillar"
              >
                <Search size={14} /> Query this statute in RAG
              </button>
              <button onClick={() => setSelectedPillar(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
