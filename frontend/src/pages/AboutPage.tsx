import React from 'react';
import { AgentArchitectureFlow } from '../components/AgentArchitectureFlow';
import { TextMarquee } from '../components/TextMarquee';
import {
  ShieldCheck,
  Cpu,
  BookOpen,
  Scale,
  Award,
  Github,
  Terminal,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  ArrowRight,
  Database,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const story = [
    {
      index: '01',
      kicker: 'Borrower Sovereignty',
      title: 'Eliminating the "Black Box" Rejection',
      body:
        'Traditional banking algorithms reject applicants without actionable explanation, triggering anxiety and confusion. We translate machine learning SHAP attribution vectors into transparent, statutory reason codes so borrowers know exactly where they stand.',
      note: 'Mandatory top-4 reason code breakdown under Federal Regulation B.',
      img: '/images/about-mission.jpg',
      alt: 'A credit team reviewing financial charts together',
      caption: 'Every decision is explained, not just issued',
    },
    {
      index: '02',
      kicker: 'Basel III & IV Solvency',
      title: 'Actuarial Precision, Not Arbitrary Markups',
      body:
        'Rather than inflated lender profit margins, every interest rate is mathematically calibrated against 1-Year Default Probability (PD) and Basel Expected Loss formulas, ensuring fair and risk-aligned borrowing costs.',
      note: 'Formula: Expected Loss = PD × Exposure at Default × Loss Given Default.',
      img: '/images/about-data.jpg',
      alt: 'Dark data wall of risk charts and node graphs',
      caption: 'Calibrated risk, measured in the open',
    },
    {
      index: '03',
      kicker: 'Equal Credit Opportunity',
      title: 'Proactive Algorithmic Non-Discrimination',
      body:
        'AI credit systems can inadvertently amplify societal disparities. Our compliance layer actively executes the Four-Fifths Adverse Impact Ratio test to prove non-bias before any credit offer is finalized.',
      note: 'Adverse Impact Ratio maintained above 0.80 benchmark threshold.',
      img: '/images/law-library.jpg',
      alt: 'Scales of justice in a law library',
      caption: 'Fairness tested, not assumed',
    },
    {
      index: '04',
      kicker: 'Empowerment Blueprint',
      title: 'Counterfactual Improvement Roadmaps',
      body:
        'When a loan is conditionally approved or rejected, our system calculates the shortest financial path to prime qualification—showing the exact debt balance to pay down or tenure adjustment needed.',
      note: 'Actionable steps to lower APR by up to 1.50% and unlock higher limits.',
      img: '/images/borrower-mobile.jpg',
      alt: 'A borrower reviewing an offer on a phone',
      caption: 'A path forward after every verdict',
    },
  ];

  const deepDives = [
    {
      category: 'GOVERNANCE & AUDITABILITY',
      stat: '5 Independent Stages',
      statColor: 'text-neonlime',
      q: 'Why deploy 5 autonomous agent layers rather than a single black-box score?',
      takeaway: 'Separation of duties prevents single points of failure and establishes complete deterministic auditability.',
      points: [
        { label: 'Role Segregation', desc: 'Identity verification, quantitative risk modeling, statutory policy reconciliation, and fairness auditing operate as isolated verification nodes.' },
        { label: 'Audit Trail', desc: 'Every decision produces an immutable execution trace citing exact borrower data points, feature weights, and regulatory articles.' },
        { label: 'Deterministic Consensus', desc: 'The credit committee cannot issue approvals without unanimous validation from all preceding compliance agents.' },
      ],
    },
    {
      category: 'STATUTORY DISCLOSURE',
      stat: '12 CFR § 1002.9',
      statColor: 'text-sky',
      q: 'How does the platform ensure statutory compliance with Equal Credit Opportunity Act (ECOA)?',
      takeaway: 'Every non-prime verdict automatically extracts and translates adverse factors into official reason codes.',
      points: [
        { label: 'Mandatory Top-4 Factors', desc: 'Statute requires lenders to disclose the exact principal drivers behind any modified or adverse credit verdict.' },
        { label: 'SHAP Feature Mapping', desc: 'Mathematical negative contribution vectors are indexed directly against regulatory compliance codes.' },
        { label: 'Borrower Recourse Rights', desc: 'Provides immediate counterfactual steps and dispute filing rights under FCRA § 615.' },
      ],
    },
    {
      category: 'FAIR LENDING DIRECTIVE',
      stat: '80% Parity Standard',
      statColor: 'text-amber',
      q: 'What is the Four-Fifths (80%) Disparate Impact Rule and how is it audited?',
      takeaway: 'Mathematical algorithmic auditing guarantees approval rates never fall below regulatory demographic parity.',
      points: [
        { label: 'Four-Fifths Ratio', desc: 'The selection rate for any protected demographic cohort must exceed 80% of the reference demographic benchmark.' },
        { label: 'Macro Stress Testing', desc: 'Injects simulated macroeconomic shocks (+300 bps interest rate hikes and unemployment spikes) to verify portfolio resilience.' },
        { label: 'Automated Circuit Breaker', desc: 'Models that fail the Adverse Impact Ratio (AIR < 0.80) are instantly flagged and quarantined for human committee review.' },
      ],
    },
    {
      category: 'ENTERPRISE ARCHITECTURE',
      stat: 'Sub-2s Real-Time',
      statColor: 'text-sky-400',
      q: 'What architecture and technologies power this platform end-to-end?',
      takeaway: 'High-throughput modern reactive stack engineered for sub-second risk intelligence and high client privacy.',
      points: [
        { label: 'Frontend Interface', desc: 'React 18, TypeScript, Tailwind CSS, high-contrast dark horizon lighting, and dual-sync local storage.' },
        { label: 'Decision Engine', desc: 'Python, FastAPI, LightGBM calibrated with Optuna hyperparameter optimization, and TreeSHAP explainability.' },
        { label: 'Database & Security', desc: 'High-speed relational storage with Write-Ahead Logging (WAL) and client-side cryptographic state verification.' },
      ],
    },
  ];

  return (
    <div className="about-page-container">
      <div className="page-header-wrap reveal-on-scroll">
        <h1>About FinRisk</h1>
        <p>
          An enterprise-grade financial intelligence platform bridging quantitative machine learning,
          stateful multi-agent orchestration, and global banking regulatory compliance.
        </p>
      </div>

      <TextMarquee
        phrases={[
          'Transparent Credit',
          'Five Agent Layers',
          'Basel III / IV',
          '12 CFR § 1002.9',
          'Auditable By Design',
          'Built For Borrowers',
        ]}
      />

      {/* Open stat band — no tiles */}
      <div className="about-stats-grid reveal-on-scroll">
        <div className="about-stat-card">
          <span className="stat-num text-emerald-400">0 Score Impact</span>
          <span className="stat-label">100% Soft Inquiry Simulation</span>
          <p className="stat-desc">Zero credit bureau inquiries — test your true credit terms without penalty.</p>
        </div>

        <div className="about-stat-card">
          <span className="stat-num text-sky">12 CFR § 1002.9</span>
          <span className="stat-label">Mandatory Adverse Action Rules</span>
          <p className="stat-desc">Full legal disclosure of the top financial factors behind every decision.</p>
        </div>

        <div className="about-stat-card">
          <span className="stat-num text-amber">80% Four-Fifths</span>
          <span className="stat-label">Fair Lending Non-Bias Standard</span>
          <p className="stat-desc">Continuous disparate impact testing to eliminate algorithmic discrimination.</p>
        </div>

        <div className="about-stat-card">
          <span className="stat-num text-sky-400">5 Autonomous Layers</span>
          <span className="stat-label">Multi-Stage Agent Pipeline</span>
          <p className="stat-desc">Deterministic separation of duties across specialized financial AI agents.</p>
        </div>
      </div>

      {/* Core mission written across the page, alternating with imagery */}
      <section className="about-story reveal-on-scroll">
        <div className="section-title-wrap reveal-on-scroll">
          <h2>Core Mission: Transparent & Equitable Credit</h2>
          <p>Overcoming the legacy banking flaws that leave everyday borrowers disempowered.</p>
        </div>

        {story.map((row, idx) => (
          <article key={row.index} className={`story-row ${idx % 2 === 1 ? 'reverse' : ''}`}>
            <div className="story-copy">
              <span className="story-index">{row.index}</span>
              <span className="story-kicker">{row.kicker}</span>
              <h3>{row.title}</h3>
              <p>{row.body}</p>
              <div className="story-note">
                <CheckCircle2 size={15} className="text-sky" />
                <span>{row.note}</span>
              </div>
            </div>

            <figure className="story-figure">
              <img src={row.img} alt={row.alt} loading="lazy" />
              <figcaption>{row.caption}</figcaption>
            </figure>
          </article>
        ))}
      </section>

      {/* Autonomous Multi-Agent Architecture */}
      <section className="architecture-showcase-section my-10 reveal-on-scroll">
        <AgentArchitectureFlow />
      </section>

      <figure className="about-banner reveal-on-scroll">
        <img
          src="/images/compliance-desk.jpg"
          alt="Regulatory documents, seal and magnifying glass on a desk"
          loading="lazy"
        />
      </figure>

      {/* Technical & Compliance Deep Dives: open editorial, no cards */}
      <div className="faq-section reveal-on-scroll">
        <div className="section-title-wrap">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Technical & Compliance Deep Dives
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto mt-2">
            Detailed insights into our regulatory calibration, algorithmic auditing, and privacy standards.
          </p>
        </div>

        <div className="deep-dives-grid">
          {deepDives.map((item, idx) => (
            <div key={idx} className={`deep-dive-card reveal-on-scroll stagger-${(idx % 4) + 1}`}>
              <div className="deep-dive-top-bar">
                <span className="deep-dive-category-chip">{item.category}</span>
              </div>

              <h3 className="deep-dive-question">{item.q}</h3>

              <div className="deep-dive-takeaway-box">
                <div className="takeaway-indicator" />
                <p className="takeaway-text">{item.takeaway}</p>
              </div>

              <div className="deep-dive-points-list">
                {item.points.map((pt, pIdx) => (
                  <div key={pIdx} className="deep-dive-point-item">
                    <div className="point-icon-col">
                      <CheckCircle2 size={16} className="text-neonlime flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="point-content-col">
                      <span className="point-label">{pt.label}:</span>{' '}
                      <span className="point-desc">{pt.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
