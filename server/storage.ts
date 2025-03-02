import type { TaxCalculation, TaxBreakdown } from "@shared/schema";

export function calculateTax(data: TaxCalculation): TaxBreakdown {
  const { income } = data;
  
  // Norwegian tax calculation logic based on 2024 rates
  const bracketTax = income * 0.12; // Simplified bracket tax
  const insuranceContribution = income * 0.082; // 8.2% social security
  const commonTax = income * 0.22; // Common tax rate
  const totalTax = bracketTax + insuranceContribution + commonTax;
  
  return {
    salary: income,
    bracketTax,
    insuranceContribution,
    commonTax,
    totalTax,
    netPay: income - totalTax,
    marginalTaxRate: 34.0,
    averageTaxRate: (totalTax / income) * 100
  };
}
