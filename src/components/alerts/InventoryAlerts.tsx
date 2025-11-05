'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  AlertTriangle, 
  Package, 
  Check, 
  X,
  Filter,
  Download,
  MoreHorizontal,
  Settings,
  Plus
} from 'lucide-react';
import { useGetInventoryAlertsQuery, useMarkAlertAsReadMutation } from '@/features/api/apiSlice';
import { useSocket } from '@/hooks/useSocket';
import type { RootState } from '@/lib/store';

interface InventoryAlert {
  id: string;
  productId: string;
  type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK';
  message: string;
  isRead: boolean;
  createdAt: string;
  product: {
    id: string;
    name: string;
    stock: number;
    minStock: number;
    maxStock: number;
    barcode?: string;
  };
}

interface InventoryUpdate {
  productId: string;
  stock: number;
  productName: string;
  timestamp: string;
}

export default function InventoryAlerts() {
  const dispatch = useDispatch();
  // Fix: Provide default argument to the query hook
  const { data: alerts, isLoading, refetch } = useGetInventoryAlertsQuery({});
  const [markAlertAsRead] = useMarkAlertAsReadMutation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'low-stock' | 'out-of-stock' | 'overstock'>('all');
  const { socket, isConnected } = useSocket();

  // Mock alerts data for now
  const mockAlerts: InventoryAlert[] = [
    {
      id: '1',
      productId: '1',
      type: 'LOW_STOCK',
      message: 'Wireless Mouse is running low on stock',
      isRead: false,
      createdAt: '2024-01-15T10:30:00Z',
      product: {
        id: '1',
        name: 'Wireless Mouse',
        stock: 3,
        minStock: 10,
        maxStock: 100,
        barcode: '1234567890123'
      }
    },
    {
      id: '2',
      productId: '2',
      type: 'OUT_OF_STOCK',
      message: 'USB Cable is out of stock',
      isRead: false,
      createdAt: '2024-01-15T09:15:00Z',
      product: {
        id: '2',
        name: 'USB Cable',
        stock: 0,
        minStock: 20,
        maxStock: 200,
        barcode: '1234567890124'
      }
    },
    {
      id: '3',
      productId: '3',
      type: 'LOW_STOCK',
      message: 'Keyboard is running low on stock',
      isRead: true,
      createdAt: '2024-01-14T14:20:00Z',
      product: {
        id: '3',
        name: 'Keyboard',
        stock: 2,
        minStock: 15,
        maxStock: 50,
        barcode: '1234567890125'
      }
    },
    {
      id: '4',
      productId: '4',
      type: 'OVERSTOCK',
      message: 'Monitor stock exceeds maximum level',
      isRead: false,
      createdAt: '2024-01-14T11:45:00Z',
      product: {
        id: '4',
        name: 'Monitor',
        stock: 30,
        minStock: 5,
        maxStock: 25,
        barcode: '1234567890126'
      }
    }
  ];

  useEffect(() => {
    if (!socket) return;

    // Listen for inventory updates
    socket.on('inventoryUpdate', (data: InventoryUpdate) => {
      console.log('Inventory update received:', data);
      // Refetch alerts when inventory is updated
      refetch();
    });

    // Clean up listener on unmount
    return () => {
      socket.off('inventoryUpdate');
    };
  }, [socket, refetch]);

  const filteredAlerts = mockAlerts.filter(alert => {
    if (filter === 'unread') return !alert.isRead;
    if (filter === 'low-stock') return alert.type === 'LOW_STOCK';
    if (filter === 'out-of-stock') return alert.type === 'OUT_OF_STOCK';
    if (filter === 'overstock') return alert.type === 'OVERSTOCK';
    return true;
  });

  const unreadCount = mockAlerts.filter(alert => !alert.isRead).length;

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await markAlertAsRead(alertId).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
    }
  };

  const handleMarkAllAsRead = () => {
    mockAlerts.forEach(alert => {
      if (!alert.isRead) {
        handleMarkAsRead(alert.id);
      }
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'LOW_STOCK':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'OUT_OF_STOCK':
        return <X className="h-4 w-4 text-red-500" />;
      case 'OVERSTOCK':
        return <Package className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Fix: Remove 'warning' variant which doesn't exist in the Badge component
  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'LOW_STOCK':
        return 'secondary';
      case 'OUT_OF_STOCK':
        return 'destructive';
      case 'OVERSTOCK':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'LOW_STOCK':
        return 'Low Stock';
      case 'OUT_OF_STOCK':
        return 'Out of Stock';
      case 'OVERSTOCK':
        return 'Overstock';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory Alerts</h1>
            <p className="text-muted-foreground">
              Monitor and manage inventory notifications
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Alert Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Alert Settings</DialogTitle>
                <DialogDescription>
                  Configure when and how you receive inventory alerts
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lowStockThreshold" className="text-right">
                    Low Stock %
                  </Label>
                  <Input id="lowStockThreshold" defaultValue="20" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="overstockThreshold" className="text-right">
                    Overstock %
                  </Label>
                  <Input id="overstockThreshold" defaultValue="150" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="emailNotifications" className="text-right">
                    Email Alerts
                  </Label>
                  <Select defaultValue="enabled">
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => setIsSettingsOpen(false)}>
                  Save Settings
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Active notifications
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAlerts.filter(a => a.type === 'LOW_STOCK').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need restocking
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <X className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAlerts.filter(a => a.type === 'OUT_OF_STOCK').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Critical shortage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({mockAlerts.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'low-stock' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('low-stock')}
            >
              Low Stock ({mockAlerts.filter(a => a.type === 'LOW_STOCK').length})
            </Button>
            <Button
              variant={filter === 'out-of-stock' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('out-of-stock')}
            >
              Out of Stock ({mockAlerts.filter(a => a.type === 'OUT_OF_STOCK').length})
            </Button>
            <Button
              variant={filter === 'overstock' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('overstock')}
            >
              Overstock ({mockAlerts.filter(a => a.type === 'OVERSTOCK').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alerts ({filteredAlerts.length})</CardTitle>
          <CardDescription>
            Inventory notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
                    {!alert.isRead && (
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getAlertIcon(alert.type)}
                      <Badge variant={getAlertVariant(alert.type) as any}>
                        {getAlertTypeLabel(alert.type)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{alert.product.name}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {alert.product.barcode}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Current: {alert.product.stock}</div>
                      <div className="text-muted-foreground">
                        Min: {alert.product.minStock} / Max: {alert.product.maxStock}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!alert.isRead && (
                          <DropdownMenuItem onClick={() => handleMarkAsRead(alert.id)}>
                            <Check className="mr-2 h-4 w-4" />
                            Mark as Read
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Package className="mr-2 h-4 w-4" />
                          View Product
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Purchase Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}