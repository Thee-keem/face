'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ReceiptPrintersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Receipt Printers</h1>
        <p className="text-muted-foreground">
          Configure receipt printers and printing settings
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Printer Configuration</CardTitle>
              <CardDescription>
                Manage receipt printers and printing preferences
              </CardDescription>
            </div>
            <Button>Add Printer</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
            <p className="text-muted-foreground">Printer settings will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}