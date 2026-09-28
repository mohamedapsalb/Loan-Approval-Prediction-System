import React from 'react';
import { 
  Home, 
  Sparkles, 
  BarChart3, 
  History as HistoryIcon, 
  Landmark, 
  ShieldCheck, 
  FileText,
  HelpCircle,
  Database
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, applicationCount = 0 }) {
  const navItems = [
    { id: 'home', label: 'Home Overview', icon: Home, badge: null },
    { id: 'predict', label: 'Predict Eligibility', icon: Sparkles, badge: 'ML Core' },
    { id: 'dashboard', label: 'Analytics Dashboard', icon: BarChart3, badge: null },
    { id: 'history', label: 'Application History', icon: HistoryIcon, count: applicationCount }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Navigation List */}
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && item.count > 0 && (
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 tabular-nums">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Model Spec Card */}
      <div className="px-4 py-3 mx-4 my-2 rounded-xl bg-slate-800/40 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Decision Algorithm</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          Evaluating 11 demographic, cash-flow, and collateral parameters based on credit underwriting heuristics.
        </p>
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Target Accuracy</span>
          <span className="text-emerald-400 font-semibold">86.4%</span>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="mt-auto p-4 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span>Storage: Browser LocalStorage</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-normal">
          Demo prediction model for educational data science demonstration only. Not a commercial banking underwriting approval.
        </p>
      </div>
    </aside>
  );
}
