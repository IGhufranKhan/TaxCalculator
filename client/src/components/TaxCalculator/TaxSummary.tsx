import { TaxCalculation } from "@shared/schema";

interface TaxSummaryProps {
  data: TaxCalculation;
}

export function TaxSummary({ data }: TaxSummaryProps) {
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString("no-NO")} kr`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const calculateMarginalRate = () => {
    const income = data.businessIncome.totalIncome;
    if (income <= 217400) return 0;
    if (income <= 306050) return 1.7;
    if (income <= 697150) return 4.0;
    if (income <= 942400) return 13.7;
    if (income <= 1410750) return 16.7;
    return 17.7;
  };

  const calculateAverageRate = () => {
    const totalIncome = data.businessIncome.totalIncome;
    if (!totalIncome) return 0;
    return (data.financial.totalTax / totalIncome) * 100;
  };

  return (
    <div className="mt-8 p-6 rounded-xl border border-blue-500 bg-white">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Withholding</h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-blue-900">Total Income</span>
          <span className="text-lg">{formatCurrency(data.businessIncome.totalIncome)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-600">
          <span>Total Deductions</span>
          <span>{formatCurrency(data.deductions.totalDeductions)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-600">
          <span>Income After Deductions</span>
          <span>{formatCurrency(data.deductions.incomeAfterDeductions)}</span>
        </div>

        <div className="flex justify-between items-center font-semibold text-blue-900">
          <span>Total Tax</span>
          <span className="text-lg">{formatCurrency(data.financial.totalTax)}</span>
        </div>

        <div className="flex justify-between items-center font-bold text-blue-900 text-xl">
          <span>Net Income</span>
          <span>{formatCurrency(data.businessIncome.totalIncome - data.financial.totalTax)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-600 mt-4">
          <span>Marginal tax rate</span>
          <span>{formatPercentage(calculateMarginalRate())}</span>
        </div>

        <div className="flex justify-between items-center text-gray-600">
          <span>Average tax rate</span>
          <span>{formatPercentage(calculateAverageRate())}</span>
        </div>
      </div>
    </div>
  );
}