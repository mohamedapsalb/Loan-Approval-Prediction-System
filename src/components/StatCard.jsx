import React from 'react';

/**
 * Reusable StatCard component for financial metrics
 */
export default function StatCard({ title, value, subtitle, icon: Icon, color = 'emerald', trend }) {
  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-950/20'
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      glow: 'shadow-rose-950/20'
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      glow: 'shadow-blue-950/20'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'shadow-amber-950/20'
    },
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400',
      glow: 'shadow-indigo-950/20'
    }
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className={`p-5 rounded-xl bg-slate-800/80 border ${style.border} shadow-lg ${style.glow} backdrop-blur-sm transition-all duration-200 hover:border-slate-600`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg ${style.bg} ${style.text}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-bold font-mono tabular-nums text-slate-100 tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-mono font-medium text-emerald-400">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 line-clamp-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
