import React from 'react';
import { Landmark, Sparkles, Menu, X, PlusCircle, BarChart3, History as HistoryIcon, Home } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const navItems = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'predict', label: 'Check Eligibility', icon: Sparkles },
    { id: 'dashboard', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'history', label: 'Application History', icon: HistoryIcon }
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark with icon */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActivePage('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/30 transition-colors">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  LoanPulse
                </span>
                <span className="text-xs font-mono text-emerald-400 ml-1.5 font-medium px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                  ML-v2
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action / Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('predict')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm hover:shadow-emerald-500/20 transition-all duration-150 whitespace-nowrap active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Apply for Loan</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900/95 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => {
                setActivePage('predict');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-slate-900 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Loan Application</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
