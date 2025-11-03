'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface StockAdjustmentFormProps {
  adjustment?: {
    id?: string
    productId: string
    locationId: string
    type: string
    quantity: number
    reason?: string
    reference?: string
  }
  products?: { id: string; name: string; sku?: string; currentStock: number }[]
  locations?: { id: string; name: string }[]
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting?: boolean
}

const ADJUSTMENT_TYPES = [
  { value: 'ADD', label: 'Add Stock' },
  { value: 'REMOVE', label: 'Remove Stock' },
  { value: 'DAMAGE', label: 'Damaged Stock' },
  { value: 'EXPIRY', label: 'Expired Stock' },
]

export function StockAdjustmentForm({
  adjustment,
  products = [],
  locations = [],
  onSubmit,
  onCancel,
  isSubmitting,
}: StockAdjustmentFormProps) {
  const [formData, setFormData] = React.useState({
    productId: adjustment?.productId || '',
    locationId: adjustment?.locationId || '',
    type: adjustment?.type || 'ADD',
    quantity: adjustment?.quantity || 1,
    reason: adjustment?.reason || '',
    reference: adjustment?.reference || '',
  })
  
  const [selectedProduct, setSelectedProduct] = React.useState<{
    id: string
    name: string
    sku?: string
    currentStock: number
  } | null>(null)
  
  // Update selected product when product changes
  React.useEffect(() => {
    if (formData.productId) {
      const product = products.find(p => p.id === formData.productId)
      setSelectedProduct(product || null)
    } else {
      setSelectedProduct(null)
    }
  }, [formData.productId, products])
  
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
        <CardTitle>{adjustment?.id ? 'Edit Stock Adjustment' : 'New Stock Adjustment'}</CardTitle>
        <CardDescription>
          {adjustment?.id 
            ? 'Update stock adjustment details' 
            : 'Record a stock adjustment for inventory management'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="locationId">Location *</Label>
              <Select
                value={formData.locationId}
                onValueChange={(value) => handleChange('locationId', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Adjustment Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select adjustment type" />
                </SelectTrigger>
                <SelectContent>
                  {ADJUSTMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productId">Product *</Label>
              <Select
                value={formData.productId}
                onValueChange={(value) => handleChange('productId', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} {product.sku && `(${product.sku})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>
          
          {selectedProduct && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">
                Current Stock: <span className="font-medium">{selectedProduct.currentStock}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                After Adjustment: <span className="font-medium">
                  {formData.type === 'ADD' 
                    ? selectedProduct.currentStock + formData.quantity 
                    : selectedProduct.currentStock - formData.quantity}
                </span>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="reference">Reference</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => handleChange('reference', e.target.value)}
              placeholder="e.g., Invoice number, delivery note"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              rows={3}
              placeholder="Reason for stock adjustment"
            />
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
              {isSubmitting ? 'Saving...' : adjustment?.id ? 'Update Adjustment' : 'Record Adjustment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}