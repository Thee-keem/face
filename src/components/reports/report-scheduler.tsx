'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ReportFrequency } from '@prisma/client'
import { PlusIcon, TrashIcon } from 'lucide-react'

interface ScheduledReport {
  id?: string
  name: string
  reportType: string
  frequency: ReportFrequency
  cronExpression?: string
  isActive: boolean
  nextRunAt?: Date
}

interface ReportSchedulerProps {
  scheduledReports: ScheduledReport[]
  onChange: (reports: ScheduledReport[]) => void
}

const REPORT_TYPES = [
  { value: 'profit-loss', label: 'Profit & Loss' },
  { value: 'sales', label: 'Sales Report' },
  { value: 'inventory', label: 'Inventory Report' },
  { value: 'tax', label: 'Tax Report' },
  { value: 'customers', label: 'Customer Report' },
  { value: 'suppliers', label: 'Supplier Report' },
  { value: 'expenses', label: 'Expense Report' },
]

const FREQUENCY_OPTIONS = [
  { value: ReportFrequency.DAILY, label: 'Daily' },
  { value: ReportFrequency.WEEKLY, label: 'Weekly' },
  { value: ReportFrequency.MONTHLY, label: 'Monthly' },
]

export function ReportScheduler({
  scheduledReports,
  onChange,
}: ReportSchedulerProps) {
  const addScheduledReport = () => {
    const newReport: ScheduledReport = {
      name: '',
      reportType: 'sales',
      frequency: ReportFrequency.DAILY,
      isActive: true,
    }
    
    onChange([...scheduledReports, newReport])
  }
  
  const updateScheduledReport = (index: number, field: keyof ScheduledReport, value: any) => {
    const updatedReports = [...scheduledReports]
    updatedReports[index] = {
      ...updatedReports[index],
      [field]: value,
    }
    
    onChange(updatedReports)
  }
  
  const removeScheduledReport = (index: number) => {
    const updatedReports = [...scheduledReports]
    updatedReports.splice(index, 1)
    onChange(updatedReports)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Reports</CardTitle>
        <CardDescription>
          Configure automated report generation and delivery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {scheduledReports.map((report, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
            <div className="col-span-3">
              <Label htmlFor={`name-${index}`}>Report Name</Label>
              <Input
                id={`name-${index}`}
                value={report.name}
                onChange={(e) => updateScheduledReport(index, 'name', e.target.value)}
                placeholder="e.g., Daily Sales Report"
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor={`type-${index}`}>Report Type</Label>
              <Select
                value={report.reportType}
                onValueChange={(value) => updateScheduledReport(index, 'reportType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor={`frequency-${index}`}>Frequency</Label>
              <Select
                value={report.frequency}
                onValueChange={(value) => updateScheduledReport(index, 'frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREQUENCY_OPTIONS.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor={`active-${index}`}>Active</Label>
              <div className="pt-2">
                <Switch
                  id={`active-${index}`}
                  checked={report.isActive}
                  onCheckedChange={(checked) => updateScheduledReport(index, 'isActive', checked)}
                />
              </div>
            </div>
            <div className="col-span-2 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeScheduledReport(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addScheduledReport}
          className="w-full"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Scheduled Report
        </Button>
      </CardContent>
    </Card>
  )
}