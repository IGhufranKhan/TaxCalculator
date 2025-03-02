import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { TaxForm } from "@/components/TaxCalculator/Form";
import { TaxBreakdown } from "@/components/TaxCalculator/TaxBreakdown";
import { Taxberg } from "@/components/TaxCalculator/Taxberg";
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
        const annualizedIncome = annualizeAmount(formData.income, formData.period);
        const response = await apiRequest('POST', '/api/calculate-tax', {
          ...formData,
          income: annualizedIncome
        });
        const data = await response.json() as TaxBreakdownType;
        return data;
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
    <div className="min-h-screen bg-gray-50">
      <LanguageSwitcher />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-8 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('calculator.title')}
              </h1>
              <p className="mt-2 text-gray-600">
                {t('calculator.subtitle')}
              </p>
            </div>
            <img
              src="https://www.svgrepo.com/show/530438/calculator.svg"
              alt="Calculator"
              className="w-24 h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <TaxForm onCalculate={handleCalculate} />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : breakdown ? (
              <div>
                <TaxBreakdown breakdown={breakdown} />
              </div>
            ) : null}
          </div>

          {breakdown && (
            <div className="mt-8">
              <Taxberg breakdown={breakdown} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}