import { TaxCalculation } from "@shared/schema";

interface TaxSummaryProps {
  data: TaxCalculation;
}

export function TaxSummary({ data }: TaxSummaryProps) {
  const formatCurrency = (value: number | undefined) => {
    return `${(value || 0).toLocaleString("no-NO")} kr`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const calculateMarginalRate = () => {
    const income = data.businessIncome?.totalIncome || 0;
    if (income <= 217400) return 0;
    if (income <= 306050) return 1.7;
    if (income <= 697150) return 4.0;
    if (income <= 942400) return 13.7;
    if (income <= 1410750) return 16.7;
    return 17.7;
  };

  const calculateAverageRate = () => {
    const totalIncome = data.businessIncome?.totalIncome || 0;
    const totalTax = data.financial?.totalTax || 0;
    if (!totalIncome) return 0;
    return (totalTax / totalIncome) * 100;
  };

  return (
    <div className="mt-8 p-6 rounded-xl border border-blue-100 bg-white shadow-sm">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Withholding</h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-blue-900">Total Income</span>
          <span className="text-lg text-blue-900">{formatCurrency(data.businessIncome?.totalIncome)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-600">
          <span>Total Deductions</span>
          <span>- {formatCurrency(data.deductions?.totalDeductions)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-600">
          <span>Income After Deductions</span>
          <span>{formatCurrency(data.deductions?.incomeAfterDeductions)}</span>
        </div>

        <div className="flex justify-between items-center font-semibold text-blue-900">
          <span>Total Tax</span>
          <span className="text-lg">{formatCurrency(data.financial?.totalTax)}</span>
        </div>

        <div className="flex justify-between items-center font-bold text-blue-900 text-xl mt-2">
          <span>Net Income</span>
          <span>{formatCurrency(
            (data.businessIncome?.totalIncome || 0) - (data.financial?.totalTax || 0)
          )}</span>
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