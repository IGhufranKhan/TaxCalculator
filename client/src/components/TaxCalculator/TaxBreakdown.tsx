import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { TaxBreakdown as TaxBreakdownType } from "@shared/schema";
import { formatCurrency, formatPercentage, calculateTaxPercentages } from "./utils";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface TaxBreakdownProps {
  breakdown: TaxBreakdownType;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export function TaxBreakdown({ breakdown }: TaxBreakdownProps) {
  const { t } = useTranslation();
  const percentages = calculateTaxPercentages(breakdown);
  
  const pieData = [
    { name: 'bracketTax', value: percentages.bracketTax },
    { name: 'insurance', value: percentages.insuranceContribution },
    { name: 'commonTax', value: percentages.commonTax }
  ];

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('calculator.breakdown.salary')}
            </h3>
            <p className="text-2xl font-bold">{formatCurrency(breakdown.salary)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('calculator.breakdown.bracketTax')}
            </h3>
            <p className="text-lg">-{formatCurrency(breakdown.bracketTax)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('calculator.breakdown.insurance')}
            </h3>
            <p className="text-lg">-{formatCurrency(breakdown.insuranceContribution)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('calculator.breakdown.commonTax')}
            </h3>
            <p className="text-lg">-{formatCurrency(breakdown.commonTax)}</p>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('calculator.breakdown.netPay')}
            </h3>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(breakdown.netPay)}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t('calculator.breakdown.taxRates.marginal')}:{' '}
              <span className="font-medium">{formatPercentage(breakdown.marginalTaxRate)}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {t('calculator.breakdown.taxRates.average')}:{' '}
              <span className="font-medium">{formatPercentage(breakdown.averageTaxRate)}</span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
