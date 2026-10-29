import React from 'react';
import { ApplicantInput } from '../services/api';
import { Play, Sparkles } from 'lucide-react';

interface ApplicantFormProps {
  input: ApplicantInput;
  onChange: (newInput: ApplicantInput) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ApplicantForm: React.FC<ApplicantFormProps> = ({
  input,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const handlePreset = (presetType: string) => {
    if (presetType === 'prime') {
      onChange({
        Age: 38,
        Income: 1800000,
        LoanAmount: 500000,
        CreditScore: 785,
        MonthsEmployed: 84,
        NumCreditLines: 5,
        InterestRate: 9.5,
        LoanTerm: 36,
        DTIRatio: 0.18,
        Education: "Master's",
        EmploymentType: 'Full-time',
        MaritalStatus: 'Married',
        HasMortgage: 'Yes',
        HasDependents: 'No',
        LoanPurpose: 'Home',
        HasCoSigner: 'No',
      });
    } else if (presetType === 'near_prime') {
      onChange({
        Age: 30,
        Income: 750000,
        LoanAmount: 350000,
        CreditScore: 685,
        MonthsEmployed: 36,
        NumCreditLines: 4,
        InterestRate: 13.5,
        LoanTerm: 36,
        DTIRatio: 0.38,
        Education: "Bachelor's",
        EmploymentType: 'Full-time',
        MaritalStatus: 'Single',
        HasMortgage: 'No',
        HasDependents: 'No',
        LoanPurpose: 'Auto',
        HasCoSigner: 'Yes',
      });
    } else if (presetType === 'subprime') {
      onChange({
        Age: 26,
        Income: 360000,
        LoanAmount: 400000,
        CreditScore: 575,
        MonthsEmployed: 10,
        NumCreditLines: 6,
        InterestRate: 22.0,
        LoanTerm: 48,
        DTIRatio: 0.58,
        Education: 'High School',
        EmploymentType: 'Part-time',
        MaritalStatus: 'Single',
        HasMortgage: 'No',
        HasDependents: 'Yes',
        LoanPurpose: 'Other',
        HasCoSigner: 'No',
      });
    } else if (presetType === 'kyc_flag') {
      onChange({
        Age: 20,
        Income: 1500000,
        LoanAmount: 800000,
        CreditScore: 680,
        MonthsEmployed: 180,
        NumCreditLines: 5,
        InterestRate: 12.0,
        LoanTerm: 36,
        DTIRatio: 0.35,
        Education: "Bachelor's",
        EmploymentType: 'Unemployed',
        MaritalStatus: 'Single',
        HasMortgage: 'No',
        HasDependents: 'No',
        LoanPurpose: 'Business',
        HasCoSigner: 'No',
      });
    }
  };

  const updateField = (field: keyof ApplicantInput, value: any) => {
    onChange({ ...input, [field]: value });
  };

  return (
    <div className="form-container">
      <div className="presets-section">
        <label className="section-label">
          <Sparkles size={14} className="text-amber-400" /> Quick Select Preset Profiles
        </label>
        <div className="preset-buttons">
          <button
            type="button"
            className="preset-btn btn-prime"
            onClick={() => handlePreset('prime')}
          >
            🌟 Prime (Tier 1)
          </button>
          <button
            type="button"
            className="preset-btn btn-near-prime"
            onClick={() => handlePreset('near_prime')}
          >
            ⚠️ Near-Prime (Tier 2)
          </button>
          <button
            type="button"
            className="preset-btn btn-subprime"
            onClick={() => handlePreset('subprime')}
          >
            🛑 Subprime (Tier 4)
          </button>
          <button
            type="button"
            className="preset-btn btn-kyc"
            onClick={() => handlePreset('kyc_flag')}
          >
            🚨 KYC Anomaly
          </button>
        </div>
      </div>

      <div className="form-grid">
        {/* Credit Score */}
        <div className="form-group">
          <div className="label-row">
            <label>CIBIL / Experian Credit Score</label>
            <span className="value-badge">{input.CreditScore}</span>
          </div>
          <input
            type="range"
            min={300}
            max={900}
            value={input.CreditScore}
            onChange={(e) => updateField('CreditScore', Number(e.target.value))}
            className="slider"
          />
        </div>

        {/* DTI Ratio */}
        <div className="form-group">
          <div className="label-row">
            <label>Debt-To-Income (DTI)</label>
            <span className="value-badge">{(input.DTIRatio * 100).toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={0.95}
            step={0.01}
            value={input.DTIRatio}
            onChange={(e) => updateField('DTIRatio', Number(e.target.value))}
            className="slider"
          />
        </div>

        {/* Annual Income */}
        <div className="form-group">
          <div className="label-row">
            <label>Annual Gross Income (₹)</label>
            <span className="value-badge text-emerald-400">₹{input.Income.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            value={input.Income}
            onChange={(e) => updateField('Income', Number(e.target.value))}
            className="text-input"
            min={100000}
            max={20000000}
            step={25000}
          />
        </div>

        {/* Loan Amount */}
        <div className="form-group">
          <div className="label-row">
            <label>Requested Loan Amount (₹)</label>
            <span className="value-badge text-cyan">₹{input.LoanAmount.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            value={input.LoanAmount}
            onChange={(e) => updateField('LoanAmount', Number(e.target.value))}
            className="text-input"
            min={25000}
            max={10000000}
            step={25000}
          />
        </div>

        {/* Employment Type */}
        <div className="form-group">
          <label>Employment Type</label>
          <select
            value={input.EmploymentType}
            onChange={(e) => updateField('EmploymentType', e.target.value)}
            className="select-input"
          >
            <option value="Full-time">Salaried (Full-time)</option>
            <option value="Self-employed">Self-employed / Business</option>
            <option value="Part-time">Part-time / Gig Economy</option>
            <option value="Unemployed">Unemployed</option>
          </select>
        </div>

        {/* Co-Signer Present */}
        <div className="form-group">
          <label>Qualified Co-Signer / Guarantor</label>
          <select
            value={input.HasCoSigner}
            onChange={(e) => updateField('HasCoSigner', e.target.value)}
            className="select-input"
          >
            <option value="No">No Co-Signer</option>
            <option value="Yes">Yes (CIBIL &ge; 750)</option>
          </select>
        </div>

        {/* Tenure & Age */}
        <div className="form-group">
          <label>Age: {input.Age} yrs</label>
          <input
            type="range"
            min={18}
            max={85}
            value={input.Age}
            onChange={(e) => updateField('Age', Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="form-group">
          <label>Work Experience: {input.MonthsEmployed} mos ({(input.MonthsEmployed / 12).toFixed(1)} yrs)</label>
          <input
            type="range"
            min={0}
            max={360}
            value={input.MonthsEmployed}
            onChange={(e) => updateField('MonthsEmployed', Number(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      <button
        type="button"
        className="submit-btn"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="spinner-text">Underwriting in Progress...</span>
        ) : (
          <>
            <Play size={18} /> Run Multi-Agent Underwriting Committee
          </>
        )}
      </button>
    </div>
  );
};
