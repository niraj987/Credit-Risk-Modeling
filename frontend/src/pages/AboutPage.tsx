import React from 'react';
import { AgentArchitectureFlow } from '../components/AgentArchitectureFlow';
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
      statColor: 'text-purple-400',
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

      {/* High-Impact Stat Highlights with Scroll Transition */}
      <div className="about-stats-grid reveal-on-scroll">
        <div className="about-stat-card reveal-on-scroll stagger-1">
          <span className="stat-num text-emerald-400">0 Score Impact</span>
          <span className="stat-label">100% Soft Inquiry Simulation</span>
          <p className="stat-desc">Zero credit bureau inquiries — test your true credit terms without penalty.</p>
        </div>

        <div className="about-stat-card reveal-on-scroll stagger-2">
          <span className="stat-num text-sky">12 CFR § 1002.9</span>
          <span className="stat-label">Mandatory Adverse Action Rules</span>
          <p className="stat-desc">Full legal disclosure of the top financial factors behind every decision.</p>
        </div>

        <div className="about-stat-card reveal-on-scroll stagger-3">
          <span className="stat-num text-amber">80% Four-Fifths</span>
          <span className="stat-label">Fair Lending Non-Bias Standard</span>
          <p className="stat-desc">Continuous disparate impact testing to eliminate algorithmic discrimination.</p>
        </div>

        <div className="about-stat-card reveal-on-scroll stagger-4">
          <span className="stat-num text-purple-400">5 Autonomous Layers</span>
          <span className="stat-label">Multi-Stage Agent Pipeline</span>
          <p className="stat-desc">Deterministic separation of duties across specialized financial AI agents.</p>
        </div>
      </div>

      {/* Core Mission Bento Grid with Scroll Transition */}
      <div className="about-bento-section reveal-on-scroll">
        <div className="section-title-wrap reveal-on-scroll">
          <h2>Core Mission: Transparent & Equitable Credit</h2>
          <p>Overcoming the legacy banking flaws that leave everyday borrowers disempowered.</p>
        </div>

        <div className="about-bento-grid">
          {/* Card 1: Rejection Transparency */}
          <div className="bento-card bento-sky reveal-on-scroll stagger-1">
            <div className="bento-top">
              <div className="bento-icon-box bg-sky-tint">
                <ShieldCheck size={24} className="text-sky" />
              </div>
              <span className="bento-badge">Borrower Sovereignty</span>
            </div>
            <h3>Eliminating the "Black Box" Rejection</h3>
            <p>
              Traditional banking algorithms reject applicants without actionable explanation, triggering anxiety and confusion.
              We translate machine learning SHAP attribution vectors into transparent, statutory reason codes so borrowers know exactly where they stand.
            </p>
            <div className="bento-footer-highlight">
              <CheckCircle2 size={15} className="text-sky" />
              <span>Mandatory top-4 reason code breakdown under Federal Regulation B.</span>
            </div>
          </div>

          {/* Card 2: Actuarial Rigor */}
          <div className="bento-card bento-emerald reveal-on-scroll stagger-2">
            <div className="bento-top">
              <div className="bento-icon-box bg-emerald-tint">
                <Scale size={24} className="text-emerald-400" />
              </div>
              <span className="bento-badge">Basel III & IV Solvency</span>
            </div>
            <h3>Actuarial Precision, Not Arbitrary Markups</h3>
            <p>
              Rather than inflated lender profit margins, every interest rate is mathematically calibrated against
              1-Year Default Probability (PD) and Basel Expected Loss formulas, ensuring fair and risk-aligned borrowing costs.
            </p>
            <div className="bento-footer-highlight">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Formula: Expected Loss = PD × Exposure at Default × Loss Given Default.</span>
            </div>
          </div>

          {/* Card 3: Non-Bias */}
          <div className="bento-card bento-rose reveal-on-scroll stagger-3">
            <div className="bento-top">
              <div className="bento-icon-box bg-rose-tint">
                <Lock size={24} className="text-rose" />
              </div>
              <span className="bento-badge">Equal Credit Opportunity</span>
            </div>
            <h3>Proactive Algorithmic Non-Discrimination</h3>
            <p>
              AI credit systems can inadvertently amplify societal disparities. Our compliance layer actively executes
              the Four-Fifths Adverse Impact Ratio test to prove non-bias before any credit offer is finalized.
            </p>
            <div className="bento-footer-highlight">
              <CheckCircle2 size={15} className="text-rose" />
              <span>Adverse Impact Ratio maintained above 0.80 benchmark threshold.</span>
            </div>
          </div>

          {/* Card 4: Action Plan */}
          <div className="bento-card bento-amber reveal-on-scroll stagger-4">
            <div className="bento-top">
              <div className="bento-icon-box bg-amber-tint">
                <Award size={24} className="text-amber" />
              </div>
              <span className="bento-badge">Empowerment Blueprint</span>
            </div>
            <h3>Counterfactual Improvement Roadmaps</h3>
            <p>
              When a loan is conditionally approved or rejected, our system calculates the shortest financial path
              to prime qualification—showing the exact debt balance to pay down or tenure adjustment needed.
            </p>
            <div className="bento-footer-highlight">
              <CheckCircle2 size={15} className="text-amber" />
              <span>Actionable steps to lower APR by up to 1.50% and unlock higher limits.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Autonomous Multi-Agent Architecture */}
      <section className="architecture-showcase-section my-10 reveal-on-scroll">
        <AgentArchitectureFlow />
      </section>

      {/* Technical & Compliance Deep Dives: High-Hierarchy Modern Cards */}
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
              {/* Top Row: Category Tag */}
              <div className="deep-dive-top-bar">
                <span className="deep-dive-category-chip">{item.category}</span>
              </div>

              {/* Bold Question Header */}
              <h3 className="deep-dive-question">{item.q}</h3>

              {/* Executive Takeaway Box */}
              <div className="deep-dive-takeaway-box">
                <div className="takeaway-indicator" />
                <p className="takeaway-text">{item.takeaway}</p>
              </div>

              {/* Structured Point Breakdown */}
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
