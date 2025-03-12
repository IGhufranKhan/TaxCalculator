import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { TaxBreakdown } from "@shared/schema";
import { formatCurrency } from "./utils";

interface TaxbergProps {
  breakdown: TaxBreakdown;
}

export function Taxberg({ breakdown }: TaxbergProps) {
  const { t } = useTranslation();
  const employerTax = 70500;

  return (
    <Card className="p-6 bg-[#E0F7FF] relative">
      <h2 className="text-2xl font-bold mb-4">The Taxberg</h2>

      {/* Clouds */}
      <div className="absolute top-4 left-8">
        <svg width="40" height="24" viewBox="0 0 40 24" fill="white">
          <path d="M8,12 Q12,8 16,12 Q20,16 24,12 Q28,8 32,12 L32,20 L8,20 Z" />
        </svg>
      </div>
      <div className="absolute top-4 right-12">
        <svg width="40" height="24" viewBox="0 0 40 24" fill="white">
          <path d="M8,12 Q12,8 16,12 Q20,16 24,12 Q28,8 32,12 L32,20 L8,20 Z" />
        </svg>
      </div>

      <div className="relative h-[600px]">
        {/* Net pay */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-center z-10">
          <p className="text-3xl font-bold">{formatCurrency(breakdown.netPay)} kr</p>
          <p className="text-lg">Net pay</p>
          <div className="border-r-2 border-dotted border-gray-400 h-16 absolute left-1/2 -bottom-16"></div>
        </div>

        {/* Tax you pay */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 text-center z-10">
          <p className="text-2xl font-bold">{formatCurrency(breakdown.totalTax)} kr</p>
          <p className="text-lg">Tax you pay</p>
          <div className="border-r-2 border-dotted border-gray-400 h-16 absolute left-1/2 -bottom-16"></div>
        </div>

        {/* Employer tax */}
        <div className="absolute top-[65%] right-[20%] text-center z-10">
          <p className="text-xl font-bold">{formatCurrency(employerTax)} kr</p>
          <p className="text-lg">Tax the employer pays</p>
        </div>

        {/* Total tax and rate */}
        <div className="absolute bottom-32 w-full px-8 flex justify-between text-white z-10">
          <div>
            <p className="text-lg">Total tax paid</p>
            <p className="text-3xl font-bold">{formatCurrency(breakdown.totalTax + employerTax)} kr</p>
          </div>
          <div>
            <p className="text-lg">Real tax rate</p>
            <p className="text-3xl font-bold">34.0%</p>
          </div>
        </div>

        {/* Explanatory text */}
        <div className="absolute bottom-4 left-4 right-4 text-white z-10">
          <p>Did you know your employer also pays tax on your salary? It costs the employer 70,500 kr to pay you 500,000 kr. In other words, every time you spend 10 kr of your hard-earned money, 3.88 kr goes to the government.</p>
        </div>

        {/* Iceberg SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
          {/* Water */}
          <rect x="0" y="300" width="800" height="300" fill="#003366"/>

          {/* Iceberg above water */}
          <path 
            d="M200,100 L400,50 L600,100 L500,300 L300,300 Z" 
            fill="#E8F4FF" 
            className="drop-shadow-lg"
          />

          {/* Iceberg below water */}
          <path 
            d="M300,300 L200,550 L600,550 L500,300 Z" 
            fill="#4B9FE1" 
            opacity="0.8"
          />

          {/* Whale silhouette */}
          <path 
            d="M650,450 Q670,440 680,450 Q690,460 680,470 L650,470 Q640,460 650,450 Z" 
            fill="#1a365d"
          />

          {/* Norwegian flag */}
          <g transform="translate(380,30)">
            <rect x="0" y="0" width="40" height="30" fill="#ED2939"/>
            <rect x="12" y="0" width="4" height="30" fill="#fff"/>
            <rect x="0" y="13" width="40" height="4" fill="#fff"/>
          </g>
        </svg>
      </div>
    </Card>
  );
}