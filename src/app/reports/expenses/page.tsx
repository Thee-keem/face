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
  Filter,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  CreditCard
} from 'lucide-react'
import { useCurrency } from '@/contexts/CurrencyContext' // Add this import

// Mock data for expense report
const expenseData = [
  { month: 'Jan', salaries: 25000, rent: 5000, utilities: 1200, supplies: 800, marketing: 3000, other: 1500 },
  { month: 'Feb', salaries: 25000, rent: 5000, utilities: 1100, supplies: 900, marketing: 2500, other: 1200 },
  { month: 'Mar', salaries: 26000, rent: 5000, utilities: 1300, supplies: 750, marketing: 4000, other: 1800 },
  { month: 'Apr', salaries: 26000, rent: 5000, utilities: 1250, supplies: 850, marketing: 3500, other: 1600 },
  { month: 'May', salaries: 27000, rent: 5000, utilities: 1400, supplies: 950, marketing: 4500, other: 2000 },
  { month: 'Jun', salaries: 27000, rent: 5000, utilities: 1350, supplies: 800, marketing: 3800, other: 1700 },
]

const expenseCategories = [
  { name: 'Salaries', value: 159000, color: '#8884d8' },
  { name: 'Rent', value: 30000, color: '#82ca9d' },
  { name: 'Marketing', value: 21800, color: '#ffc658' },
  { name: 'Utilities', value: 7600, color: '#ff7c7c' },
  { name: 'Supplies', value: 5100, color: '#8dd1e1' },
  { name: 'Other', value: 9800, color: '#a4de6c' },
]

const recentExpenses = [
  { id: '1', title: 'Office Rent', category: 'RENT', date: '2024-06-01', amount: 5000, department: 'General' },
  { id: '2', title: 'Employee Salaries', category: 'SALARIES', date: '2024-06-05', amount: 27000, department: 'HR' },
  { id: '3', title: 'Electricity Bill', category: 'UTILITIES', date: '2024-06-10', amount: 1350, department: 'General' },
  { id: '4', title: 'Office Supplies', category: 'SUPPLIES', date: '2024-06-12', amount: 800, department: 'Operations' },
  { id: '5', title: 'Marketing Campaign', category: 'MARKETING', date: '2024-06-15', amount: 3800, department: 'Marketing' },
  { id: '6', title: 'Software Subscription', category: 'OTHER', date: '2024-06-18', amount: 500, department: 'IT' },
]

export default function ExpenseReportPage() {
  const { baseCurrency, format } = useCurrency() // Add this hook
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-06-30' })
  const [exportFormat, setExportFormat] = useState('csv')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const handleExport = () => {
    console.log(`Exporting expense report in ${exportFormat} format`)
  }

  const filteredExpenses = recentExpenses.filter(expense => {
    const matchesSearch = 
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = 
      categoryFilter === 'all' || 
      expense.category.toLowerCase() === categoryFilter.toLowerCase()
    
    return matchesSearch && matchesCategory
  })

  // Calculate metrics
  const totalExpenses = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const avgMonthlyExpense = totalExpenses / 6
  const highestExpense = Math.max(...recentExpenses.map(e => e.amount))
  const expenseCategoriesCount = Object.keys(expenseCategories).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expense Report</h1>
        <p className="text-muted-foreground">
          Track and analyze your business expenses
        </p>
      </div>
      
      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>
            Customize your expense report
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
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(totalExpenses, baseCurrency)}</div>
            <p className="text-xs text-muted-foreground">+8% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Monthly</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(avgMonthlyExpense, baseCurrency)}</div>
            <p className="text-xs text-muted-foreground">+3% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Expense</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(highestExpense, baseCurrency)}</div>
            <p className="text-xs text-muted-foreground">Employee Salaries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenseCategoriesCount}</div>
            <p className="text-xs text-muted-foreground">Tracked categories</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
            <CardDescription>
              Expenses by category over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [format(Number(value), baseCurrency), 'Amount']} />
                <Legend />
                <Bar dataKey="salaries" fill="#8884d8" name="Salaries" />
                <Bar dataKey="rent" fill="#82ca9d" name="Rent" />
                <Bar dataKey="utilities" fill="#ffc658" name="Utilities" />
                <Bar dataKey="supplies" fill="#ff7c7c" name="Supplies" />
                <Bar dataKey="marketing" fill="#8dd1e1" name="Marketing" />
                <Bar dataKey="other" fill="#a4de6c" name="Other" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>
              Percentage breakdown by category
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Expenses Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>
                Latest recorded expenses
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[120px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="salaries">Salaries</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="supplies">Supplies</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{expense.title}</div>
                      <div className="text-sm text-muted-foreground">{expense.category}</div>
                    </div>
                  </TableCell>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{format(expense.amount, baseCurrency)}</TableCell>
                  <TableCell>{expense.department}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}