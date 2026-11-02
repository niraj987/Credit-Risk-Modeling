import React from 'react';
import { AgentArchitectureFlow } from '../components/AgentArchitectureFlow';
import {
  ShieldCheck,
  Cpu,
  BookOpen,
  Scale,
  Award,
  Code,
  Github,
  Terminal,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  ArrowRight,
  Database,
  Layers,
  HeartHandshake,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const faqs = [
    {
      q: 'Why was this system designed with 5 Multi-Agent layers rather than a single model?',
      a: 'In modern banking, credit underwriting is never a single score. It requires independent separation of duties: identity verification (KYC), quantitative credit risk modeling, regulatory policy reconciliation, fair lending disparate impact auditing, and senior credit committee sign-off. A multi-agent DAG (orchestrated with LangGraph) provides full state immutability, audit logging, and regulatory compliance at every step.',
    },
    {
      q: 'How does the platform ensure compliance with Equal Credit Opportunity Act (ECOA)?',
      a: 'Under 12 CFR § 1002.9, whenever a loan is denied or conditionally modified, lenders must state the top 4 principal reasons. Our Layer 3 Regulatory RAG Agent indexes the statutory handbook, while Layer 2 extracts SHAP feature attribution vectors to generate auditable reason codes automatically.',
    },
    {
      q: 'What is the Four-Fifths (80%) Rule tested in Layer 4?',
      a: 'The Four-Fifths Rule is an established regulatory standard under ECOA and EEOC. It mandates that the selection/approval rate for any demographic cohort cannot fall below 80% of the highest-performing reference cohort: AIR = Rate(Protected) / Rate(Reference) >= 0.80. If an underwriting model violates this threshold, it triggers mandatory algorithmic review.',
    },
    {
      q: 'What technologies power this platform end-to-end?',
      a: 'The frontend is engineered with React 18, TypeScript, Tailwind CSS, executive glass risk telemetry, and client-side IndexedDB with dual-sync. The backend is built with Python, FastAPI, SQLite with WAL (Write-Ahead Logging) mode and PostgreSQL compatibility, LangGraph for stateful 5-layer agent orchestration, LightGBM with Optuna tuning for credit default prediction, and SHAP for explainable AI.',
    },
  ];

  return (
    <div className="about-page-container animate-fade-in-up">
      <div className="page-header-wrap">
        <div className="page-badge badge-blue">
          <Terminal size={14} className="text-blue-400" />
          <span>System Architecture & Governance</span>
        </div>
        <h1>About FinRisk AI Underwriting</h1>
        <p>
          An enterprise-grade financial intelligence platform bridging quantitative machine learning,
          stateful multi-agent orchestration, and global banking regulatory compliance.
        </p>
      </div>

      {/* High-Impact Stat Highlights */}
      <div className="about-stats-grid">
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
          <span className="stat-num text-purple-400">5 Autonomous Layers</span>
          <span className="stat-label">LangGraph State Orchestration</span>
          <p className="stat-desc">Deterministic separation of duties across specialized financial AI agents.</p>
        </div>
      </div>

      {/* Core Mission Bento Grid */}
      <div className="about-bento-section">
        <div className="section-title-wrap">
          <h2>Core Mission: Transparent & Equitable Credit</h2>
          <p>Overcoming the legacy banking flaws that leave everyday borrowers disempowered.</p>
        </div>

        <div className="about-bento-grid">
          {/* Card 1: Rejection Transparency */}
          <div className="bento-card bento-sky">
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
          <div className="bento-card bento-emerald">
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
          <div className="bento-card bento-rose">
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
          <div className="bento-card bento-amber">
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

      {/* Autonomous Multi-Agent Architecture (LangGraph Flow) */}
      <section className="architecture-showcase-section my-10">
        <AgentArchitectureFlow />
      </section>

      {/* Technical FAQ Section */}
      <div className="faq-section">
        <div className="section-title-wrap">
          <h3>Technical & Compliance Deep Dives</h3>
          <p>Detailed insights into our regulatory calibration, algorithmic auditing, and privacy standards.</p>
        </div>

        <div className="faq-grid">
          {faqs.map((f, i) => (
            <div key={i} className="faq-card">
              <h4>
                <CheckCircle2 size={16} className="text-emerald-400" />
                {f.q}
              </h4>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Source / GitHub Footer Card */}
      <div className="github-card">
        <div className="github-info">
          <Github size={28} className="text-white" />
          <div>
            <h4>Open Source Financial Engineering Project</h4>
            <p>Explore the full source code, Python multi-agent package, and test suite on GitHub.</p>
          </div>
        </div>
        <a
          href="https://github.com/niraj987/Credit-Risk-Modeling"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link-btn"
        >
          View Repository <Github size={16} />
        </a>
      </div>
    </div>
  );
};
