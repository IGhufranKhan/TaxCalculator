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
    <Card className="p-6 bg-white shadow-md border border-gray-300 rounded-lg">
    <div className="space-y-4">
      {/* Withholding Title */}
      <h2 className="text-lg font-bold text-[#4B4AFF]">Withholding</h2>
  
      {/* Total Income */}
      <div className="flex justify-between">
        <h2 className="text-md font-semibold text-[#4B4AFF]">Total Income</h2>
        <p className="text-md font-bold text-[#4B4AFF]">
          {formatCurrency(breakdown.totalIncome)} kr
        </p>
      </div>
  
      {/* Total Deductions */}
      <div className="flex justify-between text-gray-600">
        <h2 className="text-md font-medium">Total Deductions</h2>
        <p className="text-md">{formatCurrency(-breakdown.bracketTax)} kr</p>
      </div>
  
      {/* Income After Deductions */}
      <div className="flex justify-between text-gray-600">
        <h2 className="text-md font-medium">Income After Deductions</h2>
        <p className="text-md">{formatCurrency(breakdown.netPay)} kr</p>
      </div>
  
      {/* Divider */}
      <div className="border-t border-gray-200 pt-4"></div>
  
      {/* Total Tax */}
      <div className="flex justify-between">
        <h2 className="text-md font-semibold text-[#4B4AFF]">Total Tax</h2>
        <p className="text-md font-bold text-[#4B4AFF]">
          {formatCurrency(breakdown.totalTax)} kr
        </p>
      </div>
  
      {/* Net Income */}
      <div className="flex justify-between">
        <h2 className="text-md font-bold text-[#4B4AFF]">Net Income</h2>
        <p className="text-md font-bold text-[#4B4AFF]">
          {formatCurrency(breakdown.netPay)} kr
        </p>
      </div>
  
      {/* Divider */}
      <div className="border-t border-gray-200 pt-2"></div>
  
      {/* Tax Rates */}
      <div className="text-gray-600 text-sm text-right">
        <p>Marginal tax rate: {formatPercentage(breakdown.marginalTaxRate)}</p>
        <p>Average tax rate: {formatPercentage(breakdown.averageTaxRate)}</p>
      </div>
    </div>
  </Card>
  

  );
}