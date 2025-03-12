import type { TaxCalculation, TaxBreakdown } from "@shared/schema";

function calculateTrinnskatt(income: number): number {
  // 2025 tax brackets
  if (income <= 217400) return 0;
  if (income <= 306050) return (income - 217400) * 0.017;
  if (income <= 697150) return (306050 - 217400) * 0.017 + (income - 306050) * 0.040;
  if (income <= 942400) return (306050 - 217400) * 0.017 + (697150 - 306050) * 0.040 + (income - 697150) * 0.137;
  if (income <= 1410750) return (306050 - 217400) * 0.017 + (697150 - 306050) * 0.040 + (942400 - 697150) * 0.137 + (income - 942400) * 0.167;
  return (306050 - 217400) * 0.017 + (697150 - 306050) * 0.040 + (942400 - 697150) * 0.137 + (1410750 - 942400) * 0.167 + (income - 1410750) * 0.177;
}

export function calculateTax(data: TaxCalculation): TaxBreakdown {
  try {
    // Calculate total income
    const totalIncome = Math.round(
      (data.income.salary || 0) +
      (data.businessIncome.fishingAgricultureIncome || 0) +
      (data.businessIncome.otherBusinessIncome || 0) +
      (data.income.dividend || 0) +
      (data.income.otherIncome || 0)
    );

    // Basic calculations
    const bracketTax = Math.round(calculateTrinnskatt(totalIncome));
    const insuranceContribution = Math.round(totalIncome * 0.082); // 8.2% social security
    const commonTax = Math.round(totalIncome * 0.22); // Base tax rate 22%

    // Standard deduction (simplified)
    const standardDeduction = Math.round(Math.min(totalIncome * 0.45, 109950));
    const minimumDeduction = 0;
    const mortgageDeduction = 0;
    const propertyDeduction = 0;
    const parentalBenefitDeduction = 0;
    const disabilityDeduction = 0;

    // Calculate Wealth Tax (Formueskatt)
    const totalAssets = (data.financial.totalAssets || 0);
    const totalDebt = (data.financial.totalDebt || 0);
    const W = totalAssets - totalDebt;

    let wealthTax = 0;
    if (W > 1760000) {
      // Municipal tax (0.7%)
      const municipalTax = (W - 1760000) * 0.007;

      // State tax (0.3% up to 20.7M, then 0.4%)
      let stateTax = 0;
      if (W <= 20700000) {
        stateTax = (W - 1760000) * 0.003;
      } else {
        stateTax = (20700000 - 1760000) * 0.003 + (W - 20700000) * 0.004;
      }

      wealthTax = Math.round(municipalTax + stateTax);
    }

    // Total tax calculation
    const totalDeductions = standardDeduction;
    const totalTax = Math.max(0, bracketTax + insuranceContribution + commonTax + wealthTax - totalDeductions);
    const netPay = totalIncome - totalTax;

    // Tax rates
    const marginalTaxRate = 34.0; // Default rate
    const averageTaxRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;

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
      wealthTax,
      totalDeductions,
      totalTax,
      netPay,
      marginalTaxRate,
      averageTaxRate
    };
  } catch (error) {
    console.error('Error in tax calculation:', error);
    return {
      totalIncome: 0,
      bracketTax: 0,
      insuranceContribution: 0,
      commonTax: 0,
      standardDeduction: 0,
      minimumDeduction: 0,
      mortgageDeduction: 0,
      propertyDeduction: 0,
      parentalBenefitDeduction: 0,
      disabilityDeduction: 0,
      wealthTax: 0,
      totalDeductions: 0,
      totalTax: 0,
      netPay: 0,
      marginalTaxRate: 0,
      averageTaxRate: 0
    };
  }
}