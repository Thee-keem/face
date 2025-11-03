'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CurrencySelector } from '@/components/ui/currency-selector'
import { Currency } from '@prisma/client'
import { Switch } from '@/components/ui/switch'

interface BusinessLocationFormProps {
  location?: {
    id?: string
    name: string
    code: string
    address?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    phone?: string
    email?: string
    baseCurrency: Currency
    localCurrency: Currency
    isActive: boolean
  }
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function BusinessLocationForm({
  location,
  onSubmit,
  onCancel,
  isSubmitting,
}: BusinessLocationFormProps) {
  const [formData, setFormData] = React.useState({
    name: location?.name || '',
    code: location?.code || '',
    address: location?.address || '',
    city: location?.city || '',
    state: location?.state || '',
    postalCode: location?.postalCode || '',
    country: location?.country || '',
    phone: location?.phone || '',
    email: location?.email || '',
    baseCurrency: location?.baseCurrency || Currency.USD,
    localCurrency: location?.localCurrency || Currency.USD,
    isActive: location?.isActive !== undefined ? location.isActive : true,
  })
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{location?.id ? 'Edit Business Location' : 'Add New Business Location'}</CardTitle>
        <CardDescription>
          {location?.id 
            ? 'Update business location information' 
            : 'Enter details for the new business location'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Location Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code">Location Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                required
                placeholder="e.g., LOC001, STORE01"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="baseCurrency">Base Currency</Label>
              <CurrencySelector
                value={formData.baseCurrency}
                onValueChange={(value) => handleChange('baseCurrency', value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="localCurrency">Local Currency</Label>
              <CurrencySelector
                value={formData.localCurrency}
                onValueChange={(value) => handleChange('localCurrency', value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : location?.id ? 'Update Location' : 'Add Location'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}