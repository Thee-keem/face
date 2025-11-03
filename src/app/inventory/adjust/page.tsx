'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { setProducts } from '@/features/inventory/inventorySlice';
import { toast } from 'sonner';
import type { RootState } from '@/lib/store';

export default function AdjustStockPage() {
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.inventory);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [adjustment, setAdjustment] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdjustStock = async () => {
    if (!selectedProductId || !adjustment) {
      setError('Please select a product and enter an adjustment value');
      return;
    }

    if (isNaN(parseInt(adjustment))) {
      setError('Adjustment must be a valid number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/products/${selectedProductId}/adjust-stock`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     adjustment: parseInt(adjustment),
      //     reason: reason || null
      //   }),
      // })

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      dispatch(setProducts(products.map(p => 
        p.id === selectedProductId ? { ...p, stock: p.stock + parseInt(adjustment) } : p
      )))
      
      toast.success(`Stock adjusted successfully. New stock level: ${products.find(p => p.id === selectedProductId)!.stock + parseInt(adjustment)}`)
      
      // Reset form
      setSelectedProductId('');
      setAdjustment('');
      setReason('');
    } catch (err: any) {
      setError(err.message || 'Failed to adjust stock');
      toast.error('Stock adjustment failed');
    } finally {
      setLoading(false);
    }
  }

  const selectedProduct = products.find(p => p.id === selectedProductId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adjust Stock</h1>
          <p className="text-muted-foreground">
            Manually adjust inventory levels for specific products.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Adjustment</CardTitle>
          <CardDescription>
            Select a product and enter the adjustment amount (positive to increase, negative to decrease).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} (SKU: {product.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adjustment">Adjustment Amount</Label>
                <Input
                  id="adjustment"
                  type="number"
                  value={adjustment}
                  onChange={(e) => setAdjustment(e.target.value)}
                  placeholder="Enter adjustment (e.g., 5 or -3)"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for adjustment"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleAdjustStock}
                disabled={!selectedProductId || !adjustment || loading}
              >
                {loading && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-t-transparent" />
                )}
                {loading ? 'Adjusting...' : 'Adjust Stock'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedProductId('');
                  setAdjustment('');
                  setReason('');
                }}
              >
                Clear
              </Button>
            </div>
            
            {selectedProduct && (
              <div className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Stock:</span>
                      <span className="font-medium">{selectedProduct.stock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min Stock:</span>
                      <span className="font-medium">{selectedProduct.minStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Stock:</span>
                      <span className="font-medium">{selectedProduct.maxStock}</span>
                    </div>
                    {adjustment && (
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-muted-foreground">New Stock:</span>
                        <span className="font-medium text-lg">
                          {selectedProduct.stock + parseInt(adjustment)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}