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
  disabled?: boolean;
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
        withholdingPercentage: 0
      },
      travelExpenses: {
        tripsPerYear: 0,
        kilometersPerTrip: 0,
        homeVisits: 0,
        tollAndFerry: 0,
        totalTravelExpenses: 0
      }
    }
  });

  // Watch income fields for total income calculation
  const incomeFields = form.watch([
    'income.salary',
    'income.disabilityPension',
    'income.workAssessmentAllowance',
    'income.unemploymentBenefits',
    'income.maternityBenefits',
    'income.sicknessBenefits',
    'income.employerBenefits',
    'income.dividend',
    'income.otherIncome'
  ]);

  const businessIncomeFields = form.watch([
    'businessIncome.fishingAgricultureIncome',
    'businessIncome.otherBusinessIncome',
    'businessIncome.businessProfit',
    'businessIncome.businessLoss'
  ]);

  // Calculate total income
  useEffect(() => {
    const totalIncome = [
      ...incomeFields,
      ...businessIncomeFields
    ].reduce((sum, value) => sum + (Number(value) || 0), 0);

    form.setValue('businessIncome.totalIncome', totalIncome);
  }, [...incomeFields, ...businessIncomeFields]);

  // Calculate minimum deduction
  useEffect(() => {
    const totalRelevantIncome = incomeFields.reduce((sum, value) => sum + (Number(value) || 0), 0);
    const minimumDeduction = totalRelevantIncome < 200000 ? totalRelevantIncome * 0.46 : 92000;
    form.setValue('deductions.standardDeduction', minimumDeduction);
  }, [...incomeFields]);

  const hasChildren = form.watch('personalInfo.hasChildren');
  const numberOfChildren = form.watch('deductions.numberOfChildren');

  useEffect(() => {
    const children = Number(numberOfChildren) || 0;
    let parentalDeduction = 0;

    if (hasChildren && children > 0) {
      parentalDeduction = 25000; // First child
      if (children > 1) {
        parentalDeduction += (children - 1) * 15000; // Additional children
      }
    }

    form.setValue('deductions.parentalDeduction', parentalDeduction);
  }, [numberOfChildren, hasChildren, form]);

  const deductionFields = form.watch([
    'deductions.standardDeduction',
    'deductions.unionFee',
    'deductions.ips',
    'deductions.bsu',
    'deductions.parentalDeduction',
    'deductions.otherDeductions'
  ]);

  useEffect(() => {
    const [
      standardDeduction,
      unionFee,
      ips,
      bsu,
      parentalDeduction,
      otherDeductions
    ] = deductionFields.map(value => Number(value) || 0);

    const totalDeductions =
      standardDeduction +
      (0.22 * (unionFee + ips)) + // Combined unionFee and IPS with 22%
      (0.10 * bsu) +
      (0.22 * parentalDeduction) +
      (Number(form.watch('travelExpenses.totalTravelExpenses')) || 0) +
      (0.22 * otherDeductions);

    form.setValue('deductions.totalDeductions', Math.round(totalDeductions));

    // Calculate income after deductions
    const totalIncome = form.getValues('businessIncome.totalIncome');
    form.setValue('deductions.incomeAfterDeductions', Math.round(totalIncome - totalDeductions));
  }, [...deductionFields, form.watch('businessIncome.totalIncome'), form.watch('travelExpenses.totalTravelExpenses')]);


  const travelFields = form.watch([
    'travelExpenses.tripsPerYear',
    'travelExpenses.kilometersPerTrip',
    'travelExpenses.homeVisits',
    'travelExpenses.tollAndFerry'
  ]);

  useEffect(() => {
    const [trips, kilometers, homeVisits, tollAndFerry] = travelFields.map(v => Number(v) || 0);

    // Calculate commuter expenses
    const commuterCalc = (trips * kilometers * 1.83) - 14950;
    const commuterExpenses = commuterCalc < 0 ? 0 : commuterCalc;

    // Calculate home visit expenses
    const homeVisitCalc = homeVisits - 3300;
    const homeVisitExpenses = homeVisitCalc < 0 ? 0 : homeVisitCalc;

    // Sum all expenses and cap at 97000
    const totalExpenses = Math.min(97000, commuterExpenses + homeVisitExpenses + tollAndFerry);

    form.setValue('travelExpenses.totalTravelExpenses', Math.round(totalExpenses));
  }, [...travelFields]);

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

  const NumberInput = ({ field, label, min = "0", max, step = "1", disabled = false }: NumberInputProps) => (
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

  const hasRegularEmployment = form.watch('personalInfo.hasRegularEmployment');
  const hasBeenOnSickLeave = form.watch('personalInfo.hasBeenOnSickLeave');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              {t('calculator.form.personalInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="personalInfo.hasChildren"
              render={({ field }) => (
                <YesNoSelect field={field} label={t('calculator.form.personalInfo.hasChildren')} />
              )}
            />
            <FormField
              control={form.control}
              name="personalInfo.birthYear"
              render={({ field }) => (
                <NumberInput field={field} label={t('calculator.form.personalInfo.birthYear')} min="1900" max={new Date().getFullYear().toString()} />
              )}
            />
            {form.watch('personalInfo.civilStatus') === CivilStatus.MARRIED && (
              <FormField
                control={form.control}
                name="personalInfo.spouseBirthYear"
                render={({ field }) => (
                  <NumberInput field={field} label={t('calculator.form.personalInfo.spouseBirthYear')} min="1900" max={new Date().getFullYear().toString()} />
                )}
              />
            )}
            <FormField control={form.control} name="personalInfo.civilStatus" render={({ field }) => (
              <FormItem>
                <FormLabel>{t('calculator.form.personalInfo.civilStatus')}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CivilStatus.SINGLE}>{t('calculator.form.personalInfo.civilStatus.single')}</SelectItem>
                      <SelectItem value={CivilStatus.MARRIED}>{t('calculator.form.personalInfo.civilStatus.married')}</SelectItem>
                      <SelectItem value={CivilStatus.SEPARATED}>{t('calculator.form.personalInfo.civilStatus.separated')}</SelectItem>
                      <SelectItem value={CivilStatus.DIVORCED}>{t('calculator.form.personalInfo.civilStatus.divorced')}</SelectItem>
                      <SelectItem value={CivilStatus.WIDOWED}>{t('calculator.form.personalInfo.civilStatus.widowed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField
              control={form.control}
              name="personalInfo.finnmarkDeduction"
              render={({ field }) => (
                <YesNoSelect field={field} label={t('calculator.form.personalInfo.finnmarkDeduction')} />
              )}
            />
            <FormField
              control={form.control}
              name="personalInfo.hasRegularEmployment"
              render={({ field }) => (
                <YesNoSelect field={field} label={t('calculator.form.personalInfo.hasRegularEmployment')} />
              )}
            />
            <FormField
              control={form.control}
              name="personalInfo.hasBeenOnSickLeave"
              render={({ field }) => (
                <YesNoSelect field={field} label={t('calculator.form.personalInfo.hasBeenOnSickLeave')} />
              )}
            />
            <FormField
              control={form.control}
              name="personalInfo.hasOwnHome"
              render={({ field }) => (
                <YesNoSelect field={field} label={t('calculator.form.personalInfo.hasOwnHome')} />
              )}
            />
            <FormField
              control={form.control}
              name="personalInfo.hasStudentLoans"
              render={({ field }) => (
                <YesNoSelect field={field} label={t('calculator.form.personalInfo.hasStudentLoans')} />
              )}
            />
            <FormField
              control={form.control}
              name="personalInfo.hasCarOrBoat"
              render={({ field }) => (
                <YesNoSelect field={field} label={t('calculator.form.personalInfo.hasCarOrBoat')} />
              )}
            />
            <FormField
              control={form.control}
              name="personalInfo.hasShares"
              render={({ field }) => (
                <YesNoSelect field={field} label={t('calculator.form.personalInfo.hasShares')} />
              )}
            />
          </CardContent>
        </Card>

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
                <NumberInput field={field} label={t('calculator.form.income.salary')} min="0" />
              )}
            />

            {!hasRegularEmployment && hasBeenOnSickLeave && (
              <>
                <FormField
                  control={form.control}
                  name="income.disabilityPension"
                  render={({ field }) => (
                    <NumberInput field={field} label={t('calculator.form.income.disabilityPension')} min="0" />
                  )}
                />
                <FormField
                  control={form.control}
                  name="income.workAssessmentAllowance"
                  render={({ field }) => (
                    <NumberInput field={field} label={t('calculator.form.income.workAssessmentAllowance')} min="0" />
                  )}
                />
                <FormField
                  control={form.control}
                  name="income.unemploymentBenefits"
                  render={({ field }) => (
                    <NumberInput field={field} label={t('calculator.form.income.unemploymentBenefits')} min="0" />
                  )}
                />
                <FormField
                  control={form.control}
                  name="income.maternityBenefits"
                  render={({ field }) => (
                    <NumberInput field={field} label={t('calculator.form.income.maternityBenefits')} min="0" />
                  )}
                />
                <FormField
                  control={form.control}
                  name="income.sicknessBenefits"
                  render={({ field }) => (
                    <NumberInput field={field} label={t('calculator.form.income.sicknessBenefits')} min="0" />
                  )}
                />
              </>
            )}

            {hasRegularEmployment && (
              <FormField
                control={form.control}
                name="income.employerBenefits"
                render={({ field }) => (
                  <NumberInput field={field} label={t('calculator.form.income.employerBenefits')} min="0" />
                )}
              />
            )}

            <FormField
              control={form.control}
              name="income.dividend"
              render={({ field }) => (
                <NumberInput field={field} label={t('calculator.form.income.dividend')} min="0" />
              )}
            />
            <FormField
              control={form.control}
              name="income.otherIncome"
              render={({ field }) => (
                <NumberInput field={field} label={t('calculator.form.income.otherIncome')} min="0" />
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
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              'fishingAgricultureIncome',
              'otherBusinessIncome',
              'businessProfit',
              'businessLoss',
              'totalIncome'
            ].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={`businessIncome.${fieldName}` as keyof TaxCalculation['businessIncome']}
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t(`calculator.form.businessIncome.${fieldName}`)}
                  />
                )}
              />
            ))}
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
                <NumberInput field={field} label={t('calculator.form.deductions.standardDeduction')} min="0" disabled />
              )}
            />
            <FormField
              control={form.control}
              name="deductions.unionFee"
              render={({ field }) => (
                <NumberInput field={field} label={t('calculator.form.deductions.unionFee')} min="0" max="8000" />
              )}
            />
            <FormField
              control={form.control}
              name="deductions.ips"
              render={({ field }) => (
                <NumberInput field={field} label={t('calculator.form.deductions.ips')} min="0" max="15000" />
              )}
            />
            <FormField
              control={form.control}
              name="deductions.bsu"
              render={({ field }) => (
                <NumberInput field={field} label={t('calculator.form.deductions.bsu')} min="0" max="27500" />
              )}
            />
            {hasChildren && (
              <>
                <FormField
                  control={form.control}
                  name="deductions.numberOfChildren"
                  render={({ field }) => (
                    <NumberInput
                      field={field}
                      label={t('calculator.form.deductions.numberOfChildren')}
                      min="0"
                      step="1"
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
                      disabled
                    />
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Work and commuter travel
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="travelExpenses.tripsPerYear"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label="Antall reiser per år / Number of trips per year"
                  min="0"
                />
              )}
            />
            <FormField
              control={form.control}
              name="travelExpenses.kilometersPerTrip"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label="Kilometer tur/retur per reise / Distance in kilometers (round trip) per travel"
                  min="0"
                />
              )}
            />
            <FormField
              control={form.control}
              name="travelExpenses.homeVisits"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label="Besøksreiser til hjemmet (reisekostnader til egen eller ektefelles bolig ved pendling) / Travel expenses for home visits (commuting to own or spouse's residence)"
                  min="0"
                />
              )}
            />
            <FormField
              control={form.control}
              name="travelExpenses.tollAndFerry"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label="Bompenger og fergeutgifter (over 3 300 kr i løpet av året) / Road tolls and ferry costs (exceeding 3,300 NOK annually)"
                  min="0"
                />
              )}
            />
            <FormField
              control={form.control}
              name="travelExpenses.totalTravelExpenses"
              render={({ field }) => (
                <NumberInput
                  field={field}
                  label="Sum reiseutgifter / Total travel expenses"
                  min="0"
                  disabled
                />
              )}
            />
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Andre fradrag (Other deductions)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="deductions.otherDeductions"
              render={({ field }) => (
                <NumberInput field={field} label={t('calculator.form.deductions.otherDeductions')} min="0" />
              )}
            />
            <FormField
              control={form.control}
              name="deductions.totalDeductions"
              render={({ field }) => (
                <NumberInput field={field} label={t('calculator.form.deductions.totalDeductions')} min="0" disabled />
              )}
            />
            <FormField
              control={form.control}
              name="deductions.incomeAfterDeductions"
              render={({ field }) => (
                <NumberInput field={field} label={t('calculator.form.deductions.incomeAfterDeductions')} min="0" disabled />
              )}
            />
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