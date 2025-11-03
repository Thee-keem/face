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
  Search,
  FileText,
  DollarSign,
  Calculator,
  AlertTriangle
} from 'lucide-react'

// Mock data for tax report
const taxData = [
  { month: 'Jan', taxableSales: 104167, taxCollected: 8333, taxPaid: 8333, liability: 0 },
  { month: 'Feb', taxableSales: 110000, taxCollected: 8800, taxPaid: 8800, liability: 0 },
  { month: 'Mar', taxableSales: 120833, taxCollected: 9667, taxPaid: 9667, liability: 0 },
  { month: 'Apr', taxableSales: 115000, taxCollected: 9200, taxPaid: 9200, liability: 0 },
  { month: 'May', taxableSales: 126667, taxCollected: 10133, taxPaid: 10133, liability: 0 },
  { month: 'Jun', taxableSales: 123333, taxCollected: 9867, taxPaid: 9867, liability: 0 },
]

const taxCategories = [
  { name: 'Standard Rate (20%)', value: 75, color: '#8884d8' },
  { name: 'Reduced Rate (5%)', value: 20, color: '#82ca9d' },
  { name: 'Zero Rate (0%)', value: 5, color: '#ffc658' },
]

const taxFilings = [
  { id: '1', period: 'Q1 2024', dueDate: '2024-04-30', status: 'Filed', amount: 26400 },
  { id: '2', period: 'Q2 2024', dueDate: '2024-07-31', status: 'Pending', amount: 29200 },
  { id: '3', period: 'Q3 2024', dueDate: '2024-10-31', status: 'Upcoming', amount: 0 },
  { id: '4', period: 'Q4 2024', dueDate: '2025-01-31', status: 'Upcoming', amount: 0 },
]

const COLORS = ['#8884d8', '#82ca9d', '#ffc658']

export default function TaxReportPage() {
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-06-30' })
  const [exportFormat, setExportFormat] = useState('csv')

  const handleExport = () => {
    console.log(`Exporting tax report in ${exportFormat} format`)
  }

  // Calculate metrics
  const totalTaxableSales = taxData.reduce((sum, month) => sum + month.taxableSales, 0)
  const totalTaxCollected = taxData.reduce((sum, month) => sum + month.taxCollected, 0)
  const totalTaxPaid = taxData.reduce((sum, month) => sum + month.taxPaid, 0)
  const outstandingLiability = taxData.reduce((sum, month) => sum + month.liability, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tax Report</h1>
        <p className="text-muted-foreground">
          Calculate and analyze your tax obligations
        </p>
      </div>
      
      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>
            Customize your tax report
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxable Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalTaxableSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Collected</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalTaxCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Paid</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalTaxPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All filings up to date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Liability</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${outstandingLiability.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">No outstanding payments</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tax Collected Trend</CardTitle>
            <CardDescription>
              Monthly tax collected and paid
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taxData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                <Legend />
                <Bar dataKey="taxCollected" fill="#8884d8" name="Tax Collected" />
                <Bar dataKey="taxPaid" fill="#82ca9d" name="Tax Paid" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tax Rate Distribution</CardTitle>
            <CardDescription>
              Breakdown by tax rate categories
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taxCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {taxCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Tax Filings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tax Filings</CardTitle>
              <CardDescription>
                Upcoming and past tax filings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxFilings.map((filing) => (
                <TableRow key={filing.id}>
                  <TableCell className="font-medium">{filing.period}</TableCell>
                  <TableCell>{filing.dueDate}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        filing.status === 'Filed' ? 'default' : 
                        filing.status === 'Pending' ? 'secondary' : 
                        'outline'
                      }
                    >
                      {filing.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {filing.amount > 0 ? `$${filing.amount.toLocaleString()}` : '-'}
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