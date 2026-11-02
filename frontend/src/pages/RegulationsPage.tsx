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
  Zap,
  Info,
  Layers,
  FileCheck,
} from 'lucide-react';
import { searchRAG, POPULAR_TOPICS_DATABASE, StructuredRAGHit } from '../services/api';

export const RegulationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<StructuredRAGHit[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedPillar, setSelectedPillar] = useState<any | null>(null);

  const pillars = [
    {
      id: 'ecoa',
      category: 'REJECTION_RIGHTS',
      title: 'ECOA Regulation B (12 CFR § 1002.9)',
      badge: 'Adverse Action Protection',
      colorClass: 'tile-sky',
      icon: <ShieldCheck size={26} className="text-neonlime" />,
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
      icon: <Scale size={26} className="text-neonlime" />,
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
      icon: <FileText size={26} className="text-neonlime" />,
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
      icon: <Lock size={26} className="text-neonlime" />,
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
      icon: <DollarSign size={26} className="text-neonlime" />,
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
      icon: <Sparkles size={26} className="text-neonlime" />,
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

  const handleSelectPopularTopic = (topic: StructuredRAGHit) => {
    setSearchQuery(topic.title);
    setResults([topic]);
    const el = document.getElementById('rag-results-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="regulations-page-container">
      {/* Top Header with Glass Effect */}
      <div className="page-header-wrap reveal-on-scroll">
        <div className="page-badge badge-emerald">
          <ShieldCheck size={14} className="text-neonlime" />
          <span>Consumer Credit Protection & Legal Transparency</span>
        </div>
        <h1>Borrower Rights & Credit Regulations</h1>
        <p>
          Empowering borrowers with real-time statutory intelligence. Discover how federal credit laws,
          mandatory adverse action disclosures, and Basel capital frameworks legally protect you against unfair or opaque lending practices.
        </p>
      </div>

      {/* Plain-English Explainer Banner */}
      <div className="rag-user-guide-banner reveal-on-scroll">
        <div className="guide-icon-box">
          <HelpCircle size={26} className="text-neonlime" />
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

      {/* Spacious, Elegant Search Bar with Clear Inputs & Glass Effect */}
      <div className="reg-search-card-glass reveal-on-scroll">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchQuery);
          }}
          className="search-form"
        >
          <div className="search-input-wrapper">
            <Search className="search-icon text-slate-400" size={20} />
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
          <button type="submit" className="search-submit-btn-lime" disabled={isSearching}>
            {isSearching ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full" />
                Querying Law...
              </span>
            ) : (
              'Search Knowledge Base'
            )}
          </button>
        </form>
      </div>

      {/* Popular Topics: 5 Ordered, Numbered Glass Boxes (01 to 05) */}
      <div className="popular-topics-section reveal-on-scroll">
        <div className="popular-topics-header">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-neonlime" />
            <h3>Popular Topics: Key Statutory Protections</h3>
          </div>
          <span className="topics-count-badge">5 Verified Legal Frameworks</span>
        </div>
        <p className="popular-topics-sub">
          Click any numbered box below to view its complete, structured legal mandate, borrower safeguards, and mathematical standards:
        </p>

        <div className="popular-boxes-grid">
          {POPULAR_TOPICS_DATABASE.map((topic) => (
            <div
              key={topic.chunk_id}
              onClick={() => handleSelectPopularTopic(topic)}
              className="popular-topic-box group"
            >
              <div className="topic-box-top">
                <span className="topic-number-pill">{topic.topic_number}</span>
                <span className="topic-cat-tag">{topic.category}</span>
              </div>

              <h4 className="topic-box-title">{topic.title}</h4>
              <p className="topic-box-summary">{topic.plain_english_summary}</p>

              <div className="topic-box-footer">
                <span className="topic-inspect-text">Inspect Structured Rule</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform text-neonlime" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anchor for Smooth Scrolling */}
      <div id="rag-results-anchor" />

      {/* Structured, High-Clarity Search Results with Multi-Compartment Cards */}
      {results.length > 0 && (
        <div className="results-section-enhanced animate-fade-in-up">
          <div className="results-header-bar">
            <div>
              <h3>Retrieved Legal Provisions ({results.length} verified references)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-compartment structured analysis: Plain-English summary, core mandates, borrower rights, and mathematical benchmarks.
              </p>
            </div>
            <span className="results-badge">Semantic Vector Match</span>
          </div>

          <div className="results-structured-container">
            {results.map((hit, idx) => (
              <div key={idx} className="structured-legal-card">
                {/* 1. Header Banner */}
                <div className="legal-card-header">
                  <div className="header-meta-group">
                    {hit.topic_number && <span className="topic-badge-number">{hit.topic_number}</span>}
                    <div>
                      <h4 className="legal-title-text">{hit.title}</h4>
                      <span className="legal-source-tag">{hit.source_doc}</span>
                    </div>
                  </div>
                  <span className="legal-category-pill">{hit.category}</span>
                </div>

                {/* 2. Executive Plain-English Translation ("In Plain English") */}
                <div className="legal-compartment plain-english-compartment">
                  <div className="compartment-title text-neonlime">
                    <HelpCircle size={16} />
                    <span>In Plain English: What This Means For You as a Borrower</span>
                  </div>
                  <p className="plain-english-body">{hit.plain_english_summary}</p>
                </div>

                {/* 3. Core Statutory Mandate (Bulleted Checklist) */}
                <div className="legal-compartment mandate-compartment">
                  <div className="compartment-title text-slate-200">
                    <FileCheck size={16} className="text-neonlime" />
                    <span>Statutory Mandate & Creditor Legal Requirements</span>
                  </div>
                  <ul className="mandate-bullets-list">
                    {hit.core_mandate_points.map((pt, pti) => (
                      <li key={pti} className="mandate-bullet-item">
                        <CheckCircle2 size={15} className="text-neonlime flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Borrower Rights & Actionable Protections */}
                {hit.borrower_rights && hit.borrower_rights.length > 0 && (
                  <div className="legal-compartment borrower-rights-compartment">
                    <div className="compartment-title text-slate-200">
                      <ShieldCheck size={16} className="text-neonlime" />
                      <span>Your Statutory Borrower Rights & Recourse</span>
                    </div>
                    <ul className="rights-bullets-list">
                      {hit.borrower_rights.map((br, bri) => (
                        <li key={bri} className="rights-bullet-item">
                          <Check size={14} className="text-neonlime flex-shrink-0 mt-0.5" />
                          <span>{br}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 5. Mathematical & Model Operational Standard */}
                {hit.mathematical_formula && (
                  <div className="legal-compartment math-compartment">
                    <div className="compartment-title text-slate-200">
                      <Zap size={15} className="text-amber-400" />
                      <span>Mathematical & Model Operational Standard: {hit.formula_label || 'Standard'}</span>
                    </div>
                    <div className="formula-display-box">
                      <code className="font-mono text-neonlime text-sm">{hit.mathematical_formula}</code>
                    </div>
                  </div>
                )}

                {/* 6. Official Citations & Reference Pills */}
                {hit.regulatory_citations && hit.regulatory_citations.length > 0 && (
                  <div className="legal-card-footer">
                    <span className="citation-title">Official Legal Citations:</span>
                    <div className="citation-tags">
                      {hit.regulatory_citations.map((c: string, ci: number) => (
                        <span key={ci} className="tag-pill-lime">
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
      <div className="pillar-filter-bar reveal-on-scroll">
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
      <div className="pop-tiles-grid reveal-on-scroll">
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
                <ShieldCheck size={20} className="text-neonlime" />
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
