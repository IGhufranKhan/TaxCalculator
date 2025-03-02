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
    <Card className="p-6 max-w-sm">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Total Income</h3>
          <p className="text-2xl font-bold">
            {formatCurrency(breakdown.totalIncome)}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">Bracket Tax</h3>
          <p className="text-xl">
            {formatCurrency(-breakdown.bracketTax)} kr
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">Insurance Contribution</h3>
          <p className="text-xl">
            {formatCurrency(-breakdown.insuranceContribution)} kr
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium">Common Tax</h3>
          <p className="text-xl">
            {formatCurrency(-breakdown.commonTax)} kr
          </p>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium">Net Pay</h3>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(breakdown.netPay)} kr
          </p>
        </div>

        <div className="text-sm text-gray-600">
          <p className="text-right">
            Marginal tax rate: {formatPercentage(breakdown.marginalTaxRate)}
            <br/>
            Average tax rate: {formatPercentage(breakdown.averageTaxRate)}
          </p>
        </div>
      </div>
    </Card>
  );
}