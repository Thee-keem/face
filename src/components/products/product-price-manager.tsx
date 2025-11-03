'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CurrencySelector } from '@/components/ui/currency-selector'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Currency } from '@prisma/client'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext'

interface PriceEntry {
  id?: string
  currency: Currency
  price: number
  cost: number
  isActive: boolean
}

interface ProductPriceManagerProps {
  prices: PriceEntry[]
  onChange: (prices: PriceEntry[]) => void
}

export function ProductPriceManager({
  prices,
  onChange,
}: ProductPriceManagerProps) {
  const { convert, format } = useCurrency();
  
  const addPrice = () => {
    const newPrice: PriceEntry = {
      currency: Currency.USD,
      price: 0,
      cost: 0,
      isActive: true,
    }
    
    onChange([...prices, newPrice])
  }
  
  const updatePrice = (index: number, field: keyof PriceEntry, value: any) => {
    const updatedPrices = [...prices]
    updatedPrices[index] = {
      ...updatedPrices[index],
      [field]: value,
    }
    
    onChange(updatedPrices)
  }
  
  const removePrice = (index: number) => {
    const updatedPrices = [...prices]
    updatedPrices.splice(index, 1)
    onChange(updatedPrices)
  }
  
  // Convert price to base currency for display
  const convertToBaseCurrency = (amount: number, currency: Currency) => {
    // In a real implementation, this would use the currency context to convert
    // For now, we'll just return the amount as-is
    return amount;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Currency Pricing</CardTitle>
        <CardDescription>
          Set prices for this product in different currencies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {prices.map((price, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-4">
              <Label htmlFor={`currency-${index}`}>Currency</Label>
              <CurrencySelector
                value={price.currency}
                onValueChange={(value) => updatePrice(index, 'currency', value)}
                disabled={price.id !== undefined} // Can't change currency of existing price
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor={`price-${index}`}>Selling Price</Label>
              <CurrencyInput
                id={`price-${index}`}
                currency={price.currency}
                value={price.price}
                onValueChange={(value) => updatePrice(index, 'price', value || 0)}
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor={`cost-${index}`}>Cost Price</Label>
              <CurrencyInput
                id={`cost-${index}`}
                currency={price.currency}
                value={price.cost}
                onValueChange={(value) => updatePrice(index, 'cost', value || 0)}
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removePrice(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addPrice}
          className="w-full"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Currency Price
        </Button>
      </CardContent>
    </Card>
  )
}