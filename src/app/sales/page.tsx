'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Receipt,
  Filter,
  Download,
  Calendar,
  User
} from 'lucide-react';
import { setSales, updateSaleStatus } from '@/features/sales/salesSlice';
import type { RootState } from '@/lib/store';
import { toast } from 'sonner';

export default function SalesPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { sales } = useSelector((state: RootState) => state.sales);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    paymentMethod: ''
  });

  // Mock sales data
  const mockSales = [
    {
      id: '1',
      invoiceNumber: 'INV-001',
      date: new Date('2024-01-15'),
      customer: 'John Doe',
      items: [
        { name: 'Wireless Mouse', quantity: 2, price: 29.99 },
        { name: 'USB Cable', quantity: 1, price: 12.99 }
      ],
      subtotal: 72.97,
      tax: 5.84,
      total: 78.81,
      paymentMethod: 'CASH',
      status: 'COMPLETED',
      staff: { name: 'Jane Smith' }
    },
    {
      id: '2',
      invoiceNumber: 'INV-002',
      date: new Date('2024-01-15'),
      customer: 'Jane Smith',
      items: [
        { name: 'Keyboard', quantity: 1, price: 79.99 },
        { name: 'Monitor', quantity: 1, price: 299.99 }
      ],
      subtotal: 379.98,
      tax: 30.40,
      total: 410.38,
      paymentMethod: 'CARD',
      status: 'COMPLETED',
      staff: { name: 'John Doe' }
    },
    {
      id: '3',
      invoiceNumber: 'INV-003',
      date: new Date('2024-01-14'),
      customer: 'Bob Johnson',
      items: [
        { name: 'USB Cable', quantity: 3, price: 12.99 }
      ],
      subtotal: 38.97,
      tax: 3.12,
      total: 42.09,
      paymentMethod: 'CASH',
      status: 'PENDING',
      staff: { name: 'Jane Smith' }
    },
    {
      id: '4',
      invoiceNumber: 'INV-004',
      date: new Date('2024-01-14'),
      customer: 'Alice Brown',
      items: [
        { name: 'Wireless Mouse', quantity: 1, price: 29.99 },
        { name: 'Keyboard', quantity: 1, price: 79.99 }
      ],
      subtotal: 109.98,
      tax: 8.80,
      total: 118.78,
      paymentMethod: 'CARD',
      status: 'REFUNDED',
      staff: { name: 'John Doe' }
    },
  ];

  // Use Redux sales if available, otherwise use mock data
  const displaySales = sales.length > 0 ? sales : mockSales;

  const filteredSales = displaySales.filter(sale => {
    const matchesSearch = sale.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sale.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filters.status === "all" || !filters.status || sale.status === filters.status;
    const matchesPaymentMethod = filters.paymentMethod === "all" || !filters.paymentMethod || sale.paymentMethod === filters.paymentMethod;

    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'REFUNDED':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case 'CASH':
        return <Badge variant="outline">Cash</Badge>;
      case 'CARD':
        return <Badge variant="outline">Card</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  // Helper function to format dates
  const formatDate = (date: string | Date): string => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Invoice #', 'Date', 'Customer', 'Items', 'Total', 'Payment Method', 'Status', 'Staff'];
    const csvContent = [
      headers.join(','),
      ...filteredSales.map(sale => [
        `"${sale.invoiceNumber}"`,
        `"${formatDate(sale.date)}"`,
        `"${sale.customer}"`,
        sale.items.length,
        sale.total,
        `"${sale.paymentMethod}"`,
        `"${sale.status}"`,
        `"${sale.staff?.name || 'N/A'}"`
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Sales data exported successfully');
  };

  const handlePrintReceipt = (sale: any) => {
    // In a real app, this would generate and print a receipt
    toast.info(`Printing receipt for ${sale.invoiceNumber}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sales Management</h1>
          <p className="text-muted-foreground">
            View and manage all sales transactions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="whitespace-nowrap">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button onClick={() => router.push('/pos')} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">New Sale</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              ${displaySales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{displaySales.length}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              ${displaySales.length > 0 ? (displaySales.reduce((sum, sale) => sum + sale.total, 0) / displaySales.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {displaySales.filter(s => s.status === 'PENDING').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by invoice number or customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setFilters({ ...filters, paymentMethod: value })}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Transactions ({filteredSales.length})</CardTitle>
          <CardDescription>
            A list of all sales transactions in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="hidden sm:table-cell">Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Staff</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(sale.date)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{sale.customer}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">
                        {sale.items.length} item{sale.items.length > 1 ? 's' : ''}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${sale.total.toFixed(2)}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getPaymentMethodBadge(sale.paymentMethod)}
                    </TableCell>
                    <TableCell>{getStatusBadge(sale.status)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {sale.staff?.name || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedSale(sale);
                            setIsDetailDialogOpen(true);
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrintReceipt(sale)}>
                            <Receipt className="mr-2 h-4 w-4" />
                            Print Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSales.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      No sales found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Sale Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sale Details - {selectedSale?.invoiceNumber}</DialogTitle>
            <DialogDescription>
              Complete information about this sales transaction.
            </DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSale.date.toLocaleDateString()} {selectedSale.date.toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm text-muted-foreground">{selectedSale.customer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <p className="text-sm text-muted-foreground">{selectedSale.paymentMethod}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-muted-foreground">{selectedSale.status}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedSale.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm border-b pb-2">
                      <div>
                        <span className="font-medium">{item.quantity}x {item.name}</span>
                      </div>
                      <span>${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${selectedSale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${selectedSale.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t">
                  <span>Total:</span>
                  <span>${selectedSale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => selectedSale && handlePrintReceipt(selectedSale)}>
              <Receipt className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}