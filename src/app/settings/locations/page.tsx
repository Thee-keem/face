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
  MapPin,
  Package,
  Users
} from 'lucide-react'

// Mock data for business locations
const businessLocations = [
  {
    id: '1',
    name: 'Main Warehouse',
    address: '123 Storage Street, Industrial District, ID 12345',
    type: 'Warehouse',
    status: 'active',
    products: 1247,
    staff: 12,
    manager: 'John Smith'
  },
  {
    id: '2',
    name: 'Downtown Store',
    address: '456 Main Avenue, Downtown, DT 67890',
    type: 'Retail Store',
    status: 'active',
    products: 325,
    staff: 8,
    manager: 'Jane Doe'
  },
  {
    id: '3',
    name: 'North Branch',
    address: '789 North Road, Northern District, ND 54321',
    type: 'Retail Store',
    status: 'active',
    products: 287,
    staff: 6,
    manager: 'Bob Johnson'
  },
  {
    id: '4',
    name: 'Distribution Center',
    address: '321 Logistics Blvd, Commercial Area, CA 98765',
    type: 'Distribution',
    status: 'inactive',
    products: 0,
    staff: 0,
    manager: 'Unassigned'
  },
]

const locationTypes = [
  'Warehouse', 'Retail Store', 'Distribution', 'Office', 'Showroom'
]

export default function BusinessLocationsPage() {
  const [locations] = useState(businessLocations)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredLocations = locations.filter(location => {
    const matchesSearch = 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || 
      location.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleAddLocation = () => {
    setIsDialogOpen(true)
  }

  const handleEditLocation = (locationId: string) => {
    console.log('Edit location:', locationId)
    setIsDialogOpen(true)
  }

  const handleDeleteLocation = (locationId: string) => {
    console.log('Delete location:', locationId)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Locations</h1>
        <p className="text-muted-foreground">
          Manage your business locations and warehouses
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Location Management</CardTitle>
              <CardDescription>
                Add, edit, and manage your business locations
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search locations..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddLocation}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Location
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.name}</TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      {location.type}
                    </div>
                  </TableCell>
                  <TableCell>{location.manager}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                      {location.products}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      {location.staff}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(location.status)}>
                      {location.status}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditLocation(location.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteLocation(location.id)}>
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

      {/* Add Location Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Business Location</DialogTitle>
            <DialogDescription>
              Enter location details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locationName" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input id="locationName" placeholder="Location name" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locationAddress" className="text-right">
                Address
              </Label>
              <div className="col-span-3">
                <textarea
                  id="locationAddress"
                  className="w-full p-2 border rounded-md"
                  placeholder="Full address"
                  rows={3}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locationType" className="text-right">
                Type
              </Label>
              <div className="col-span-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locationManager" className="text-right">
                Manager
              </Label>
              <div className="col-span-3">
                <Input id="locationManager" placeholder="Manager name" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Location</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}