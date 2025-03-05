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
    <Card className="p-6 bg-white shadow-sm">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Total Income</h2>
          <p className="text-3xl font-bold">
            {formatCurrency(breakdown.totalIncome)}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-1">Bracket Tax</h2>
          <p className="text-xl">
            {formatCurrency(-breakdown.bracketTax)} kr
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-1">Insurance Contribution</h2>
          <p className="text-xl">
            {formatCurrency(-breakdown.insuranceContribution)} kr
          </p>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-1">Common Tax</h2>
          <p className="text-xl">
            {formatCurrency(-breakdown.commonTax)} kr
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h2 className="text-lg font-medium mb-1">Net Pay</h2>
          <p className="text-3xl font-bold text-red-600">
            {formatCurrency(breakdown.netPay)} kr
          </p>
        </div>

        <div className="text-right text-gray-600 text-sm pt-2">
          <p>Marginal tax rate: {formatPercentage(breakdown.marginalTaxRate)}</p>
          <p>Average tax rate: {formatPercentage(breakdown.averageTaxRate)}</p>
        </div>
      </div>
    </Card>
  );
}