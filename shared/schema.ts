import { z } from "zod";

export const TaxPeriod = {
  ANNUAL: "Annual",
  MONTH: "Month",
  SEMIMONTHLY: "Semi-monthly",
  WEEKLY: "Weekly",
  DAY: "Day",
  HOUR: "Hour"
} as const;

export const taxCalculationSchema = z.object({
  income: z.number().min(0),
  period: z.enum([
    TaxPeriod.ANNUAL,
    TaxPeriod.MONTH,
    TaxPeriod.SEMIMONTHLY,
    TaxPeriod.WEEKLY,
    TaxPeriod.DAY,
    TaxPeriod.HOUR
  ]),
  location: z.string(),
});

export type TaxCalculation = z.infer<typeof taxCalculationSchema>;

export interface TaxBreakdown {
  salary: number;
  bracketTax: number;
  insuranceContribution: number;
  commonTax: number;
  totalTax: number;
  netPay: number;
  marginalTaxRate: number;
  averageTaxRate: number;
}
