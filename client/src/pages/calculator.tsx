import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { TaxForm } from "@/components/TaxCalculator/Form";
import { TaxBreakdown } from "@/components/TaxCalculator/TaxBreakdown";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { apiRequest } from "@/lib/queryClient";
import type { TaxBreakdown as TaxBreakdownType, TaxCalculation } from "@shared/schema";
import { annualizeAmount } from "@/components/TaxCalculator/utils";
import { useToast } from "@/hooks/use-toast";

export default function Calculator() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<TaxCalculation | null>(null);

  const { data: breakdown, isLoading, error } = useQuery({
    queryKey: ['/api/calculate-tax', formData],
    queryFn: async () => {
      if (!formData) return null;
      try {
        // Calculate annual income for each income source
        const annualizedIncome = {
          ...formData.income,
          salary: annualizeAmount(formData.income.salary, formData.period),
          businessIncome: formData.income.businessIncome ? annualizeAmount(formData.income.businessIncome, formData.period) : 0,
          freelanceIncome: formData.income.freelanceIncome ? annualizeAmount(formData.income.freelanceIncome, formData.period) : 0,
          overtimePay: formData.income.overtimePay ? annualizeAmount(formData.income.overtimePay, formData.period) : 0,
          bonuses: formData.income.bonuses ? annualizeAmount(formData.income.bonuses, formData.period) : 0,
          disabilityBenefits: formData.income.disabilityBenefits ? annualizeAmount(formData.income.disabilityBenefits, formData.period) : 0,
          parentalBenefits: formData.income.parentalBenefits ? annualizeAmount(formData.income.parentalBenefits, formData.period) : 0,
          sickPay: formData.income.sickPay ? annualizeAmount(formData.income.sickPay, formData.period) : 0,
        };

        const response = await apiRequest('POST', '/api/calculate-tax', {
          ...formData,
          income: annualizedIncome
        });
        return await response.json() as TaxBreakdownType;
      } catch (err) {
        console.error('Tax calculation error:', err);
        toast({
          title: "Error",
          description: "Failed to calculate tax. Please try again.",
          variant: "destructive"
        });
        throw err;
      }
    },
    enabled: !!formData
  });

  const handleCalculate = (data: TaxCalculation) => {
    console.log('Calculating tax for:', data);
    setFormData(data);
  };

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('calculator.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('calculator.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card rounded-lg p-6">
              <TaxForm onCalculate={handleCalculate} />
            </div>

            <div className="space-y-8">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : breakdown ? (
                <div className="glass-card rounded-lg">
                  <TaxBreakdown breakdown={breakdown} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}