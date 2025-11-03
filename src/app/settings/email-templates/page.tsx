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
  Mail,
  FileText,
  Calendar
} from 'lucide-react'

// Mock data for email templates
const emailTemplates = [
  {
    id: '1',
    name: 'Sales Report',
    subject: 'Weekly Sales Report - {{date}}',
    type: 'Report',
    lastModified: '2024-07-01',
    status: 'active',
    usedIn: 'Scheduled Reports'
  },
  {
    id: '2',
    name: 'Inventory Alert',
    subject: 'Low Stock Alert - {{product}}',
    type: 'Alert',
    lastModified: '2024-06-28',
    status: 'active',
    usedIn: 'Inventory System'
  },
  {
    id: '3',
    name: 'Customer Welcome',
    subject: 'Welcome to {{company}}!',
    type: 'Notification',
    lastModified: '2024-06-25',
    status: 'active',
    usedIn: 'Customer Management'
  },
  {
    id: '4',
    name: 'Order Confirmation',
    subject: 'Order #{{order_id}} Confirmation',
    type: 'Transaction',
    lastModified: '2024-06-20',
    status: 'draft',
    usedIn: 'POS System'
  },
]

const templateTypes = [
  'Report', 'Alert', 'Notification', 'Transaction', 'Custom'
]

export default function EmailTemplatesPage() {
  const [templates] = useState(emailTemplates)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || 
      template.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleCreateTemplate = () => {
    setIsDialogOpen(true)
  }

  const handleEditTemplate = (templateId: string) => {
    console.log('Edit template:', templateId)
    setIsDialogOpen(true)
  }

  const handleDeleteTemplate = (templateId: string) => {
    console.log('Delete template:', templateId)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'draft': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
        <p className="text-muted-foreground">
          Manage email templates for reports and notifications
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Email Template Management</CardTitle>
              <CardDescription>
                Configure email templates for automated reports and notifications
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
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
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleCreateTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Used In</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.subject}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                      {template.type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {template.lastModified}
                    </div>
                  </TableCell>
                  <TableCell>{template.usedIn}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(template.status)}>
                      {template.status}
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
                        <DropdownMenuItem onClick={() => handleEditTemplate(template.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteTemplate(template.id)}>
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

      {/* Create Template Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Email Template</DialogTitle>
            <DialogDescription>
              Design your email template for automated notifications
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="templateName" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input id="templateName" placeholder="Template name" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="templateSubject" className="text-right">
                Subject
              </Label>
              <div className="col-span-3">
                <Input id="templateSubject" placeholder="Email subject" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="templateType" className="text-right">
                Type
              </Label>
              <div className="col-span-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    {templateTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="templateContent" className="text-right">
                Content
              </Label>
              <div className="col-span-3">
                <textarea
                  id="templateContent"
                  className="w-full h-32 p-2 border rounded-md"
                  placeholder="Email template content with {{variables}}"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Template</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}