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
  const currentYear = new Date().getFullYear();

  const form = useForm<TaxCalculation>({
    resolver: zodResolver(taxCalculationSchema),
    defaultValues: {
      personalInfo: {
        birthYear: currentYear - 30,
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
      bankAndLoans: {
        savingsInterest: 0,
        bankDeposits: 0,
        loanInterest: 0,
        mortgageInterest: 0,
      },
      property: {
        primaryResidence: false,
        rentalIncome: 0,
        propertyValue: 0,
        propertyExpenses: 0,
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
    }
  });

  const onSubmit = (data: TaxCalculation) => {
    const formattedData = {
      ...data,
      income: Object.entries(data.income).reduce((acc: any, [key, value]) => {
        acc[key] = Number(value) || 0;
        return acc;
      }, {}),
      bankAndLoans: Object.entries(data.bankAndLoans).reduce((acc: any, [key, value]) => {
        acc[key] = Number(value) || 0;
        return acc;
      }, {}),
      property: {
        ...data.property,
        rentalIncome: Number(data.property.rentalIncome) || 0,
        propertyValue: Number(data.property.propertyValue) || 0,
        propertyExpenses: Number(data.property.propertyExpenses) || 0,
      }
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
                  max={String(currentYear)}
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
                    max={String(currentYear)}
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
            {[
              'salary',
              'disabilityPension',
              'workAssessmentAllowance',
              'unemploymentBenefits',
              'maternityBenefits',
              'sicknessBenefits',
              'employerBenefits',
              'dividend',
              'otherIncome'
            ].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={`income.${fieldName}` as keyof TaxCalculation['income']}
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t(`calculator.form.income.${fieldName}`)}
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
            {[
              'standardDeduction',
              'unionFee',
              'ips',
              'bsu',
              'parentalDeduction',
              'numberOfChildren',
              'otherDeductions',
              'totalDeductions',
              'incomeAfterDeductions'
            ].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={`deductions.${fieldName}` as keyof TaxCalculation['deductions']}
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t(`calculator.form.deductions.${fieldName}`)}
                    min="0"
                    max={
                      fieldName === 'unionFee' ? '8000' :
                      fieldName === 'ips' ? '15000' :
                      fieldName === 'bsu' ? '27500' : undefined
                    }
                  />
                )}
              />
            ))}
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
              {t('calculator.form.bankAndLoans')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              'savingsInterest',
              'bankDeposits',
              'loanInterest',
              'mortgageInterest'
            ].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={`bankAndLoans.${fieldName}` as keyof TaxCalculation['bankAndLoans']}
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t(`calculator.form.bankAndLoans.${fieldName}`)}
                  />
                )}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              {t('calculator.form.property')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="property.primaryResidence"
              render={({ field }) => (
                <YesNoSelect
                  field={field}
                  label={t('calculator.form.property.primaryResidence')}
                />
              )}
            />
            {[
              'rentalIncome',
              'propertyValue',
              'propertyExpenses'
            ].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={`property.${fieldName}` as keyof TaxCalculation['property']}
                render={({ field }) => (
                  <NumberInput
                    field={field}
                    label={t(`calculator.form.property.${fieldName}`)}
                  />
                )}
              />
            ))}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
          {t('calculator.form.calculate')}
        </Button>
      </form>
    </Form>
  );
}