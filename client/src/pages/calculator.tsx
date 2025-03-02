import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { TaxForm } from "@/components/TaxCalculator/Form";
import { TaxBreakdown } from "@/components/TaxCalculator/TaxBreakdown";
import { Taxberg } from "@/components/TaxCalculator/Taxberg";
import { apiRequest } from "@/lib/queryClient";
import type { TaxBreakdown as TaxBreakdownType } from "@shared/schema";
import { annualizeAmount } from "@/components/TaxCalculator/utils";

export default function Calculator() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(null);

  const { data: breakdown, isLoading } = useQuery({
    queryKey: ['/api/calculate-tax', formData],
    queryFn: async () => {
      if (!formData) return null;
      const annualizedIncome = annualizeAmount(formData.income, formData.period);
      const response = await apiRequest('POST', '/api/calculate-tax', {
        ...formData,
        income: annualizedIncome
      });
      return response.json() as Promise<TaxBreakdownType>;
    },
    enabled: !!formData
  });

  return (
    <div className="min-h-screen bg-gray-50">
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
              <TaxForm onCalculate={setFormData} />
            </div>
            
            {breakdown && (
              <div>
                <TaxBreakdown breakdown={breakdown} />
              </div>
            )}
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
