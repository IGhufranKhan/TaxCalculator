import { z } from "zod";

export const TaxPeriod = {
  ANNUAL: "Annual",
  MONTH: "Month",
  SEMIMONTHLY: "Semi-monthly",
  WEEKLY: "Weekly",
  DAY: "Day",
  HOUR: "Hour"
} as const;

// Income and Work related fields
export const workIncomeSchema = z.object({
  salary: z.number().min(0),
  businessIncome: z.number().min(0).optional(),
  freelanceIncome: z.number().min(0).optional(),
  overtimePay: z.number().min(0).optional(),
  bonuses: z.number().min(0).optional(),
  disabilityBenefits: z.number().min(0).optional(),
  parentalBenefits: z.number().min(0).optional(),
  sickPay: z.number().min(0).optional(),
});

// Bank and Loan related fields
export const bankLoanSchema = z.object({
  savingsInterest: z.number().min(0).optional(),
  bankDeposits: z.number().min(0).optional(),
  loanInterest: z.number().min(0).optional(),
  mortgageInterest: z.number().min(0).optional(),
});

// Housing and Property related fields
export const propertySchema = z.object({
  primaryResidence: z.boolean().optional(),
  rentalIncome: z.number().min(0).optional(),
  propertyValue: z.number().min(0).optional(),
  propertyExpenses: z.number().min(0).optional(),
});

export const taxCalculationSchema = z.object({
  income: workIncomeSchema,
  bankAndLoans: bankLoanSchema,
  property: propertySchema,
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
export type WorkIncome = z.infer<typeof workIncomeSchema>;
export type BankLoan = z.infer<typeof bankLoanSchema>;
export type Property = z.infer<typeof propertySchema>;

export interface TaxBreakdown {
  // Base calculation
  totalIncome: number;
  bracketTax: number;
  insuranceContribution: number;
  commonTax: number;

  // Deductions
  mortgageDeduction: number;
  standardDeduction: number;

  // Final calculations
  totalTax: number;
  netPay: number;
  marginalTaxRate: number;
  averageTaxRate: number;
}