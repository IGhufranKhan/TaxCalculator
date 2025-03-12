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

const formatCurrency = (num: number) => new Intl.NumberFormat('no-NO', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}).format(num);

export default function Calculator() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<TaxCalculation | null>(null);
  const employerTax = 70500; // Fixed employer tax amount

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

              <div className="mt-12 relative">
                {/* Base image */}
                <img src={"/UI Image for Tax Calculator.png"} alt="Tax Calculator" className="w-full" />

                {/* Text overlays */}
                <div className="absolute inset-0 flex flex-col">
                  {/* Net Income */}
                  <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-center">
                    <p className="text-3xl font-bold text-[#4B4AFF]">{formatCurrency(breakdown.netPay)} kr</p>
                    <p className="text-lg">Net pay</p>
                  </div>

                  {/* Tax you pay */}
                  <div className="absolute top-[45%] left-1/2 -translate-x-1/2 text-center">
                    <p className="text-2xl font-bold text-[#4B4AFF]">{formatCurrency(breakdown.totalTax)} kr</p>
                    <p className="text-lg">Tax you pay</p>
                  </div>

                  {/* Employer tax */}
                  <div className="absolute top-[65%] right-[20%] text-center">
                    <p className="text-xl font-bold text-[#4B4AFF]">{formatCurrency(employerTax)} kr</p>
                    <p className="text-lg">Tax the employer pays</p>
                  </div>

                  {/* Bottom stats */}
                  <div className="absolute bottom-32 w-full px-8 flex justify-between text-white">
                    <div>
                      <p className="text-lg">Total tax paid</p>
                      <p className="text-3xl font-bold">{formatCurrency(breakdown.totalTax + employerTax)} kr</p>
                    </div>
                    <div>
                      <p className="text-lg">Real tax rate</p>
                      <p className="text-3xl font-bold">{(breakdown.averageTaxRate * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Explanatory text */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p>Did you know your employer also pays tax on your salary? It costs the employer {formatCurrency(employerTax)} kr to pay you {formatCurrency(breakdown.totalIncome)} kr. In other words, every time you spend 10 kr of your hard-earned money, {((breakdown.totalTax + employerTax) / breakdown.totalIncome * 10).toFixed(2)} kr goes to the government.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}