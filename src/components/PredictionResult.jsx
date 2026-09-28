import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  AlertTriangle, 
  RotateCcw, 
  FileText, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Award,
  BookmarkCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function PredictionResult({ result, applicantData, onReset, onViewHistory, onViewDashboard }) {
  if (!result || !applicantData) return null;

  const isApproved = result.status === 'Approved';
  const score = result.score;

  // Determine score color tier
  const getScoreTheme = (scoreVal) => {
    if (scoreVal >= 75) return { text: 'text-emerald-400', stroke: '#10b981', label: 'Prime Tier', bg: 'bg-emerald-500/10' };
    if (scoreVal >= 60) return { text: 'text-teal-400', stroke: '#14b8a6', label: 'Standard Approval Tier', bg: 'bg-teal-500/10' };
    if (scoreVal >= 45) return { text: 'text-amber-400', stroke: '#f59e0b', label: 'Borderline Underwriting', bg: 'bg-amber-500/10' };
    return { text: 'text-rose-400', stroke: '#f43f5e', label: 'High Delinquency Risk', bg: 'bg-rose-500/10' };
  };

  const scoreTheme = getScoreTheme(score);
  const totalIncome = (Number(applicantData.applicantIncome) || 0) + (Number(applicantData.coapplicantIncome) || 0);

  return (
    <div className="space-y-6">
      
      {/* Primary Decision Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border shadow-xl backdrop-blur-sm transition-all ${
        isApproved
          ? 'bg-slate-800/90 border-emerald-500/40 shadow-emerald-950/20'
          : 'bg-slate-800/90 border-rose-500/40 shadow-rose-950/20'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-700/80">
          
          {/* Status Indicator */}
          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl ${isApproved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
              {isApproved ? (
                <CheckCircle2 className="w-9 h-9" />
              ) : (
                <XCircle className="w-9 h-9" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  isApproved ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                }`}>
                  Predicted Outcome
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Confidence: {isApproved ? 'High' : 'Significant'}
                </span>
              </div>

              <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 ${
                isApproved ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                Loan {result.status}
              </h1>

              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {result.statusReason}
              </p>
            </div>
          </div>

          {/* Radial Score Gauge Card */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-700/60 shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  strokeDasharray={`${score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke={scoreTheme.stroke}
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-extrabold font-mono tabular-nums ${scoreTheme.text}`}>
                  {score}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">/ 100</span>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Eligibility Score
              </div>
              <div className={`text-sm font-semibold mt-0.5 ${scoreTheme.text}`}>
                {scoreTheme.label}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Benchmark: 60/100 threshold
              </div>
            </div>
          </div>

        </div>

        {/* Financial Repayment Capacity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Estimated Monthly EMI</span>
            <span className="text-lg font-bold font-mono tabular-nums text-slate-100">
              ${result.monthlyEMI?.toLocaleString() || 0}
            </span>
            <span className="text-[10px] text-slate-500 block">@ 8.5% fixed p.a.</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Debt-to-Income (DTI)</span>
            <span className={`text-lg font-bold font-mono tabular-nums ${
              result.dti <= 35 ? 'text-emerald-400' : result.dti <= 50 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {result.dti}%
            </span>
            <span className="text-[10px] text-slate-500 block">Target ceiling: &lt; 40%</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Monthly Income</span>
            <span className="text-lg font-bold font-mono tabular-nums text-slate-100">
              ${totalIncome.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block">Applicant + Co-App</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Max Recommended Principal</span>
            <span className="text-lg font-bold font-mono tabular-nums text-emerald-400">
              ${result.maxRecommendedLoan?.toLocaleString() || 0}
            </span>
            <span className="text-[10px] text-slate-500 block">Under 40% DTI rule</span>
          </div>
        </div>

        {/* Model Disclaimer Callout */}
        <div className="pt-4 border-t border-slate-700/80 flex items-start gap-2.5 text-xs text-slate-400">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-300">Data Science Model Notice:</strong> This prediction is synthesized by an educational machine learning scoring algorithm based on historical loan eligibility features. It is not an actual commercial bank credit decision or binding pre-qualification.
          </p>
        </div>

      </div>

      {/* Two Column Section: Applicant Summary & Underwriting Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Applicant Summary Dossier (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-200">
                Applicant Application Dossier
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {applicantData.applicantName}
            </span>
          </div>

          <div className="divide-y divide-slate-700/60 text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-400">Gender & Marital Status</span>
              <span className="font-medium text-slate-200">
                {applicantData.gender} · {applicantData.married === 'Yes' ? 'Married' : 'Single'}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-400">Dependents</span>
              <span className="font-medium text-slate-200 font-mono">
                {applicantData.dependents} Dependents
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-400">Education Level</span>
              <span className="font-medium text-slate-200">
                {applicantData.education}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-400">Employment Type</span>
              <span className="font-medium text-slate-200">
                {applicantData.selfEmployed === 'Yes' ? 'Self-Employed' : 'Salaried Employee'}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-400">Primary Applicant Income</span>
              <span className="font-medium text-slate-200 font-mono tabular-nums">
                ${Number(applicantData.applicantIncome).toLocaleString()}/mo
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-400">Co-Applicant Income</span>
              <span className="font-medium text-slate-200 font-mono tabular-nums">
                ${Number(applicantData.coapplicantIncome || 0).toLocaleString()}/mo
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-400">Requested Principal</span>
              <span className="font-bold text-slate-100 font-mono tabular-nums">
                ${Number(applicantData.loanAmount).toLocaleString()}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-400">Loan Tenure</span>
              <span className="font-medium text-slate-200 font-mono">
                {applicantData.loanTerm} Months ({(applicantData.loanTerm / 12).toFixed(0)} Yrs)
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-400">Credit History Rating</span>
              <span className={`font-semibold font-mono ${
                Number(applicantData.creditHistory) === 1 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {Number(applicantData.creditHistory) === 1 ? '1.0 (Meets Guidelines)' : '0.0 (Adverse / Default)'}
              </span>
            </div>

            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-400">Collateral / Property Area</span>
              <span className="font-medium text-slate-200">
                {applicantData.propertyArea} Area
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Key Contributing Factors & Recommendations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Positive Factors */}
          {result.positiveFactors && result.positiveFactors.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-emerald-500/20 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Approval Supporting Strengths ({result.positiveFactors.length})
                </h3>
              </div>
              <div className="space-y-2.5">
                {result.positiveFactors.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-200">
                      <span>{item.factor}</span>
                      <span className="text-emerald-400 font-mono">{item.impact}</span>
                    </div>
                    <p className="mt-1 text-slate-400 text-[11px] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Factors */}
          {result.riskFactors && result.riskFactors.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-rose-500/20 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-300">
                  Risk Factors & Underwriting Flags ({result.riskFactors.length})
                </h3>
              </div>
              <div className="space-y-2.5">
                {result.riskFactors.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50 text-xs">
                    <div className="flex items-center justify-between font-semibold text-rose-200">
                      <span>{item.factor}</span>
                      <span className="text-rose-400 font-mono">{item.impact}</span>
                    </div>
                    <p className="mt-1 text-slate-400 text-[11px] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-blue-500/20 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                  Improvement & Re-Application Recommendations
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <ChevronRight className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>

      {/* Action Footer Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-slate-800/80 border border-slate-700 gap-4">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
          <BookmarkCheck className="w-4 h-4" />
          <span>Record saved automatically to Browser Application History</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Check Another Applicant</span>
          </button>

          {onViewHistory && (
            <button
              type="button"
              onClick={onViewHistory}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 rounded-lg border border-slate-600 transition-colors"
            >
              <span>View History</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
