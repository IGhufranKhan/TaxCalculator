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

  const { data: breakdown, isLoading } = useQuery({
    queryKey: ['/api/calculate-tax', formData],
    queryFn: async () => {
      if (!formData) return null;
      try {
        const response = await apiRequest('POST', '/api/calculate-tax', {
          ...formData,
          income: {
            ...formData.income,
            salary: annualizeAmount(formData.income.salary, formData.period)
          }
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
    <div className="min-h-screen bg-white">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="calculator-header">
            <img 
              src="/calculator-illustration.svg" 
              alt="Calculator" 
              className="calculator-illustration"
            />
            <h1 className="calculator-title">
              <span>Calculate</span>
              <span>Your Taxes</span>
            </h1>
            <p className="calculator-subtitle">
              Hassle-free.
            </p>
            <p className="calculator-description">
              {t('calculator.subtitle')}
            </p>
          </header>

          <div className="card mb-8">
            <TaxForm onCalculate={handleCalculate} />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : breakdown ? (
            <div className="card">
              <TaxBreakdown breakdown={breakdown} />
            </div>
          ) : null}

          <div className="mt-12">
            <img 
              src="/client/src/pages/UI Image for Tax Calculator.png" 
              alt="Norwegian Iceberg" 
              className="w-full max-w-2xl mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}