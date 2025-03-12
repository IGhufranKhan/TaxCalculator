import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { TaxBreakdown as TaxBreakdownType } from "@shared/schema";
import { formatCurrency, formatPercentage } from "./utils";

interface TaxBreakdownProps {
  breakdown: TaxBreakdownType;
}

export function TaxBreakdown({ breakdown }: TaxBreakdownProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        {/* Net Income */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-700">Net Income</h2>
          <p className="text-xl font-bold text-blue-700">
            {formatCurrency(breakdown.netPay)} kr
          </p>
        </div>

        {/* Total Income */}
        <div className="flex justify-between items-center">
          <h2 className="text-md font-semibold text-[#4B4AFF]">Total Income</h2>
          <p className="text-md font-bold text-[#4B4AFF]">
            {formatCurrency(breakdown.totalIncome)} kr
          </p>
        </div>

        {/* Total Deductions */}
        <div className="flex justify-between text-gray-600 items-center">
          <h2 className="text-md font-medium">Total Deductions</h2>
          <p className="text-md">{formatCurrency(-breakdown.bracketTax)} kr</p>
        </div>

        {/* Income After Deductions */}
        <div className="flex justify-between text-gray-600 items-center">
          <h2 className="text-md font-medium">Income After Deductions</h2>
          <p className="text-md">{formatCurrency(breakdown.netPay)} kr</p>
        </div>


        {/* Total Tax */}
        <div className="flex justify-between items-center">
          <h2 className="text-md font-semibold text-[#4B4AFF]">Total Tax</h2>
          <p className="text-md font-bold text-[#4B4AFF]">
            {formatCurrency(breakdown.totalTax)} kr
          </p>
        </div>

        {/* Tax Rates */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Marginal tax rate</p>
            <p className="text-gray-900">{formatPercentage(breakdown.marginalTaxRate)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Average tax rate</p>
            <p className="text-gray-900">{formatPercentage(breakdown.averageTaxRate)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}