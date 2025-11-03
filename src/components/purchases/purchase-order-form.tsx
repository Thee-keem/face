'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CurrencySelector } from '@/components/ui/currency-selector'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Currency } from '@prisma/client'
import { PlusIcon, TrashIcon, CalendarIcon } from 'lucide-react'

interface PurchaseOrderItem {
  id?: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  taxRate: number
}

interface PurchaseOrderFormProps {
  purchaseOrder?: {
    id?: string
    supplierId: string
    orderNumber: string
    reference?: string
    orderDate: Date
    expectedDeliveryDate?: Date
    currency: Currency
    exchangeRate: number
    notes?: string
    items: PurchaseOrderItem[]
  }
  suppliers?: { id: string; companyName: string }[]
  products?: { id: string; name: string; sku?: string }[]
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function PurchaseOrderForm({
  purchaseOrder,
  suppliers = [],
  products = [],
  onSubmit,
  onCancel,
  isSubmitting,
}: PurchaseOrderFormProps) {
  const [formData, setFormData] = React.useState({
    supplierId: purchaseOrder?.supplierId || '',
    orderNumber: purchaseOrder?.orderNumber || '',
    reference: purchaseOrder?.reference || '',
    orderDate: purchaseOrder?.orderDate ? purchaseOrder.orderDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    expectedDeliveryDate: purchaseOrder?.expectedDeliveryDate ? purchaseOrder.expectedDeliveryDate.toISOString().split('T')[0] : '',
    currency: purchaseOrder?.currency || Currency.USD,
    exchangeRate: purchaseOrder?.exchangeRate || 1,
    notes: purchaseOrder?.notes || '',
    items: purchaseOrder?.items || [
      {
        productId: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
      }
    ],
  })
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }
  
  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    }
    
    // If product changes, update product name
    if (field === 'productId') {
      const product = products.find(p => p.id === value)
      if (product) {
        updatedItems[index].productName = product.name
      }
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
    }))
  }
  
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: '',
          productName: '',
          quantity: 1,
          unitPrice: 0,
          taxRate: 0,
        }
      ],
    }))
  }
  
  const removeItem = (index: number) => {
    if (formData.items.length <= 1) return
    
    const updatedItems = [...formData.items]
    updatedItems.splice(index, 1)
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
    }))
  }
  
  const calculateTotals = () => {
    let subtotal = 0
    let taxAmount = 0
    let totalAmount = 0
    
    formData.items.forEach(item => {
      const itemTotal = item.quantity * item.unitPrice
      const itemTax = itemTotal * (item.taxRate / 100)
      
      subtotal += itemTotal
      taxAmount += itemTax
      totalAmount += itemTotal + itemTax
    })
    
    return { subtotal, taxAmount, totalAmount }
  }
  
  const { subtotal, taxAmount, totalAmount } = calculateTotals()
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert date strings back to Date objects
    const submitData = {
      ...formData,
      orderDate: new Date(formData.orderDate),
      expectedDeliveryDate: formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate) : undefined,
    }
    
    onSubmit(submitData)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{purchaseOrder?.id ? 'Edit Purchase Order' : 'Create Purchase Order'}</CardTitle>
        <CardDescription>
          {purchaseOrder?.id 
            ? 'Update purchase order details' 
            : 'Create a new purchase order for supplier'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplierId">Supplier *</Label>
              <select
                id="supplierId"
                value={formData.supplierId}
                onChange={(e) => handleChange('supplierId', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select a supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.companyName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number *</Label>
              <Input
                id="orderNumber"
                value={formData.orderNumber}
                onChange={(e) => handleChange('orderNumber', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => handleChange('reference', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orderDate">Order Date *</Label>
              <div className="relative">
                <Input
                  id="orderDate"
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => handleChange('orderDate', e.target.value)}
                  required
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
              <div className="relative">
                <Input
                  id="expectedDeliveryDate"
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => handleChange('expectedDeliveryDate', e.target.value)}
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <CurrencySelector
                value={formData.currency}
                onValueChange={(value) => handleChange('currency', value)}
              />
            </div>
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
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Order Items</h3>
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                  <div className="col-span-4">
                    <Label htmlFor={`product-${index}`}>Product *</Label>
                    <select
                      id={`product-${index}`}
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} {product.sku && `(${product.sku})`}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor={`quantity-${index}`}>Quantity *</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor={`unitPrice-${index}`}>Unit Price *</Label>
                    <CurrencyInput
                      id={`unitPrice-${index}`}
                      currency={formData.currency}
                      value={item.unitPrice}
                      onValueChange={(value) => handleItemChange(index, 'unitPrice', value || 0)}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor={`taxRate-${index}`}>Tax %</Label>
                    <Input
                      id={`taxRate-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.taxRate}
                      onChange={(e) => handleItemChange(index, 'taxRate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="col-span-2 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length <= 1}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <Label>Subtotal</Label>
              <div className="text-lg font-medium">
                {subtotal.toFixed(2)} {formData.currency}
              </div>
            </div>
            <div>
              <Label>Tax</Label>
              <div className="text-lg font-medium">
                {taxAmount.toFixed(2)} {formData.currency}
              </div>
            </div>
            <div>
              <Label>Total</Label>
              <div className="text-xl font-bold">
                {totalAmount.toFixed(2)} {formData.currency}
              </div>
            </div>
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
              {isSubmitting ? 'Saving...' : purchaseOrder?.id ? 'Update Order' : 'Create Order'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}