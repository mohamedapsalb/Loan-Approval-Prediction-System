import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import Home from './pages/Home.jsx';
import Prediction from './pages/Prediction.jsx';
import History from './pages/History.jsx';
import { 
  getStoredApplications, 
  deleteApplicationById, 
  clearAllApplications 
} from './utils/prediction.js';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [editingApplicant, setEditingApplicant] = useState(null);

  // Initialize applications from localStorage on mount
  useEffect(() => {
    const loaded = getStoredApplications();
    setApplications(loaded);
  }, []);

  // Handle saving a new application
  const handleApplicationSaved = (newApp) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  // Handle deleting an application
  const handleDeleteApplication = (id) => {
    const updated = deleteApplicationById(id);
    setApplications(updated);
  };

  // Handle clearing all applications
  const handleClearAll = () => {
    clearAllApplications();
    setApplications([]);
  };

  // Handle loading an application back to the form
  const handleLoadApplication = (app) => {
    setEditingApplicant(app);
    setActivePage('predict');
  };

  // High-level statistics for Home and Dashboard
  const totalApps = applications.length;
  const approvedApps = applications.filter(a => a.status === 'Approved').length;
  const approvalRate = totalApps > 0 
    ? ((approvedApps / totalApps) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Layout Container with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Desktop Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          applicationCount={applications.length}
        />

        {/* Dynamic Main Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activePage === 'home' && (
            <Home
              onNavigate={(page) => setActivePage(page)}
              stats={{
                total: totalApps,
                approved: approvedApps,
                approvalRate
              }}
            />
          )}

          {activePage === 'predict' && (
            <Prediction
              onApplicationSaved={handleApplicationSaved}
              onNavigate={(page) => setActivePage(page)}
              initialApplicant={editingApplicant}
            />
          )}

          {activePage === 'dashboard' && (
            <Dashboard
              applications={applications}
              onNewApplication={() => setActivePage('predict')}
              onSelectApplication={() => setActivePage('history')}
            />
          )}

          {activePage === 'history' && (
            <History
              applications={applications}
              onDeleteApplication={handleDeleteApplication}
              onClearAll={handleClearAll}
              onLoadApplication={handleLoadApplication}
            />
          )}
        </main>
      </div>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">LoanPulse Prediction System</span>
            <span>·</span>
            <span>Credit Risk Machine Learning Demonstration</span>
          </div>

          <div className="text-slate-400 text-center sm:text-right">
            Browser LocalStorage Persistence · Client-side Heuristic Inference
          </div>
        </div>
      </footer>

    </div>
  );
}
