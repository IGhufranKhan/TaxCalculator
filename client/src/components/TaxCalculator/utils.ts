import { TaxPeriod, type TaxBreakdown } from "@shared/schema";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('no-NO', {
    style: 'currency',
    currency: 'NOK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0.0%';
  return `${value.toFixed(1)}%`;
}

export function annualizeAmount(amount: number, period: string): number {
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
  if (!total) return { bracketTax: 0, insuranceContribution: 0, commonTax: 0 };

  return {
    bracketTax: (breakdown.bracketTax / total) * 100,
    insuranceContribution: (breakdown.insuranceContribution / total) * 100,
    commonTax: (breakdown.commonTax / total) * 100
  };
}