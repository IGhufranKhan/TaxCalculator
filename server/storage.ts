import type { TaxCalculation, TaxBreakdown } from "@shared/schema";

function calculateBracketTax(income: number): number {
  // Bracket tax calculation according to the document
  if (income <= 198350) return 0;
  if (income <= 279150) return (income - 198350) * 0.017;
  if (income <= 642950) return (279150 - 198350) * 0.017 + (income - 279150) * 0.04;
  if (income <= 926800) return (279150 - 198350) * 0.017 + (642950 - 279150) * 0.04 + (income - 642950) * 0.134;
  if (income <= 1500000) return (279150 - 198350) * 0.017 + (642950 - 279150) * 0.04 + (926800 - 642950) * 0.134 + (income - 926800) * 0.164;
  return (279150 - 198350) * 0.017 + (642950 - 279150) * 0.04 + (926800 - 642950) * 0.134 + (1500000 - 926800) * 0.164 + (income - 1500000) * 0.174;
}

function calculateMinimumDeduction(income: number): number {
  // Minimum standard deduction according to document (45% of income up to 109,950 NOK)
  return Math.min(income * 0.45, 109950);
}

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

  // Calculate minimum deduction
  const minimumDeduction = calculateMinimumDeduction(totalIncome);

  // Calculate standard deduction based on civil status and income
  const standardDeduction = data.personalInfo.civilStatus === 'married' ? 
    Math.min(totalIncome * 0.32, 87550) : Math.min(totalIncome * 0.45, 109950);

  // Calculate mortgage deduction (25% of interest paid)
  const mortgageDeduction = (data.bankAndLoans.mortgageInterest || 0) * 0.25;

  // Property deduction
  const propertyDeduction = data.property.primaryResidence ? 
    Math.min((data.property.propertyValue || 0) * 0.25, 25000) : 0;

  // Special deductions
  const parentalBenefitDeduction = (data.income.parentalBenefits || 0) * 0.15;
  const disabilityDeduction = (data.income.disabilityBenefits || 0) * 0.20;

  // Calculate tax components
  const bracketTax = calculateBracketTax(totalIncome);
  const insuranceContribution = totalIncome * 0.082; // 8.2% social security
  const commonTax = totalIncome * 0.22; // Base tax rate 22%

  // Total deductions
  const totalDeductions = 
    minimumDeduction +
    standardDeduction +
    mortgageDeduction +
    propertyDeduction +
    parentalBenefitDeduction +
    disabilityDeduction;

  // Calculate total tax after deductions
  const totalTax = Math.max(0, bracketTax + insuranceContribution + commonTax - totalDeductions);

  // Calculate marginal and average tax rates
  const marginalTaxRate = (totalIncome > 1500000) ? 47.4 : 
    (totalIncome > 926800) ? 46.4 :
    (totalIncome > 642950) ? 43.4 :
    (totalIncome > 279150) ? 34.0 :
    (totalIncome > 198350) ? 31.7 : 22.0;

  return {
    totalIncome,
    bracketTax,
    insuranceContribution,
    commonTax,
    standardDeduction,
    minimumDeduction,
    mortgageDeduction,
    propertyDeduction,
    parentalBenefitDeduction,
    disabilityDeduction,
    totalDeductions,
    totalTax,
    netPay: totalIncome - totalTax,
    marginalTaxRate,
    averageTaxRate: (totalTax / totalIncome) * 100
  };
}