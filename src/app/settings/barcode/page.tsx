'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function BarcodeSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Barcode Settings</h1>
        <p className="text-muted-foreground">
          Configure barcode generation and scanning settings
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Barcode Configuration</CardTitle>
              <CardDescription>
                Manage barcode formats, prefixes, and scanning preferences
              </CardDescription>
            </div>
            <Button>Save Changes</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
            <p className="text-muted-foreground">Barcode settings will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}