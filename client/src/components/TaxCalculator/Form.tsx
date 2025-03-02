import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { taxCalculationSchema, TaxPeriod } from "@shared/schema";
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

interface TaxFormProps {
  onCalculate: (data: any) => void;
}

export function TaxForm({ onCalculate }: TaxFormProps) {
  const { t } = useTranslation();
  const form = useForm({
    resolver: zodResolver(taxCalculationSchema),
    defaultValues: {
      income: 500000,
      period: TaxPeriod.ANNUAL,
      location: "Norway"
    }
  });

  const onSubmit = (data: any) => {
    // Convert income to number as form input returns string
    const formattedData = {
      ...data,
      income: Number(data.income)
    };
    onCalculate(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="income"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('calculator.form.income')}</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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