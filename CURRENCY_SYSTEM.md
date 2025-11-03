# Currency System Implementation

## Overview
This document describes the currency system implementation for the BoltPOS application, which provides real-time currency conversion and synchronization across the entire application.

## Architecture

### 1. Currency Context (`/src/contexts/CurrencyContext.tsx`)
The core of the currency system is a React Context that provides:
- Real-time exchange rates management
- Currency conversion functions
- Formatting utilities
- Automatic rate updates

### 2. API Endpoint (`/src/app/api/currency/rates/route.ts`)
A Next.js API route that fetches real-time exchange rates from external services.

### 3. Utility Functions (`/src/lib/currency.ts`)
Helper functions for currency formatting, conversion, and validation.

### 4. UI Components (`/src/app/settings/currency-rates/page.tsx`)
The currency rates management interface with real-time converter.

## Implementation Details

### Currency Context Provider
The `CurrencyProvider` wraps the entire application in `/src/components/providers/Providers.tsx` to ensure all components have access to currency data.

### Real-time Data Synchronization
- Exchange rates are automatically updated every 15 minutes
- Manual update option available in the UI
- All currency conversions use the latest rates

### Supported Currencies
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- KSH (Kenyan Shilling)
- ZAR (South African Rand)

## Usage Examples

### In Components
```tsx
import { useCurrency } from '@/contexts/CurrencyContext'

export default function MyComponent() {
  const { convert, format } = useCurrency()
  
  const amountInUSD = 100
  const amountInEUR = convert(amountInUSD, 'USD', 'EUR')
  const formattedAmount = format(amountInEUR, 'EUR')
  
  return <div>{formattedAmount}</div>
}
```

### In API Routes
```ts
import { convertCurrency } from '@/lib/currency'

// Convert 100 USD to EUR
const eurAmount = convertCurrency(100, 0.85)
```

## Data Flow
1. Currency rates are fetched from external APIs via the internal API endpoint
2. Rates are stored in the Currency Context
3. Components subscribe to the context for real-time updates
4. Currency conversions use the latest rates from context
5. All UI displays use consistent formatting

## Extending the System
To add new currencies:
1. Add the currency to `supportedCurrencies` array
2. Update `currencySymbols` map in utility functions
3. Ensure the external API supports the new currency pair

## Error Handling
- Graceful fallback to mock rates if API fails
- Error messages displayed in UI
- Automatic retry mechanism

## Performance Considerations
- Rates cached in context to avoid repeated API calls
- Selective updates only when currency pairs change
- Efficient React.memo usage in components