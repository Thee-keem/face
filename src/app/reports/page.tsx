'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign,
  Building,
  AlertTriangle,
  Calendar,
  Download,
  BarChart,
  PieChart,
  LineChart
} from 'lucide-react'
import Link from 'next/link'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and export detailed business reports
        </p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Reports</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Generated this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Reports</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Generated this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Reports</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Generated this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Active schedules</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Scheduled
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Overview</CardTitle>
              <CardDescription>
                Summary of your business reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <h3 className="font-medium">Top Performing Reports</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Sales Performance</span>
                      <span className="font-medium">Generated 24 times</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Inventory Analysis</span>
                      <span className="font-medium">Generated 18 times</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Profit & Loss</span>
                      <span className="font-medium">Generated 12 times</span>
                    </li>
                  </ul>
                  <Button variant="link" className="p-0 mt-2 h-auto" asChild>
                    <Link href="/reports/sales">View sales reports</Link>
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <h3 className="font-medium">Reports Needing Attention</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Tax Report</span>
                      <span className="font-medium">Not generated this month</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Expense Report</span>
                      <span className="font-medium">Not generated this week</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Customer Analysis</span>
                      <span className="font-medium">Not generated this quarter</span>
                    </li>
                  </ul>
                  <Button variant="link" className="p-0 mt-2 h-auto" asChild>
                    <Link href="/reports/tax">Generate tax report</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                Profit & Loss, Tax, and Expense reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Profit & Loss
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analyze business profitability
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/reports/profit-loss">
                        <BarChart className="h-4 w-4 mr-2" />
                        Generate Report
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Tax Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Calculate tax obligations
                    </p>
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/reports/tax">
                        <FileText className="h-4 w-4 mr-2" />
                        View Report
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Expense Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Track business expenses
                    </p>
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/reports/expenses">
                        <LineChart className="h-4 w-4 mr-2" />
                        Analyze Expenses
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Reports</CardTitle>
              <CardDescription>
                Stock levels, movements, and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Inventory Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Detailed stock level analysis
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/reports/inventory">
                        <PieChart className="h-4 w-4 mr-2" />
                        Generate Report
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Stock Movement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Track inventory adjustments
                    </p>
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/stock/adjustments">
                        <BarChart className="h-4 w-4 mr-2" />
                        View Adjustments
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Reports</CardTitle>
              <CardDescription>
                Customer and supplier analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Customer Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analyze customer behavior
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/reports/customers">
                        <Users className="h-4 w-4 mr-2" />
                        Generate Report
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Supplier Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analyze supplier performance
                    </p>
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/reports/suppliers">
                        <Building className="h-4 w-4 mr-2" />
                        View Report
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scheduled Reports</CardTitle>
                  <CardDescription>
                    Automated report generation and delivery
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href="/reports/scheduled">
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Schedules
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <h3 className="font-medium">Active Schedules</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Weekly Sales Report</span>
                      <p className="text-sm text-muted-foreground">Every Monday at 9:00 AM</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/reports/scheduled">
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Monthly Inventory Report</span>
                      <p className="text-sm text-muted-foreground">First day of each month</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/reports/scheduled">
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Quarterly Profit & Loss</span>
                      <p className="text-sm text-muted-foreground">First day of each quarter</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/reports/scheduled">
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}