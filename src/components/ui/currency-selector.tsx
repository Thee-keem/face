'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Currency } from '@prisma/client'
import { getCurrencySymbol, getCurrencyName } from '@/lib/currency'

interface CurrencySelectorProps {
  value?: Currency
  onValueChange?: (value: Currency) => void
  disabled?: boolean
  placeholder?: string
}

export function CurrencySelector({
  value,
  onValueChange,
  disabled,
  placeholder = 'Select currency',
}: CurrencySelectorProps) {
  const currencies = Object.values(Currency)
  
  return (
    <Select 
      value={value} 
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {value && (
            <div className="flex items-center gap-2">
              <span>{getCurrencySymbol(value)}</span>
              <span>{getCurrencyName(value)}</span>
              <span className="text-muted-foreground">({value})</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency} value={currency}>
            <div className="flex items-center gap-2">
              <span>{getCurrencySymbol(currency)}</span>
              <span>{getCurrencyName(currency)}</span>
              <span className="text-muted-foreground">({currency})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}