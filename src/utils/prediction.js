/**
 * Loan Approval Prediction Algorithm
 * 
 * Inspired by real-world credit risk assessment and the classic Kaggle Loan Prediction Dataset.
 * Uses a multi-factor weighted scoring model that evaluates creditworthiness, debt-to-income (DTI) ratio,
 * repayment capacity, household stability, and asset location.
 */

// Estimated benchmark annual interest rate for residential/personal loans
const ANNUAL_INTEREST_RATE = 0.085; // 8.5% per annum
const MONTHLY_RATE = ANNUAL_INTEREST_RATE / 12;

/**
 * Calculates monthly EMI using the standard amortized formula:
 * EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 */
export function calculateEMI(principal, termInMonths) {
  if (!principal || principal <= 0 || !termInMonths || termInMonths <= 0) return 0;
  const p = Number(principal);
  const n = Number(termInMonths);
  const r = MONTHLY_RATE;
  
  const factor = Math.pow(1 + r, n);
  const emi = (p * r * factor) / (factor - 1);
  return Math.round(emi);
}

/**
 * Core prediction function that returns a comprehensive risk profile and decision.
 * 
 * @param {Object} applicant
 * @param {string} applicant.gender - 'Male' | 'Female' | 'Other'
 * @param {string} applicant.married - 'Yes' | 'No'
 * @param {string} applicant.dependents - '0' | '1' | '2' | '3+'
 * @param {string} applicant.education - 'Graduate' | 'Not Graduate'
 * @param {string} applicant.selfEmployed - 'Yes' | 'No'
 * @param {number} applicant.applicantIncome - Monthly income in $
 * @param {number} applicant.coapplicantIncome - Monthly co-applicant income in $
 * @param {number} applicant.loanAmount - Total requested loan in $
 * @param {number} applicant.loanTerm - Loan term in months
 * @param {number|string} applicant.creditHistory - 1 (Meets guidelines) or 0 (Does not meet guidelines)
 * @param {string} applicant.propertyArea - 'Urban' | 'Semiurban' | 'Rural'
 */
export function predictLoanApproval(applicant) {
  const applicantIncome = Math.max(0, Number(applicant.applicantIncome) || 0);
  const coapplicantIncome = Math.max(0, Number(applicant.coapplicantIncome) || 0);
  const totalMonthlyIncome = applicantIncome + coapplicantIncome;
  const loanAmount = Math.max(0, Number(applicant.loanAmount) || 0);
  const loanTerm = Math.max(12, Number(applicant.loanTerm) || 360);
  const creditHistory = Number(applicant.creditHistory) === 1 ? 1 : 0;
  
  // Repayment calculation
  const monthlyEMI = calculateEMI(loanAmount, loanTerm);
  const dti = totalMonthlyIncome > 0 ? (monthlyEMI / totalMonthlyIncome) * 100 : 100;
  const annualIncome = totalMonthlyIncome * 12;
  const loanToIncomeRatio = annualIncome > 0 ? (loanAmount / annualIncome) : 999;
  
  let score = 48; // Baseline starting score
  const reasons = [];
  const positiveFactors = [];
  const riskFactors = [];
  const recommendations = [];

  // 1. Credit History Assessment (The single most impactful feature in lending models)
  if (creditHistory === 1) {
    score += 28;
    positiveFactors.push({
      factor: 'Credit History Guidelines Met',
      impact: '+28 pts',
      description: 'Applicant possesses an established record of timely repayments and no unresolved defaults.'
    });
  } else {
    score -= 38;
    riskFactors.push({
      factor: 'Adverse Credit History (Delinquency Risk)',
      impact: '-38 pts',
      description: 'Absence of clean credit history or documented past defaults creates critical underwriting risk.'
    });
    recommendations.push('Rebuild credit profile with timely payments for at least 12-24 consecutive months before reapplying.');
  }

  // 2. Debt-to-Income (DTI) & Affordability
  if (dti <= 20) {
    score += 20;
    positiveFactors.push({
      factor: 'Exceptional Debt-to-Income Ratio (DTI < 20%)',
      impact: '+20 pts',
      description: `Estimated EMI ($${monthlyEMI.toLocaleString()}/mo) consumes only ${dti.toFixed(1)}% of combined monthly income ($${totalMonthlyIncome.toLocaleString()}/mo).`
    });
  } else if (dti <= 35) {
    score += 14;
    positiveFactors.push({
      factor: 'Healthy Debt-to-Income Ratio (DTI 20% - 35%)',
      impact: '+14 pts',
      description: `EMI of $${monthlyEMI.toLocaleString()}/mo is well within the prime lending threshold of 35% of total income.`
    });
  } else if (dti <= 45) {
    score += 4;
    reasons.push('Moderate DTI ratio: EMI represents 35%-45% of gross monthly income, which requires careful budgetary control.');
  } else if (dti <= 55) {
    score -= 12;
    riskFactors.push({
      factor: 'High Debt Burden (DTI 45% - 55%)',
      impact: '-12 pts',
      description: `Estimated monthly payment requires ${dti.toFixed(1)}% of applicant gross income, leaving constrained emergency margins.`
    });
    recommendations.push('Consider extending the loan term or reducing the requested principal to lower monthly obligations.');
  } else {
    score -= 28;
    riskFactors.push({
      factor: 'Excessive Debt Burden (DTI > 55%)',
      impact: '-28 pts',
      description: `Requested loan results in an unsustainable debt service ratio of ${dti.toFixed(1)}% against monthly cash flows.`
    });
    recommendations.push('Requested loan amount exceeds safe borrowing limits. Consider requesting a lower principal amount.');
  }

  // 3. Co-Applicant Income Contribution
  if (coapplicantIncome > 0) {
    const coAppShare = (coapplicantIncome / totalMonthlyIncome) * 100;
    score += 6;
    positiveFactors.push({
      factor: 'Secondary Borrower / Co-Applicant Present',
      impact: '+6 pts',
      description: `Co-applicant contributes $${coapplicantIncome.toLocaleString()}/mo (${coAppShare.toFixed(0)}% of joint income), reducing single-earner risk.`
    });
  }

  // 4. Education Level
  if (applicant.education === 'Graduate') {
    score += 4;
    positiveFactors.push({
      factor: 'Graduate Educational Qualification',
      impact: '+4 pts',
      description: 'Tertiary education correlates with stronger long-term employment resilience.'
    });
  } else {
    reasons.push('Standard underwriting tier applied for non-graduate educational profile.');
  }

  // 5. Dependents Overhead
  const dep = applicant.dependents;
  if (dep === '0') {
    score += 4;
    positiveFactors.push({
      factor: 'Zero Dependents',
      impact: '+4 pts',
      description: 'Lower household living overhead affords higher disposable income for debt service.'
    });
  } else if (dep === '1') {
    score += 2;
  } else if (dep === '2') {
    score += 0;
  } else if (dep === '3+') {
    score -= 4;
    riskFactors.push({
      factor: 'High Dependent Ratio (3+ Dependents)',
      impact: '-4 pts',
      description: 'Higher fixed living expenses reduce residual income buffer in unexpected stress events.'
    });
  }

  // 6. Employment & Income Stability
  if (applicant.selfEmployed === 'Yes') {
    if (applicantIncome >= 6000) {
      score += 2;
    } else {
      score -= 3;
      riskFactors.push({
        factor: 'Self-Employed with Moderate Cashflow',
        impact: '-3 pts',
        description: 'Self-employment in lower income brackets carries higher volatility in quarterly earnings.'
      });
      recommendations.push('Providing 2+ years of verified tax returns or audited financials strengthens self-employed dossiers.');
    }
  } else {
    score += 3;
    positiveFactors.push({
      factor: 'Salaried Employment Status',
      impact: '+3 pts',
      description: 'Regular, predictable payroll schedule lowers repayment interruption probability.'
    });
  }

  // 7. Property Area Collateral Valuation
  if (applicant.propertyArea === 'Semiurban') {
    score += 5;
    positiveFactors.push({
      factor: 'Semiurban Property Location',
      impact: '+5 pts',
      description: 'Semiurban demographic sectors consistently reflect high property value appreciation in historical datasets.'
    });
  } else if (applicant.propertyArea === 'Urban') {
    score += 4;
    positiveFactors.push({
      factor: 'Urban High-Liquidity Area',
      impact: '+4 pts',
      description: 'Strong secondary market collateral liquidity for properties located in urban zones.'
    });
  } else {
    score += 1;
    reasons.push('Rural property location evaluated with standard collateral margin.');
  }

  // 8. Marital Stability
  if (applicant.married === 'Yes') {
    score += 2;
  }

  // Bound score strictly between 5 and 99
  const finalScore = Math.min(99, Math.max(5, Math.round(score)));

  // Final Decision Matrix:
  // - High barrier: Adverse credit history (0) is an immediate veto in prime automated underwriting unless score is extraordinary.
  // - Excessive DTI (> 60%) is also an automatic rejection.
  let isApproved = false;
  let statusReason = '';

  if (creditHistory === 0) {
    isApproved = false;
    statusReason = 'Rejected primarily due to unverified or deficient credit history (Credit History = 0). Automated policy requires satisfactory credit score or manual underwriter exception.';
  } else if (dti > 60) {
    isApproved = false;
    statusReason = `Rejected due to critical Debt-to-Income breach (${dti.toFixed(1)}% exceeds the statutory safe limit of 50-60%).`;
  } else if (finalScore >= 60) {
    isApproved = true;
    statusReason = 'Approved: The applicant demonstrates solid debt-service capability, clean credit history, and acceptable risk margins.';
  } else {
    isApproved = false;
    statusReason = `Rejected: Composite eligibility score of ${finalScore}/100 falls below the automated qualification threshold of 60/100.`;
  }

  // Maximum recommended loan amount for this income profile (assuming 40% max DTI)
  const maxSafeMonthlyEmi = totalMonthlyIncome * 0.40;
  // Invert EMI formula to get recommended loan principal
  const r = MONTHLY_RATE;
  const factor = Math.pow(1 + r, loanTerm);
  const maxRecommendedLoan = Math.round((maxSafeMonthlyEmi * (factor - 1)) / (r * factor));

  return {
    status: isApproved ? 'Approved' : 'Rejected',
    isApproved,
    score: finalScore,
    statusReason,
    monthlyEMI,
    dti: Number(dti.toFixed(1)),
    loanToIncomeRatio: Number(loanToIncomeRatio.toFixed(2)),
    totalMonthlyIncome,
    maxRecommendedLoan: Math.max(10000, maxRecommendedLoan),
    positiveFactors,
    riskFactors,
    recommendations,
    evaluatedAt: new Date().toISOString()
  };
}

/**
 * Initial historical applications seed to ensure the dashboard and history
 * have realistic data right from the start.
 */
export const SEED_APPLICATIONS = [
  {
    id: 'APP-1001',
    applicantName: 'Sarah Jenkins',
    gender: 'Female',
    married: 'Yes',
    dependents: '1',
    education: 'Graduate',
    selfEmployed: 'No',
    applicantIncome: 6500,
    coapplicantIncome: 2800,
    loanAmount: 180000,
    loanTerm: 360,
    creditHistory: 1,
    propertyArea: 'Semiurban',
    status: 'Approved',
    score: 88,
    monthlyEMI: 1384,
    dti: 14.9,
    timestamp: '2026-09-26T14:32:00.000Z'
  },
  {
    id: 'APP-1002',
    applicantName: 'Marcus Vance',
    gender: 'Male',
    married: 'No',
    dependents: '0',
    education: 'Graduate',
    selfEmployed: 'Yes',
    applicantIncome: 4200,
    coapplicantIncome: 0,
    loanAmount: 220000,
    loanTerm: 240,
    creditHistory: 0,
    propertyArea: 'Urban',
    status: 'Rejected',
    score: 34,
    monthlyEMI: 1910,
    dti: 45.5,
    timestamp: '2026-09-26T16:15:00.000Z'
  },
  {
    id: 'APP-1003',
    applicantName: 'Elena Rostova',
    gender: 'Female',
    married: 'Yes',
    dependents: '2',
    education: 'Graduate',
    selfEmployed: 'No',
    applicantIncome: 5100,
    coapplicantIncome: 3400,
    loanAmount: 210000,
    loanTerm: 360,
    creditHistory: 1,
    propertyArea: 'Urban',
    status: 'Approved',
    score: 82,
    monthlyEMI: 1615,
    dti: 19.0,
    timestamp: '2026-09-27T09:40:00.000Z'
  },
  {
    id: 'APP-1004',
    applicantName: 'David K. Chen',
    gender: 'Male',
    married: 'Yes',
    dependents: '3+',
    education: 'Not Graduate',
    selfEmployed: 'No',
    applicantIncome: 3100,
    coapplicantIncome: 0,
    loanAmount: 175000,
    loanTerm: 180,
    creditHistory: 1,
    propertyArea: 'Rural',
    status: 'Rejected',
    score: 52,
    monthlyEMI: 1723,
    dti: 55.6,
    timestamp: '2026-09-27T11:20:00.000Z'
  },
  {
    id: 'APP-1005',
    applicantName: 'Amara Okafor',
    gender: 'Female',
    married: 'No',
    dependents: '0',
    education: 'Graduate',
    selfEmployed: 'No',
    applicantIncome: 7800,
    coapplicantIncome: 0,
    loanAmount: 140000,
    loanTerm: 360,
    creditHistory: 1,
    propertyArea: 'Semiurban',
    status: 'Approved',
    score: 91,
    monthlyEMI: 1076,
    dti: 13.8,
    timestamp: '2026-09-27T15:05:00.000Z'
  }
];

export const STORAGE_KEY = 'loan_applications_history_v1';

export function getStoredApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_APPLICATIONS));
      return SEED_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_APPLICATIONS;
  } catch (e) {
    console.error('Failed to load application history from localStorage', e);
    return SEED_APPLICATIONS;
  }
}

export function saveApplication(newApp) {
  try {
    const existing = getStoredApplications();
    const updated = [newApp, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save application to localStorage', e);
    return [];
  }
}

export function deleteApplicationById(id) {
  try {
    const existing = getStoredApplications();
    const updated = existing.filter(app => app.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete application from localStorage', e);
    return [];
  }
}

export function clearAllApplications() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (e) {
    console.error('Failed to clear application history', e);
    return [];
  }
}
