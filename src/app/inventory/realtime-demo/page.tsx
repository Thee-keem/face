'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSocket } from '@/hooks/useSocket';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface InventoryUpdate {
  productId: string;
  stock: number;
  productName: string;
  timestamp: string;
}

export default function RealtimeInventoryDemo() {
  const [productId, setProductId] = useState('test-product-123');
  const [productName, setProductName] = useState('Test Product');
  const [stock, setStock] = useState('10');
  const [updates, setUpdates] = useState<InventoryUpdate[]>([]);
  const { socket, isConnected, emit } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    if (!socket) return;

    // Listen for inventory updates
    socket.on('inventoryUpdate', (data: InventoryUpdate) => {
      console.log('Received inventory update:', data);
      setUpdates(prev => [data, ...prev.slice(0, 9)]); // Keep only last 10 updates
    });

    // Clean up listener on unmount
    return () => {
      socket.off('inventoryUpdate');
    };
  }, [socket]);

  const handleSendUpdate = () => {
    if (productId && productName && stock) {
      emit('inventoryUpdate', {
        productId,
        productName,
        stock: parseInt(stock),
      });
      
      // Clear inputs
      // setProductId('');
      // setProductName('');
      // setStock('');
      
      toast({
        title: 'Success',
        description: 'Inventory update sent via WebSocket',
      });
    }
  };

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
          <h1 className="text-3xl font-bold">Real-time Inventory Demo</h1>
          <p className="text-muted-foreground">
            Test real-time inventory updates via WebSocket
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>
              Current WebSocket connection status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? 'default' : 'destructive'}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              <span>
                {isConnected ? 'Real-time updates enabled' : 'Not connected to WebSocket server'}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Inventory Update</CardTitle>
              <CardDescription>
                Simulate an inventory update event
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
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSendUpdate}
                  disabled={!productId || !productName || !stock || !isConnected}
                >
                  Send Update (Client)
                </Button>
                
                <Button 
                  variant="secondary"
                  onClick={handleTestWebSocket}
                >
                  Send Update (Server)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>
                Last 10 inventory updates received
              </CardDescription>
            </CardHeader>
            <CardContent>
              {updates.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No updates received yet
                </p>
              ) : (
                <div className="space-y-2">
                  {updates.map((update, index) => (
                    <div 
                      key={index} 
                      className="p-3 border rounded-md bg-muted/50"
                    >
                      <div className="font-medium">{update.productName}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {update.productId} | Stock: {update.stock}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(update.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}