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
} from 'lucide-react';
import { RiskGlobe3D } from '../components/RiskGlobe3D';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [calcAmount, setCalcAmount] = useState<number>(300000);
  const [calcTerm, setCalcTerm] = useState<number>(36);
  const [calcRate, setCalcRate] = useState<number>(10.5);

  // EMI calculation: P * r * (1+r)^n / ((1+r)^n - 1)
  const r = calcRate / 100 / 12;
  const emi = Math.round(
    r > 0
      ? (calcAmount * r * Math.pow(1 + r, calcTerm)) / (Math.pow(1 + r, calcTerm) - 1)
      : calcAmount / calcTerm
  );
  const totalPayment = emi * calcTerm;
  const totalInterest = Math.max(0, totalPayment - calcAmount);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <Sparkles size={14} className="text-cyan-400" />
            <span>Next-Gen Multi-Agent Credit Underwriting</span>
          </div>

          <h1 className="hero-headline">
            Personal Loan <br />
            <span className="gradient-text">Eligibility Checker</span>
          </h1>

          <p className="hero-description">
            Experience institutional-grade loan decisions powered by 5 collaborative
            autonomous agents. Get calibrated default probabilities, Basel III/IV expected
            losses, and 100% transparent statutory reason codes in under 2 seconds.
          </p>

          <div className="hero-cta-group">
            <button
              onClick={() => onNavigate('eligibility')}
              className="cta-primary-btn"
            >
              <span>Check Eligibility Now</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate('calculator')}
              className="cta-secondary-btn"
            >
              <Calculator size={18} />
              <span>Loan Calculator</span>
            </button>
          </div>

          <div className="hero-trust-strip">
            <div className="trust-item">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>No Hard Credit Pull</span>
            </div>
            <div className="trust-item">
              <Lock size={16} className="text-blue-400" />
              <span>12 CFR § 1002.9 Compliant</span>
            </div>
            <div className="trust-item">
              <Award size={16} className="text-amber-400" />
              <span>Basel III/IV IRB Aligned</span>
            </div>
          </div>
        </div>

        {/* Interactive 3D Globe + Quick Estimator Widget */}
        <div className="hero-interactive-card">
          <div className="mini-globe-wrap">
            <RiskGlobe3D riskScore={12} decision="APPROVED" />
          </div>

          <div className="quick-calculator-widget">
            <div className="calc-header">
              <span className="calc-title">Instant EMI Estimator</span>
              <span className="calc-rate-badge">{calcRate}% Benchmark APR</span>
            </div>

            <div className="calc-slider-group">
              <div className="calc-slider-label">
                <span>Loan Amount</span>
                <b>₹{calcAmount.toLocaleString('en-IN')}</b>
              </div>
              <input
                type="range"
                min={50000}
                max={4000000}
                step={25000}
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="slider"
              />
            </div>

            <div className="calc-slider-group">
              <div className="calc-slider-label">
                <span>Duration</span>
                <b>{calcTerm} Months ({(calcTerm / 12).toFixed(1)} yrs)</b>
              </div>
              <input
                type="range"
                min={12}
                max={60}
                step={12}
                value={calcTerm}
                onChange={(e) => setCalcTerm(Number(e.target.value))}
                className="slider"
              />
            </div>

            <div className="calc-results-strip">
              <div className="result-item">
                <span className="res-lbl">Monthly EMI</span>
                <span className="res-val text-cyan">₹{emi.toLocaleString('en-IN')}/mo</span>
              </div>
              <div className="result-item">
                <span className="res-lbl">Total Interest</span>
                <span className="res-val text-muted">₹{totalInterest.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('eligibility')}
              className="calc-apply-btn"
            >
              Verify Loan Eligibility with This Amount <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 5-Layer Multi-Agent Architecture Showcase */}
      <section className="agents-showcase-section">
        <div className="section-title-wrap">
          <span className="section-eyebrow">Enterprise Governance</span>
          <h2>The 5-Layer Multi-Agent Underwriting Committee</h2>
          <p>
            Unlike traditional black-box credit models, our system deploys specialized
            autonomous agents working in structured layers to evaluate every loan application.
          </p>
        </div>

        <div className="agents-grid">
          <div className="agent-showcase-card">
            <div className="agent-icon-box bg-cyan">
              <ShieldCheck size={24} />
            </div>
            <span className="agent-layer-num">Layer 1</span>
            <h3>KYC & Anomaly Agent</h3>
            <p>
              Performs automated data reconciliation, flags synthetic identity risks, checks
              debt-to-income spikes, and validates age-to-employment tenure plausibility.
            </p>
            <div className="agent-tag">Synthetic Identity Protection</div>
          </div>

          <div className="agent-showcase-card">
            <div className="agent-icon-box bg-blue">
              <Cpu size={24} />
            </div>
            <span className="agent-layer-num">Layer 2</span>
            <h3>Quantitative ML Risk Agent</h3>
            <p>
              Runs calibrated LightGBM default prediction models, generates granular SHAP feature
              attribution vectors, and calculates Basel III/IV Expected Loss ($EL = PD \times EAD \times LGD$).
            </p>
            <div className="agent-tag">Basel III/IV IRB Standard</div>
          </div>

          <div className="agent-showcase-card">
            <div className="agent-icon-box bg-purple">
              <BookOpen size={24} />
            </div>
            <span className="agent-layer-num">Layer 3</span>
            <h3>Regulatory RAG Agent</h3>
            <p>
              Retrieves statutory legal requirements from ECOA Regulation B (12 CFR § 1002.9),
              FCRA § 615, and internal institutional credit manuals for automatic compliance alignment.
            </p>
            <div className="agent-tag">Semantic Legal RAG</div>
          </div>

          <div className="agent-showcase-card">
            <div className="agent-icon-box bg-amber">
              <Scale size={24} />
            </div>
            <span className="agent-layer-num">Layer 4</span>
            <h3>Fair Lending & Stress Agent</h3>
            <p>
              Executes Four-Fifths (80%) Rule Adverse Impact Ratio audits and subjects the borrower
              to Federal Reserve CCAR Severely Adverse macroeconomic shock simulations (+300 bps rates).
            </p>
            <div className="agent-tag">Four-Fifths Rule & CCAR</div>
          </div>

          <div className="agent-showcase-card highlight-card">
            <div className="agent-icon-box bg-emerald">
              <Award size={24} />
            </div>
            <span className="agent-layer-num">Layer 5</span>
            <h3>Credit Committee Orchestrator</h3>
            <p>
              Synthesizes telemetry across all layers, prices risk dynamically via Risk-Adjusted Return
              on Capital (RAROC), determines loan covenants, and drafts the Credit Memorandum.
            </p>
            <div className="agent-tag">Executive Synthesis</div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="process-section">
        <div className="section-title-wrap">
          <span className="section-eyebrow">Seamless Experience</span>
          <h2>How to Check Your Eligibility</h2>
        </div>

        <div className="process-steps-grid">
          <div className="step-card">
            <div className="step-badge">01</div>
            <h4>Input Stated Profile</h4>
            <p>Enter your credit score, income, employment, and requested loan parameters, or choose a one-click preset.</p>
          </div>
          <div className="step-card">
            <div className="step-badge">02</div>
            <h4>Autonomous Inspection</h4>
            <p>Watch 5 specialized agents run identity checks, compute default probabilities, and cross-reference policy in real time.</p>
          </div>
          <div className="step-card">
            <div className="step-badge">03</div>
            <h4>Instant Decision & Rate</h4>
            <p>Receive your eligibility tier (Approved, Conditional, or Adverse Action) with a personalized risk-adjusted APR.</p>
          </div>
          <div className="step-card">
            <div className="step-badge">04</div>
            <h4>Export Credit Memo</h4>
            <p>Download the official underwriting memorandum, view counterfactual improvement steps, or search regulatory citations.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-inner">
          <div className="cta-banner-text">
            <h2>Ready to Verify Your Personal Loan Eligibility?</h2>
            <p>
              Experience transparent, AI-driven lending with zero negative impact on your credit bureau score.
            </p>
          </div>
          <button
            onClick={() => onNavigate('eligibility')}
            className="cta-primary-btn btn-large"
          >
            Launch Eligibility Checker <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};
