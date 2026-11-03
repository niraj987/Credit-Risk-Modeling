import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  ShieldCheck,
  Scale,
  FileText,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  DollarSign,
  Lock,
  Sparkles,
  ArrowRight,
  X,
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
      title: 'Equal Credit Opportunity Act (ECOA)',
      badge: 'Adverse Action Protection',
      colorClass: 'tile-sky',
      icon: <ShieldCheck size={24} className="text-neonlime" />,
      rule: 'Lenders cannot silently deny a credit application without formal written disclosure.',
      mandate: 'Mandatory disclosure of top 4 exact, plain-English reasons for any rejection or modified terms within 30 days.',
      protection: 'Guarantees actionable feedback and prevents discriminatory credit denial based on protected demographics.',
      userImpact: 'Guarantees you receive actionable feedback to fix your financial profile and qualify for better terms.',
      keyBenefit: 'Guaranteed written explanation for any loan decision within 30 days.',
    },
    {
      id: 'basel',
      category: 'SOLVENCY',
      title: 'Basel Capital Adequacy Framework',
      badge: 'Bank Safety & Solvency',
      colorClass: 'tile-emerald',
      icon: <Scale size={24} className="text-neonlime" />,
      rule: 'Banks must calculate actuarially sound Expected Loss on all consumer loans.',
      mandate: 'Expected Loss calculation (PD × EAD × LGD) must be backed by dedicated Tier-1 equity reserves.',
      protection: 'Ensures your loan interest rate reflects fair, actuarially sound risk pricing rather than predatory corporate markups.',
      userImpact: 'Ensures your loan interest rate reflects fair, actuarially sound risk pricing.',
      keyBenefit: 'Fair interest rate pricing based on true mathematical risk, not arbitrary markups.',
    },
    {
      id: 'fcra',
      category: 'CREDIT_RIGHTS',
      title: 'Fair Credit Reporting Act (FCRA)',
      badge: 'Credit Bureau Accuracy',
      colorClass: 'tile-amber',
      icon: <FileText size={24} className="text-neonlime" />,
      rule: 'Lenders taking adverse action must disclose the consumer credit bureau consulted.',
      mandate: 'Gives you the absolute right to know which bureau (CIBIL, Experian) provided your file, plus free credit disclosure and dispute rights.',
      protection: 'Protects you from erroneous bureau entries and unauthorized credit inquiries that damage your score.',
      userImpact: 'Protects you from erroneous bureau entries and unauthorized credit checks.',
      keyBenefit: 'Full transparency into credit reports and free dispute rights for inaccurate data.',
    },
    {
      id: 'fairlending',
      category: 'FAIRNESS',
      title: 'Four-Fifths Rule & Algorithmic Parity',
      badge: 'Algorithmic Non-Bias',
      colorClass: 'tile-rose',
      icon: <Lock size={24} className="text-neonlime" />,
      rule: 'AI credit algorithms must maintain demographic parity across all borrower cohorts.',
      mandate: 'Approval rates across demographic cohorts must satisfy the 80% (Four-Fifths) ratio: AIR = Rate(Protected) / Rate(Reference) ≥ 0.80.',
      protection: 'Guarantees automated credit models are statistically tested and prohibited from exhibiting indirect demographic bias.',
      userImpact: 'Ensures AI algorithms never discriminate against protected demographics.',
      keyBenefit: 'Rigorous algorithmic testing to guarantee unbiased approval decisions for every applicant.',
    },
    {
      id: 'tila',
      category: 'APR_TRANSPARENCY',
      title: 'Truth in Lending Act (TILA)',
      badge: 'APR Disclosure & Transparency',
      colorClass: 'tile-purple',
      icon: <DollarSign size={24} className="text-neonlime" />,
      rule: 'Lenders are legally barred from concealing processing fees or compounding traps.',
      mandate: 'Mandates standard upfront disclosure of Annual Percentage Rate (APR), payment schedule, finance charges, and prepayment terms.',
      protection: 'Protects borrowers from hidden fees, surprise penalty rate hikes, or balloon payment covenants.',
      userImpact: 'Protects you from hidden fees, sudden balloon payments, or predatory interest.',
      keyBenefit: 'Zero hidden fees: clear APR, total interest cost, and monthly payment schedules upfront.',
    },
    {
      id: 'glba',
      category: 'PRIVACY',
      title: 'Gramm-Leach-Bliley Privacy Safeguards',
      badge: 'Financial Data Privacy',
      colorClass: 'tile-cyan',
      icon: <Sparkles size={24} className="text-neonlime" />,
      rule: 'Confidential borrower financial data must remain strictly encrypted and sovereign.',
      mandate: 'Comprehensive technical, administrative, and physical encryption safeguards for nonpublic personal financial data.',
      protection: 'Guarantees your monthly salary and PAN/Aadhaar identity details are never monetized, leaked, or shared with third parties.',
      userImpact: 'Guarantees your salary and PAN/Aadhaar data remains 100% private and encrypted.',
      keyBenefit: 'Bank-grade encryption protecting all your financial data from unauthorized sharing or sale.',
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
        <h1>Borrower Rights & Credit Regulations</h1>
        <p>
          Empowering borrowers with real-time statutory intelligence. Discover how federal credit laws,
          mandatory adverse action disclosures, and Basel capital frameworks legally protect you against unfair or opaque lending practices.
        </p>
      </div>

      {/* Plain-English Explainer Written Directly on the Webpage (No Container Box) */}
      <div className="rights-matter-open-section reveal-on-scroll">
        <div className="rights-matter-header">
          <HelpCircle size={24} className="text-neonlime inline-block mr-2" />
          <h2>Why Do Credit Regulations & Borrower Rights Matter to You?</h2>
        </div>
        <p className="rights-matter-lead">
          Credit laws aren't just dry legal textbooks—they are your <span className="highlight-text-lime font-bold">legal shield as a consumer</span>. 
          When you apply for a loan, these statutes guarantee your absolute right to receive <span className="text-white font-bold">exact rejection reasons</span>, 
          prohibit <span className="text-white font-bold">discriminatory black-box algorithms</span>, and strictly outlaw <span className="text-white font-bold">hidden interest rates or surprise fees</span>. 
          Our underwriting engine executes these rulebooks automatically so every decision is fair, audited, and mathematically transparent.
        </p>
      </div>

      {/* Spacious, Elegant Search Bar: Perfectly Aligned Unified Pill */}
      <div className="reg-search-card-glass reveal-on-scroll">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchQuery);
          }}
          className="search-form-unified"
        >
          <div className="search-bar-inner">
            <Search className="search-icon text-neonlime flex-shrink-0" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search credit laws, adverse action rules, borrower rights, Basel formulas..."
              className="search-field-unified"
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
            <button type="submit" className="search-submit-btn-unified" disabled={isSearching}>
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full" />
                  Searching...
                </span>
              ) : (
                'Search Knowledge Base'
              )}
            </button>
          </div>
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

      {/* Decorative Pop-Up Pillar Tiles Grid with Descent, Structured Content & Zero Clutter */}
      <div className="pop-tiles-grid reveal-on-scroll">
        {filteredPillars.map((pillar) => (
          <div
            key={pillar.id}
            className="pop-tile-card"
            onClick={() => setSelectedPillar(pillar)}
          >
            <div className="tile-top-row">
              <span className="tile-badge">{pillar.badge}</span>
              <div className="tile-icon-box">{pillar.icon}</div>
            </div>
            
            <h3 className="tile-title">{pillar.title}</h3>

            <div className="tile-structured-box">
              <div className="structured-row">
                <span className="struct-tag text-neonlime">Statutory Rule:</span>
                <p className="struct-desc">{pillar.rule}</p>
              </div>
              <div className="structured-row">
                <span className="struct-tag text-sky">Mandate:</span>
                <p className="struct-desc">{pillar.mandate}</p>
              </div>
              <div className="structured-row">
                <span className="struct-tag text-amber">Borrower Shield:</span>
                <p className="struct-desc">{pillar.protection}</p>
              </div>
            </div>

            {/* Key Borrower Benefit Strip */}
            <div className="tile-benefit-strip">
              <CheckCircle2 size={15} className="text-neonlime flex-shrink-0 mt-0.5" />
              <span>{pillar.keyBenefit}</span>
            </div>

            <div className="tile-bottom-action">
              <span className="action-hint">View full legal guidance</span>
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
                <p className="detail-plain-text">{selectedPillar.mandate}</p>
              </div>

              <div className="detail-section">
                <h4>Statutory Protection & Creditor Duty</h4>
                <p className="detail-legal-text">{selectedPillar.protection}</p>
              </div>

              <div className="detail-takeaway-box">
                <ShieldCheck size={22} className="text-neonlime flex-shrink-0" />
                <div>
                  <b>Our Underwriting Guarantee:</b>
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
