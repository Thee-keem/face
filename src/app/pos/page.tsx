'use client';

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Package,
  Camera,
  CreditCard,
  DollarSign,
  Smartphone,
  Building2,
  Receipt,
  X,
  Barcode,
  Download,
  Calculator
} from 'lucide-react';
import { receiptGenerator, type ReceiptData } from '@/lib/receiptGenerator';
import { 
  addItem, 
  removeItem, 
  updateQuantity, 
  setDiscount, 
  setTax, 
  setPaymentMethod,
  setCustomerInfo,
  setScanning,
  clearCart,
  selectSubtotal,
  selectTotal
} from '@/features/pos/posSlice';
import { addSale } from '@/features/sales/salesSlice';
import type { RootState } from '@/lib/store';
import { useCurrency } from '@/contexts/CurrencyContext';
import { CurrencyDisplay } from '@/components/ui/currency-display';

// Mock tax rates data
const mockTaxRates = [
  {
    id: '1',
    name: 'Standard VAT',
    rate: 20,
    type: 'percentage',
    category: 'General',
    isCompound: false,
    status: 'active'
  },
  {
    id: '2',
    name: 'Reduced VAT',
    rate: 5,
    type: 'percentage',
    category: 'Food',
    isCompound: false,
    status: 'active'
  }
];

export default function POSPage() {
  const dispatch = useDispatch();
  const { items, discount, tax, paymentMethod, customerInfo, isScanning } = useSelector((state: RootState) => state.pos);
  const { baseCurrency: currency } = useCurrency();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorInput, setCalculatorInput] = useState('');
  const [selectedTaxRate, setSelectedTaxRate] = useState('1'); // Default to Standard VAT
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const { convert, format } = useCurrency();

  // Get subtotal from Redux store
  const subtotal = useSelector(selectSubtotal);
  const total = useSelector(selectTotal);

  // Fetch products and customers from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        setProducts(productsData.products);
        
        // Fetch customers
        const customersResponse = await fetch('/api/customers');
        if (!customersResponse.ok) {
          throw new Error('Failed to fetch customers');
        }
        const customersData = await customersResponse.json();
        setCustomers(customersData.customers);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate tax automatically when tax rate or subtotal changes
  useEffect(() => {
    const selectedRate = mockTaxRates.find(rate => rate.id === selectedTaxRate);
    if (selectedRate) {
      const calculatedTax = subtotal * (selectedRate.rate / 100);
      dispatch(setTax(calculatedTax));
    }
  }, [subtotal, selectedTaxRate, dispatch]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode?.includes(searchQuery)
  );

  const handleAddToCart = (product: any) => {
    dispatch(addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      currency: currency,
      quantity: 1,
    }));
  };

  const handleBarcodeScan = async (barcode: string) => {
    try {
      const response = await fetch(`/api/barcode?code=${encodeURIComponent(barcode)}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      const product = data.product;
      
      if (product) {
        handleAddToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        });
        setSearchQuery('');
        if (barcodeInputRef.current) {
          barcodeInputRef.current.focus();
        }
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      alert('Product not found');
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeItem(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const handleCheckout = async () => {
    try {
      // Create sale via API
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          paymentMethod,
          discount,
          tax, // Include calculated tax
          customerId: (customerInfo as any).id || null,
          notes: null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create sale');
      }

      const sale = await response.json();

      // Generate receipt data
      const receiptData: ReceiptData = {
        storeInfo: {
          name: 'Inventory Pro Store',
          address: '123 Main St, City, State 12345',
          phone: '+1 (555) 123-4567',
          email: 'store@inventorypro.com',
        },
        receiptInfo: {
          invoiceNo: sale.invoiceNo,
          date: sale.createdAt,
          cashier: 'Current User', // This would come from the auth state
          paymentMethod: paymentMethod,
        },
        customerInfo: customerInfo.name || customerInfo.email ? customerInfo : undefined,
        items: sale.saleItems.map((item: any) => ({
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
        subtotal: sale.totalAmount - sale.tax + sale.discount,
        discount: sale.discount,
        tax: sale.tax,
        total: sale.finalAmount,
      };

      // Create sale object for Redux store
      const newSale = {
        id: sale.id,
        invoiceNumber: sale.invoiceNo,
        date: sale.createdAt,
        customer: customerInfo.name || 'Walk-in Customer',
        items: sale.saleItems.map((item: any) => ({
          productId: item.productId,
          name: item.product.name,
          price: item.unitPrice,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        })),
        subtotal: sale.totalAmount - sale.tax + sale.discount,
        tax: sale.tax,
        discount: sale.discount,
        total: sale.finalAmount,
        paymentMethod: sale.paymentMethod,
        status: sale.status,
        staff: {
          name: 'Current User',
          email: 'user@inventorypro.com'
        },
        customerInfo: customerInfo.name || customerInfo.email ? customerInfo : undefined,
        createdAt: sale.createdAt,
      };

      // Add sale to Redux store
      dispatch(addSale(newSale));

      // Generate and download receipt
      receiptGenerator.downloadReceipt(receiptData);

      alert(`Sale completed! Total: ${format(total, currency)}\nReceipt downloaded successfully!`);
      dispatch(clearCart());
      setIsCheckoutOpen(false);
    } catch (error) {
      console.error('Error processing checkout:', error);
      alert(`Error processing sale: ${(error as Error).message}`);
    }
  };

  const handleGenerateReceipt = () => {
    const receiptData: ReceiptData = {
      storeInfo: {
        name: 'Inventory Pro Store',
        address: '123 Main St, City, State 12345',
        phone: '+1 (555) 123-4567',
        email: 'store@inventorypro.com',
      },
      receiptInfo: {
        invoiceNo: `INV-${Date.now()}`,
        date: new Date().toISOString(),
        cashier: 'Current User',
        paymentMethod: paymentMethod,
      },
      customerInfo: customerInfo.name || customerInfo.email ? customerInfo : undefined,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.totalPrice,
      })),
      subtotal,
      discount,
      tax,
      total,
    };

    receiptGenerator.downloadReceipt(receiptData);
  };

  // Calculator functions
  const handleCalculatorInput = (value: string) => {
    if (value === '=') {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(calculatorInput);
        setCalculatorInput(result.toString());
      } catch (error) {
        setCalculatorInput('Error');
      }
    } else if (value === 'C') {
      setCalculatorInput('');
    } else if (value === '←') {
      setCalculatorInput(prev => prev.slice(0, -1));
    } else {
      setCalculatorInput(prev => prev + value);
    }
  };

  const paymentMethods = [
    { value: 'CASH', label: 'Cash', icon: DollarSign },
    { value: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
    { value: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard },
    { value: 'MOBILE_PAYMENT', label: 'Mobile Payment', icon: Smartphone },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: Building2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
          <p className="text-muted-foreground">
            Process sales and manage transactions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCalculatorOpen(true)}>
            <Calculator className="h-4 w-4 mr-2" />
            Calculator
          </Button>
          <Button variant="outline" onClick={() => dispatch(setScanning(!isScanning))}>
            <Camera className="h-4 w-4 mr-2" />
            {isScanning ? 'Stop Scanning' : 'Start Scanning'}
          </Button>
          <Button 
            variant="outline" 
            disabled={items.length === 0}
            onClick={() => dispatch(clearCart())}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
          {items.length > 0 && (
            <Button variant="outline" onClick={handleGenerateReceipt}>
              <Download className="h-4 w-4 mr-2" />
              Generate Receipt
            </Button>
          )}
          <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
            <DialogTrigger asChild>
              <Button disabled={items.length === 0}>
                <Receipt className="h-4 w-4 mr-2" />
                Checkout (<CurrencyDisplay amount={total} fromCurrency={currency} />)
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Checkout</DialogTitle>
                <DialogDescription>
                  Complete the sale by selecting payment method.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer" className="text-right">
                    Customer
                  </Label>
                  <div className="col-span-3">
                    <Input 
                      id="customer" 
                      placeholder="Search customer..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="mb-2" 
                    />
                    {customerSearch && (
                      <div className="border rounded-md max-h-40 overflow-y-auto">
                        {customers
                          .filter(customer => 
                            customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                            customer.email.toLowerCase().includes(customerSearch.toLowerCase())
                          )
                          .map(customer => (
                            <div 
                              key={customer.id}
                              className="p-2 hover:bg-muted cursor-pointer"
                              onClick={() => {
                                dispatch(setCustomerInfo({ 
                                  id: customer.id,
                                  name: customer.name || '', 
                                  email: customer.email || ''
                                }));
                                setCustomerSearch('');
                              }}
                            >
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">{customer.email}</div>
                            </div>
                          ))
                        }
                      </div>
                    )}
                    <div className="mt-2">
                      <Input 
                        placeholder="Customer name"
                        value={customerInfo.name || ''}
                        onChange={(e) => dispatch(setCustomerInfo({ name: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="customer@email.com"
                    value={customerInfo.email || ''}
                    onChange={(e) => dispatch(setCustomerInfo({ email: e.target.value }))}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Payment</Label>
                  <Select value={paymentMethod} onValueChange={(value) => dispatch(setPaymentMethod(value as any))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          <div className="flex items-center gap-2">
                            <method.icon className="h-4 w-4" />
                            {method.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discount" className="text-right">
                    Discount
                  </Label>
                  <Input 
                    id="discount" 
                    type="number"
                    placeholder="0.00"
                    value={discount}
                    onChange={(e) => dispatch(setDiscount(parseFloat(e.target.value) || 0))}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="taxRate" className="text-right">
                    Tax Rate
                  </Label>
                  <Select value={selectedTaxRate} onValueChange={setSelectedTaxRate}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTaxRates.map((rate) => (
                        <SelectItem key={rate.id} value={rate.id}>
                          {rate.name} ({rate.rate}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tax" className="text-right">
                    Tax
                  </Label>
                  <Input 
                    id="tax" 
                    type="number"
                    placeholder="0.00"
                    value={tax}
                    readOnly
                    className="col-span-3" 
                  />
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span>
                    <CurrencyDisplay amount={subtotal} fromCurrency={currency} />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Discount:</span>
                  <span>
                    -<CurrencyDisplay amount={discount} fromCurrency={currency} />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax:</span>
                  <span>
                    <CurrencyDisplay amount={tax} fromCurrency={currency} />
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold">
                  <span>Total:</span>
                  <span>
                    <CurrencyDisplay amount={total} fromCurrency={currency} />
                  </span>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCheckout}>
                  Complete Sale
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Calculator Dialog */}
      <Dialog open={isCalculatorOpen} onOpenChange={setIsCalculatorOpen}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Calculator</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <Input 
              value={calculatorInput} 
              readOnly 
              className="text-right text-xl h-12" 
            />
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" onClick={() => handleCalculatorInput('C')}>C</Button>
              <Button variant="outline" onClick={() => handleCalculatorInput('←')}>←</Button>
              <Button variant="outline" onClick={() => handleCalculatorInput('%')}>%</Button>
              <Button variant="outline" onClick={() => handleCalculatorInput('/')}>/</Button>
              
              <Button variant="outline" onClick={() => handleCalculatorInput('7')}>7</Button>
              <Button variant="outline" onClick={() => handleCalculatorInput('8')}>8</Button>
              <Button variant="outline" onClick={() => handleCalculatorInput('9')}>9</Button>
              <Button variant="outline" onClick={() => handleCalculatorInput('*')}>×</Button>
              
              <Button variant="outline" onClick={() => handleCalculatorInput('4')}>4</Button>
              <Button variant="outline" onClick={() => handleCalculatorInput('5')}>5</Button>
              <Button variant="outline" onClick={() => handleCalculatorInput('6')}>6</Button>
              <Button variant="outline" onClick={() => handleCalculatorInput('-')}>-</Button>
              
              <Button variant="outline" onClick={() => handleCalculatorInput('1')}>1</Button>
              <Button variant="outline" onClick={() => handleCalculatorInput('2')}>2</Button>
              <Button variant="outline" onClick={() => handleCalculatorInput('3')}>3</Button>
              <Button variant="outline" onClick={() => handleCalculatorInput('+')}>+</Button>
              
              <Button variant="outline" onClick={() => handleCalculatorInput('0')}>0</Button>
              <Button variant="outline" onClick={() => handleCalculatorInput('.')}>.</Button>
              <Button variant="outline" onClick={() => handleCalculatorInput('=')}>=</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Barcode Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Barcode className="h-5 w-5" />
                Barcode Scanner
              </CardTitle>
              <CardDescription>
                Scan or enter barcode to add products to cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  ref={barcodeInputRef}
                  placeholder="Enter barcode or scan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleBarcodeScan(searchQuery);
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={() => handleBarcodeScan(searchQuery)}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Click on a product to add it to the cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleAddToCart(product)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{product.name}</h3>
                        <Badge variant={product.stock > 10 ? 'default' : 'destructive'}>
                          {product.stock}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground font-mono">
                          {product.barcode}
                        </p>
                        <p className="font-semibold text-lg">
                          <CurrencyDisplay amount={product.price} fromCurrency={currency} />
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shopping Cart</CardTitle>
              <CardDescription>
                {items.length} {items.length === 1 ? 'item' : 'items'} in cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Your cart is empty</p>
                  <p className="text-sm">Add products to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="max-h-96 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            <CurrencyDisplay amount={item.price} fromCurrency={item.currency} />
                            {' '}each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => dispatch(removeItem(item.productId))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>
                        <CurrencyDisplay amount={subtotal} fromCurrency={currency} />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>
                        -<CurrencyDisplay amount={discount} fromCurrency={currency} />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>
                        <CurrencyDisplay amount={tax} fromCurrency={currency} />
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>
                        <CurrencyDisplay amount={total} fromCurrency={currency} />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}