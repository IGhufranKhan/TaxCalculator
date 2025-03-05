import { TaxPeriod, type TaxBreakdown } from "@shared/schema";

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0";
  }
  return new Intl.NumberFormat('no-NO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + " kr";
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) return '0.0%';
  return `${value.toFixed(1)}%`;
}

export function annualizeAmount(amount: number | undefined | null, period: string): number {
  if (!amount || isNaN(amount)) return 0;

  switch (period) {
    case TaxPeriod.MONTH:
      return amount * 12;
    case TaxPeriod.SEMIMONTHLY:
      return amount * 24;
    case TaxPeriod.WEEKLY:
      return amount * 52;
    case TaxPeriod.DAY:
      return amount * 365;
    case TaxPeriod.HOUR:
      return amount * 1920; // 40 hours * 48 weeks
    default:
      return amount;
  }
}

export function calculateTaxPercentages(breakdown: TaxBreakdown) {
  const total = breakdown.totalTax;
  if (!total || isNaN(total)) return { bracketTax: 0, insuranceContribution: 0, commonTax: 0 };

  return {
    bracketTax: (breakdown.bracketTax / total) * 100,
    insuranceContribution: (breakdown.insuranceContribution / total) * 100,
    commonTax: (breakdown.commonTax / total) * 100
  };
}

export function downloadTaxResults(breakdown: TaxBreakdown) {
  const results = `
Norwegian Tax Calculation Results
===============================

Income and Deductions
-------------------
Total Income: ${formatCurrency(breakdown.totalIncome)}
Standard Deduction: ${formatCurrency(breakdown.standardDeduction)}
Mortgage Deduction: ${formatCurrency(breakdown.mortgageDeduction)}

Tax Components
------------
Bracket Tax: ${formatCurrency(breakdown.bracketTax)}
Insurance Contribution: ${formatCurrency(breakdown.insuranceContribution)}
Common Tax: ${formatCurrency(breakdown.commonTax)}

Summary
-------
Total Tax: ${formatCurrency(breakdown.totalTax)}
Net Pay: ${formatCurrency(breakdown.netPay)}
Marginal Tax Rate: ${formatPercentage(breakdown.marginalTaxRate)}
Average Tax Rate: ${formatPercentage(breakdown.averageTaxRate)}

Generated on: ${new Date().toLocaleString()}
`;

  const blob = new Blob([results], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'tax-calculation.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}