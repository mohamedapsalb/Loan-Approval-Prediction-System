import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  AlertCircle, 
  Sparkles,
  FileSpreadsheet,
  X
} from 'lucide-react';

export default function ApplicationHistory({ applications = [], onDeleteApplication, onClearAll, onLoadApplication }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Approved' | 'Rejected'
  const [selectedApp, setSelectedApp] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter and Search logic
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Status filter
      if (statusFilter !== 'all' && app.status !== statusFilter) {
        return false;
      }

      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = (app.applicantName || '').toLowerCase().includes(query);
        const matchesId = (app.id || '').toLowerCase().includes(query);
        const matchesArea = (app.propertyArea || '').toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesArea) {
          return false;
        }
      }

      return true;
    });
  }, [applications, statusFilter, searchTerm]);

  // Export to JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(applications, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `loan_predictions_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (applications.length === 0) return;
    const headers = [
      'ID', 'Applicant Name', 'Gender', 'Married', 'Dependents', 'Education',
      'Self Employed', 'Applicant Income', 'Co-Applicant Income', 'Loan Amount',
      'Loan Term (Months)', 'Credit History', 'Property Area', 'Score', 'Status', 'Date'
    ];

    const rows = applications.map(a => [
      a.id,
      `"${a.applicantName || ''}"`,
      a.gender,
      a.married,
      a.dependents,
      a.education,
      a.selfEmployed,
      a.applicantIncome,
      a.coapplicantIncome,
      a.loanAmount,
      a.loanTerm,
      a.creditHistory,
      a.propertyArea,
      a.score,
      a.status,
      a.timestamp ? new Date(a.timestamp).toISOString() : ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `loan_predictions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Global Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Application History & Registry
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Historical evaluations stored persistently in browser localStorage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {applications.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                title="Download spreadsheet"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by applicant name, ID, or property area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status Filter Segmented Buttons */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700/80 self-start sm:self-auto">
          {[
            { id: 'all', label: `All (${applications.length})` },
            { id: 'Approved', label: `Approved (${applications.filter(a => a.status === 'Approved').length})` },
            { id: 'Rejected', label: `Rejected (${applications.filter(a => a.status === 'Rejected').length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table Card */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl overflow-hidden">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="font-medium text-slate-300">No applications match your filter.</p>
            <p className="text-slate-500">Try modifying your search term or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Applicant & ID</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Loan Principal</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Monthly Income</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Credit History</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Area</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Score</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-mono">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-700/30 transition-colors">
                    
                    {/* Applicant details */}
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-200">
                      <div className="font-semibold text-white">{app.applicantName || 'Applicant'}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="text-emerald-400/90">{app.id}</span>
                        <span>·</span>
                        <span>{app.gender}</span>
                        <span>·</span>
                        <span>{app.education}</span>
                      </div>
                    </td>

                    {/* Loan Amount */}
                    <td className="py-3.5 px-4 text-right font-bold text-slate-100 tabular-nums">
                      ${Number(app.loanAmount).toLocaleString()}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        {app.loanTerm} mos ({(app.loanTerm / 12).toFixed(0)} yrs)
                      </span>
                    </td>

                    {/* Total Income */}
                    <td className="py-3.5 px-4 text-right text-slate-200 tabular-nums">
                      ${((Number(app.applicantIncome) || 0) + (Number(app.coapplicantIncome) || 0)).toLocaleString()}/mo
                      {Number(app.coapplicantIncome) > 0 && (
                        <span className="block text-[10px] text-emerald-400/80 font-normal">
                          +Co-App ${Number(app.coapplicantIncome).toLocaleString()}
                        </span>
                      )}
                    </td>

                    {/* Credit History */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        Number(app.creditHistory) === 1 
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40' 
                          : 'bg-rose-950/80 text-rose-300 border border-rose-800/40'
                      }`}>
                        {Number(app.creditHistory) === 1 ? '1.0 Good' : '0.0 Adverse'}
                      </span>
                    </td>

                    {/* Area */}
                    <td className="py-3.5 px-4 text-center font-sans text-slate-300">
                      {app.propertyArea}
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-4 text-center font-bold tabular-nums">
                      <span className={app.score >= 60 ? 'text-emerald-400' : 'text-rose-400'}>
                        {app.score}
                      </span>
                      <span className="text-slate-500 text-[10px]">/100</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-sans ${
                        app.status === 'Approved'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {app.status === 'Approved' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{app.status}</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-center text-slate-400 text-[11px] font-sans">
                      {app.timestamp ? new Date(app.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'Recent'}
                    </td>

                    {/* Row Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteApplication(app.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details View Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
                  {selectedApp.id}
                </span>
                <h3 className="text-base font-bold text-white">
                  {selectedApp.applicantName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400">Prediction Result</span>
                <span className={`font-bold text-sm ${selectedApp.status === 'Approved' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  Loan {selectedApp.status} ({selectedApp.score}/100)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-800/40">
                  <span className="text-slate-500 block text-[10px] uppercase">Loan Principal</span>
                  <span className="font-mono font-bold text-slate-100">${Number(selectedApp.loanAmount).toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/40">
                  <span className="text-slate-500 block text-[10px] uppercase">Loan Term</span>
                  <span className="font-mono font-bold text-slate-100">{selectedApp.loanTerm} Months</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/40">
                  <span className="text-slate-500 block text-[10px] uppercase">Applicant Income</span>
                  <span className="font-mono font-bold text-slate-100">${Number(selectedApp.applicantIncome).toLocaleString()}/mo</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/40">
                  <span className="text-slate-500 block text-[10px] uppercase">Co-Applicant Income</span>
                  <span className="font-mono font-bold text-slate-100">${Number(selectedApp.coapplicantIncome || 0).toLocaleString()}/mo</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/40">
                  <span className="text-slate-500 block text-[10px] uppercase">Credit History</span>
                  <span className={`font-mono font-bold ${Number(selectedApp.creditHistory) === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Number(selectedApp.creditHistory) === 1 ? '1.0 Meets Guidelines' : '0.0 Adverse'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/40">
                  <span className="text-slate-500 block text-[10px] uppercase">Property Area</span>
                  <span className="font-bold text-slate-100">{selectedApp.propertyArea}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/40 text-slate-400 space-y-1">
                <div>Demographics: {selectedApp.gender} · {selectedApp.married === 'Yes' ? 'Married' : 'Single'} · {selectedApp.dependents} Dependents</div>
                <div>Employment: {selectedApp.education} · {selectedApp.selfEmployed === 'Yes' ? 'Self-Employed' : 'Salaried'}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              {onLoadApplication && (
                <button
                  type="button"
                  onClick={() => {
                    onLoadApplication(selectedApp);
                    setSelectedApp(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Re-test / Edit in Form</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-white">Clear Application History?</h3>
              <p className="mt-1 text-xs text-slate-400">
                This will delete all saved applications from browser localStorage. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
