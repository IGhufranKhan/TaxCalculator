import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { TaxBreakdown } from "@shared/schema";
import { formatCurrency } from "./utils";

interface TaxbergProps {
  breakdown: TaxBreakdown;
}

export function Taxberg({ breakdown }: TaxbergProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-6 bg-sky-50">
      <div className="relative h-[400px]">
        {/* Iceberg SVG */}
        <svg
          className="w-full h-full"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M200,50 L300,150 L250,300 L150,300 L100,150 Z"
            fill="#a5d8ff"
            className="drop-shadow-lg"
          />
          <path
            d="M150,300 L100,400 L300,400 L250,300 Z"
            fill="#4dabf7"
            className="opacity-80"
          />
        </svg>

        {/* Text Overlays */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 text-center">
          <p className="text-2xl font-bold">{formatCurrency(breakdown.netPay)}</p>
          <p className="text-sm text-muted-foreground">Net pay</p>
        </div>

        <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 text-center">
          <p className="text-2xl font-bold">{formatCurrency(breakdown.totalTax)}</p>
          <p className="text-sm text-muted-foreground">Total tax paid</p>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center w-full px-4">
          <p className="text-lg font-semibold">
            Real tax rate: {(breakdown.averageTaxRate).toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Tax with you and the employer both paying tax. What used to be 34.7% turns out to be 34.0%, meaning we pay more in tax now than what was reserved at first.
          </p>
        </div>
      </div>
    </Card>
  );
}
