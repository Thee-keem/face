'use client'

import { useState, useEffect } from 'react'
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
  Store, 
  Globe, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,
  Save,
  RotateCcw,
  MapPin
} from 'lucide-react'
import { CurrencySelector } from '@/components/ui/currency-selector'
import { useCurrency } from '@/contexts/CurrencyContext'
import { Currency } from '@prisma/client'

// Mock data for business locations
const mockBusinessLocations = [
  {
    id: '1',
    name: 'Main Warehouse',
    address: '123 Storage Street, Industrial District, ID 12345',
    type: 'Warehouse',
    status: 'active'
  },
  {
    id: '2',
    name: 'Downtown Store',
    address: '456 Main Avenue, Downtown, DT 67890',
    type: 'Retail Store',
    status: 'active'
  },
  {
    id: '3',
    name: 'North Branch',
    address: '789 North Road, Northern District, ND 54321',
    type: 'Retail Store',
    status: 'active'
  }
]

export default function BusinessSettingsPage() {
  const { baseCurrency, setBaseCurrency } = useCurrency()
  const [isSaving, setIsSaving] = useState(false)
  const [businessLocations] = useState(mockBusinessLocations)
  const [selectedLocation, setSelectedLocation] = useState('')

  // Business information
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Inventory Pro Store',
    legalName: 'Inventory Pro Solutions LLC',
    taxId: '12-3456789',
    phone: '+1 (555) 123-4567',
    email: 'info@inventorypro.com',
    website: 'https://inventorypro.com',
    address: '123 Business Street',
    city: 'Commerce City',
    state: 'NY',
    zipCode: '12345',
    country: 'United States'
  })

  // Business hours
  const [businessHours, setBusinessHours] = useState({
    monday: { open: '09:00', close: '17:00', closed: false },
    tuesday: { open: '09:00', close: '17:00', closed: false },
    wednesday: { open: '09:00', close: '17:00', closed: false },
    thursday: { open: '09:00', close: '17:00', closed: false },
    friday: { open: '09:00', close: '17:00', closed: false },
    saturday: { open: '10:00', close: '16:00', closed: false },
    sunday: { open: '', close: '', closed: true }
  })

  // Operational settings
  const [operationalSettings, setOperationalSettings] = useState({
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour'
  })

  // Load selected location from localStorage on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedBusinessLocation')
    if (savedLocation) {
      setSelectedLocation(savedLocation)
      
      // Load business info for the selected location
      const location = mockBusinessLocations.find(loc => loc.id === savedLocation)
      if (location) {
        setBusinessInfo(prev => ({
          ...prev,
          name: location.name,
          address: location.address
        }))
      }
    }
  }, [])

  // Save selected location to localStorage when it changes
  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem('selectedBusinessLocation', selectedLocation)
    }
  }, [selectedLocation])

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert('Business settings saved successfully!')
    
    // Update the business location in localStorage and dispatch a custom event
    // to notify other components (like DashboardLayout) of the change
    if (selectedLocation) {
      const location = mockBusinessLocations.find(loc => loc.id === selectedLocation)
      if (location) {
        // Dispatch a custom event to notify other components of the change
        window.dispatchEvent(new CustomEvent('businessLocationChanged', {
          detail: {
            name: location.name,
            address: location.address
          }
        }))
      }
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all business settings to default?')) {
      // Reset to default values
      alert('Business settings reset to default!')
    }
  }

  // Update business info when selected location changes
  useEffect(() => {
    if (selectedLocation) {
      const location = mockBusinessLocations.find(loc => loc.id === selectedLocation)
      if (location) {
        setBusinessInfo(prev => ({
          ...prev,
          name: location.name,
          address: location.address
        }))
      }
    }
  }, [selectedLocation])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Settings</h1>
        <p className="text-muted-foreground">
          Configure your business information and preferences
        </p>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Business Information
          </CardTitle>
          <CardDescription>
            Basic information about your business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={businessInfo.name}
                onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalName">Legal Name</Label>
              <Input
                id="legalName"
                value={businessInfo.legalName}
                onChange={(e) => setBusinessInfo({ ...businessInfo, legalName: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / EIN</Label>
              <Input
                id="taxId"
                value={businessInfo.taxId}
                onChange={(e) => setBusinessInfo({ ...businessInfo, taxId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  className="pl-10"
                  value={businessInfo.phone}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={businessInfo.email}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                className="pl-10"
                value={businessInfo.website}
                onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={businessInfo.address}
              onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
              placeholder="Street address"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={businessInfo.city}
                onChange={(e) => setBusinessInfo({ ...businessInfo, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={businessInfo.state}
                onChange={(e) => setBusinessInfo({ ...businessInfo, state: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={businessInfo.zipCode}
                onChange={(e) => setBusinessInfo({ ...businessInfo, zipCode: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={businessInfo.country} onValueChange={(value) => setBusinessInfo({ ...businessInfo, country: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Business Locations
          </CardTitle>
          <CardDescription>
            Select your current business location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentLocation">Current Location</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select a business location" />
              </SelectTrigger>
              <SelectContent>
                {businessLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedLocation && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">
                {businessLocations.find(loc => loc.id === selectedLocation)?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {businessLocations.find(loc => loc.id === selectedLocation)?.address}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Business Hours
          </CardTitle>
          <CardDescription>
            Set your regular business hours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(businessHours).map(([day, hours]) => (
            <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <span className="w-20 font-medium capitalize">{day}</span>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!hours.closed}
                    onCheckedChange={(checked) => 
                      setBusinessHours({
                        ...businessHours,
                        [day]: { ...hours, closed: !checked }
                      })
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {hours.closed ? 'Closed' : 'Open'}
                  </span>
                </div>
              </div>
              
              {!hours.closed && (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={hours.open}
                    onChange={(e) => 
                      setBusinessHours({
                        ...businessHours,
                        [day]: { ...hours, open: e.target.value }
                      })
                    }
                    className="w-24"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={hours.close}
                    onChange={(e) => 
                      setBusinessHours({
                        ...businessHours,
                        [day]: { ...hours, close: e.target.value }
                      })
                    }
                    className="w-24"
                  />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Operational Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Operational Settings
          </CardTitle>
          <CardDescription>
            Configure operational preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={operationalSettings.timezone} onValueChange={(value) => setOperationalSettings({ ...operationalSettings, timezone: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <CurrencySelector 
                value={baseCurrency}
                onValueChange={(value) => {
                  setBaseCurrency(value)
                  setOperationalSettings({ ...operationalSettings, currency: value })
                  // Save to localStorage for persistence
                  localStorage.setItem('selectedCurrency', value)
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={operationalSettings.language} onValueChange={(value) => setOperationalSettings({ ...operationalSettings, language: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select value={operationalSettings.dateFormat} onValueChange={(value) => setOperationalSettings({ ...operationalSettings, dateFormat: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}