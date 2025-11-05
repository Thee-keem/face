'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import { 
  Download, 
  Calendar, 
  Search, 
  Filter,
  Building,
  TrendingUp,
  DollarSign,
  Package
} from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext'

// Mock data for supplier report
const supplierPerformance = [
  { month: 'Jan', orders: 24, onTime: 22, totalSpent: 12500 },
  { month: 'Feb', orders: 28, onTime: 26, totalSpent: 14200 },
  { month: 'Mar', orders: 32, onTime: 29, totalSpent: 18600 },
  { month: 'Apr', orders: 26, onTime: 24, totalSpent: 16800 },
  { month: 'May', orders: 30, onTime: 28, totalSpent: 21400 },
  { month: 'Jun', orders: 27, onTime: 25, totalSpent: 19200 },
]

const topSuppliers = [
  { id: '1', name: 'Tech Solutions Inc.', contact: 'John Smith', email: 'john@techsolutions.com', totalSpent: 42500, orders: 24, onTimeRate: 92, products: 42 },
  { id: '2', name: 'Global Electronics', contact: 'Jane Doe', email: 'jane@globalelectronics.com', totalSpent: 38200, orders: 28, onTimeRate: 89, products: 28 },
  { id: '3', name: 'Office Supplies Co.', contact: 'Bob Johnson', email: 'bob@officesupplies.com', totalSpent: 18750, orders: 15, onTimeRate: 95, products: 15 },
  { id: '4', name: 'Industrial Parts Ltd.', contact: 'Alice Brown', email: 'alice@industrialparts.com', totalSpent: 15600, orders: 18, onTimeRate: 87, products: 22 },
  { id: '5', name: 'Quality Components', contact: 'Charlie Wilson', email: 'charlie@qualitycomponents.com', totalSpent: 12400, orders: 12, onTimeRate: 93, products: 18 },
]

export default function SupplierReportPage() {
  const { baseCurrency, format } = useCurrency()
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-06-30' })
  const [exportFormat, setExportFormat] = useState('csv')
  const [searchTerm, setSearchTerm] = useState('')

  const handleExport = () => {
    console.log(`Exporting supplier report in ${exportFormat} format`)
  }

  const filteredSuppliers = topSuppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate metrics
  const totalSuppliers = topSuppliers.length
  const totalSpent = topSuppliers.reduce((sum, supplier) => sum + supplier.totalSpent, 0)
  const avgOrderValue = totalSpent / topSuppliers.reduce((sum, supplier) => sum + supplier.orders, 0)
  const avgOnTimeRate = topSuppliers.reduce((sum, supplier) => sum + supplier.onTimeRate, 0) / totalSuppliers

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Supplier Report</h1>
        <p className="text-muted-foreground">
          Analyze supplier performance and purchasing patterns
        </p>
      </div>
      
      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>
            Customize your supplier report
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                id="startDate" 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input 
                id="endDate" 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="xlsx">Excel</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} className="whitespace-nowrap">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">+3% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(totalSpent, baseCurrency)}</div>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(avgOrderValue, baseCurrency)}</div>
            <p className="text-xs text-muted-foreground">+5% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOnTimeRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">+2% from last period</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Supplier Orders Trend</CardTitle>
            <CardDescription>
              Purchase orders and on-time delivery over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" name="Total Orders" />
                <Bar dataKey="onTime" fill="#82ca9d" name="On-Time Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
            <CardDescription>
              Monthly spending with suppliers
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={supplierPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  if (name === 'totalSpent') {
                    return [format(Number(value), baseCurrency), 'Total Spent'];
                  }
                  return [value, name];
                }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalSpent" 
                  stroke="#8884d8" 
                  name="Total Spent ($)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Suppliers Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Top Suppliers</CardTitle>
              <CardDescription>
                Highest spending suppliers in the selected period
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>On-Time Rate</TableHead>
                <TableHead>Products</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-sm text-muted-foreground">{supplier.contact}</div>
                      <div className="text-sm text-muted-foreground">{supplier.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{format(supplier.totalSpent, baseCurrency)}</TableCell>
                  <TableCell>{supplier.orders}</TableCell>
                  <TableCell>{supplier.onTimeRate}%</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                      {supplier.products}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}