'use client';

import { useState, useEffect } from 'react';
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
  Edit, 
  Trash2, 
  Package,
  AlertTriangle,
  Filter,
  Download
} from 'lucide-react';
import { setProducts, setSearchQuery, setFilters } from '@/features/inventory/inventorySlice';
import type { RootState } from '@/lib/store';
import { toast } from 'sonner';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { ProductPriceManager } from '@/components/products/product-price-manager';
import { Currency } from '@prisma/client';

export default function InventoryPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { products, searchQuery, filters } = useSelector((state: RootState) => state.inventory);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [apiProducts, setApiProducts] = useState<any[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    price: '',
    cost: '',
    stock: '',
    minStock: '',
    maxStock: '',
    category: '',
    isActive: true,
    prices: [{ currency: Currency.USD, price: 0, cost: 0, isActive: true }] as Array<{ currency: Currency; price: number; cost: number; isActive: boolean }>
  });

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setApiProducts(data.products);
        dispatch(setProducts(data.products));
      } catch (error) {
        toast.error('Failed to load products');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch]);

  const filteredProducts = apiProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.barcode?.includes(searchQuery);
    
    const matchesCategory = filters.category === "all" || !filters.category || product.category?.name === filters.category;
    const matchesLowStock = !filters.lowStock || product.stock <= product.minStock;
    const matchesOutOfStock = !filters.outOfStock || product.stock === 0;
    const matchesActive = filters.active === false || product.isActive;
    
    // Price range filter
    let matchesPriceRange = true;
    if (filters.priceRange === '0-50') {
      matchesPriceRange = product.price <= 50;
    } else if (filters.priceRange === '50-100') {
      matchesPriceRange = product.price > 50 && product.price <= 100;
    } else if (filters.priceRange === '100+') {
      matchesPriceRange = product.price > 100;
    }

    return matchesSearch && matchesCategory && matchesLowStock && matchesOutOfStock && matchesActive && matchesPriceRange;
  });

  const getStockStatus = (product: any) => {
    if (product.stock === 0) return { status: 'Out of Stock', variant: 'destructive' as const };
    if (product.stock <= product.minStock) return { status: 'Low Stock', variant: 'outline' as const };
    return { status: 'In Stock', variant: 'default' as const };
  };

  // CRUD Functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      barcode: '',
      price: '',
      cost: '',
      stock: '',
      minStock: '',
      maxStock: '',
      category: '',
      isActive: true,
      prices: [{ currency: Currency.USD, price: 0, cost: 0, isActive: true }]
    });
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name: formData.name,
      sku: formData.sku || `SKU-${Date.now()}`,
      barcode: formData.barcode || `BAR-${Date.now()}`,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost) || 0,
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock) || 10,
      maxStock: parseInt(formData.maxStock) || 100,
      isActive: formData.isActive,
      category: { name: formData.category || 'Other' },
      prices: formData.prices
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          sku: formData.sku,
          barcode: formData.barcode,
          price: parseFloat(formData.price),
          cost: parseFloat(formData.cost) || 0,
          stock: parseInt(formData.stock),
          minStock: parseInt(formData.minStock) || 10,
          maxStock: parseInt(formData.maxStock) || 100,
          isActive: formData.isActive,
          categoryId: formData.category || null,
          prices: formData.prices
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const newProduct = await response.json();
      setApiProducts(prev => [...prev, newProduct]);
      dispatch(setProducts([...apiProducts, newProduct]));
    } catch (error) {
      toast.error('Failed to add product');
      console.error('Error adding product:', error);
      return;
    }
    
    toast.success('Product added successfully');
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      maxStock: product.maxStock.toString(),
      category: product.category?.name || '',
      isActive: product.isActive,
      prices: product.prices || [{ currency: Currency.USD, price: product.price, cost: product.cost, isActive: true }]
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct || !formData.name || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          sku: formData.sku,
          barcode: formData.barcode,
          price: parseFloat(formData.price),
          cost: parseFloat(formData.cost) || 0,
          stock: parseInt(formData.stock),
          minStock: parseInt(formData.minStock) || 10,
          maxStock: parseInt(formData.maxStock) || 100,
          isActive: formData.isActive,
          categoryId: formData.category || null,
          prices: formData.prices
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct = await response.json();
      
      // Update the local state
      setApiProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
      dispatch(setProducts(apiProducts.map(p => p.id === selectedProduct.id ? updatedProduct : p)));
      
      toast.success('Product updated successfully');
      resetForm();
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error('Failed to update product');
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (product: any) => {
    if (!confirm(`Are you sure you want to delete ${product.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Update the local state
      setApiProducts(prev => prev.filter(p => p.id !== product.id));
      dispatch(setProducts(apiProducts.filter(p => p.id !== product.id)));
      
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Error deleting product:', error);
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['Name', 'SKU', 'Barcode', 'Price', 'Cost', 'Stock', 'Min Stock', 'Max Stock', 'Category', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(product => [
        product.name,
        product.sku,
        product.barcode,
        product.price,
        product.cost,
        product.stock,
        product.minStock,
        product.maxStock,
        product.category?.name || '',
        getStockStatus(product).status
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Inventory exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your products, track stock levels, and receive alerts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExport} className="whitespace-nowrap">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" onClick={() => router.push('/inventory/import')} className="whitespace-nowrap">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          <Button variant="outline" onClick={() => router.push('/inventory/adjust')} className="whitespace-nowrap">
            <Package className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Adjust Stock</span>
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Product</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Create a new product in your inventory.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    placeholder="Product name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sku" className="text-right">
                    SKU
                  </Label>
                  <Input 
                    id="sku" 
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    placeholder="Auto-generated"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="barcode" className="text-right">
                    Barcode
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Input 
                      id="barcode" 
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      placeholder="Auto-generated"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={async () => {
                        // Generate a random barcode
                        const newBarcode = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
                        setFormData(prev => ({ ...prev, barcode: newBarcode }));
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Stock *
                  </Label>
                  <Input 
                    id="stock" 
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    placeholder="0"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="minStock" className="text-right">
                    Min Stock
                  </Label>
                  <Input 
                    id="minStock" 
                    name="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    placeholder="10"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maxStock" className="text-right">
                    Max Stock
                  </Label>
                  <Input 
                    id="maxStock" 
                    name="maxStock"
                    type="number"
                    value={formData.maxStock}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    placeholder="100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select onValueChange={(value) => handleSelectChange('category', value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Image
                  </Label>
                  <Input 
                    id="image" 
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      // Handle image upload
                      const file = e.target.files?.[0];
                      if (file) {
                        // In a real implementation, you would upload the file to a storage service
                        // and set the imageUrl in the formData
                        console.log('Image selected:', file.name);
                      }
                    }}
                    className="col-span-3" 
                  />
                </div>
                
                {/* Multi-currency pricing section */}
                <div className="col-span-4">
                  <ProductPriceManager 
                    prices={formData.prices} 
                    onChange={(prices) => setFormData(prev => ({ ...prev, prices }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={handleAddProduct}>
                  Save Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name, SKU, or barcode..."
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select onValueChange={(value) => dispatch(setFilters({ category: value }))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={filters.lowStock ? "default" : "outline"}
                  size="sm"
                  onClick={() => dispatch(setFilters({ lowStock: !filters.lowStock }))}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Low Stock
                </Button>
                <Button
                  variant={filters.outOfStock ? "default" : "outline"}
                  size="sm"
                  onClick={() => dispatch(setFilters({ outOfStock: !filters.outOfStock }))}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Out of Stock
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.active === false ? "outline" : "default"}
                size="sm"
                onClick={() => dispatch(setFilters({ active: filters.active === false ? true : false }))}
              >
                Active Only
              </Button>
              <Button
                variant={filters.priceRange === '0-50' ? "default" : "outline"}
                size="sm"
                onClick={() => dispatch(setFilters({ priceRange: filters.priceRange === '0-50' ? undefined : '0-50' }))}
              >
                Under $50
              </Button>
              <Button
                variant={filters.priceRange === '50-100' ? "default" : "outline"}
                size="sm"
                onClick={() => dispatch(setFilters({ priceRange: filters.priceRange === '50-100' ? undefined : '50-100' }))}
              >
                $50-$100
              </Button>
              <Button
                variant={filters.priceRange === '100+' ? "default" : "outline"}
                size="sm"
                onClick={() => dispatch(setFilters({ priceRange: filters.priceRange === '100+' ? undefined : '100+' }))}
              >
                Over $100
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>
            A list of all your products in the inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="hidden sm:table-cell">SKU</TableHead>
                <TableHead className="hidden md:table-cell">Barcode</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground hidden sm:table-cell">
                            Cost: <CurrencyDisplay amount={product.cost} />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{product.sku}</TableCell>
                    <TableCell className="hidden md:table-cell font-mono">{product.barcode}</TableCell>
                    <TableCell>
                      <CurrencyDisplay amount={product.price} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{product.stock}</span>
                        {product.stock <= product.minStock && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>{stockStatus.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{product.category?.name}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteProduct(product)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name *
              </Label>
              <Input 
                id="edit-name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3" 
                placeholder="Product name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-sku" className="text-right">
                SKU
              </Label>
              <Input 
                id="edit-sku" 
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="col-span-3" 
                placeholder="SKU"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-barcode" className="text-right">
                Barcode
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input 
                  id="edit-barcode" 
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleInputChange}
                  placeholder="Barcode"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={async () => {
                    // Generate a random barcode
                    const newBarcode = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
                    setFormData(prev => ({ ...prev, barcode: newBarcode }));
                  }}
                >
                  Generate
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-stock" className="text-right">
                Stock *
              </Label>
              <Input 
                id="edit-stock" 
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                className="col-span-3" 
                placeholder="0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-minStock" className="text-right">
                Min Stock
              </Label>
              <Input 
                id="edit-minStock" 
                name="minStock"
                type="number"
                value={formData.minStock}
                onChange={handleInputChange}
                className="col-span-3" 
                placeholder="10"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-maxStock" className="text-right">
                Max Stock
              </Label>
              <Input 
                id="edit-maxStock" 
                name="maxStock"
                type="number"
                value={formData.maxStock}
                onChange={handleInputChange}
                className="col-span-3" 
                placeholder="100"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category
              </Label>
              <Select onValueChange={(value) => handleSelectChange('category', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Multi-currency pricing section */}
            <div className="col-span-4">
              <ProductPriceManager 
                prices={formData.prices} 
                onChange={(prices) => setFormData(prev => ({ ...prev, prices }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              resetForm();
              setSelectedProduct(null);
            }}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleUpdateProduct}>
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}