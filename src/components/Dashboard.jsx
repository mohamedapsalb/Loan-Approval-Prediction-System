import React from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Percent, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  PlusCircle, 
  Clock, 
  MapPin, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import StatCard from './StatCard.jsx';

export default function Dashboard({ applications = [], onNewApplication, onSelectApplication }) {
  const totalApps = applications.length;
  const approvedApps = applications.filter(a => a.status === 'Approved').length;
  const rejectedApps = applications.filter(a => a.status === 'Rejected').length;
  
  const approvalRate = totalApps > 0 
    ? ((approvedApps / totalApps) * 100).toFixed(1) 
    : '0.0';

  const totalLoanVolume = applications.reduce((sum, a) => sum + (Number(a.loanAmount) || 0), 0);
  const avgScore = totalApps > 0 
    ? Math.round(applications.reduce((sum, a) => sum + (Number(a.score) || 0), 0) / totalApps) 
    : 0;

  // Property Area Distribution breakdown
  const propertyCounts = applications.reduce((acc, a) => {
    const area = a.propertyArea || 'Urban';
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, { Semiurban: 0, Urban: 0, Rural: 0 });

  // Credit history counts
  const goodCreditCount = applications.filter(a => Number(a.creditHistory) === 1).length;
  const poorCreditCount = totalApps - goodCreditCount;

  // Recent 5 applications
  const recentApps = [...applications].slice(0, 5);

  return (
    <div className="space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Loan Analytics Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Real-time underwriting performance metrics, risk distribution, and historical loan evaluations.
          </p>
        </div>

        <button
          onClick={onNewApplication}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all duration-150 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={totalApps.toString()}
          subtitle="Processed through ML heuristic"
          icon={FileText}
          color="indigo"
        />

        <StatCard
          title="Approved Loans"
          value={approvedApps.toString()}
          subtitle={`${approvalRate}% approval rate`}
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Rejected Loans"
          value={rejectedApps.toString()}
          subtitle="Flagged by risk criteria"
          icon={XCircle}
          color="rose"
        />

        <StatCard
          title="Avg Eligibility Score"
          value={`${avgScore}/100`}
          subtitle="Benchmark threshold: 60/100"
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Analytical Charts & Visual Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Outcome Ratio Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">
                Loan Outcome & Underwriting Performance
              </h2>
              <p className="text-xs text-slate-400">
                Approval vs. Rejection portfolio allocation
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              {approvalRate}% Qualified
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="space-y-2">
            <div className="h-5 w-full bg-slate-900 rounded-lg overflow-hidden flex border border-slate-700/60 p-0.5">
              <div 
                className="bg-emerald-500 rounded-l-md transition-all duration-500"
                style={{ width: `${totalApps > 0 ? (approvedApps / totalApps) * 100 : 0}%` }}
                title={`Approved: ${approvedApps}`}
              />
              <div 
                className="bg-rose-500 rounded-r-md transition-all duration-500"
                style={{ width: `${totalApps > 0 ? (rejectedApps / totalApps) * 100 : 0}%` }}
                title={`Rejected: ${rejectedApps}`}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Approved: {approvedApps} apps ({totalApps > 0 ? ((approvedApps / totalApps) * 100).toFixed(0) : 0}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-300">Rejected: {rejectedApps} apps ({totalApps > 0 ? ((rejectedApps / totalApps) * 100).toFixed(0) : 0}%)</span>
              </div>
            </div>
          </div>

          {/* Metric Comparison Bars */}
          <div className="pt-4 border-t border-slate-700/60 space-y-3">
            <div className="text-xs font-medium text-slate-300">
              Credit Score Compliance
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Credit Guidelines Met (1.0)</span>
                <span className="font-mono text-slate-200">{goodCreditCount} applicants</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${totalApps > 0 ? (goodCreditCount / totalApps) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Adverse / Delinquent Credit (0.0)</span>
                <span className="font-mono text-slate-200">{poorCreditCount} applicants</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-400 rounded-full"
                  style={{ width: `${totalApps > 0 ? (poorCreditCount / totalApps) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Area Distribution (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Property Area Distribution
            </h2>
            <p className="text-xs text-slate-400">
              Loan concentration across demographic zones
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { name: 'Semiurban', count: propertyCounts.Semiurban || 0, color: 'bg-emerald-400', tag: 'Highest historical approval' },
              { name: 'Urban', count: propertyCounts.Urban || 0, color: 'bg-blue-400', tag: 'High collateral liquidity' },
              { name: 'Rural', count: propertyCounts.Rural || 0, color: 'bg-amber-400', tag: 'Standard collateral margin' }
            ].map((zone) => {
              const pct = totalApps > 0 ? Math.round((zone.count / totalApps) * 100) : 0;
              return (
                <div key={zone.name} className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200">{zone.name}</span>
                    <span className="font-mono text-slate-300 font-bold tabular-nums">
                      {zone.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${zone.color} rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {zone.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Applications Feed */}
      <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Recent Applications
            </h2>
            <p className="text-xs text-slate-400">
              Latest predictions evaluated by the model
            </p>
          </div>

          <button
            onClick={() => onSelectApplication && onSelectApplication('all')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentApps.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No applications submitted yet. Click "New Application" to run your first prediction.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Applicant Name</th>
                  <th className="py-3 px-3 text-right">Requested Loan</th>
                  <th className="py-3 px-3 text-right">Monthly Income</th>
                  <th className="py-3 px-3 text-center">Credit History</th>
                  <th className="py-3 px-3 text-center">Score</th>
                  <th className="py-3 px-3 text-center">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-mono">
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-3 font-sans font-medium text-slate-200">
                      <div>{app.applicantName || 'Anonymous Applicant'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {app.id} · {app.propertyArea}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-200 tabular-nums">
                      ${Number(app.loanAmount).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                      ${((Number(app.applicantIncome) || 0) + (Number(app.coapplicantIncome) || 0)).toLocaleString()}/mo
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        Number(app.creditHistory) === 1 
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40' 
                          : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                      }`}>
                        {Number(app.creditHistory) === 1 ? '1.0 Good' : '0.0 Adverse'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-200 tabular-nums">
                      {app.score}/100
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-sans ${
                        app.status === 'Approved'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
