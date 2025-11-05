'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { MOCK_CURRENCY_RATES } from '@/lib/mockData'
import { Currency } from '@prisma/client'

// Define types
interface CurrencyRate {
  fromCurrency: string
  toCurrency: string
  rate: number
  lastUpdated: string
  source: string
}

interface CurrencyContextType {
  baseCurrency: Currency
  setBaseCurrency: (currency: Currency) => void
  rates: Record<string, CurrencyRate>
  updateRate: (from: string, to: string, rate: number) => void
  convert: (amount: number, from: Currency, to: Currency) => number
  format: (amount: number, currency: Currency) => string
  formatWithCurrency: (amount: number, fromCurrency: Currency, toCurrency: Currency) => string
  isLoading: boolean
  error: string | null
  refreshRates: () => Promise<void>
}

// Default values
const defaultCurrencyContext: CurrencyContextType = {
  baseCurrency: Currency.USD,
  setBaseCurrency: () => {},
  rates: {},
  updateRate: () => {},
  convert: () => 0,
  format: () => '',
  formatWithCurrency: () => '',
  isLoading: false,
  error: null,
  refreshRates: async () => {}
}

// Create context
const CurrencyContext = createContext<CurrencyContextType>(defaultCurrencyContext)

// Provider component
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [baseCurrency, setBaseCurrencyState] = useState<Currency>(Currency.USD)
  const [rates, setRates] = useState<Record<string, CurrencyRate>>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize with persisted currency or mock data
  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency')
    if (savedCurrency && Object.values(Currency).includes(savedCurrency as Currency)) {
      setBaseCurrencyState(savedCurrency as Currency)
    }

    const initialRates: Record<string, CurrencyRate> = {}
    MOCK_CURRENCY_RATES.forEach(rate => {
      const key = `${rate.fromCurrency}-${rate.toCurrency}`
      initialRates[key] = rate
    })
    
    setRates(initialRates)
  }, [])

  // Persist currency to localStorage when it changes
  const setBaseCurrency = (currency: Currency) => {
    setBaseCurrencyState(currency)
    localStorage.setItem('selectedCurrency', currency)
  }

  // Update a specific rate
  const updateRate = (from: string, to: string, rate: number) => {
    const key = `${from}-${to}`
    setRates(prev => ({
      ...prev,
      [key]: {
        fromCurrency: from,
        toCurrency: to,
        rate,
        lastUpdated: new Date().toISOString(),
        source: 'Manual Update'
      }
    }))
  }

  // Convert amount from one currency to another
  const convert = (amount: number, from: Currency, to: Currency): number => {
    // If same currency, no conversion needed
    if (from === to) return amount
    
    const key = `${from}-${to}`
    const rate = rates[key]
    
    if (rate) {
      return parseFloat((amount * rate.rate).toFixed(6))
    }
    
    // Try reverse conversion
    const reverseKey = `${to}-${from}`
    const reverseRate = rates[reverseKey]
    
    if (reverseRate) {
      return parseFloat((amount / reverseRate.rate).toFixed(6))
    }
    
    // If no direct rate found, return original amount
    console.warn(`No exchange rate found for ${from} to ${to}`)
    return amount
  }

  // Format currency with symbol
  const format = (amount: number, currency: Currency): string => {
    const currencySymbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'CAD': 'C$',
      'KSH': 'KSh',
      'ZAR': 'R'
    }
    
    const symbol = currencySymbols[currency] || currency
    const decimalPlaces = ['KSH', 'JPY'].includes(currency) ? 0 : 2
    
    return `${symbol}${amount.toFixed(decimalPlaces)}`
  }

  // Format amount with conversion from base currency
  const formatWithCurrency = (amount: number, fromCurrency: Currency, toCurrency: Currency): string => {
    const convertedAmount = convert(amount, fromCurrency, toCurrency)
    return format(convertedAmount, toCurrency)
  }

  // Refresh exchange rates from API
  const refreshRates = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/currency/rates')
      if (!response.ok) {
        throw new Error('Failed to fetch currency rates')
      }
      
      const data = await response.json()
      
      // Update rates in state
      const updatedRates: Record<string, CurrencyRate> = {}
      Object.keys(data.rates).forEach(toCurrency => {
        const key = `${baseCurrency}-${toCurrency}`
        updatedRates[key] = {
          fromCurrency: baseCurrency,
          toCurrency,
          rate: data.rates[toCurrency],
          lastUpdated: new Date().toISOString(),
          source: 'API'
        }
      })
      
      setRates(prev => ({ ...prev, ...updatedRates }))
    } catch (err) {
      setError('Failed to fetch currency rates')
      console.error('Error fetching rates:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch rates periodically (every 15 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshRates()
    }, 15 * 60 * 1000) // 15 minutes
    
    return () => clearInterval(interval)
  }, [baseCurrency])

  const value = {
    baseCurrency,
    setBaseCurrency,
    rates,
    updateRate,
    convert,
    format,
    formatWithCurrency,
    isLoading,
    error,
    refreshRates
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

// Hook to use currency context
export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}