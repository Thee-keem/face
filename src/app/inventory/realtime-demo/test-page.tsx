'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function WebSocketTestPage() {
  const [productId, setProductId] = useState('test-product-123');
  const [productName, setProductName] = useState('Test Product');
  const [stock, setStock] = useState('10');
  const { toast } = useToast();

  const handleTestWebSocket = async () => {
    try {
      const response = await fetch('/api/inventory/test-websocket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          productName,
          stock: parseInt(stock),
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Inventory update sent via WebSocket',
        });
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send inventory update',
        variant: 'destructive',
      });
      console.error('Error testing WebSocket:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">WebSocket Test</h1>
          <p className="text-muted-foreground">
            Test the WebSocket functionality by sending inventory updates
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send Test Inventory Update</CardTitle>
            <CardDescription>
              This will send an inventory update via WebSocket to test real-time functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product ID</Label>
              <Input
                id="productId"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Enter product ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
                <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Level</Label>
              <Input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Enter stock level"
              />
            </div>
            
            <Button onClick={handleTestWebSocket}>
              Send WebSocket Update
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}