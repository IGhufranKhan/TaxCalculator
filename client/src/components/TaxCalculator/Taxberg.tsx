import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { TaxBreakdown } from "@shared/schema";
import { formatCurrency } from "./utils";

interface TaxbergProps {
  breakdown: TaxBreakdown;
}

export function Taxberg({ breakdown }: TaxbergProps) {
  const { t } = useTranslation();
  const employerTax = 70500; // This should come from calculation

  return (
    <Card className="p-6 bg-sky-50">
      <h2 className="text-2xl font-bold mb-4">The Taxberg</h2>
      <div className="relative h-[500px]">
        {/* Iceberg SVG */}
        <svg
          className="w-full h-full"
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Above water - visible part */}
          <path
            d="M50,150 L200,50 L350,150 L300,300 L100,300 Z"
            fill="#a5d8ff"
            className="drop-shadow-lg"
          />
          {/* Below water - submerged part */}
          <path
            d="M100,300 L50,500 L350,500 L300,300 Z"
            fill="#4dabf7"
            className="opacity-80"
          />

          {/* Norwegian flag */}
          <g transform="translate(180, 30)">
            <rect x="0" y="0" width="40" height="30" fill="#ED2939"/>
            <rect x="12" y="0" width="4" height="30" fill="#fff"/>
            <rect x="0" y="13" width="40" height="4" fill="#fff"/>
          </g>
        </svg>

        {/* Text Overlays */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-center">
          <p className="text-3xl font-bold">{formatCurrency(breakdown.netPay)} kr</p>
          <p className="text-lg text-gray-600">Net pay</p>
        </div>

        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 text-center w-full px-4">
          <p className="text-2xl font-bold">{formatCurrency(breakdown.totalTax)} kr</p>
          <p className="text-lg text-gray-600">Tax you pay</p>
        </div>

        <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 text-center w-full px-4">
          <p className="text-xl font-bold">{formatCurrency(employerTax)} kr</p>
          <p className="text-md text-gray-600">Tax the employer pays</p>
        </div>

        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-center w-full px-4">
          <p className="text-xl font-bold">{formatCurrency(breakdown.totalTax + employerTax)} kr</p>
          <p className="text-md text-gray-600">Total tax paid</p>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center w-full px-4">
          <div className="bg-white/80 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-xl font-semibold">
              Real tax rate: {(breakdown.averageTaxRate).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Did you know your employer also pays tax on your salary? It costs the employer {formatCurrency(employerTax)} kr to pay you {formatCurrency(breakdown.netPay)} kr. In other words, every time you spend 10 kr of your hard-earned money, 3.88 kr goes to the government.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}