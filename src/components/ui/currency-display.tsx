'use client'

import * as React from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { Currency } from '@prisma/client'

interface CurrencyDisplayProps {
  amount: number
  fromCurrency?: Currency
  toCurrency?: Currency
  currency?: Currency
  showCurrencyCode?: boolean
  className?: string
}

export function CurrencyDisplay({
  amount,
  fromCurrency,
  toCurrency,
  currency,
  showCurrencyCode = false,
  className = '',
}: CurrencyDisplayProps) {
  const { baseCurrency, convert, format } = useCurrency()
  
  const displayCurrency = currency || toCurrency || baseCurrency
  const sourceCurrency = fromCurrency || baseCurrency
  
  const convertedAmount = fromCurrency 
    ? convert(amount, sourceCurrency, displayCurrency)
    : amount
  
  const formattedAmount = format(convertedAmount, displayCurrency)
  
  return (
    <span className={className}>
      {formattedAmount}
      {showCurrencyCode && ` ${displayCurrency}`}
    </span>
  )
}