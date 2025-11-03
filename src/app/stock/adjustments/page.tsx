'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter
} from 'lucide-react'
import { MOCK_STOCK_ADJUSTMENTS } from '@/lib/mockData'

export default function StockAdjustmentsPage() {
  const [adjustments] = useState(MOCK_STOCK_ADJUSTMENTS)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredAdjustments = adjustments.filter(adjustment => {
    const matchesSearch = 
      adjustment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adjustment.sku.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = 
      typeFilter === 'all' || 
      (typeFilter === 'increase' && adjustment.quantity > 0) ||
      (typeFilter === 'decrease' && adjustment.quantity < 0)
    
    return matchesSearch && matchesType
  })

  const handleMakeAdjustment = () => {
    setIsDialogOpen(true)
  }

  const handleEditAdjustment = (adjustmentId: string) => {
    console.log('Edit adjustment:', adjustmentId)
    setIsDialogOpen(true)
  }

  const handleDeleteAdjustment = (adjustmentId: string) => {
    console.log('Delete adjustment:', adjustmentId)
  }

  const handleViewAdjustment = (adjustmentId: string) => {
    console.log('View adjustment:', adjustmentId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stock Adjustments</h1>
        <p className="text-muted-foreground">
          Manage stock adjustments and corrections
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Stock Adjustment List</CardTitle>
              <CardDescription>
                View and manage all stock adjustments
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search adjustments..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="increase">Increase</SelectItem>
                  <SelectItem value="decrease">Decrease</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleMakeAdjustment}>
                <Plus className="h-4 w-4 mr-2" />
                Make Adjustment
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Adjustment ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Adjusted By</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdjustments.map((adjustment) => (
                <TableRow key={adjustment.id}>
                  <TableCell className="font-medium">{adjustment.id}</TableCell>
                  <TableCell>{adjustment.product}</TableCell>
                  <TableCell>{adjustment.sku}</TableCell>
                  <TableCell>{adjustment.date}</TableCell>
                  <TableCell>{adjustment.adjustedBy}</TableCell>
                  <TableCell>
                    <Badge variant={adjustment.quantity > 0 ? 'default' : 'destructive'}>
                      {adjustment.quantity > 0 ? '+' : ''}{adjustment.quantity}
                    </Badge>
                  </TableCell>
                  <TableCell>{adjustment.reason}</TableCell>
                  <TableCell>{adjustment.location}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewAdjustment(adjustment.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditAdjustment(adjustment.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteAdjustment(adjustment.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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

      {/* Make Adjustment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Make Stock Adjustment</DialogTitle>
            <DialogDescription>
              Enter adjustment details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product" className="text-right">
                Product
              </Label>
              <div className="col-span-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wireless-headphones">Wireless Headphones</SelectItem>
                    <SelectItem value="usb-cable">USB Cable</SelectItem>
                    <SelectItem value="keyboard">Keyboard</SelectItem>
                    <SelectItem value="smartphone">Smartphone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <div className="col-span-3">
                <Input id="quantity" type="number" placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <div className="col-span-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="damaged">Damaged Items</SelectItem>
                    <SelectItem value="received">New Shipment Received</SelectItem>
                    <SelectItem value="quality">Quality Issues</SelectItem>
                    <SelectItem value="correction">Inventory Correction</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <div className="col-span-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main-warehouse">Main Warehouse</SelectItem>
                    <SelectItem value="store-1">Store 1</SelectItem>
                    <SelectItem value="store-2">Store 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Adjustment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}