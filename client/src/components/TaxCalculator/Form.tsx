import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { taxCalculationSchema, TaxPeriod, CivilStatus, type TaxCalculation } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface NumberInputProps {
  field: any;
  label: string;
  min?: string;
  max?: string;
  step?: string;
  disabled?: boolean;
  onChange?: (e: any) => void;
  tooltip?: string;
}

interface YesNoSelectProps {
  field: any;
  label: string;
}

const LabelWithTooltip = ({ label, tooltip }: { label: string; tooltip?: string }) => (
  <div className="flex items-center gap-2">
    <span>{label}</span>
    {tooltip && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="bg-white p-4 max-w-sm rounded-lg shadow-lg border border-gray-200">
            <p className="text-sm text-gray-700 whitespace-pre-line">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </div>
);

const NumberInput = ({ field, label, tooltip, min = "0", max, step = "1", disabled = false, onChange }: NumberInputProps) => (
  <FormItem>
    <FormLabel>
      {tooltip ? (
        <LabelWithTooltip label={label} tooltip={tooltip} />
      ) : (
        label
      )}
    </FormLabel>
    <FormControl>
      <Input
        type="number"
        {...field}
        onChange={onChange || ((e) => {
          const value = e.target.value === '' ? 0 : Number(e.target.value);
          field.onChange(value);
        })}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
    </FormControl>
    <FormMessage />
  </FormItem>
);

const YesNoSelect = ({ field, label }: YesNoSelectProps) => (
  <FormItem>
    <FormLabel>{label}</FormLabel>
    <Select onValueChange={(value) => field.onChange(value === 'yes')} defaultValue={field.value ? 'yes' : 'no'}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="yes">Yes</SelectItem>
        <SelectItem value="no">No</SelectItem>
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
);

export function TaxForm() {
  const { t } = useTranslation();
  const [showResults, setShowResults] = useState(false);

  const form = useForm<TaxCalculation>({
    resolver: zodResolver(taxCalculationSchema),
    defaultValues: {
      personalInfo: {
        birthYear: new Date().getFullYear() - 30,
        spouseBirthYear: undefined,
        civilStatus: CivilStatus.SINGLE,
        hasChildren: false,
        finnmarkDeduction: false,
        hasRegularEmployment: false,
        hasBeenOnSickLeave: false,
        hasOwnHome: false,
        hasStudentLoans: false,
        hasCarOrBoat: false,
        hasShares: false
      },
      income: {
        salary: 0,
        disabilityPension: 0,
        workAssessmentAllowance: 0,
        unemploymentBenefits: 0,
        maternityBenefits: 0,
        sicknessBenefits: 0,
        employerBenefits: 0,
        dividend: 0,
        otherIncome: 0
      },
      deductions: {
        standardDeduction: 0,
        parentalDeduction: 0,
        numberOfChildren: 0,
        otherDeductions: 0,
        totalDeductions: 0,
        incomeAfterDeductions: 0,
        unionFee: 0,
        ips: 0,
        bsu: 0
      },
      businessIncome: {
        fishingAgricultureIncome: 0,
        otherBusinessIncome: 0,
        businessProfit: 0,
        businessLoss: 0,
        totalIncome: 0
      },
      travelExpenses: {
        tripsPerYear: 0,
        kilometersPerTrip: 0,
        homeVisits: 0,
        tollAndFerry: 0,
        totalTravelExpenses: 0
      },
      financial: {
        totalBankBalance: 0,
        investmentValue: 0,
        primaryResidenceValue: 0,
        secondaryResidenceValue: 0,
        vehicleValue: 0,
        boatValue: 0,
        totalAssets: 0,
        mortgageShare: 0,
        totalMortgage: 0,
        carLoan: 0,
        studentLoan: 0,
        consumerLoan: 0,
        otherLoans: 0,
        totalDebt: 0,
        interestIncome: 0,
        interestExpenses: 0,
        investmentGainsLosses: 0,
        socialSecurityContribution: 0,
        generalIncomeTax: 0,
        bracketTax: 0,
        wealthTax: 0,
        totalTax: 0,
        withholdingPercentage: 0
      },
      period: TaxPeriod.ANNUAL,
      location: "Norway"
    }
  });

  // Form state variables
  const hasRegularEmployment = form.watch('personalInfo.hasRegularEmployment');
  const hasBeenOnSickLeave = form.watch('personalInfo.hasBeenOnSickLeave');
  const hasShares = form.watch('personalInfo.hasShares');
  const hasOwnHome = form.watch('personalInfo.hasOwnHome');
  const hasCarOrBoat = form.watch('personalInfo.hasCarOrBoat');
  const hasStudentLoans = form.watch('personalInfo.hasStudentLoans');
  const hasChildren = form.watch('personalInfo.hasChildren');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="space-y-8">
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              {t('calculator.form.income')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="income.salary"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.income.salary')}
                  tooltip={t('tooltips.salary')}
                  min="0"
                />
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}

// Placeholder for TaxSummary component (replace with actual implementation)
const TaxSummary = ({ data }: { data: TaxCalculation }) => (
  <pre>{JSON.stringify(data, null, 2)}</pre>
);

const Separator = () => <hr className="my-4 border-t border-gray-300" />;