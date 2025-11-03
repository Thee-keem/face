'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CurrencySelector } from '@/components/ui/currency-selector'
import { Currency } from '@prisma/client'
import { PlusIcon, RefreshCwIcon, TrashIcon } from 'lucide-react'
import { format } from 'date-fns'

interface CurrencyRate {
  id?: string
  fromCurrency: Currency
  toCurrency: Currency
  rate: number
  date: Date
  source?: string
}

interface CurrencyRateManagerProps {
  rates: CurrencyRate[]
  onChange: (rates: CurrencyRate[]) => void
  onSync?: () => void
  isSyncing?: boolean
}

export function CurrencyRateManager({
  rates,
  onChange,
  onSync,
  isSyncing,
}: CurrencyRateManagerProps) {
  const addRate = () => {
    const newRate: CurrencyRate = {
      fromCurrency: Currency.USD,
      toCurrency: Currency.EUR,
      rate: 1,
      date: new Date(),
    }
    
    onChange([...rates, newRate])
  }
  
  const updateRate = (index: number, field: keyof CurrencyRate, value: any) => {
    const updatedRates = [...rates]
    updatedRates[index] = {
      ...updatedRates[index],
      [field]: value,
    }
    
    onChange(updatedRates)
  }
  
  const removeRate = (index: number) => {
    const updatedRates = [...rates]
    updatedRates.splice(index, 1)
    onChange(updatedRates)
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Currency Exchange Rates</CardTitle>
            <CardDescription>
              Manage exchange rates for multi-currency transactions
            </CardDescription>
          </div>
          {onSync && (
            <Button
              variant="outline"
              onClick={onSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCwIcon className="h-4 w-4 mr-2" />
              )}
              Sync Rates
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {rates.map((rate, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-3">
              <Label htmlFor={`fromCurrency-${index}`}>From</Label>
              <CurrencySelector
                value={rate.fromCurrency}
                onValueChange={(value) => updateRate(index, 'fromCurrency', value)}
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor={`toCurrency-${index}`}>To</Label>
              <CurrencySelector
                value={rate.toCurrency}
                onValueChange={(value) => updateRate(index, 'toCurrency', value)}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor={`rate-${index}`}>Rate</Label>
              <Input
                id={`rate-${index}`}
                type="number"
                step="0.0001"
                value={rate.rate}
                onChange={(e) => updateRate(index, 'rate', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="col-span-2">
              <Label>Date</Label>
              <div className="text-sm py-2">
                {format(rate.date, 'yyyy-MM-dd')}
              </div>
            </div>
            <div className="col-span-2 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeRate(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addRate}
          className="w-full"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Exchange Rate
        </Button>
      </CardContent>
    </Card>
  )
}