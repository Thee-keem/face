'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Switch 
} from '@/components/ui/switch'
import { 
  Separator 
} from '@/components/ui/separator'
import { 
  FileText, 
  Hash, 
  Palette, 
  Save,
  RotateCcw,
  Eye
} from 'lucide-react'

export default function InvoiceSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  // Invoice numbering
  const [invoiceNumbering, setInvoiceNumbering] = useState({
    prefix: 'INV',
    suffix: '',
    startingNumber: '0001',
    resetYearly: true,
    resetMonthly: false
  })

  // Invoice template
  const [invoiceTemplate, setInvoiceTemplate] = useState({
    logo: '',
    header: 'Thank you for your business!',
    footer: 'Please make payment within 30 days',
    terms: 'Payment terms and conditions go here...',
    notes: 'Additional notes for customers'
  })

  // Invoice appearance
  const [invoiceAppearance, setInvoiceAppearance] = useState({
    colorScheme: 'blue',
    fontSize: 'medium',
    paperSize: 'letter',
    showLogo: true,
    showWatermark: false
  })

  // Tax settings
  const [taxSettings, setTaxSettings] = useState({
    taxRate: 8.5,
    taxLabel: 'Sales Tax',
    showTaxBreakdown: true,
    compoundTax: false
  })

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert('Invoice settings saved successfully!')
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all invoice settings to default?')) {
      // Reset to default values
      alert('Invoice settings reset to default!')
    }
  }

  const handlePreview = () => {
    alert('Invoice preview would be shown here')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoice Settings</h1>
        <p className="text-muted-foreground">
          Configure invoice templates and numbering
        </p>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handlePreview}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Invoice Numbering */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Invoice Numbering
          </CardTitle>
          <CardDescription>
            Configure invoice numbering sequence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prefix">Prefix</Label>
              <Input
                id="prefix"
                value={invoiceNumbering.prefix}
                onChange={(e) => setInvoiceNumbering({ ...invoiceNumbering, prefix: e.target.value })}
                placeholder="INV"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startingNumber">Starting Number</Label>
              <Input
                id="startingNumber"
                value={invoiceNumbering.startingNumber}
                onChange={(e) => setInvoiceNumbering({ ...invoiceNumbering, startingNumber: e.target.value })}
                placeholder="0001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix">Suffix</Label>
              <Input
                id="suffix"
                value={invoiceNumbering.suffix}
                onChange={(e) => setInvoiceNumbering({ ...invoiceNumbering, suffix: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label>Reset Options</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="resetYearly" className="font-normal">
                    Reset Yearly
                  </Label>
                  <Switch
                    id="resetYearly"
                    checked={invoiceNumbering.resetYearly}
                    onCheckedChange={(checked) => setInvoiceNumbering({ ...invoiceNumbering, resetYearly: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="resetMonthly" className="font-normal">
                    Reset Monthly
                  </Label>
                  <Switch
                    id="resetMonthly"
                    checked={invoiceNumbering.resetMonthly}
                    onCheckedChange={(checked) => setInvoiceNumbering({ ...invoiceNumbering, resetMonthly: checked })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Invoice Template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoice Template
          </CardTitle>
          <CardDescription>
            Customize invoice content and layout
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="header">Header Message</Label>
            <Input
              id="header"
              value={invoiceTemplate.header}
              onChange={(e) => setInvoiceTemplate({ ...invoiceTemplate, header: e.target.value })}
              placeholder="Thank you for your business!"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="footer">Footer Message</Label>
            <Input
              id="footer"
              value={invoiceTemplate.footer}
              onChange={(e) => setInvoiceTemplate({ ...invoiceTemplate, footer: e.target.value })}
              placeholder="Please make payment within 30 days"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={invoiceTemplate.terms}
              onChange={(e) => setInvoiceTemplate({ ...invoiceTemplate, terms: e.target.value })}
              placeholder="Payment terms and conditions..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={invoiceTemplate.notes}
              onChange={(e) => setInvoiceTemplate({ ...invoiceTemplate, notes: e.target.value })}
              placeholder="Additional notes for customers"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Invoice Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize invoice visual appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="colorScheme">Color Scheme</Label>
              <Select value={invoiceAppearance.colorScheme} onValueChange={(value) => setInvoiceAppearance({ ...invoiceAppearance, colorScheme: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="gray">Gray</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fontSize">Font Size</Label>
              <Select value={invoiceAppearance.fontSize} onValueChange={(value) => setInvoiceAppearance({ ...invoiceAppearance, fontSize: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paperSize">Paper Size</Label>
              <Select value={invoiceAppearance.paperSize} onValueChange={(value) => setInvoiceAppearance({ ...invoiceAppearance, paperSize: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="letter">Letter (8.5" x 11")</SelectItem>
                  <SelectItem value="a4">A4 (210mm x 297mm)</SelectItem>
                  <SelectItem value="legal">Legal (8.5" x 14")</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="showLogo" className="font-normal">
                Show Logo
              </Label>
              <Switch
                id="showLogo"
                checked={invoiceAppearance.showLogo}
                onCheckedChange={(checked) => setInvoiceAppearance({ ...invoiceAppearance, showLogo: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="showWatermark" className="font-normal">
                Show Watermark
              </Label>
              <Switch
                id="showWatermark"
                checked={invoiceAppearance.showWatermark}
                onCheckedChange={(checked) => setInvoiceAppearance({ ...invoiceAppearance, showWatermark: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Tax Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Settings</CardTitle>
          <CardDescription>
            Configure tax rates and display options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                value={taxSettings.taxRate}
                onChange={(e) => setTaxSettings({ ...taxSettings, taxRate: parseFloat(e.target.value) || 0 })}
                placeholder="8.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxLabel">Tax Label</Label>
              <Input
                id="taxLabel"
                value={taxSettings.taxLabel}
                onChange={(e) => setTaxSettings({ ...taxSettings, taxLabel: e.target.value })}
                placeholder="Sales Tax"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="showTaxBreakdown" className="font-normal">
                Show Tax Breakdown
              </Label>
              <Switch
                id="showTaxBreakdown"
                checked={taxSettings.showTaxBreakdown}
                onCheckedChange={(checked) => setTaxSettings({ ...taxSettings, showTaxBreakdown: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="compoundTax" className="font-normal">
                Compound Tax
              </Label>
              <Switch
                id="compoundTax"
                checked={taxSettings.compoundTax}
                onCheckedChange={(checked) => setTaxSettings({ ...taxSettings, compoundTax: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}