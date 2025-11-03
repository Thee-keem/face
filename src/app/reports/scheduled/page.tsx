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
  Calendar,
  Clock,
  Mail,
  FileText,
  Play,
  Pause
} from 'lucide-react'

// Mock data for scheduled reports
const scheduledReports = [
  {
    id: '1',
    name: 'Weekly Sales Report',
    reportType: 'Sales',
    frequency: 'Weekly',
    nextRun: '2024-07-08 09:00:00',
    lastRun: '2024-07-01 09:00:00',
    status: 'active',
    recipients: 'management@company.com, sales@company.com'
  },
  {
    id: '2',
    name: 'Monthly Inventory Report',
    reportType: 'Inventory',
    frequency: 'Monthly',
    nextRun: '2024-08-01 09:00:00',
    lastRun: '2024-07-01 09:00:00',
    status: 'active',
    recipients: 'inventory@company.com, management@company.com'
  },
  {
    id: '3',
    name: 'Quarterly Profit & Loss',
    reportType: 'Profit & Loss',
    frequency: 'Quarterly',
    nextRun: '2024-10-01 09:00:00',
    lastRun: '2024-07-01 09:00:00',
    status: 'active',
    recipients: 'management@company.com, finance@company.com'
  },
  {
    id: '4',
    name: 'Daily Expense Report',
    reportType: 'Expenses',
    frequency: 'Daily',
    nextRun: '2024-07-03 09:00:00',
    lastRun: '2024-07-02 09:00:00',
    status: 'paused',
    recipients: 'finance@company.com'
  },
]

const reportTypes = [
  'Sales', 'Inventory', 'Profit & Loss', 'Expenses', 
  'Customers', 'Suppliers', 'Tax', 'Custom Report'
]

const frequencies = [
  'Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Yearly'
]

export default function ScheduledReportsPage() {
  const [reports] = useState(scheduledReports)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportType.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || 
      report.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleCreateSchedule = () => {
    setIsDialogOpen(true)
  }

  const handleEditSchedule = (reportId: string) => {
    console.log('Edit schedule:', reportId)
    setIsDialogOpen(true)
  }

  const handleDeleteSchedule = (reportId: string) => {
    console.log('Delete schedule:', reportId)
  }

  const handleRunNow = (reportId: string) => {
    console.log('Run report now:', reportId)
  }

  const handleToggleStatus = (reportId: string) => {
    console.log('Toggle report status:', reportId)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'paused': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scheduled Reports</h1>
        <p className="text-muted-foreground">
          Manage automated report generation and delivery
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Configure and manage automated report delivery
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schedules..."
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
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleCreateSchedule}>
                <Plus className="h-4 w-4 mr-2" />
                Create Schedule
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Report Type</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                      {report.reportType}
                    </div>
                  </TableCell>
                  <TableCell>{report.frequency}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {report.nextRun}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {report.lastRun}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(report.status)}>
                      {report.status}
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
                        <DropdownMenuItem onClick={() => handleRunNow(report.id)}>
                          <Play className="mr-2 h-4 w-4" />
                          Run Now
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(report.id)}>
                          {report.status === 'active' ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditSchedule(report.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteSchedule(report.id)}>
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

      {/* Create Schedule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Schedule</DialogTitle>
            <DialogDescription>
              Set up automated report generation and delivery
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportName" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input id="reportName" placeholder="Schedule name" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportType" className="text-right">
                Report Type
              </Label>
              <div className="col-span-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Frequency
              </Label>
              <div className="col-span-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq} value={freq.toLowerCase()}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipients" className="text-right">
                Recipients
              </Label>
              <div className="col-span-3">
                <Input id="recipients" placeholder="email1@example.com, email2@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scheduleTime" className="text-right">
                Time
              </Label>
              <div className="col-span-3">
                <Input id="scheduleTime" type="time" defaultValue="09:00" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Schedule</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}