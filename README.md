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

## Development

This project uses:
- React with TypeScript
- Tailwind CSS for styling
- i18n for internationalization
- React Query for API handling
- Express.js backend
- Zod for schema validation

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

- `/client/src` - Frontend React application
  - `/components` - React components
  - `/i18n` - Translation files
  - `/pages` - Page components
- `/server` - Express.js backend
- `/shared` - Shared types and schemas
