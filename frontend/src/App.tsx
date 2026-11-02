import React, { useState, useEffect } from 'react';
import {
  ApplicantInput,
  UnderwritingResponse,
  submitUnderwriting,
} from './services/api';
import { jsDatabase, SavedEvaluation } from './services/db';
import { HomePage } from './pages/HomePage';
import { EligibilityPage } from './pages/EligibilityPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { RegulationsPage } from './pages/RegulationsPage';
import { AboutPage } from './pages/AboutPage';
import { HistoryPage } from './pages/HistoryPage';
import { CreditMemoModal } from './components/CreditMemoModal';
import { RAGExplorerModal } from './components/RAGExplorerModal';
import { useScrollProgress } from './hooks/useScrollProgress';
import {
  Home,
  CheckCircle,
  Calculator,
  BookOpen,
  Database,
  Info,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X,
  Scale,
  Activity,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollProgress } = useScrollProgress();

  const [applicant, setApplicant] = useState<ApplicantInput>({
    Age: 32,
    Income: 850000,
    LoanAmount: 300000,
    CreditScore: 720,
    MonthsEmployed: 48,
    NumCreditLines: 4,
    InterestRate: 10.5,
    LoanTerm: 36,
    DTIRatio: 0.28,
    Education: "Bachelor's",
    EmploymentType: 'Full-time',
    MaritalStatus: 'Single',
    HasMortgage: 'No',
    HasDependents: 'No',
    LoanPurpose: 'Auto',
    HasCoSigner: 'No',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<UnderwritingResponse['data'] | null>(null);

  // Modals
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [isRAGOpen, setIsRAGOpen] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<SavedEvaluation[]>([]);

  // Load history from JS Database on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const list = await jsDatabase.getAllEvaluations();
    setHistoryRecords(list);
  };

  const handleUnderwrite = async () => {
    setIsLoading(true);
    try {
      const resp = await submitUnderwriting(applicant);
      setResults(resp.data);

      // Save to client-side JS Database
      const record: SavedEvaluation = {
        id: resp.application_id,
        applicantName: `Applicant (FICO ${applicant.CreditScore})`,
        creditScore: applicant.CreditScore,
        income: applicant.Income,
        loanAmount: applicant.LoanAmount,
        dtiRatio: applicant.DTIRatio,
        pdPercent: resp.data.ml_risk_assessment.pd_percent,
        ratingGrade: resp.data.ml_risk_assessment.rating_grade,
        expectedLoss: resp.data.ml_risk_assessment.expected_loss_usd,
        decision: resp.data.credit_committee_synthesis.final_decision,
        recommendedApr: resp.data.credit_committee_synthesis.recommended_apr,
        timestamp: new Date().toISOString(),
        state: resp.data,
      };
      await jsDatabase.saveEvaluation(record);
      await loadHistory();

      // Trigger celebration on approval
      if (resp.data.credit_committee_synthesis.final_decision === 'APPROVED') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (rec: SavedEvaluation) => {
    if (rec.state) {
      setResults(rec.state);
      setApplicant(rec.state.applicant_data);
      setActivePage('eligibility');
    }
  };

  const handleDeleteHistory = async (id: string) => {
    await jsDatabase.deleteEvaluation(id);
    await loadHistory();
  };

  const handleClearAllHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history records from IndexedDB?')) {
      for (const rec of historyRecords) {
        await jsDatabase.deleteEvaluation(rec.id);
      }
      await loadHistory();
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={16} /> },
    { id: 'eligibility', label: 'Eligibility Checker', icon: <CheckCircle size={16} /> },
    { id: 'calculator', label: 'Loan Calculator', icon: <Calculator size={16} /> },
    { id: 'regulations', label: 'Borrower Rights & Laws', icon: <Scale size={16} /> },
    { id: 'history', label: `Audit Database (${historyRecords.length})`, icon: <Database size={16} /> },
    { id: 'about', label: 'About & Governance', icon: <Info size={16} /> },
  ];

  return (
    <div className="app-layout">
      {/* Scroll Progress Bar at Very Top of Screen */}
      <div className="scroll-progress-line" style={{ width: `${scrollProgress}%` }} />

      {/* Top Header Navigation with Ultra-Glass Effect */}
      <header className="navbar glass-header">
        <div className="navbar-left">
          <div
            className="brand-logo"
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="brand-crest-box bg-lime-tint">
              <ShieldCheck size={22} className="text-neonlime" />
            </div>
            <div className="brand-text">
              <h1>FinRisk</h1>
              <span className="brand-tag">Credit Intelligence</span>
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="navbar-center desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`nav-link ${activePage === item.id ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
              {activePage === item.id && <span className="nav-active-glow-dot" />}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="navbar-right">
          <button
            onClick={() => setIsRAGOpen(true)}
            className="nav-btn btn-search-rag"
            title="Search Consumer Credit Laws"
          >
            <Search size={15} /> <span>Query Law</span>
          </button>

          {results && (
            <button
              onClick={() => setIsMemoOpen(true)}
              className="nav-btn btn-memo"
              title="View Credit Memo"
            >
              <FileText size={15} /> <span>Credit Memo</span>
            </button>
          )}

          {activePage !== 'eligibility' && (
            <button
              onClick={() => {
                setActivePage('eligibility');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="nav-btn btn-cta"
            >
              <Sparkles size={15} /> <span>Check Eligibility</span>
            </button>
          )}

          {/* Professional Executive Menu Control Box */}
          <button
            className={`pro-menu-box ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Control Box"
            title="Navigation Suite"
          >
            <div className="pro-menu-icon">
              <span className="pro-bar pro-bar-1"></span>
              <span className="pro-bar pro-bar-2"></span>
              <span className="pro-bar pro-bar-3"></span>
            </div>
            <span className="pro-menu-label">{mobileMenuOpen ? 'Close' : 'Menu'}</span>
            <span className="pro-menu-indicator"></span>
          </button>
        </div>
      </header>

      {/* Floating Executive Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="pro-nav-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="pro-nav-drawer-card" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="flex items-center gap-2.5">
                <div className="brand-crest-box-sm">
                  <ShieldCheck size={20} className="text-neonlime" />
                </div>
                <div>
                  <h4 className="drawer-title">FinRisk</h4>
                  <span className="drawer-sub">Credit Intelligence Suite</span>
                </div>
              </div>
              <button
                className="drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="drawer-section-label">Navigation Suite</div>
            <div className="drawer-nav-links">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`drawer-link ${activePage === item.id ? 'active' : ''}`}
                >
                  <div className="drawer-link-icon">{item.icon}</div>
                  <span className="drawer-link-text">{item.label}</span>
                  {activePage === item.id && <span className="drawer-active-dot"></span>}
                </button>
              ))}
            </div>

            <div className="drawer-section-label">Quick Actions</div>
            <div className="drawer-actions-grid">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsRAGOpen(true);
                }}
                className="drawer-action-btn btn-action-rag"
              >
                <Search size={15} /> <span>Query Laws</span>
              </button>

              <button
                onClick={() => {
                  setActivePage('eligibility');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="drawer-action-btn btn-action-check"
              >
                <Sparkles size={15} /> <span>Check Rate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Multi-Page Switcher */}
      <main className="page-body">
        {activePage === 'home' && <HomePage onNavigate={(p) => setActivePage(p)} />}

        {activePage === 'eligibility' && (
          <EligibilityPage
            applicant={applicant}
            setApplicant={setApplicant}
            results={results}
            isLoading={isLoading}
            onUnderwrite={handleUnderwrite}
            onOpenMemo={() => setIsMemoOpen(true)}
          />
        )}

        {activePage === 'calculator' && (
          <CalculatorPage onNavigate={(p) => setActivePage(p)} />
        )}

        {activePage === 'regulations' && <RegulationsPage />}

        {activePage === 'history' && (
          <HistoryPage
            records={historyRecords}
            onSelectRecord={handleSelectHistory}
            onDeleteRecord={handleDeleteHistory}
            onClearAll={handleClearAllHistory}
          />
        )}

        {activePage === 'about' && <AboutPage />}
      </main>

      {/* Clean Professional Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-top-row">
            <div className="footer-brand">
              <div className="flex items-center gap-2">
                <div className="brand-crest-box-sm">
                  <ShieldCheck size={18} className="text-neonlime" />
                </div>
                <span className="footer-brand-title">FinRisk Intelligence</span>
              </div>
              <p className="footer-tagline">
                Empowering borrowers with transparent pre-qualification, unbiased AI risk assessment,
                and actionable roadmaps to secure the best borrowing terms.
              </p>
            </div>

            <div className="footer-links-group">
              <span className="footer-links-title">Platform</span>
              <button onClick={() => setActivePage('home')}>Home Overview</button>
              <button onClick={() => setActivePage('eligibility')}>Eligibility Engine</button>
              <button onClick={() => setActivePage('calculator')}>EMI Calculator</button>
            </div>

            <div className="footer-links-group">
              <span className="footer-links-title">Compliance & Rights</span>
              <button onClick={() => setActivePage('regulations')}>Borrower Rights & Laws</button>
              <button onClick={() => setActivePage('about')}>System Governance & FAQ</button>
              <button onClick={() => setActivePage('history')}>Audit Trail</button>
            </div>

            <div className="footer-links-group">
              <span className="footer-links-title">Open Source</span>
              <a
                href="https://github.com/niraj987/Credit-Risk-Modeling"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
              <span className="version-pill">Version 2.3.0 • Production</span>
            </div>
          </div>

          <div className="footer-bottom-row">
            <p className="disclaimer-text">
              <b>Consumer Notice:</b> FinRisk AI is an educational pre-qualification platform designed to provide
              transparent credit analysis under the Equal Credit Opportunity Act (ECOA 12 CFR § 1002.9) and the Fair Credit
              Reporting Act (FCRA). Pre-qualification assessments use soft evaluations with zero impact on credit bureau scores.
            </p>
            <p className="copyright-text">
              © {new Date().getFullYear()} FinRisk AI • MIT Licensed • Ethical & Transparent Underwriting
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreditMemoModal
        isOpen={isMemoOpen}
        onClose={() => setIsMemoOpen(false)}
        memo={results?.credit_committee_synthesis?.credit_memo || ''}
        decision={results?.credit_committee_synthesis?.final_decision || 'PENDING'}
        pdPercent={results?.ml_risk_assessment?.pd_percent || 0}
        expectedLoss={results?.ml_risk_assessment?.expected_loss_usd || 0}
        recommendedApr={results?.credit_committee_synthesis?.recommended_apr || 0}
        covenants={results?.credit_committee_synthesis?.covenants || []}
        adverseReasons={results?.credit_committee_synthesis?.adverse_action_reasons || []}
      />

      <RAGExplorerModal
        isOpen={isRAGOpen}
        onClose={() => setIsRAGOpen(false)}
      />
    </div>
  );
};
