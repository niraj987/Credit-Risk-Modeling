import React, { useState } from 'react';
import { Calculator, ArrowRight, DollarSign, Calendar, Percent, CheckCircle } from 'lucide-react';

interface CalculatorPageProps {
  onNavigate: (page: string) => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ onNavigate }) => {
  const [loanAmount, setLoanAmount] = useState<number>(25000);
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [loanTerm, setLoanTerm] = useState<number>(36);

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRate / 100 / 12;
  const emi = Math.round(
    monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
        (Math.pow(1 + monthlyRate, loanTerm) - 1)
      : loanAmount / loanTerm
  );

  const totalPayment = emi * loanTerm;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  // Amortization Table (first 12 months)
  const schedule = [];
  let balance = loanAmount;
  for (let m = 1; m <= Math.min(12, loanTerm); m++) {
    const interestPart = Math.round(balance * monthlyRate);
    const principalPart = Math.min(balance, emi - interestPart);
    const endBalance = Math.max(0, balance - principalPart);
    schedule.push({
      month: m,
      startBalance: balance,
      principal: principalPart,
      interest: interestPart,
      endBalance,
    });
    balance = endBalance;
  }

  // Tier Comparison Matrix
  const computeTierEmi = (rate: number) => {
    const r = rate / 100 / 12;
    return Math.round(
      (loanAmount * r * Math.pow(1 + r, loanTerm)) / (Math.pow(1 + r, loanTerm) - 1)
    );
  };

  const primeEmi = computeTierEmi(6.5);
  const nearPrimeEmi = computeTierEmi(11.5);
  const subprimeEmi = computeTierEmi(19.0);

  const primeTotalInterest = Math.round(primeEmi * loanTerm - loanAmount);
  const subprimeTotalInterest = Math.round(subprimeEmi * loanTerm - loanAmount);
  const potentialSavings = Math.max(0, subprimeTotalInterest - primeTotalInterest);

  return (
    <div className="calculator-page-container">
      <div className="page-header-wrap">
        <div className="page-badge">
          <Calculator size={14} className="text-cyan-400" />
          <span>Interactive Loan Estimator</span>
        </div>
        <h1>Personal Loan EMI & Amortization Calculator</h1>
        <p>
          Simulate monthly repayments, total interest obligations, and explore how your
          underwriting tier directly impacts lifetime borrowing costs.
        </p>
      </div>

      <div className="calc-main-grid">
        {/* Left Inputs Card */}
        <div className="calc-input-panel">
          <h3 className="panel-title">Loan Parameters</h3>

          <div className="calc-field-group">
            <div className="field-top-row">
              <label>Loan Amount</label>
              <span className="field-val">${loanAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-ticks">
              <span>$1,000</span>
              <span>$50,000</span>
              <span>$100,000</span>
            </div>
          </div>

          <div className="calc-field-group">
            <div className="field-top-row">
              <label>Interest Rate (APR)</label>
              <span className="field-val">{interestRate}%</span>
            </div>
            <input
              type="range"
              min={3.5}
              max={32.0}
              step={0.5}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-ticks">
              <span>3.5% (Prime)</span>
              <span>15.0%</span>
              <span>32.0% (Subprime)</span>
            </div>
          </div>

          <div className="calc-field-group">
            <div className="field-top-row">
              <label>Loan Term</label>
              <span className="field-val">{loanTerm} Months</span>
            </div>
            <div className="term-selector-pills">
              {[12, 24, 36, 48, 60].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`term-pill ${loanTerm === t ? 'active' : ''}`}
                  onClick={() => setLoanTerm(t)}
                >
                  {t} mo ({(t / 12).toFixed(0)} yr)
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('eligibility')}
            className="calc-cta-btn"
          >
            Check Real Eligibility with This Loan <ArrowRight size={16} />
          </button>
        </div>

        {/* Right Summary Card */}
        <div className="calc-summary-panel">
          <h3 className="panel-title">Repayment Summary</h3>

          <div className="big-emi-card">
            <span className="emi-lbl">Estimated Monthly Repayment</span>
            <div className="emi-val">${emi.toLocaleString()}</div>
            <span className="emi-sub">Due monthly over {loanTerm} installments</span>
          </div>

          <div className="breakdown-grid">
            <div className="breakdown-item">
              <span className="item-lbl">Principal Borrowed</span>
              <span className="item-val">${loanAmount.toLocaleString()}</span>
            </div>
            <div className="breakdown-item">
              <span className="item-lbl">Total Interest Payable</span>
              <span className="item-val text-amber">${totalInterest.toLocaleString()}</span>
            </div>
            <div className="breakdown-item">
              <span className="item-lbl">Total Lifetime Cost</span>
              <span className="item-val text-cyan">${totalPayment.toLocaleString()}</span>
            </div>
          </div>

          {/* Tier Comparison Card */}
          <div className="tier-savings-box">
            <h4>💡 Why Credit Tiers Matter</h4>
            <p>
              Qualifying for <b>Tier 1 (Prime)</b> instead of Tier 3/4 saves you up to{' '}
              <b className="text-emerald-400">${potentialSavings.toLocaleString()}</b> in total interest
              over the life of this loan!
            </p>
          </div>
        </div>
      </div>

      {/* Credit Tier Comparison Matrix */}
      <div className="tier-matrix-section">
        <h3>Rate Comparison Across Credit Underwriting Tiers</h3>
        <div className="tier-cards-row">
          <div className="tier-col-card tier-prime">
            <span className="tier-tag">Prime (Score 720+)</span>
            <div className="tier-rate">6.5% APR</div>
            <div className="tier-monthly">${primeEmi.toLocaleString()}/mo</div>
            <div className="tier-interest">Total Interest: ${primeTotalInterest.toLocaleString()}</div>
            <div className="tier-feat">✅ Instant Approval Corridor</div>
          </div>

          <div className="tier-col-card tier-near">
            <span className="tier-tag">Near-Prime (Score 660-719)</span>
            <div className="tier-rate">11.5% APR</div>
            <div className="tier-monthly">${nearPrimeEmi.toLocaleString()}/mo</div>
            <div className="tier-interest">Total Interest: ${Math.round(nearPrimeEmi * loanTerm - loanAmount).toLocaleString()}</div>
            <div className="tier-feat">⚡ Conditional Approval</div>
          </div>

          <div className="tier-col-card tier-sub">
            <span className="tier-tag">Subprime (Score &lt;660)</span>
            <div className="tier-rate">19.0% APR</div>
            <div className="tier-monthly">${subprimeEmi.toLocaleString()}/mo</div>
            <div className="tier-interest">Total Interest: ${subprimeTotalInterest.toLocaleString()}</div>
            <div className="tier-feat">⚠️ Co-Signer Covenant Required</div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Preview */}
      <div className="schedule-table-card">
        <h3>First 12 Months Amortization Schedule</h3>
        <div className="table-responsive">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Starting Balance</th>
                <th>Principal Paid</th>
                <th>Interest Paid</th>
                <th>Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.month}>
                  <td>Month {row.month}</td>
                  <td>${row.startBalance.toLocaleString()}</td>
                  <td className="text-emerald-400">+${row.principal.toLocaleString()}</td>
                  <td className="text-amber-400">${row.interest.toLocaleString()}</td>
                  <td>${row.endBalance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
