import { useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";

interface TaxFormProps {
  onCalculate: (data: TaxCalculation) => void;
}

interface NumberInputProps {
  field: any;
  label: string;
  min?: string;
  max?: string;
  step?: string;
}

interface YesNoSelectProps {
  field: any;
  label: string;
}

export function TaxForm({ onCalculate }: TaxFormProps) {
  const { t } = useTranslation();
  const form = useForm<TaxCalculation>({
    resolver: zodResolver(taxCalculationSchema),
    defaultValues: {
      personalInfo: {
        birthYear: new Date().getFullYear() - 30,
        spouseBirthYear: undefined,
        civilStatus: CivilStatus.SINGLE,
        hasChildren: false,
        numberOfDependents: 0,
        finnmarkDeduction: false,
        hasRegularEmployment: false,
        hasBeenOnSickLeave: false,
        hasOwnHome: false,
        hasStudentLoans: false,
        hasCarOrBoat: false,
        hasSecondHome: false,
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
        unionFee: 0,
        ips: 0,
        bsu: 0,
        parentalDeduction: 0,
        numberOfChildren: 0,
        otherDeductions: 0,
        totalDeductions: 0,
        incomeAfterDeductions: 0
      },
      travelExpenses: {
        tripsPerYear: 0,
        kilometersPerTrip: 0,
        homeVisits: 0,
        tollAndFerry: 3300,
        totalTravelExpenses: 0
      },
      period: TaxPeriod.ANNUAL,
      location: "Norway",
      businessIncome: {
        fishingAgricultureIncome: 0,
        otherBusinessIncome: 0,
        businessProfit: 0,
        businessLoss: 0,
        totalIncome: 0
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
        withholdingPercentage: 0,
      }
    }
  });

  const hasRegularEmployment = form.watch('personalInfo.hasRegularEmployment');
  const hasBeenOnSickLeave = form.watch('personalInfo.hasBeenOnSickLeave');

  // Watch income fields for minimum deduction calculation
  const relevantIncomeFields = form.watch([
    'income.salary',
    'income.disabilityPension',
    'income.workAssessmentAllowance',
    'income.unemploymentBenefits',
    'income.maternityBenefits',
    'income.sicknessBenefits',
    'income.otherIncome'
  ]);

  // Watch additional income fields for total income calculation
  const additionalIncomeFields = form.watch([
    'income.employerBenefits',
    'income.dividend'
  ]);

  const businessIncomeFields = form.watch([
    'businessIncome.fishingAgricultureIncome',
    'businessIncome.otherBusinessIncome',
    'businessIncome.businessProfit',
    'businessIncome.businessLoss'
  ]);

  // Calculate minimum deduction
  useEffect(() => {
    const totalRelevantIncome = relevantIncomeFields.reduce((sum, value) => sum + (Number(value) || 0), 0);
    const minimumDeduction = totalRelevantIncome < 200000 ? totalRelevantIncome * 0.46 : 92000;
    form.setValue('deductions.standardDeduction', minimumDeduction);
  }, [...relevantIncomeFields]);

  // Calculate total income
  useEffect(() => {
    const totalIncome = [
      ...relevantIncomeFields,
      ...additionalIncomeFields,
      ...businessIncomeFields
    ].reduce((sum, value) => sum + (Number(value) || 0), 0);

    form.setValue('businessIncome.totalIncome', totalIncome);
  }, [...relevantIncomeFields, ...additionalIncomeFields, ...businessIncomeFields]);

  const onSubmit = (data: TaxCalculation) => {
    const formattedData = {
      ...data,
      income: Object.entries(data.income).reduce((acc: any, [key, value]) => {
        acc[key] = Number(value) || 0;
        return acc;
      }, {}),
      financial: Object.entries(data.financial).reduce((acc: any, [key, value]) => {
        acc[key] = Number(value) || 0;
        return acc;
      }, {})
    };
    console.log('Formatted form data:', formattedData);
    onCalculate(formattedData);
  };

  const NumberInput = ({ field, label, min = "0", max, step = "1" }: NumberInputProps) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          type="number"
          {...field}
          onChange={(e) => {
            const value = e.target.value === '' ? 0 : Number(e.target.value);
            field.onChange(value);
          }}
          min={min}
          max={max}
          step={step}
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              {t('calculator.form.personalInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="personalInfo.birthYear"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.personalInfo.birthYear')}
                  min="1900"
                  max={String(new Date().getFullYear())}
                  step="1"
                />
              )}
            />

            <FormField
              control={form.control}
              name="personalInfo.civilStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('calculator.form.personalInfo.civilStatus')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CivilStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {t(`calculator.form.personalInfo.civilStatus.${status}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('personalInfo.civilStatus') === CivilStatus.MARRIED && (
              <FormField
                control={form.control}
                name="personalInfo.spouseBirthYear"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.personalInfo.spouseBirthYear')}
                    min="1900"
                    max={String(new Date().getFullYear())}
                    step="1"
                  />
                )}
              />
            )}

            <FormField
              control={form.control}
              name="personalInfo.finnmarkDeduction"
              render={({ field }) => (
                <YesNoSelect
                  field={field}
                  label={t('calculator.form.personalInfo.finnmarkDeduction')}
                />
              )}
            />

            {[
              { name: 'hasChildren' as const, label: t('calculator.form.personalInfo.hasChildren') },
              { name: 'hasRegularEmployment' as const, label: t('calculator.form.personalInfo.hasRegularEmployment') },
              { name: 'hasBeenOnSickLeave' as const, label: t('calculator.form.personalInfo.hasBeenOnSickLeave') },
              { name: 'hasOwnHome' as const, label: t('calculator.form.personalInfo.hasOwnHome') },
              { name: 'hasStudentLoans' as const, label: t('calculator.form.personalInfo.hasStudentLoans') },
              { name: 'hasCarOrBoat' as const, label: t('calculator.form.personalInfo.hasCarOrBoat') },
              { name: 'hasSecondHome' as const, label: t('calculator.form.personalInfo.hasSecondHome') },
              { name: 'hasShares' as const, label: t('calculator.form.personalInfo.hasShares') }
            ].map(({ name, label }) => (
              <FormField
                key={name}
                control={form.control}
                name={`personalInfo.${name}`}
                render={({ field }) => (
                  <YesNoSelect field={field} label={label} />
                )}
              />
            ))}

            {form.watch('personalInfo.hasChildren') && (
              <FormField
                control={form.control}
                name="personalInfo.numberOfDependents"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.personalInfo.numberOfDependents')}
                    min="0"
                    step="1"
                  />
                )}
              />
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              {t('calculator.form.income')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="income.salary"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.income.salary')}
                />
              )}
            />

            {!hasRegularEmployment && hasBeenOnSickLeave && (
              <>
                <FormField
                  control={form.control}
                  name="income.disabilityPension"
                  render={({ field }) => (
                    <NumberInput
                      field={field}
                      label={t('calculator.form.income.disabilityPension')}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="income.workAssessmentAllowance"
                  render={({ field }) => (
                    <NumberInput
                      field={field}
                      label={t('calculator.form.income.workAssessmentAllowance')}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="income.unemploymentBenefits"
                  render={({ field }) => (
                    <NumberInput
                      field={field}
                      label={t('calculator.form.income.unemploymentBenefits')}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="income.maternityBenefits"
                  render={({ field }) => (
                    <NumberInput
                      field={field}
                      label={t('calculator.form.income.maternityBenefits')}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="income.sicknessBenefits"
                  render={({ field }) => (
                    <NumberInput
                      field={field}
                      label={t('calculator.form.income.sicknessBenefits')}
                    />
                  )}
                />
              </>
            )}

            {hasRegularEmployment && (
              <FormField
                control={form.control}
                name="income.employerBenefits"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.income.employerBenefits')}
                  />
                )}
              />
            )}

            <FormField
              control={form.control}
              name="income.dividend"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.income.dividend')}
                />
              )}
            />
            <FormField
              control={form.control}
              name="income.otherIncome"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.income.otherIncome')}
                />
              )}
            />
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              {t('calculator.form.businessIncome')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="businessIncome.fishingAgricultureIncome"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.businessIncome.fishingAgricultureIncome')}
                />
              )}
            />
            <FormField
              control={form.control}
              name="businessIncome.otherBusinessIncome"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.businessIncome.otherBusinessIncome')}
                />
              )}
            />
            <FormField
              control={form.control}
              name="businessIncome.businessProfit"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.businessIncome.businessProfit')}
                />
              )}
            />
            <FormField
              control={form.control}
              name="businessIncome.businessLoss"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.businessIncome.businessLoss')}
                />
              )}
            />

            <Separator className="my-4" />

            <FormField
              control={form.control}
              name="businessIncome.totalIncome"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.businessIncome.totalIncome')}
                  disabled
                />
              )}
            />
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              {t('calculator.form.deductions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="deductions.standardDeduction"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.deductions.standardDeduction')}
                  min="0"
                  disabled
                />
              )}
            />
            <FormField
              control={form.control}
              name="deductions.unionFee"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.deductions.unionFee')}
                  min="0"
                  max="8000"
                />
              )}
            />
            <FormField
              control={form.control}
              name="deductions.ips"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.deductions.ips')}
                  min="0"
                  max="15000"
                />
              )}
            />
            <FormField
              control={form.control}
              name="deductions.bsu"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.deductions.bsu')}
                  min="0"
                  max="27500"
                />
              )}
            />
            <FormField
              control={form.control}
              name="deductions.parentalDeduction"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.deductions.parentalDeduction')}
                  min="0"
                />
              )}
            />
            <FormField
              control={form.control}
              name="deductions.numberOfChildren"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.deductions.numberOfChildren')}
                  min="0"
                />
              )}
            />
            <Separator className="my-4" />
            <FormField
              control={form.control}
              name="deductions.otherDeductions"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.deductions.otherDeductions')}
                  min="0"
                />
              )}
            />
            <FormField
              control={form.control}
              name="deductions.totalDeductions"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.deductions.totalDeductions')}
                  min="0"
                />
              )}
            />
            <FormField
              control={form.control}
              name="deductions.incomeAfterDeductions"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label={t('calculator.form.deductions.incomeAfterDeductions')}
                  min="0"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              {t('calculator.form.travelExpenses')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              'tripsPerYear',
              'kilometersPerTrip',
              'homeVisits',
              'tollAndFerry',
              'totalTravelExpenses'
            ].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={`travelExpenses.${fieldName}` as keyof TaxCalculation['travelExpenses']}
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t(`calculator.form.travelExpenses.${fieldName}`)}
                    min={fieldName === 'tollAndFerry' ? '3300' : '0'}
                  />
                )}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              {t('calculator.form.financial.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="financial.totalBankBalance"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.totalBankBalance')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.investmentValue"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.investmentValue')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.primaryResidenceValue"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.primaryResidenceValue')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.secondaryResidenceValue"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.secondaryResidenceValue')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.vehicleValue"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.vehicleValue')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.boatValue"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.boatValue')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.totalAssets"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.totalAssets')}
                    min="0"
                  />
                )}
              />
              <Separator className="my-6" />
              <h3 className="text-lg font-medium mb-4">
                {t('calculator.form.financial.loans')}
              </h3>
              <FormField
                control={form.control}
                name="financial.mortgageShare"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.mortgageShare')}
                    min="0"
                    max="100"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.totalMortgage"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.totalMortgage')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.carLoan"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.carLoan')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.studentLoan"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.studentLoan')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.consumerLoan"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.consumerLoan')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.otherLoans"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.otherLoans')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.totalDebt"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.totalDebt')}
                    min="0"
                  />
                )}
              />
              <Separator className="my-6" />
              <h3 className="text-lg font-medium mb-4">
                {t('calculator.form.financial.capitalSection')}
              </h3>
              <FormField
                control={form.control}
                name="financial.interestIncome"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.interestIncome')}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.interestExpenses"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.interestExpenses')}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.investmentGainsLosses"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.investmentGainsLosses')}
                  />
                )}
              />
              <Separator className="my-6" />
              <h3 className="text-lg font-medium mb-4">
                {t('calculator.form.financial.taxCalculation')}
              </h3>
              <FormField
                control={form.control}
                name="financial.socialSecurityContribution"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.socialSecurityContribution')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.generalIncomeTax"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.generalIncomeTax')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.bracketTax"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.bracketTax')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.wealthTax"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.wealthTax')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.totalTax"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.totalTax')}
                    min="0"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="financial.withholdingPercentage"
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t('calculator.form.financial.withholdingPercentage')}
                    min="0"
                    max="100"
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
          {t('calculator.form.calculate')}
        </Button>
      </form>
    </Form>
  );
}