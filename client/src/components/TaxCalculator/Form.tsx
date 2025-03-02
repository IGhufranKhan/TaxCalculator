import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { taxCalculationSchema, TaxPeriod, CivilStatus } from "@shared/schema";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TaxFormProps {
  onCalculate: (data: any) => void;
}

export function TaxForm({ onCalculate }: TaxFormProps) {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(taxCalculationSchema),
    defaultValues: {
      personalInfo: {
        civilStatus: CivilStatus.SINGLE,
        age: 30,
        hasChildren: false,
        numberOfDependents: 0,
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

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
    onCalculate(data);
  };

  const NumberInput = ({ field, label }: any) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input 
          type="number" 
          {...field} 
          onChange={(e) => field.onChange(Number(e.target.value))}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('calculator.form.personalInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <FormField
              control={form.control}
              name="personalInfo.age"
              render={({ field }) => (
                <NumberInput field={field} label={t('calculator.form.personalInfo.age')} />
              )}
            />

            <FormField
              control={form.control}
              name="personalInfo.hasChildren"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{t('calculator.form.personalInfo.hasChildren')}</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personalInfo.numberOfDependents"
              render={({ field }) => (
                <NumberInput field={field} label={t('calculator.form.personalInfo.numberOfDependents')} />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('calculator.form.income')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  name={`income.${fieldName}`}
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

        <Card>
          <CardHeader>
            <CardTitle>{t('calculator.form.bankAndLoans')}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'savingsInterest',
              'bankDeposits',
              'loanInterest',
              'mortgageInterest'
            ].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={`bankAndLoans.${fieldName}`}
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

        <Card>
          <CardHeader>
            <CardTitle>{t('calculator.form.property')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="property.primaryResidence"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{t('calculator.form.property.primaryResidence')}</FormLabel>
                </FormItem>
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
                name={`property.${fieldName}`}
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

        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('calculator.form.period')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaxPeriod).map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {t('calculator.form.calculate')}
        </Button>
      </form>
    </Form>
  );
}