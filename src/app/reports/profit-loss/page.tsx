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
  Line,
  AreaChart,
  Area
} from 'recharts'
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package
} from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext' // Add this import

// Mock data for profit and loss report
const profitLossData = [
  { month: 'Jan', revenue: 125000, cogs: 75000, grossProfit: 50000, expenses: 35000, netProfit: 15000 },
  { month: 'Feb', revenue: 132000, cogs: 79200, grossProfit: 52800, expenses: 36500, netProfit: 16300 },
  { month: 'Mar', revenue: 145000, cogs: 87000, grossProfit: 58000, expenses: 38000, netProfit: 20000 },
  { month: 'Apr', revenue: 138000, cogs: 82800, grossProfit: 55200, expenses: 37000, netProfit: 18200 },
  { month: 'May', revenue: 152000, cogs: 91200, grossProfit: 60800, expenses: 39500, netProfit: 21300 },
  { month: 'Jun', revenue: 148000, cogs: 88800, grossProfit: 59200, expenses: 38500, netProfit: 20700 },
]

const expenseBreakdown = [
  { category: 'Salaries', amount: 159000, percentage: 35 },
  { category: 'Rent', amount: 30000, percentage: 6.6 },
  { category: 'Marketing', amount: 21800, percentage: 4.8 },
  { category: 'Utilities', amount: 7600, percentage: 1.7 },
  { category: 'Supplies', amount: 5100, percentage: 1.1 },
  { category: 'Other', amount: 9800, percentage: 2.2 },
]

export default function ProfitLossReportPage() {
  const { baseCurrency, format } = useCurrency() // Add this hook
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-06-30' })
  const [exportFormat, setExportFormat] = useState('csv')

  const handleExport = () => {
    console.log(`Exporting profit & loss report in ${exportFormat} format`)
  }

  // Calculate metrics
  const totalRevenue = profitLossData.reduce((sum, month) => sum + month.revenue, 0)
  const totalCOGS = profitLossData.reduce((sum, month) => sum + month.cogs, 0)
  const totalGrossProfit = profitLossData.reduce((sum, month) => sum + month.grossProfit, 0)
  const totalExpenses = profitLossData.reduce((sum, month) => sum + month.expenses, 0)
  const totalNetProfit = profitLossData.reduce((sum, month) => sum + month.netProfit, 0)
  const grossProfitMargin = (totalGrossProfit / totalRevenue) * 100
  const netProfitMargin = (totalNetProfit / totalRevenue) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profit & Loss Report</h1>
        <p className="text-muted-foreground">
          Analyze your business profitability over time
        </p>
      </div>
      
      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>
            Customize your profit & loss report
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(totalRevenue, baseCurrency)}</div>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(totalGrossProfit, baseCurrency)}</div>
            <p className="text-xs text-muted-foreground">
              Margin: {grossProfitMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(totalNetProfit, baseCurrency)}</div>
            <p className="text-xs text-muted-foreground">
              Margin: {netProfitMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Profit Trend</CardTitle>
            <CardDescription>
              Monthly revenue, gross profit, and net profit
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitLossData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [format(Number(value), baseCurrency), 'Amount']} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  fill="#8884d8" 
                  stroke="#8884d8" 
                  name="Revenue"
                  fillOpacity={0.2}
                />
                <Area 
                  type="monotone" 
                  dataKey="grossProfit" 
                  fill="#82ca9d" 
                  stroke="#82ca9d" 
                  name="Gross Profit"
                  fillOpacity={0.2}
                />
                <Area 
                  type="monotone" 
                  dataKey="netProfit" 
                  fill="#ffc658" 
                  stroke="#ffc658" 
                  name="Net Profit"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>
              Distribution of expenses by category
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseBreakdown} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                <Legend />
                <Bar dataKey="amount" fill="#ff7c7c" name="Amount">
                  {expenseBreakdown.map((entry, index) => (
                    <text 
                      key={index}
                      x={entry.amount + 1000} 
                      y={index * 40 + 20} 
                      fill="#666" 
                      textAnchor="start" 
                      fontSize={12}
                    >
                      {entry.percentage}%
                    </text>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Profit & Loss Statement Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profit & Loss Statement</CardTitle>
              <CardDescription>
                Detailed breakdown of revenues, costs, and profits
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Jan</TableHead>
                <TableHead className="text-right">Feb</TableHead>
                <TableHead className="text-right">Mar</TableHead>
                <TableHead className="text-right">Apr</TableHead>
                <TableHead className="text-right">May</TableHead>
                <TableHead className="text-right">Jun</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Revenue</TableCell>
                {profitLossData.map((month, index) => (
                  <TableCell key={index} className="text-right font-medium">
                    ${month.revenue.toLocaleString()}
                  </TableCell>
                ))}
                <TableCell className="text-right font-bold">
                  ${totalRevenue.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Cost of Goods Sold</TableCell>
                {profitLossData.map((month, index) => (
                  <TableCell key={index} className="text-right">
                    (${month.cogs.toLocaleString()})
                  </TableCell>
                ))}
                <TableCell className="text-right font-medium">
                  (${totalCOGS.toLocaleString()})
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Gross Profit</TableCell>
                {profitLossData.map((month, index) => (
                  <TableCell key={index} className="text-right font-medium">
                    ${month.grossProfit.toLocaleString()}
                  </TableCell>
                ))}
                <TableCell className="text-right font-bold">
                  ${totalGrossProfit.toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Operating Expenses</TableCell>
                {profitLossData.map((month, index) => (
                  <TableCell key={index} className="text-right">
                    (${month.expenses.toLocaleString()})
                  </TableCell>
                ))}
                <TableCell className="text-right font-medium">
                  (${totalExpenses.toLocaleString()})
                </TableCell>
              </TableRow>
              <TableRow className="bg-muted">
                <TableCell className="font-bold">Net Profit</TableCell>
                {profitLossData.map((month, index) => (
                  <TableCell key={index} className="text-right font-bold">
                    ${month.netProfit.toLocaleString()}
                  </TableCell>
                ))}
                <TableCell className="text-right font-bold text-lg">
                  ${totalNetProfit.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}