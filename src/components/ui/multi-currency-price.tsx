'use client'

import * as React from 'react'
import { formatCurrency } from '@/lib/currency'
import { Currency } from '@prisma/client'

interface MultiCurrencyPriceProps {
  amount: number
  baseCurrency?: Currency
  currencies?: Currency[]
  rates?: Record<string, number>
}

export function MultiCurrencyPrice({
  amount,
  baseCurrency = Currency.USD,
  currencies = [Currency.USD, Currency.EUR, Currency.GBP],
  rates = {},
}: MultiCurrencyPriceProps) {
  // Filter out base currency from display
  const displayCurrencies = currencies.filter(c => c !== baseCurrency)
  
  return (
    <div className="flex flex-col gap-1">
      <div className="font-medium">
        {formatCurrency(amount, baseCurrency)}
      </div>
      {displayCurrencies.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {displayCurrencies.map((currency) => {
            const rateKey = `${baseCurrency}-${currency}`
            const rate = rates[rateKey] || 1
            const convertedAmount = amount * rate
            
            return (
              <div key={currency}>
                {formatCurrency(convertedAmount, currency)}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}