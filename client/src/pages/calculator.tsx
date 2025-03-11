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
    <div className="min-h-screen bg-white relative">
      {/* Top Left Section (Logo) */}
      <div className="absolute top-4 left-3">
        <img src={import.meta.env.BASE_URL + "Logo.png"} alt="Logo" className="h-10 w-auto" />
      </div>

      {/* Top Right Section (Language Switcher) */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center justify-between py-6 bg-white">
            {/* Left Section: Text */}
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold leading-tight text-gray-900">
                Calculate <br />
                <span className="relative text-blue-600">
                  Your <span className="bg-blue-300 px-2 py-1 rounded">Taxes</span>
                </span>
                <br />
                Hassle-free.
              </h1>
              <p className="mt-4 text-gray-600 text-lg">
                An easy-to-use tax calculator designed for Norway. Quick, accurate, and free.
              </p>
            </div>

            {/* Right Section: Image */}
            <div className="max-w-sm">
              <img src={import.meta.env.BASE_URL + "Frame.png"} alt="Tax Calculator" />
            </div>
          </header>

          <div className="mb-8">
            <h2 className="text-2xl font-bold leading-tight text-gray-900">Tax Calculator</h2>
            <p className="text-gray-600 text-lg">Calculate your taxes easily through our tax calculator designed specifically for Norway. </p>
            <TaxForm onCalculate={handleCalculate} />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : breakdown ? (
            <div>
              <TaxBreakdown breakdown={breakdown} />
            </div>
          ) : null}

          <div className="mt-12">
            <img src={"/UI Image for Tax Calculator.png"} alt="Tax Calculator" />
          </div>
        </div>
      </div>
    </div>
  );
}