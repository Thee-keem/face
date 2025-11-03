'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Currency } from '@prisma/client'
import { formatCurrency, getCurrencySymbol } from '@/lib/currency'

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  currency?: Currency
  value?: number
  onValueChange?: (value: number | undefined) => void
}

export function CurrencyInput({
  currency = Currency.USD,
  value,
  onValueChange,
  ...props
}: CurrencyInputProps) {
  const [inputValue, setInputValue] = React.useState<string>(
    value !== undefined ? value.toString() : ''
  )
  
  // Update input when value changes from outside
  React.useEffect(() => {
    if (value !== undefined) {
      setInputValue(value.toString())
    } else {
      setInputValue('')
    }
  }, [value])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    setInputValue(rawValue)
    
    // Try to parse the value
    const parsed = parseFloat(rawValue)
    if (!isNaN(parsed) && isFinite(parsed)) {
      onValueChange?.(parsed)
    } else if (rawValue === '') {
      onValueChange?.(undefined)
    }
  }
  
  const symbol = getCurrencySymbol(currency)
  
  return (
    <div className="relative">
      <Input
        {...props}
        value={inputValue}
        onChange={handleChange}
        type="number"
        step="0.01"
        min="0"
        className="pl-8"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
        {symbol}
      </div>
    </div>
  )
}