import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { TaxBreakdown } from "@shared/schema";
import { formatCurrency } from "./utils";

interface TaxbergProps {
  breakdown: TaxBreakdown;
}

export function Taxberg({ breakdown }: TaxbergProps) {
  const { t } = useTranslation();
  const employerTax = 70500; // Fixed employer tax amount

  return (
    <Card className="p-6 bg-[#E0F7FF]">
      <h2 className="text-2xl font-bold mb-4">The Taxberg</h2>

      {/* Cloud images */}
      <div className="absolute top-8 left-8">
        <img src="/cloud1.svg" alt="" className="w-16 opacity-80" />
      </div>
      <div className="absolute top-6 right-12">
        <img src="/cloud2.svg" alt="" className="w-20 opacity-80" />
      </div>

      <div className="relative h-[600px]">
        {/* Net pay section */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-center">
          <p className="text-3xl font-bold">{formatCurrency(breakdown.netPay)} kr</p>
          <p className="text-lg">Net pay</p>
        </div>

        {/* Tax you pay section */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 text-center">
          <p className="text-2xl font-bold">{formatCurrency(breakdown.totalTax)} kr</p>
          <p className="text-lg">Tax you pay</p>
        </div>

        {/* Employer tax section */}
        <div className="absolute top-[60%] left-[70%] text-center">
          <p className="text-xl font-bold">{formatCurrency(employerTax)} kr</p>
          <p className="text-lg">Tax the employer pays</p>
        </div>

        {/* Tax totals section */}
        <div className="absolute bottom-[30%] left-0 w-full">
          <div className="flex justify-between items-center px-8">
            <div>
              <p className="text-xl font-bold">Total tax paid</p>
              <p className="text-2xl font-bold">{formatCurrency(breakdown.totalTax + employerTax)} kr</p>
            </div>
            <div>
              <p className="text-xl font-bold">Real tax rate</p>
              <p className="text-2xl font-bold">{(breakdown.averageTaxRate).toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Explanatory text */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/80 rounded-lg p-4">
          <p className="text-sm">
            Did you know your employer also pays tax on your salary? It costs the employer {formatCurrency(employerTax)} kr to pay you {formatCurrency(breakdown.netPay)} kr. In other words, every time you spend 10 kr of your hard-earned money, 3.88 kr goes to the government.
          </p>
        </div>

        {/* Iceberg SVG */}
        <svg
          className="w-full h-full absolute inset-0 z-0"
          viewBox="0 0 400 600"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Water background */}
          <rect x="0" y="300" width="400" height="300" fill="#003366" opacity="0.8" />

          {/* Above water iceberg */}
          <path
            d="M100,150 L200,50 L300,150 L250,300 L150,300 Z"
            fill="#E8F4FF"
            className="drop-shadow-lg"
          />

          {/* Below water iceberg */}
          <path
            d="M150,300 L50,550 L350,550 L250,300 Z"
            fill="#4B9FE1"
            opacity="0.8"
          />

          {/* Norwegian flag */}
          <g transform="translate(180, 30)">
            <rect x="0" y="0" width="40" height="30" fill="#ED2939"/>
            <rect x="12" y="0" width="4" height="30" fill="#fff"/>
            <rect x="0" y="13" width="40" height="4" fill="#fff"/>
          </g>
        </svg>
      </div>
    </Card>
  );
}