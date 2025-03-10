import { z } from "zod";

export const TaxPeriod = {
  ANNUAL: "Annual",
  MONTH: "Month",
  SEMIMONTHLY: "Semi-monthly",
  WEEKLY: "Weekly",
  DAY: "Day",
  HOUR: "Hour"
} as const;

// Civil status
export const CivilStatus = {
  SINGLE: "single",
  MARRIED: "married",
  SEPARATED: "separated",
  DIVORCED: "divorced",
  WIDOWED: "widowed"
} as const;

// Personal Information Schema
export const personalInfoSchema = z.object({
  birthYear: z.number().min(1900).max(new Date().getFullYear()),
  spouseBirthYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
  civilStatus: z.enum([
    CivilStatus.SINGLE,
    CivilStatus.MARRIED,
    CivilStatus.SEPARATED,
    CivilStatus.DIVORCED,
    CivilStatus.WIDOWED
  ]),
  hasChildren: z.boolean(),
  numberOfDependents: z.number().min(0),
  finnmarkDeduction: z.boolean(),
  hasRegularEmployment: z.boolean(),
  hasBeenOnSickLeave: z.boolean(),
  hasOwnHome: z.boolean(),
  hasStudentLoans: z.boolean(),
  hasCarOrBoat: z.boolean(),
  hasSecondHome: z.boolean(),
  hasShares: z.boolean()
});

// Work Income Schema
export const workIncomeSchema = z.object({
  salary: z.number().min(0),
  disabilityPension: z.number().min(0).optional(),
  workAssessmentAllowance: z.number().min(0).optional(),
  unemploymentBenefits: z.number().min(0).optional(),
  maternityBenefits: z.number().min(0).optional(),
  sicknessBenefits: z.number().min(0).optional(),
  employerBenefits: z.number().min(0).optional(),
  dividend: z.number().min(0).optional(),
  otherIncome: z.number().min(0).optional(),
});

// Business Income Schema
export const businessIncomeSchema = z.object({
  fishingAgricultureIncome: z.number().min(0).optional(),
  otherBusinessIncome: z.number().min(0).optional(),
  businessProfit: z.number().min(0).optional(),
  businessLoss: z.number().min(0).optional(),
  totalIncome: z.number().min(0).optional(),
});

// Bank and Loan Schema
export const bankLoanSchema = z.object({
  savingsInterest: z.number().min(0).optional(),
  bankDeposits: z.number().min(0).optional(),
  loanInterest: z.number().min(0).optional(),
  mortgageInterest: z.number().min(0).optional(),
});

// Property Schema
export const propertySchema = z.object({
  primaryResidence: z.boolean().optional(),
  rentalIncome: z.number().min(0).optional(),
  propertyValue: z.number().min(0).optional(),
  propertyExpenses: z.number().min(0).optional(),
});


export const taxCalculationSchema = z.object({
  personalInfo: personalInfoSchema,
  income: workIncomeSchema,
  businessIncome: businessIncomeSchema,
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
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type WorkIncome = z.infer<typeof workIncomeSchema>;
export type BankLoan = z.infer<typeof bankLoanSchema>;
export type Property = z.infer<typeof propertySchema>;
export type BusinessIncome = z.infer<typeof businessIncomeSchema>;

export interface TaxBreakdown {
  // Base calculation
  totalIncome: number;
  bracketTax: number;
  insuranceContribution: number;
  commonTax: number;

  // Deductions
  standardDeduction: number;
  minimumDeduction: number;
  mortgageDeduction: number;
  propertyDeduction: number;

  // Special calculations
  parentalBenefitDeduction: number;
  disabilityDeduction: number;

  // Final calculations
  totalDeductions: number;
  totalTax: number;
  netPay: number;
  marginalTaxRate: number;
  averageTaxRate: number;
}