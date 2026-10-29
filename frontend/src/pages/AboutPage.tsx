import React from 'react';
import { ShieldCheck, Cpu, BookOpen, Scale, Award, Code, Github, Terminal, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const faqs = [
    {
      q: 'Why was this system designed with 5 Multi-Agent layers rather than a single model?',
      a: 'In Tier-1 banking, credit underwriting is never a single score. It requires independent separation of duties: identity verification (KYC), quantitative credit risk modeling, regulatory policy reconciliation, fair lending disparate impact auditing, and senior credit committee sign-off. A multi-agent DAG (orchestrated with LangGraph) provides full state immutability, audit logging, and regulatory compliance at every step.',
    },
    {
      q: 'How does the platform ensure compliance with Equal Credit Opportunity Act (ECOA)?',
      a: 'Under 12 CFR § 1002.9, whenever a loan is denied or conditionally modified, lenders must state the top 4 principal reasons. Our Layer 3 Regulatory RAG Agent indexes the statutory handbook, while Layer 2 extracts SHAP feature attribution vectors to generate auditable reason codes automatically.',
    },
    {
      q: 'What is the Four-Fifths (80%) Rule tested in Layer 4?',
      a: 'The Four-Fifths Rule is an established regulatory standard under ECOA and EEOC. It mandates that the selection/approval rate for any demographic cohort cannot fall below 80% of the highest-performing reference cohort: AIR = Rate(Protected) / Rate(Reference) >= 0.80. If an underwriting model violates this threshold, it triggers mandatory review.',
    },
    {
      q: 'What technologies power this platform end-to-end?',
      a: 'The frontend is built with React 18, TypeScript, Three.js for 3D risk visualization, and client-side IndexedDB for offline persistence. The backend is built with FastAPI, LangGraph for stateful agent orchestration, LightGBM with Optuna tuning for credit default prediction, and SHAP for explainable AI.',
    },
  ];

  return (
    <div className="about-page-container">
      <div className="page-header-wrap">
        <div className="page-badge badge-blue">
          <Terminal size={14} className="text-blue-400" />
          <span>System Architecture & Governance</span>
        </div>
        <h1>About Personal Loan Eligibility Checker</h1>
        <p>
          An enterprise-grade financial intelligence platform bridging quantitative machine learning,
          stateful multi-agent orchestration, and global banking regulatory compliance.
        </p>
      </div>

      {/* Core Mission Banner */}
      <div className="mission-card">
        <h2>Executive Mission: Transparent & Equitable Credit</h2>
        <p>
          Traditional consumer credit models act as opaque "black boxes," leaving borrowers confused
          by unexpected denials and exposing lenders to regulatory enforcement actions under the Equal
          Credit Opportunity Act (ECOA) and Basel Committee standards.
        </p>
        <p>
          <b>Personal Loan Eligibility Checker</b> re-architects the underwriting process into a
          collaborative 5-agent committee. Every approval, conditional offer, or adverse action notice
          is backed by quantitative mathematical modeling, verified against regulatory policy manuals,
          and accompanied by actionable counterfactual improvement steps.
        </p>
      </div>

      {/* 5-Agent Layer Breakdown */}
      <div className="architecture-section">
        <h3>Autonomous Multi-Agent Architecture (LangGraph Flow)</h3>
        <div className="arch-flow-grid">
          <div className="arch-step-box">
            <div className="step-num-tag">Layer 1</div>
            <h4>KYC & Anomaly Agent</h4>
            <p>Sanity-checks borrower profile, checks debt leverage ratios, detects synthetic identities.</p>
          </div>
          <div className="arch-arrow">&rarr;</div>
          <div className="arch-step-box">
            <div className="step-num-tag">Layer 2</div>
            <h4>Quantitative ML Agent</h4>
            <p>Computes calibrated Default Probability (PD), Basel Expected Loss, and SHAP vectors.</p>
          </div>
          <div className="arch-arrow">&rarr;</div>
          <div className="arch-step-box">
            <div className="step-num-tag">Layer 3</div>
            <h4>Regulatory RAG Agent</h4>
            <p>Indexes Basel III/IV IRB and ECOA Regulation B for statutory citation extraction.</p>
          </div>
          <div className="arch-arrow">&rarr;</div>
          <div className="arch-step-box">
            <div className="step-num-tag">Layer 4</div>
            <h4>Fair Lending & Stress</h4>
            <p>Audits the Four-Fifths AIR rule and simulates CCAR +300 bps macroeconomic rate shocks.</p>
          </div>
          <div className="arch-arrow">&rarr;</div>
          <div className="arch-step-box highlight-step">
            <div className="step-num-tag">Layer 5</div>
            <h4>Credit Committee</h4>
            <p>Synthesizes final decision, Risk-Adjusted APR pricing (RAROC), and Credit Memo.</p>
          </div>
        </div>
      </div>

      {/* Technical FAQ Section */}
      <div className="faq-section">
        <h3>Technical & Compliance Deep Dives</h3>
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
