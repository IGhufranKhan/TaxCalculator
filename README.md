# Norwegian Tax Calculator

A comprehensive Norwegian tax calculator with multiple tax categories, visualizations, and full Norwegian language support.

## Features

- Calculate Norwegian taxes based on multiple income sources
- Support for various income periods (annual, monthly, weekly, etc.)
- Full Norwegian and English language support
- Interactive tax breakdown visualization
- Bank and loan deductions calculation
- Property tax considerations
- Downloadable tax calculation results

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaxCalculator/
│   │   │   │   ├── Form.tsx
│   │   │   │   ├── TaxBreakdown.tsx
│   │   │   │   ├── Taxberg.tsx
│   │   │   │   └── utils.ts
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── i18n/
│   │   │   ├── en.json
│   │   │   ├── i18n.ts
│   │   │   └── no.json
│   │   ├── lib/
│   │   │   └── queryClient.ts
│   │   ├── pages/
│   │   │   ├── calculator.tsx
│   │   │   └── not-found.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── vite.ts
├── shared/
│   └── schema.ts
├── drizzle.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── theme.json
├── tsconfig.json
└── vite.config.ts
```

## Setup Instructions

1. Create a new directory for your project:
```bash
mkdir norwegian-tax-calculator
cd norwegian-tax-calculator
```

2. Initialize a new Node.js project:
```bash
npm init -y
```

3. Install dependencies:
```bash
npm install @hookform/resolvers @tanstack/react-query class-variance-authority clsx cmdk date-fns drizzle-orm drizzle-zod express i18next lucide-react react react-dom react-hook-form react-i18next recharts tailwind-merge tailwindcss-animate wouter zod
```

4. Install development dependencies:
```bash
npm install -D @types/react @types/react-dom @vitejs/plugin-react autoprefixer postcss tailwindcss typescript vite
```

5. Create all the necessary files according to the project structure above.

6. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Environment Setup

Make sure you have Node.js version 20 or later installed on your system.

## Important Files

1. Frontend Components:
   - `client/src/components/TaxCalculator/Form.tsx`: Main tax input form
   - `client/src/components/TaxCalculator/TaxBreakdown.tsx`: Tax calculation results
   - `client/src/components/TaxCalculator/Taxberg.tsx`: Visual representation of tax
   - `client/src/components/TaxCalculator/utils.ts`: Helper functions

2. Backend Files:
   - `server/storage.ts`: Tax calculation logic
   - `server/routes.ts`: API endpoints
   - `server/index.ts`: Server setup

3. Shared Types:
   - `shared/schema.ts`: Type definitions and Zod schemas

4. Configuration Files:
   - `vite.config.ts`: Vite configuration
   - `tailwind.config.ts`: Tailwind CSS configuration
   - `tsconfig.json`: TypeScript configuration
   - `theme.json`: Theme configuration

## Development

The project uses:
- React with TypeScript for the frontend
- Express.js for the backend
- Tailwind CSS for styling
- i18n for internationalization
- React Query for API handling
- Zod for schema validation

## Contributing

Feel free to contribute to this project by submitting pull requests or creating issues for bugs and feature requests.