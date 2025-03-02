import type { TaxCalculation, TaxBreakdown } from "@shared/schema";

function calculateTrinnskatt(income: number): number {
  // 2025 tax brackets from the document
  const brackets = [
    { limit: 217400, rate: 0.000 },
    { limit: 306050, rate: 0.017 },
    { limit: 697150, rate: 0.040 },
    { limit: 942400, rate: 0.137 },
    { limit: 1410750, rate: 0.167 },
    { limit: Infinity, rate: 0.177 }
  ];

  let tax = 0;
  let previousLimit = 0;

  for (let i = 0; i < brackets.length; i++) {
    const { limit, rate } = brackets[i];
    if (income > previousLimit) {
      const taxableAmount = Math.min(income, limit) - previousLimit;
      tax += taxableAmount * rate;
    }
    previousLimit = limit;
  }

  return tax;
}

function calculateWealthTax(netWealth: number): number {
  let municipalTax = 0;
  let stateTax = 0;

  // Municipal tax (kommuneskatt)
  if (netWealth > 1760000) {
    municipalTax = (netWealth - 1760000) * 0.007;
  }

  // State tax (statsskatt)
  if (netWealth > 1760000) {
    if (netWealth <= 20700000) {
      stateTax = (netWealth - 1760000) * 0.003;
    } else {
      stateTax = (20700000 - 1760000) * 0.003 + (netWealth - 20700000) * 0.004;
    }
  }

  return municipalTax + stateTax;
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
  const bracketTax = calculateTrinnskatt(totalIncome);
  const insuranceContribution = totalIncome * 0.082; // 8.2% social security
  const commonTax = totalIncome * 0.22; // Base tax rate 22%

  // Calculate net wealth for wealth tax
  const netWealth = 
    (data.property.propertyValue || 0) +
    (data.bankAndLoans.bankDeposits || 0) -
    (data.bankAndLoans.mortgageInterest || 0) * 20; // Approximate mortgage principal

  const wealthTax = calculateWealthTax(netWealth);

  // Total deductions
  const totalDeductions = 
    minimumDeduction +
    standardDeduction +
    mortgageDeduction +
    propertyDeduction +
    parentalBenefitDeduction +
    disabilityDeduction;

  // Calculate total tax after deductions
  const totalTax = Math.max(0, bracketTax + insuranceContribution + commonTax + wealthTax - totalDeductions);

  // Calculate marginal and average tax rates
  const marginalTaxRate = (totalIncome > 1410750) ? 47.7 : 
    (totalIncome > 942400) ? 46.7 :
    (totalIncome > 697150) ? 43.7 :
    (totalIncome > 306050) ? 34.0 :
    (totalIncome > 217400) ? 31.7 : 22.0;

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