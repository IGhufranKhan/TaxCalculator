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
        salary: 500000,
        businessIncome: 0,
        freelanceIncome: 0,
        overtimePay: 0,
        bonuses: 0,
        disabilityBenefits: 0,
        parentalBenefits: 0,
        sickPay: 0,
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
      location: "Norway"
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
            <FormField
              control={form.control}
              name="income.salary"
              render={({ field }) => (
                <NumberInput field={field} label={t('calculator.form.income.salary')} />
              )}
            />
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'businessIncome',
                'freelanceIncome',
                'overtimePay',
                'bonuses',
                'disabilityBenefits',
                'parentalBenefits',
                'sickPay'
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
            </div>
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