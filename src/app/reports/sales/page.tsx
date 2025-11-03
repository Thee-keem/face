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
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign,
  Filter,
  Globe
} from 'lucide-react'
import { CurrencyDisplay } from '@/components/ui/currency-display'
import { useCurrency } from '@/contexts/CurrencyContext'
import { Currency } from '@prisma/client'

// Mock data for sales report
const salesData = [
  { date: '2024-01-01', sales: 24, revenue: 3200, currency: Currency.USD },
  { date: '2024-01-02', sales: 18, revenue: 2800, currency: Currency.USD },
  { date: '2024-01-03', sales: 31, revenue: 4100, currency: Currency.USD },
  { date: '2024-01-04', sales: 27, revenue: 3800, currency: Currency.USD },
  { date: '2024-01-05', sales: 42, revenue: 5600, currency: Currency.USD },
  { date: '2024-01-06', sales: 35, revenue: 4900, currency: Currency.USD },
  { date: '2024-01-07', sales: 29, revenue: 4200, currency: Currency.USD },
]

const topProducts = [
  { name: 'Wireless Headphones', sales: 124, revenue: 12400, currency: Currency.USD },
  { name: 'Smartphone', sales: 87, revenue: 26100, currency: Currency.USD },
  { name: 'Laptop', sales: 45, revenue: 45000, currency: Currency.USD },
  { name: 'Tablet', sales: 63, revenue: 18900, currency: Currency.USD },
  { name: 'Smart Watch', sales: 92, revenue: 9200, currency: Currency.USD },
]

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']

export default function SalesReportPage() {
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-01-07' })
  const [exportFormat, setExportFormat] = useState('csv')
  const [reportCurrency, setReportCurrency] = useState<Currency>(Currency.USD)
  const { convert, format } = useCurrency()

  const handleExport = () => {
    console.log(`Exporting report in ${exportFormat} format`)
  }

  // Convert sales data to selected currency
  const convertedSalesData = salesData.map(item => ({
    ...item,
    revenue: convert(item.revenue, item.currency, reportCurrency)
  }))

  // Convert top products data to selected currency
  const convertedTopProducts = topProducts.map(item => ({
    ...item,
    revenue: convert(item.revenue, item.currency, reportCurrency)
  }))

  const totalSales = convertedSalesData.reduce((sum, day) => sum + day.sales, 0)
  const totalRevenue = convertedSalesData.reduce((sum, day) => sum + day.revenue, 0)
  const avgOrderValue = totalRevenue / totalSales

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales Report</h1>
        <p className="text-muted-foreground">
          Analyze your sales performance and trends
        </p>
      </div>
      
      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>
            Customize your sales report
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
          <div className="flex items-end gap-2">
            <Select value={reportCurrency} onValueChange={(value) => setReportCurrency(value as Currency)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Currency).map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {currency}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CurrencyDisplay amount={totalRevenue} fromCurrency={reportCurrency} />
            </div>
            <p className="text-xs text-muted-foreground">+8% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CurrencyDisplay amount={avgOrderValue} fromCurrency={reportCurrency} />
            </div>
            <p className="text-xs text-muted-foreground">+3% from last period</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales Trend</CardTitle>
            <CardDescription>
              Sales volume and revenue over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={convertedSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'revenue') {
                      return [<span key="currency"><CurrencyDisplay amount={Number(value)} fromCurrency={reportCurrency} /></span>, 'Revenue'];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Sales Count" />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Revenue contribution by product
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={convertedTopProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {convertedTopProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [<span key="currency"><CurrencyDisplay amount={Number(value)} fromCurrency={reportCurrency} /></span>, 'Revenue']} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>
            Detailed breakdown of best performing products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {convertedTopProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">{product.sales}</TableCell>
                  <TableCell className="text-right">
                    <CurrencyDisplay amount={product.revenue} fromCurrency={reportCurrency} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">
                      {((product.revenue / totalRevenue) * 100).toFixed(1)}%
                    </Badge>
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