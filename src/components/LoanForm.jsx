import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  RotateCcw, 
  Sparkles, 
  AlertCircle, 
  User, 
  DollarSign, 
  Briefcase, 
  Home, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  TrendingUp,
  Percent
} from 'lucide-react';
import { calculateEMI } from '../utils/prediction.js';

// Preset demographic scenarios for fast evaluation and testing
const PRESETS = [
  {
    name: 'Prime Approved Profile',
    desc: 'High income, clean credit history, graduate, low DTI',
    data: {
      applicantName: 'Sophia Reynolds',
      gender: 'Female',
      married: 'Yes',
      dependents: '1',
      education: 'Graduate',
      selfEmployed: 'No',
      applicantIncome: '7500',
      coapplicantIncome: '3200',
      loanAmount: '240000',
      loanTerm: '360',
      creditHistory: '1',
      propertyArea: 'Semiurban'
    }
  },
  {
    name: 'Poor Credit History (High Risk)',
    desc: 'Good income but adverse credit rating (Credit History = 0)',
    data: {
      applicantName: 'Brandon Miller',
      gender: 'Male',
      married: 'No',
      dependents: '0',
      education: 'Graduate',
      selfEmployed: 'No',
      applicantIncome: '6200',
      coapplicantIncome: '0',
      loanAmount: '190000',
      loanTerm: '240',
      creditHistory: '0',
      propertyArea: 'Urban'
    }
  },
  {
    name: 'High Debt-to-Income (Excessive Loan)',
    desc: 'Income insufficient for requested loan size (DTI > 60%)',
    data: {
      applicantName: 'Liam O\'Connor',
      gender: 'Male',
      married: 'Yes',
      dependents: '3+',
      education: 'Not Graduate',
      selfEmployed: 'Yes',
      applicantIncome: '3200',
      coapplicantIncome: '0',
      loanAmount: '350000',
      loanTerm: '180',
      creditHistory: '1',
      propertyArea: 'Rural'
    }
  }
];

export default function LoanForm({ onPredict, isPredicting, initialData }) {
  // Form State
  const initialFormState = {
    applicantName: '',
    gender: 'Male',
    married: 'Yes',
    dependents: '0',
    education: 'Graduate',
    selfEmployed: 'No',
    applicantIncome: '',
    coapplicantIncome: '0',
    loanAmount: '',
    loanTerm: '360',
    creditHistory: '1',
    propertyArea: 'Semiurban'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sync initialData if provided (e.g. from History re-test)
  useEffect(() => {
    if (initialData) {
      setFormData({
        applicantName: initialData.applicantName || '',
        gender: initialData.gender || 'Male',
        married: initialData.married || 'Yes',
        dependents: String(initialData.dependents ?? '0'),
        education: initialData.education || 'Graduate',
        selfEmployed: initialData.selfEmployed || 'No',
        applicantIncome: String(initialData.applicantIncome ?? ''),
        coapplicantIncome: String(initialData.coapplicantIncome ?? '0'),
        loanAmount: String(initialData.loanAmount ?? ''),
        loanTerm: String(initialData.loanTerm ?? '360'),
        creditHistory: String(initialData.creditHistory ?? '1'),
        propertyArea: initialData.propertyArea || 'Semiurban'
      });
    }
  }, [initialData]);

  // Real-time calculations for instant financial feedback
  const parsedApplicantIncome = Math.max(0, parseFloat(formData.applicantIncome) || 0);
  const parsedCoapplicantIncome = Math.max(0, parseFloat(formData.coapplicantIncome) || 0);
  const parsedTotalIncome = parsedApplicantIncome + parsedCoapplicantIncome;
  const parsedLoanAmount = Math.max(0, parseFloat(formData.loanAmount) || 0);
  const parsedLoanTerm = parseInt(formData.loanTerm) || 360;

  const liveEstimatedEMI = parsedLoanAmount > 0 && parsedLoanTerm > 0 
    ? calculateEMI(parsedLoanAmount, parsedLoanTerm) 
    : 0;

  const liveDTI = parsedTotalIncome > 0 && liveEstimatedEMI > 0
    ? ((liveEstimatedEMI / parsedTotalIncome) * 100).toFixed(1)
    : '0.0';

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field if valid
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  // Field Level Validation
  const validateField = (name, value) => {
    let error = null;

    if (name === 'applicantName' && !value.trim()) {
      error = 'Applicant name is required';
    } else if (name === 'applicantIncome') {
      if (value === '' || value === null) {
        error = 'Applicant income is required';
      } else if (parseFloat(value) < 0) {
        error = 'Income cannot be negative';
      } else if (parseFloat(value) === 0 && (parseFloat(formData.coapplicantIncome) || 0) === 0) {
        error = 'At least one income source must be greater than 0';
      }
    } else if (name === 'coapplicantIncome') {
      if (value !== '' && parseFloat(value) < 0) {
        error = 'Co-applicant income cannot be negative';
      }
    } else if (name === 'loanAmount') {
      if (!value) {
        error = 'Loan amount is required';
      } else if (parseFloat(value) <= 0) {
        error = 'Loan amount must be greater than $0';
      } else if (parseFloat(value) > 5000000) {
        error = 'Maximum loan amount limit is $5,000,000 for standard model';
      }
    } else if (name === 'loanTerm') {
      if (!value || parseInt(value) <= 0) {
        error = 'Valid loan term is required';
      }
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }

    return !error;
  };

  // Full Form Validation
  const validateAll = () => {
    const newErrors = {};

    if (!formData.applicantName.trim()) {
      newErrors.applicantName = 'Please enter the applicant\'s full name';
    }

    if (formData.applicantIncome === '' || formData.applicantIncome === null) {
      newErrors.applicantIncome = 'Monthly applicant income is required';
    } else if (parseFloat(formData.applicantIncome) < 0) {
      newErrors.applicantIncome = 'Income cannot be negative';
    }

    if (formData.coapplicantIncome !== '' && parseFloat(formData.coapplicantIncome) < 0) {
      newErrors.coapplicantIncome = 'Co-applicant income cannot be negative';
    }

    if ((parseFloat(formData.applicantIncome) || 0) + (parseFloat(formData.coapplicantIncome) || 0) <= 0) {
      newErrors.applicantIncome = 'Total household income must be greater than 0';
    }

    if (!formData.loanAmount) {
      newErrors.loanAmount = 'Requested loan amount is required';
    } else if (parseFloat(formData.loanAmount) <= 0) {
      newErrors.loanAmount = 'Loan amount must be greater than $0';
    }

    if (!formData.loanTerm || parseInt(formData.loanTerm) <= 0) {
      newErrors.loanTerm = 'Please select a valid loan term';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) {
      return;
    }

    onPredict({
      ...formData,
      applicantIncome: parseFloat(formData.applicantIncome),
      coapplicantIncome: parseFloat(formData.coapplicantIncome) || 0,
      loanAmount: parseFloat(formData.loanAmount),
      loanTerm: parseInt(formData.loanTerm),
      creditHistory: parseInt(formData.creditHistory)
    });
  };

  // Reset form
  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setTouched({});
  };

  // Load a preset scenario
  const applyPreset = (presetData) => {
    setFormData(presetData);
    setErrors({});
    setTouched({});
  };

  return (
    <div className="space-y-6">
      {/* Preset Profiles Quick Bar */}
      <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Quick Test Presets (1-Click Fill)</span>
          </div>
          <span className="text-xs text-slate-500">
            Select a sample profile to auto-fill the 11 variables
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset.data)}
              className="text-left p-3 rounded-lg bg-slate-900/60 border border-slate-700/60 hover:border-emerald-500/50 hover:bg-slate-800 transition-all text-xs group"
            >
              <div className="font-semibold text-slate-200 group-hover:text-emerald-300 flex items-center justify-between">
                <span>{preset.name}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-400" />
              </div>
              <p className="mt-1 text-[11px] text-slate-400 leading-tight">
                {preset.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Loan Application Form Card */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-xl backdrop-blur-sm">
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-700/80 gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Calculator className="w-6 h-6 text-emerald-400" />
              Applicant Financial & Demographic Dossier
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Provide the 11 underwriting variables used by the machine learning risk assessment classifier.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Form</span>
            </button>
          </div>
        </div>

        {/* Global Error Banner if validation fails */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-200">Please review highlighted fields:</p>
              <ul className="mt-1 list-disc list-inside space-y-0.5 text-rose-300">
                {Object.values(errors).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="space-y-8">
          
          {/* Section 1: Personal & Demographic Profile */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-1 border-b border-slate-800">
              <User className="w-4 h-4 text-emerald-400" />
              <span>1. Personal & Household Profile</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Applicant Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Jordan Hayes"
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900/80 border text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    errors.applicantName ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-slate-700 hover:border-slate-600'
                  }`}
                />
                {errors.applicantName && (
                  <p className="mt-1 text-[11px] text-rose-400">{errors.applicantName}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Gender <span className="text-rose-400">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-slate-600 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Non-Binary</option>
                </select>
              </div>

              {/* Married */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Marital Status <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {['Yes', 'No'].map((status) => (
                    <label
                      key={status}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                        formData.married === status
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="married"
                        value={status}
                        checked={formData.married === status}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span>{status === 'Yes' ? 'Married' : 'Single'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Number of Dependents */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Dependents <span className="text-rose-400">*</span>
                </label>
                <select
                  name="dependents"
                  value={formData.dependents}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-slate-600 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="0">0 Dependents</option>
                  <option value="1">1 Dependent</option>
                  <option value="2">2 Dependents</option>
                  <option value="3+">3+ Dependents</option>
                </select>
              </div>

              {/* Education */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Education Level <span className="text-rose-400">*</span>
                </label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-slate-600 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Graduate">Graduate (University Degree)</option>
                  <option value="Not Graduate">Not Graduate (Secondary / High School)</option>
                </select>
              </div>

              {/* Self Employed */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Employment Status <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'No', label: 'Salaried / Employed' },
                    { val: 'Yes', label: 'Self-Employed / Business' }
                  ].map((emp) => (
                    <label
                      key={emp.val}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                        formData.selfEmployed === emp.val
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="selfEmployed"
                        value={emp.val}
                        checked={formData.selfEmployed === emp.val}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span>{emp.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Income & Financial Capacity */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-1 border-b border-slate-800">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>2. Monthly Income Breakdown</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Applicant Income */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Primary Applicant Monthly Income ($) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-sm font-mono">
                    $
                  </span>
                  <input
                    type="number"
                    name="applicantIncome"
                    value={formData.applicantIncome}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="0"
                    step="100"
                    placeholder="e.g. 5500"
                    className={`w-full pl-8 pr-3.5 py-2.5 rounded-lg bg-slate-900/80 border text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.applicantIncome ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-slate-700 hover:border-slate-600'
                    }`}
                  />
                </div>
                {errors.applicantIncome ? (
                  <p className="mt-1 text-[11px] text-rose-400">{errors.applicantIncome}</p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-500">Gross regular income before deductions</p>
                )}
              </div>

              {/* Co-Applicant Income */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Co-Applicant Monthly Income ($) <span className="text-slate-500">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-sm font-mono">
                    $
                  </span>
                  <input
                    type="number"
                    name="coapplicantIncome"
                    value={formData.coapplicantIncome}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="0"
                    step="100"
                    placeholder="e.g. 2000 (Enter 0 if none)"
                    className={`w-full pl-8 pr-3.5 py-2.5 rounded-lg bg-slate-900/80 border text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.coapplicantIncome ? 'border-rose-500' : 'border-slate-700 hover:border-slate-600'
                    }`}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">Secondary borrower or spouse income</p>
              </div>

            </div>
          </div>

          {/* Section 3: Loan Parameters & Underwriting Factors */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-1 border-b border-slate-800">
              <Home className="w-4 h-4 text-emerald-400" />
              <span>3. Loan Terms & Credit Underwriting</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Requested Loan Amount */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Requested Loan Principal Amount ($) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 text-sm font-mono">
                    $
                  </span>
                  <input
                    type="number"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="1000"
                    step="1000"
                    placeholder="e.g. 150000"
                    className={`w-full pl-8 pr-3.5 py-2.5 rounded-lg bg-slate-900/80 border text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.loanAmount ? 'border-rose-500 ring-1 ring-rose-500/50' : 'border-slate-700 hover:border-slate-600'
                    }`}
                  />
                </div>
                {errors.loanAmount ? (
                  <p className="mt-1 text-[11px] text-rose-400">{errors.loanAmount}</p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-500">Total borrowing request</p>
                )}
              </div>

              {/* Loan Term */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Loan Tenure (Term) <span className="text-rose-400">*</span>
                </label>
                <select
                  name="loanTerm"
                  value={formData.loanTerm}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-slate-600 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                >
                  <option value="360">360 Months (30 Years)</option>
                  <option value="240">240 Months (20 Years)</option>
                  <option value="180">180 Months (15 Years)</option>
                  <option value="120">120 Months (10 Years)</option>
                  <option value="84">84 Months (7 Years)</option>
                  <option value="60">60 Months (5 Years)</option>
                </select>
                <p className="mt-1 text-[11px] text-slate-500">Amortization tenure</p>
              </div>

              {/* Property Area */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Property Area Location <span className="text-rose-400">*</span>
                </label>
                <select
                  name="propertyArea"
                  value={formData.propertyArea}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-slate-600 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Semiurban">Semiurban (High approval index)</option>
                  <option value="Urban">Urban (High liquidity)</option>
                  <option value="Rural">Rural (Standard coverage)</option>
                </select>
                <p className="mt-1 text-[11px] text-slate-500">Collateral classification</p>
              </div>

              {/* Credit History (Heavy Weight) */}
              <div className="sm:col-span-2 lg:col-span-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-200">
                    Credit History Scorecard <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-emerald-400">
                    Primary Predictor (Kaggle Dataset Weight: 84%)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.creditHistory === '1'
                        ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300'
                        : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="creditHistory"
                      value="1"
                      checked={formData.creditHistory === '1'}
                      onChange={handleChange}
                      className="mt-0.5 text-emerald-500 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Meets Credit Guidelines (1.0)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        Consistent on-time repayments, no outstanding collections or major defaults.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.creditHistory === '0'
                        ? 'bg-rose-500/15 border-rose-500/60 text-rose-300'
                        : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="creditHistory"
                      value="0"
                      checked={formData.creditHistory === '0'}
                      onChange={handleChange}
                      className="mt-0.5 text-rose-500 focus:ring-rose-500"
                    />
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-1.5 text-rose-300">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        <span>Does Not Meet Guidelines (0.0)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        Documented late payments, default records, or delinquent credit bureau score.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* Real-time Financial Heuristics Bar */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-mono">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Live Heuristics Preview:</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-mono">
              <div>
                <span className="text-slate-500">Total Income: </span>
                <span className="text-slate-200 font-bold tabular-nums">
                  ${parsedTotalIncome.toLocaleString()}/mo
                </span>
              </div>

              <div>
                <span className="text-slate-500">Estimated EMI: </span>
                <span className="text-slate-200 font-bold tabular-nums">
                  ${liveEstimatedEMI.toLocaleString()}/mo
                </span>
              </div>

              <div>
                <span className="text-slate-500">Projected DTI: </span>
                <span className={`font-bold tabular-nums ${
                  parseFloat(liveDTI) <= 35 ? 'text-emerald-400' :
                  parseFloat(liveDTI) <= 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {liveDTI}%
                </span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-700/80">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              Clear Inputs
            </button>

            <button
              type="submit"
              disabled={isPredicting}
              className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3 text-sm font-semibold rounded-lg shadow-lg transition-all duration-150 ${
                isPredicting
                  ? 'bg-emerald-600/50 text-emerald-200 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-emerald-500/25 active:scale-98'
              }`}
            >
              {isPredicting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Computing Prediction Model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Predict Loan Approval</span>
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
