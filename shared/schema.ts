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

// Deductions Schema
export const deductionsSchema = z.object({
  standardDeduction: z.number().min(0).optional(),
  unionFee: z.number().min(0).max(8000).optional(),
  ips: z.number().min(0).max(15000).optional(),
  bsu: z.number().min(0).max(27500).optional(),
  parentalDeduction: z.number().min(0).optional(),
  numberOfChildren: z.number().min(0).optional(),
  otherDeductions: z.number().min(0).optional(),
  totalDeductions: z.number().min(0).optional(),
  incomeAfterDeductions: z.number().min(0).optional(),
});

// Travel Expenses Schema
export const travelExpensesSchema = z.object({
  tripsPerYear: z.number().min(0).optional(),
  kilometersPerTrip: z.number().min(0).optional(),
  homeVisits: z.number().min(0).optional(),
  tollAndFerry: z.number().min(3300).optional(),
  totalTravelExpenses: z.number().min(0).optional(),
});

// Business Income Schema
export const businessIncomeSchema = z.object({
  fishingAgricultureIncome: z.number().min(0).optional(),
  otherBusinessIncome: z.number().min(0).optional(),
  businessProfit: z.number().min(0).optional(),
  businessLoss: z.number().min(0).optional(),
  totalIncome: z.number().min(0).optional(),
});


// Financial Information Schema
export const financialSchema = z.object({
  totalBankBalance: z.number().min(0).optional(),
  investmentValue: z.number().min(0).optional(),
  primaryResidenceValue: z.number().min(0).optional(),
  secondaryResidenceValue: z.number().min(0).optional(),
  vehicleValue: z.number().min(0).optional(),
  boatValue: z.number().min(0).optional(),
  totalAssets: z.number().min(0).optional(),

  // Loans
  mortgageShare: z.number().min(0).max(100).optional(),
  totalMortgage: z.number().min(0).optional(),
  carLoan: z.number().min(0).optional(),
  studentLoan: z.number().min(0).optional(),
  consumerLoan: z.number().min(0).optional(),
  otherLoans: z.number().min(0).optional(),
  totalDebt: z.number().min(0).optional(),

  // Capital Income and Expenses
  interestIncome: z.number().optional(),
  interestExpenses: z.number().optional(),
  investmentGainsLosses: z.number().optional(),

  // Tax Calculation
  socialSecurityContribution: z.number().min(0).optional(),
  generalIncomeTax: z.number().min(0).optional(),
  bracketTax: z.number().min(0).optional(),
  wealthTax: z.number().min(0).optional(),
  totalTax: z.number().min(0).optional(),
  withholdingPercentage: z.number().min(0).max(100).optional(),
});

export const taxCalculationSchema = z.object({
  personalInfo: personalInfoSchema,
  income: workIncomeSchema,
  businessIncome: businessIncomeSchema,
  deductions: deductionsSchema,
  travelExpenses: travelExpensesSchema,
  financial: financialSchema,
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
export type BankLoan = z.infer<typeof bankLoanSchema>; //This line was already present before the edit, and is included here for completeness.
export type Property = z.infer<typeof propertySchema>; //This line was already present before the edit, and is included here for completeness.
export type BusinessIncome = z.infer<typeof businessIncomeSchema>;
export type Deductions = z.infer<typeof deductionsSchema>;
export type TravelExpenses = z.infer<typeof travelExpensesSchema>;
export type Financial = z.infer<typeof financialSchema>;

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