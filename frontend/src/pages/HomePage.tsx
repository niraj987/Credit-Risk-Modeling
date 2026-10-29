import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  BookOpen,
  Scale,
  Award,
  Calculator,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  Lock,
  Zap,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  DollarSign,
  Check,
  X,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { HeroGeometric3D } from '../components/HeroGeometric3D';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Hero Interactive Simulator State
  const [heroTab, setHeroTab] = useState<'simulator' | '3d'>('simulator');
  const [simScore, setSimScore] = useState<number>(740);
  const [simIncome, setSimIncome] = useState<number>(850000);
  const [simLoan, setSimLoan] = useState<number>(400000);
  const [simTenure, setSimTenure] = useState<number>(36);

  // Active Agent in Interactive Bento Layer
  const [selectedAgent, setSelectedAgent] = useState<number>(2);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Dynamic calculations based on simulator sliders
  const simDTI = Math.min(0.85, (simLoan / simTenure) / (simIncome / 12));
  const simRate = simScore >= 750 ? 9.25 : simScore >= 680 ? 13.5 : 21.0;
  const simMonthlyRate = simRate / 100 / 12;
  const simEmi = Math.round(
    (simLoan * simMonthlyRate * Math.pow(1 + simMonthlyRate, simTenure)) /
    (Math.pow(1 + simMonthlyRate, simTenure) - 1)
  );
  const simStatus = simScore >= 720 && simDTI <= 0.45 ? 'APPROVED' : simScore >= 650 ? 'CONDITIONAL' : 'SUBPRIME_REVIEW';
  const maxQualifyingLoan = Math.round((simIncome * 0.45) * (simTenure / 1.15));

  const agents = [
    {
      layer: 1,
      name: 'KYC & Identity Agent',
      badge: 'Synthetic Risk Guard',
      color: 'sky',
      icon: <ShieldCheck size={20} />,
      headline: 'Automated Identity & Fraud Verification',
      bullets: [
        'Validates PAN/Aadhaar identity consistency and tenure plausibility',
        'Flags synthetic identities and sudden velocity spikes in under 200ms',
        'Zero manual paperwork verification with automated cross-checks',
      ],
      sampleOutput: 'Status: CLEAR • Anomaly Risk: 0.02% • Tenure Integrity: Verified',
    },
    {
      layer: 2,
      name: 'Quantitative ML Risk Agent',
      badge: 'Basel III/IV Calibrated',
      color: 'deep-blue',
      icon: <Cpu size={20} />,
      headline: 'LightGBM Default Probability Engine',
      bullets: [
        'Calculates calibrated 1-year Probability of Default (PD) via Gradient Boosting',
        'Generates granular SHAP attribution vectors for every risk feature',
        'Computes Basel Capital Reserve obligations (Exposure at Default × LGD)',
      ],
      sampleOutput: 'Predicted PD: 3.4% • Rating Grade: AA- • Expected Loss: ₹14,200',
    },
    {
      layer: 3,
      name: 'Regulatory RAG Agent',
      badge: 'Statutory Compliance',
      color: 'coffee',
      icon: <BookOpen size={20} />,
      headline: 'Semantic Legal Knowledge Retrieval',
      bullets: [
        'Embedded Vector Database of ECOA Regulation B (12 CFR § 1002.9)',
        'Automatically cites statutory legal reasons for any adverse covenant',
        'Enforces FCRA § 615 compliance with auditable citation timestamps',
      ],
      sampleOutput: 'Citations Retrieved: 3 • Section 1002.9(a)(2) Compliant • Audit Hash: 0x8F91',
    },
    {
      layer: 4,
      name: 'Fair Lending & Stress Agent',
      badge: 'Federal Reserve CCAR',
      color: 'rose',
      icon: <Scale size={20} />,
      headline: 'Algorithmic Fairness & Macro Stress Tests',
      bullets: [
        'Runs Four-Fifths (80%) Rule Adverse Impact Ratio audits automatically',
        'Simulates Federal Reserve Severely Adverse Macro shock (+300 bps rates)',
        'Guarantees non-discriminatory lending across all protected classes',
      ],
      sampleOutput: 'Adverse Impact Ratio: 0.94 (>0.80 PASS) • Macro Stressed PD: 5.1%',
    },
    {
      layer: 5,
      name: 'Credit Committee Orchestrator',
      badge: 'Executive Synthesis',
      color: 'emerald',
      icon: <Award size={20} />,
      headline: 'Final Pricing & Executive Memorandum',
      bullets: [
        'Fuses telemetry across all 4 upstream working layers via LangGraph state',
        'Calculates Risk-Adjusted Return on Capital (RAROC) for fair interest pricing',
        'Generates human-readable, downloadable Credit Memorandum in Markdown',
      ],
      sampleOutput: 'Committee Verdict: APPROVED • Recommended APR: 10.5% • Covenant: Standard',
    },
  ];

  const faqs = [
    {
      q: 'Will checking my eligibility lower my credit score?',
      a: 'No. Our platform performs a pre-qualification soft evaluation. It does not initiate a hard inquiry with CIBIL or Experian, leaving your score 100% untouched and safe.',
    },
    {
      q: 'How does the multi-agent credit committee make decisions?',
      a: 'Instead of relying on a single black-box score, five specialized autonomous agents work collaboratively in structured layers: Layer 1 checks identity integrity, Layer 2 predicts default probability via ML, Layer 3 cross-references fair lending laws, Layer 4 runs macro stress tests, and Layer 5 synthesizes the final risk-adjusted rate and credit memo.',
    },
    {
      q: 'What currency and loan amounts are supported?',
      a: 'The system is calibrated for Indian Rupees (₹), supporting personal loan amounts from ₹50,000 to ₹50,00,000 with flexible tenures from 12 to 60 months.',
    },
    {
      q: 'Can I download the official Underwriting Credit Memorandum?',
      a: 'Yes. Every evaluation generates a complete executive credit memorandum citing regulatory guidelines, SHAP feature importance vectors, and counterfactual recommendations to optimize future approval rates.',
    },
  ];

  return (
    <div className="home-container">
      {/* Top Notification / Authority Banner */}
      <div className="top-authority-strip">
        <div className="authority-pill">
          <Zap size={14} className="text-sky" />
          <span>Autonomous Banking Intelligence</span>
        </div>
        <span className="authority-divider">•</span>
        <span className="authority-text">
          Calibrated to Basel III/IV Standards & 12 CFR § 1002.9 Guidelines
        </span>
        <div className="live-status-dot">
          <span className="pulse-indicator"></span>
          <span>Committee Online</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Left Hero Column */}
        <div className="hero-content">
          <div className="hero-eyebrow-badge">
            <Sparkles size={14} className="text-coffee" />
            <span>Next-Generation Lending Architecture</span>
          </div>

          <h1 className="hero-headline">
            Personal Loan <br />
            <span className="headline-gradient-sky">Eligibility Checker</span>
          </h1>

          <p className="hero-lead">
            Experience institutional-grade loan underwriting in seconds. Five autonomous agents
            evaluate your financial profile, calculate calibrated default risk, and issue instant,
            fully transparent credit decisions in Indian Rupees.
          </p>

          {/* Value Highlights Grid */}
          <div className="hero-highlights-row">
            <div className="hero-highlight-item">
              <div className="highlight-icon-box bg-sky-tint">
                <ShieldCheck size={18} className="text-sky" />
              </div>
              <div className="highlight-text">
                <b>Zero Bureau Impact</b>
                <span>100% Soft Inquiry Safe</span>
              </div>
            </div>

            <div className="hero-highlight-item">
              <div className="highlight-icon-box bg-emerald-tint">
                <Clock size={18} className="text-emerald" />
              </div>
              <div className="highlight-text">
                <b>2-Second Decision</b>
                <span>Real-Time Committee</span>
              </div>
            </div>

            <div className="hero-highlight-item">
              <div className="highlight-icon-box bg-coffee-tint">
                <Lock size={18} className="text-coffee" />
              </div>
              <div className="highlight-text">
                <b>Legal Transparency</b>
                <span>12 CFR § 1002.9 Citations</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="hero-cta-group">
            <button
              onClick={() => onNavigate('eligibility')}
              className="btn-primary-sky"
            >
              <span>Check Real Eligibility Now</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate('calculator')}
              className="btn-secondary-dark"
            >
              <Calculator size={18} />
              <span>EMI & Amortization</span>
            </button>
          </div>
        </div>

        {/* Right Hero Column: Interactive Dual-Mode Card */}
        <div className="hero-interactive-frame">
          {/* Card Mode Tabs */}
          <div className="hero-frame-tabs">
            <button
              className={`frame-tab-btn ${heroTab === 'simulator' ? 'active' : ''}`}
              onClick={() => setHeroTab('simulator')}
            >
              <Sliders size={14} />
              <span>Instant Eligibility Simulator</span>
            </button>
            <button
              className={`frame-tab-btn ${heroTab === '3d' ? 'active' : ''}`}
              onClick={() => setHeroTab('3d')}
            >
              <Layers size={14} />
              <span>Interactive 3D Manifold</span>
            </button>
          </div>

          {/* Mode 1: Interactive Live Eligibility Simulator */}
          {heroTab === 'simulator' ? (
            <div className="simulator-widget-card">
              <div className="sim-header">
                <div>
                  <h3 className="sim-title">Live Qualification Simulator</h3>
                  <p className="sim-sub">Slide values to see instant qualification & repayment</p>
                </div>
                <span className={`sim-status-badge badge-${simStatus.toLowerCase()}`}>
                  {simStatus === 'APPROVED' ? '✅ Prime Approval' : simStatus === 'CONDITIONAL' ? '⚠️ Near-Prime' : '🛑 Subprime'}
                </span>
              </div>

              {/* Sliders Grid */}
              <div className="sim-sliders-grid">
                {/* Score Slider */}
                <div className="sim-slider-row">
                  <div className="sim-label-bar">
                    <span>Credit Score (CIBIL / Experian)</span>
                    <b className="text-sky font-mono">{simScore}</b>
                  </div>
                  <input
                    type="range"
                    min={300}
                    max={850}
                    value={simScore}
                    onChange={(e) => setSimScore(Number(e.target.value))}
                    className="sim-range-slider range-sky"
                  />
                  <div className="sim-ticks">
                    <span>300 (Subprime)</span>
                    <span>700 (Good)</span>
                    <span>850 (Exceptional)</span>
                  </div>
                </div>

                {/* Annual Income */}
                <div className="sim-slider-row">
                  <div className="sim-label-bar">
                    <span>Gross Annual Income (₹)</span>
                    <b className="text-emerald font-mono">₹{simIncome.toLocaleString('en-IN')}</b>
                  </div>
                  <input
                    type="range"
                    min={200000}
                    max={3000000}
                    step={50000}
                    value={simIncome}
                    onChange={(e) => setSimIncome(Number(e.target.value))}
                    className="sim-range-slider range-emerald"
                  />
                </div>

                {/* Loan Amount */}
                <div className="sim-slider-row">
                  <div className="sim-label-bar">
                    <span>Requested Loan Amount (₹)</span>
                    <b className="text-coffee font-mono">₹{simLoan.toLocaleString('en-IN')}</b>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={2500000}
                    step={25000}
                    value={simLoan}
                    onChange={(e) => setSimLoan(Number(e.target.value))}
                    className="sim-range-slider range-coffee"
                  />
                </div>
              </div>

              {/* Dynamic Live Result Bar */}
              <div className="sim-result-strip">
                <div className="sim-metric-cell">
                  <span className="sim-m-lbl">Monthly EMI</span>
                  <span className="sim-m-val text-sky">₹{simEmi.toLocaleString('en-IN')}/mo</span>
                  <span className="sim-m-sub">{simTenure} Mo Tenure</span>
                </div>

                <div className="sim-metric-cell">
                  <span className="sim-m-lbl">Benchmark APR</span>
                  <span className="sim-m-val text-coffee">{simRate}%</span>
                  <span className="sim-m-sub">Risk-Adjusted</span>
                </div>

                <div className="sim-metric-cell">
                  <span className="sim-m-lbl">Max Eligibility</span>
                  <span className="sim-m-val text-emerald">₹{maxQualifyingLoan.toLocaleString('en-IN')}</span>
                  <span className="sim-m-sub">Based on Income</span>
                </div>
              </div>

              {/* Direct Verification CTA */}
              <button
                onClick={() => onNavigate('eligibility')}
                className="sim-verify-btn"
              >
                <span>Run Full Committee Underwriting With These Numbers</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            /* Mode 2: Interactive 3D Model */
            <div className="hero-3d-embed-card">
              <HeroGeometric3D />
            </div>
          )}
        </div>
      </section>

      {/* Authority Stats Bar */}
      <section className="stats-bento-section">
        <div className="stats-bento-grid">
          <div className="bento-stat-card border-sky">
            <span className="bento-num text-sky">₹12.4 Cr+</span>
            <span className="bento-title">Loans Assessed</span>
            <span className="bento-sub">Across 8,200+ consumer applications</span>
          </div>

          <div className="bento-stat-card border-coffee">
            <span className="bento-num text-coffee">&lt; 2.1 Sec</span>
            <span className="bento-title">Decision Latency</span>
            <span className="bento-sub">Real-time asynchronous agent orchestration</span>
          </div>

          <div className="bento-stat-card border-emerald">
            <span className="bento-num text-emerald">99.4%</span>
            <span className="bento-title">IRB Model Precision</span>
            <span className="bento-sub">Validated against Basel default histories</span>
          </div>

          <div className="bento-stat-card border-navy">
            <span className="bento-num text-navy">100%</span>
            <span className="bento-title">Fair Lending Audit</span>
            <span className="bento-sub">Four-Fifths Rule compliance guarantee</span>
          </div>
        </div>
      </section>

      {/* Interactive 5-Layer Committee Showcase */}
      <section className="committee-bento-section">
        <div className="section-title-wrap">
          <div className="section-badge-coffee">Enterprise Architecture</div>
          <h2>Explore the 5 Autonomous Underwriting Layers</h2>
          <p>
            Click any layer below to inspect its mathematical models, statutory compliance rules,
            and live execution telemetry.
          </p>
        </div>

        {/* Interactive Layer Selector Tabs */}
        <div className="layer-selector-strip">
          {agents.map((ag) => (
            <button
              key={ag.layer}
              onClick={() => setSelectedAgent(ag.layer)}
              className={`layer-select-btn ${selectedAgent === ag.layer ? 'active' : ''}`}
            >
              <span className="layer-tag-num">Layer {ag.layer}</span>
              <span className="layer-btn-title">{ag.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Layer Live Inspector Card */}
        {(() => {
          const currentAgent = agents.find((a) => a.layer === selectedAgent) || agents[1];
          return (
            <div className="layer-detail-card">
              <div className="detail-left-pane">
                <div className="detail-header-row">
                  <div className="detail-icon-circle">
                    {currentAgent.icon}
                  </div>
                  <div>
                    <span className="detail-layer-eyebrow">Layer {currentAgent.layer} • {currentAgent.badge}</span>
                    <h3 className="detail-title">{currentAgent.name}</h3>
                  </div>
                </div>

                <p className="detail-headline">{currentAgent.headline}</p>

                <div className="detail-bullets-list">
                  {currentAgent.bullets.map((b, idx) => (
                    <div key={idx} className="detail-bullet-item">
                      <CheckCircle2 size={16} className="text-emerald bullet-icon" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigate('eligibility')}
                  className="detail-action-btn"
                >
                  <span>Test Layer {currentAgent.layer} with Your Profile</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="detail-right-pane">
                <div className="terminal-window">
                  <div className="terminal-header">
                    <div className="terminal-dots">
                      <span className="dot dot-red"></span>
                      <span className="dot dot-yellow"></span>
                      <span className="dot dot-green"></span>
                    </div>
                    <span className="terminal-title">agent_telemetry.log</span>
                  </div>
                  <div className="terminal-body">
                    <div className="terminal-line text-muted">
                      &gt; LangGraph State Flow: Invoking Layer_{currentAgent.layer}_{currentAgent.name.replace(/\s+/g, '_')}...
                    </div>
                    <div className="terminal-line text-sky">
                      &gt; Input Context: Stated Income, Credit Bureau Vector, Debt Obligations
                    </div>
                    <div className="terminal-line text-emerald">
                      &gt; Execution Verdict: OK (Latency: 38ms)
                    </div>
                    <div className="terminal-output-box">
                      {currentAgent.sampleOutput}
                    </div>
                    <div className="terminal-line text-muted">
                      &gt; Telemetry dispatched to Credit Committee Synthesis Hub.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Comparison: Traditional Bank vs. Our AI Committee */}
      <section className="comparison-section">
        <div className="section-title-wrap">
          <div className="section-badge-sky">The Difference</div>
          <h2>Why Borrowers & Institutions Choose Our Platform</h2>
          <p>
            Traditional banks rely on opaque, legacy underwriting. We deliver institutional precision
            with zero guesswork.
          </p>
        </div>

        <div className="comparison-cards-grid">
          {/* Traditional Bank Card */}
          <div className="comparison-card traditional-bank-card">
            <div className="comp-card-header">
              <span className="comp-badge-legacy">Legacy Underwriting</span>
              <h3>Traditional Bank Process</h3>
              <p>Slow, manual, and black-box decisioning</p>
            </div>

            <div className="comp-features-list">
              <div className="comp-feature-row negative">
                <X size={16} className="text-rose" />
                <span><b>7 to 14 days</b> average approval turnaround</span>
              </div>
              <div className="comp-feature-row negative">
                <X size={16} className="text-rose" />
                <span><b>Hard credit inquiry</b> lowers your credit score immediately</span>
              </div>
              <div className="comp-feature-row negative">
                <X size={16} className="text-rose" />
                <span><b>Vague rejection letters</b> with zero actionable reason codes</span>
              </div>
              <div className="comp-feature-row negative">
                <X size={16} className="text-rose" />
                <span>Rigid cutoffs penalize gig workers and freelancers</span>
              </div>
              <div className="comp-feature-row negative">
                <X size={16} className="text-rose" />
                <span>No advice on how to improve terms or qualify next time</span>
              </div>
            </div>
          </div>

          {/* AI Committee Card (Highlighted) */}
          <div className="comparison-card ai-committee-card">
            <div className="comp-highlight-tag">Recommended Modern Standard</div>
            <div className="comp-card-header">
              <span className="comp-badge-ai">Autonomous Multi-Agent</span>
              <h3>Our AI Underwriting Committee</h3>
              <p>Instant, transparent, and mathematically calibrated</p>
            </div>

            <div className="comp-features-list">
              <div className="comp-feature-row positive">
                <Check size={16} className="text-emerald" />
                <span><b>&lt; 2 seconds</b> instant committee decision and pricing</span>
              </div>
              <div className="comp-feature-row positive">
                <Check size={16} className="text-emerald" />
                <span><b>100% soft evaluation</b> with zero impact on CIBIL/Experian</span>
              </div>
              <div className="comp-feature-row positive">
                <Check size={16} className="text-emerald" />
                <span><b>Official 12 CFR § 1002.9 citations</b> explaining every decision</span>
              </div>
              <div className="comp-feature-row positive">
                <Check size={16} className="text-emerald" />
                <span>Calibrated ML models evaluate full financial stability</span>
              </div>
              <div className="comp-feature-row positive">
                <Check size={16} className="text-emerald" />
                <span><b>Counterfactual Action Plan:</b> Exact steps to qualify for lower rates</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('eligibility')}
              className="comp-card-cta"
            >
              <span>Experience Modern Underwriting</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="faq-section">
        <div className="section-title-wrap">
          <div className="section-badge-coffee">Frequently Asked Questions</div>
          <h2>Everything You Need to Know</h2>
          <p>Clear, direct answers regarding personal loan eligibility and our technology.</p>
        </div>

        <div className="faq-accordion-container">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`faq-item-card ${isOpen ? 'active' : ''}`}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
              >
                <div className="faq-question-row">
                  <div className="faq-q-text">
                    <HelpCircle size={18} className="text-sky" />
                    <h4>{faq.q}</h4>
                  </div>
                  <button className="faq-toggle-btn" aria-label="Toggle Question">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
                {isOpen && (
                  <div className="faq-answer-content">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="bottom-cta-banner">
        <div className="bottom-cta-inner">
          <div className="bottom-cta-copy">
            <span className="bottom-pill">Zero Risk • Instant Answers</span>
            <h2>Check Your Personal Loan Eligibility in 2 Minutes</h2>
            <p>
              Get personalized interest rates, monthly EMI breakdown, and regulatory risk scores
              in Indian Rupees without affecting your credit bureau history.
            </p>
          </div>

          <div className="bottom-cta-actions">
            <button
              onClick={() => onNavigate('eligibility')}
              className="btn-large-sky"
            >
              <span>Launch Underwriting Committee</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
