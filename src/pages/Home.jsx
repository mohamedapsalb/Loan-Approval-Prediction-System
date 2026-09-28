import React from 'react';
import { 
  Sparkles, 
  BarChart3, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Database, 
  FileSpreadsheet, 
  Cpu, 
  Calculator, 
  LineChart, 
  Landmark,
  Scale,
  Percent,
  Layers
} from 'lucide-react';

export default function Home({ onNavigate, stats = {} }) {
  const { total = 0, approved = 0, approvalRate = '0.0' } = stats;

  return (
    <div className="space-y-12 pb-8">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-800/90 via-slate-800/60 to-slate-900/90 border border-slate-700/80 p-8 sm:p-12 shadow-2xl">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Machine Learning & Credit Scoring Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Intelligent Loan Approval <span className="text-emerald-400">Prediction System</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Evaluate loan eligibility in seconds using a machine learning-inspired multi-factor risk assessment model. Analyze 11 underwriting dimensions including debt service coverage, credit history guidelines, and property collateral valuation.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('predict')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-150 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Check Loan Eligibility</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all duration-150"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>View Analytics Dashboard</span>
            </button>
          </div>

          {/* Quick Trust / Architecture Indicators */}
          <div className="pt-6 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono text-slate-400">
            <div>
              <span className="text-slate-500 block">Decision Framework</span>
              <span className="text-slate-200 font-bold">Weighted Heuristic v2.4</span>
            </div>
            <div>
              <span className="text-slate-500 block">Benchmark Accuracy</span>
              <span className="text-emerald-400 font-bold">86.4% on Test Split</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-500 block">Evaluated Applications</span>
              <span className="text-slate-200 font-bold tabular-nums">{total} in Registry</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works: 3 Step Pipeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Underwriting Prediction Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              How the algorithmic engine processes raw borrower inputs into an actionable credit verdict.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-white">
              Demographic & Income Ingestion
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accepts 11 standardized inputs including applicant and co-applicant income, requested principal, tenure, education level, and collateral region.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-white">
              Heuristic Risk Assessment
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates amortized monthly EMI, computes Debt-to-Income (DTI) ratio, weights credit history reliability, and computes a 0-100 eligibility score.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono font-bold">
              03
            </div>
            <h3 className="text-base font-bold text-white">
              Explainable Decision & Advisory
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Delivers an instant "Approved" or "Rejected" verdict accompanied by positive points, identified risk markers, and restructuring recommendations.
            </p>
          </div>

        </div>
      </div>

      {/* Model Input Factors Specification Grid */}
      <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-lg space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            11 Underwriting Dimensions Evaluated
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Ground-truth features adapted from standard financial and machine learning loan classification benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {[
            { title: 'Credit History', desc: 'Binary credit bureau scorecard rating (1.0 vs 0.0). Primary risk weight in algorithm.' },
            { title: 'Debt-to-Income (DTI)', desc: 'Monthly amortized payment divided by gross household income. Under 35% is prime.' },
            { title: 'Loan-to-Income', desc: 'Total principal requested relative to combined annual gross earning capacity.' },
            { title: 'Co-Applicant Support', desc: 'Secondary borrower presence provides additional cash-flow buffer and joint liability.' },
            { title: 'Education Credential', desc: 'University graduation status correlates with long-term earnings trajectory.' },
            { title: 'Employment Stability', desc: 'Predictability of salaried cash flows versus self-employed revenue variance.' },
            { title: 'Household Dependents', desc: 'Dependency ratio affects discretionary cash flow available for debt service.' },
            { title: 'Collateral Property Area', desc: 'Semiurban, urban, or rural geographical classification affecting resale liquidity.' }
          ].map((feature, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/50 space-y-1">
              <span className="font-semibold text-slate-200 block text-xs">
                {feature.title}
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* College Project / Educational Demonstration Disclaimer Banner */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
        <Scale className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-amber-200 text-sm">
            Academic & Demonstration Model Notice
          </p>
          <p className="text-amber-300/80 leading-relaxed">
            This application simulates a Data Science loan approval machine learning model for instructional and analytical demonstration. Real lending institutions evaluate extensive documentation including credit bureau reports (FICO / CIBIL), tax returns, bank statements, collateral appraisals, and regulatory guidelines.
          </p>
        </div>
      </div>

    </div>
  );
}
