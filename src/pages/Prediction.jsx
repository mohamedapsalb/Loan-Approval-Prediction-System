import React, { useState } from 'react';
import LoanForm from '../components/LoanForm.jsx';
import PredictionResult from '../components/PredictionResult.jsx';
import { predictLoanApproval, saveApplication } from '../utils/prediction.js';

export default function Prediction({ onApplicationSaved, onNavigate }) {
  const [predictionResult, setPredictionResult] = useState(null);
  const [currentApplicant, setCurrentApplicant] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [simulationStep, setSimulationStep] = useState('');

  const handlePredict = (formData) => {
    setIsPredicting(true);
    setSimulationStep('Vectorizing categorical and numerical features...');

    // Simulate real ML inference latency with progressive steps
    setTimeout(() => {
      setSimulationStep('Computing debt-to-income and amortized cash flow...');
    }, 250);

    setTimeout(() => {
      setSimulationStep('Evaluating credit risk and probability score...');
    }, 550);

    setTimeout(() => {
      const result = predictLoanApproval(formData);

      // Create unique application identifier
      const generatedId = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
      const savedRecord = {
        id: generatedId,
        applicantName: formData.applicantName || 'Anonymous Applicant',
        gender: formData.gender,
        married: formData.married,
        dependents: formData.dependents,
        education: formData.education,
        selfEmployed: formData.selfEmployed,
        applicantIncome: formData.applicantIncome,
        coapplicantIncome: formData.coapplicantIncome,
        loanAmount: formData.loanAmount,
        loanTerm: formData.loanTerm,
        creditHistory: formData.creditHistory,
        propertyArea: formData.propertyArea,
        status: result.status,
        score: result.score,
        monthlyEMI: result.monthlyEMI,
        dti: result.dti,
        timestamp: new Date().toISOString()
      };

      // Persist to localStorage
      saveApplication(savedRecord);
      if (onApplicationSaved) {
        onApplicationSaved(savedRecord);
      }

      setPredictionResult(result);
      setCurrentApplicant(formData);
      setIsPredicting(false);
      setSimulationStep('');
    }, 850);
  };

  const handleReset = () => {
    setPredictionResult(null);
    setCurrentApplicant(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
          <span>LoanPulse ML Engine</span>
          <span>/</span>
          <span className="text-slate-400">Risk Assessment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {predictionResult ? 'Underwriting Evaluation Report' : 'Loan Eligibility Prediction Form'}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          {predictionResult 
            ? 'Detailed predictive breakdown, contributing risk scores, and debt-service metrics.'
            : 'Fill out the 11 underwriting fields below or use 1-click test presets to simulate model scoring.'
          }
        </p>
      </div>

      {/* Simulated Inference Overlay if predicting */}
      {isPredicting && (
        <div className="p-8 rounded-2xl bg-slate-800/90 border border-emerald-500/40 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative w-14 h-14">
            <div className="w-14 h-14 rounded-full border-4 border-slate-700 border-t-emerald-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Running Machine Learning Model</h3>
            <p className="text-xs text-emerald-400 font-mono mt-1">
              {simulationStep}
            </p>
          </div>
        </div>
      )}

      {/* Main Content: Form or Result */}
      {!isPredicting && (
        <>
          {predictionResult ? (
            <PredictionResult
              result={predictionResult}
              applicantData={currentApplicant}
              onReset={handleReset}
              onViewHistory={() => onNavigate && onNavigate('history')}
              onViewDashboard={() => onNavigate && onNavigate('dashboard')}
            />
          ) : (
            <LoanForm
              onPredict={handlePredict}
              isPredicting={isPredicting}
              initialData={initialApplicant}
            />
          )}
        </>
      )}

    </div>
  );
}
