import type { TaxCalculation, TaxBreakdown } from "@shared/schema";

export function calculateTax(data: TaxCalculation): TaxBreakdown {
  // Calculate total income from all sources
  const totalIncome = 
    data.income.salary +
    (data.income.businessIncome || 0) +
    (data.income.freelanceIncome || 0) +
    (data.income.overtimePay || 0) +
    (data.income.bonuses || 0) +
    (data.income.disabilityBenefits || 0) +
    (data.income.parentalBenefits || 0) +
    (data.income.sickPay || 0);

  // Calculate standard deduction (minimum of 45% of income or 109,950 NOK)
  const standardDeduction = Math.min(totalIncome * 0.45, 109950);

  // Calculate mortgage deduction (25% of interest paid)
  const mortgageDeduction = (data.bankAndLoans.mortgageInterest || 0) * 0.25;

  // Calculate tax components
  const bracketTax = totalIncome * 0.12; // Simplified bracket tax
  const insuranceContribution = totalIncome * 0.082; // 8.2% social security
  const commonTax = totalIncome * 0.22; // Common tax rate 22%

  // Apply deductions
  const totalTax = bracketTax + insuranceContribution + commonTax - mortgageDeduction - standardDeduction;

  return {
    totalIncome,
    bracketTax,
    insuranceContribution,
    commonTax,
    mortgageDeduction,
    standardDeduction,
    totalTax,
    netPay: totalIncome - totalTax,
    marginalTaxRate: 34.0, // Top marginal rate for 2024
    averageTaxRate: (totalTax / totalIncome) * 100
  };
}