import { FC } from 'react';

export const IcebergBackground: FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full opacity-80"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Moon */}
        <circle cx="150" cy="150" r="60" fill="#FFFFFF" />

        {/* Background Mountains */}
        <path
          d="M0 400 L200 200 L400 350 L600 250 L800 400 L800 600 L0 600 Z"
          fill="#E8F0F9"
          opacity="0.5"
        />

        {/* Iceberg Above Water */}
        <path
          d="M300 250 L400 150 L500 250 L450 500 L350 500 Z"
          fill="#FFFFFF"
          opacity="0.9"
        />

        {/* Underwater part with sparkles */}
        <path
          d="M250 500 L400 580 L550 500 L500 580 L300 580 Z"
          fill="#D1E2F3"
          opacity="0.6"
        />

        {/* Sparkles */}
        <g className="sparkles">
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={i}
              cx={300 + Math.random() * 200}
              cy={450 + Math.random() * 100}
              r={1}
              fill="#FFFFFF"
              opacity={0.6}
            />
          ))}
        </g>

        {/* Norwegian Flag */}
        <g transform="translate(470 230) scale(0.4)">
          <rect width="40" height="30" fill="#EF2B2D" />
          <rect x="12" width="4" height="30" fill="#FFFFFF" />
          <rect y="13" width="40" height="4" fill="#FFFFFF" />
          <rect x="13" y="12" width="2" height="6" fill="#002868" />
          <rect x="12" y="13" width="6" height="4" fill="#002868" />
        </g>
      </svg>
    </div>
  );
};