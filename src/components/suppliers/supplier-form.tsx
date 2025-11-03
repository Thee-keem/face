'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CurrencySelector } from '@/components/ui/currency-selector'
import { Switch } from '@/components/ui/switch'

interface SupplierFormProps {
  supplier?: {
    id?: string
    companyName: string
    contactName?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    website?: string
    paymentTerms?: string
    preferredCurrency: string
    taxId?: string
    notes?: string
    isActive: boolean
  }
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function SupplierForm({
  supplier,
  onSubmit,
  onCancel,
  isSubmitting,
}: SupplierFormProps) {
  const [formData, setFormData] = React.useState({
    companyName: supplier?.companyName || '',
    contactName: supplier?.contactName || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    city: supplier?.city || '',
    state: supplier?.state || '',
    postalCode: supplier?.postalCode || '',
    country: supplier?.country || '',
    website: supplier?.website || '',
    paymentTerms: supplier?.paymentTerms || '',
    preferredCurrency: supplier?.preferredCurrency || 'USD',
    taxId: supplier?.taxId || '',
    notes: supplier?.notes || '',
    isActive: supplier?.isActive !== undefined ? supplier.isActive : true,
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
        <CardTitle>{supplier?.id ? 'Edit Supplier' : 'Add New Supplier'}</CardTitle>
        <CardDescription>
          {supplier?.id 
            ? 'Update supplier information' 
            : 'Enter details for the new supplier'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
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
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) => handleChange('taxId', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferredCurrency">Preferred Currency</Label>
              <CurrencySelector
                value={formData.preferredCurrency as any}
                onValueChange={(value) => handleChange('preferredCurrency', value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input
                id="paymentTerms"
                value={formData.paymentTerms}
                onChange={(e) => handleChange('paymentTerms', e.target.value)}
                placeholder="e.g., Net 30, COD"
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
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
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
              {isSubmitting ? 'Saving...' : supplier?.id ? 'Update Supplier' : 'Add Supplier'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}