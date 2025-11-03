import { Currency } from '@prisma/client';

// Currency configuration with symbols and formatting
export const CURRENCY_CONFIG = {
  USD: {
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    decimalPlaces: 2,
  },
  EUR: {
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE',
    decimalPlaces: 2,
  },
  GBP: {
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    decimalPlaces: 2,
  },
  CAD: {
    symbol: 'CA$',
    name: 'Canadian Dollar',
    locale: 'en-CA',
    decimalPlaces: 2,
  },
  KSH: {
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    locale: 'en-KE',
    decimalPlaces: 2,
  },
  ZAR: {
    symbol: 'R',
    name: 'South African Rand',
    locale: 'en-ZA',
    decimalPlaces: 2,
  },
} as const;

// Import mock data
import { MOCK_CURRENCY_RATES, SUPPORTED_CURRENCIES } from './mockData';

// Format currency amount with proper symbol and decimal places
export function formatCurrency(amount: number, currencyCode: Currency = Currency.USD): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  const symbol = currency?.symbol || currencyCode;
  const decimalPlaces = currencyCode === Currency.KSH ? 0 : 2;

  return `${symbol}${amount.toFixed(decimalPlaces)}`;
}

// Get currency symbol by code
export function getCurrencySymbol(currencyCode: Currency): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  return currency?.symbol || currencyCode;
}

// Get currency name by code
export function getCurrencyName(currencyCode: Currency): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  return currency?.name || currencyCode;
}

// Format large currency amounts (e.g., 1.2M, 3.5K)
export function formatLargeCurrency(amount: number, currencyCode: Currency = Currency.USD): string {
  if (amount >= 1000000) {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
    const symbol = currency?.symbol || currencyCode;
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
    const symbol = currency?.symbol || currencyCode;
    return `${symbol}${(amount / 1000).toFixed(1)}K`;
  }
  
  // Use the existing formatCurrency function
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  if (currency) {
    const config = CURRENCY_CONFIG[currency.code as keyof typeof CURRENCY_CONFIG];
    if (config) {
      try {
        return new Intl.NumberFormat(config.locale, {
          style: 'currency',
          currency: currency.code,
          minimumFractionDigits: config.decimalPlaces,
          maximumFractionDigits: config.decimalPlaces,
        }).format(amount);
      } catch (error) {
        // Fallback formatting if Intl fails
        return `${config.symbol}${amount.toFixed(config.decimalPlaces)}`;
      }
    }
  }
  
  // Default fallback
  return `${amount.toFixed(2)} ${currencyCode}`;
}

// Validate currency amount
export function isValidCurrencyAmount(amount: any): boolean {
  return !isNaN(parseFloat(amount)) && isFinite(amount) && parseFloat(amount) >= 0;
}

// Get exchange rate between two currencies from mock data
export function getMockExchangeRate(fromCurrency: Currency, toCurrency: Currency): number | null {
  if (fromCurrency === toCurrency) return 1;
  
  const rate = MOCK_CURRENCY_RATES.find(
    r => r.fromCurrency === fromCurrency && r.toCurrency === toCurrency
  );
  
  return rate ? rate.rate : null;
}

// Get all supported currencies from mock data
export function getSupportedCurrencies(): Array<{ code: Currency; name: string; symbol: string }> {
  return SUPPORTED_CURRENCIES as Array<{ code: Currency; name: string; symbol: string }>;
}

// Validate if a currency code is supported
export function isSupportedCurrency(currencyCode: Currency): boolean {
  return SUPPORTED_CURRENCIES.some(c => c.code === currencyCode);
}

// Currency converter utility class
export class CurrencyConverter {
  private static instance: CurrencyConverter;
  private rates: Map<string, number> = new Map();
  private lastUpdated: Date | null = null;
  
  private constructor() {}
  
  static getInstance(): CurrencyConverter {
    if (!CurrencyConverter.instance) {
      CurrencyConverter.instance = new CurrencyConverter();
    }
    return CurrencyConverter.instance;
  }
  
  // Set exchange rate
  setRate(fromCurrency: Currency, toCurrency: Currency, rate: number): void {
    const key = `${fromCurrency}-${toCurrency}`;
    this.rates.set(key, rate);
    
    if (!this.lastUpdated) {
      this.lastUpdated = new Date();
    }
  }
  
  // Get exchange rate
  getRate(fromCurrency: Currency, toCurrency: Currency): number | null {
    const key = `${fromCurrency}-${toCurrency}`;
    return this.rates.get(key) || null;
  }
  
  // Convert amount between currencies
  convert(
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency,
    fallbackRate?: number
  ): number {
    if (fromCurrency === toCurrency) {
      return amount;
    }
    
    const rate = this.getRate(fromCurrency, toCurrency);
    if (rate) {
      return amount * rate;
    }
    
    // Use fallback rate if provided
    if (fallbackRate) {
      return amount * fallbackRate;
    }
    
    // If no rate available, return original amount (no conversion)
    console.warn(`No exchange rate found for ${fromCurrency} to ${toCurrency}`);
    return amount;
  }
  
  // Check if rates are stale (older than 24 hours)
  areRatesStale(): boolean {
    if (!this.lastUpdated) {
      return true;
    }
    
    const now = new Date();
    const diffHours = (now.getTime() - this.lastUpdated.getTime()) / (1000 * 60 * 60);
    return diffHours > 24;
  }
  
  // Clear all rates
  clearRates(): void {
    this.rates.clear();
    this.lastUpdated = null;
  }
}

// Default currency converter instance
export const currencyConverter = CurrencyConverter.getInstance();

// Mock exchange rates for development
export const MOCK_EXCHANGE_RATES = {
  'USD-EUR': 0.85,
  'USD-GBP': 0.73,
  'USD-CAD': 1.25,
  'USD-KSH': 110.0,
  'USD-ZAR': 15.5,
  'EUR-USD': 1.18,
  'EUR-GBP': 0.86,
  'EUR-CAD': 1.47,
  'EUR-KSH': 129.41,
  'EUR-ZAR': 18.24,
  'GBP-USD': 1.37,
  'GBP-EUR': 1.16,
  'GBP-CAD': 1.71,
  'GBP-KSH': 150.68,
  'GBP-ZAR': 21.23,
  'CAD-USD': 0.80,
  'CAD-EUR': 0.68,
  'CAD-GBP': 0.58,
  'CAD-KSH': 88.0,
  'CAD-ZAR': 12.4,
  'KSH-USD': 0.0091,
  'KSH-EUR': 0.0077,
  'KSH-GBP': 0.0066,
  'KSH-CAD': 0.0114,
  'KSH-ZAR': 0.14,
  'ZAR-USD': 0.0645,
  'ZAR-EUR': 0.0549,
  'ZAR-GBP': 0.0471,
  'ZAR-CAD': 0.0806,
  'ZAR-KSH': 7.1,
};