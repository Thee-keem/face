'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings, 
  Store, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Globe,
  CreditCard,
  Save,
  RotateCw,
  Download,
  Upload,
  Building,
  FileText,
  Printer,
  Barcode,
  Calendar,
  Mail,
  User
} from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your system settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="pos" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">POS</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your business locations and warehouses
                </p>
                <Button asChild className="w-full">
                  <Link href="/settings/locations">
                    <Building className="h-4 w-4 mr-2" />
                    Manage Locations
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Invoice Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure invoice templates and numbering
                </p>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/settings/invoice">
                    <FileText className="h-4 w-4 mr-2" />
                    Configure
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Currency Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage currency exchange rates
                </p>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/settings/currency-rates">
                    <Globe className="h-4 w-4 mr-2" />
                    Manage Rates
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Configuration</CardTitle>
              <CardDescription>
                Manage your business information and operational settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium">Store Information</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Business name, address, and contact details
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/settings/business">
                      <Store className="h-4 w-4 mr-2" />
                      Edit Store Info
                    </Link>
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <h3 className="font-medium">Business Hours</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Operating hours and holiday schedules
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/settings/business">
                      <Calendar className="h-4 w-4 mr-2" />
                      Set Hours
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email and system notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-purple-500" />
                  <h3 className="font-medium">Email Templates</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize email templates for reports and notifications
                </p>
                <Button asChild>
                  <Link href="/settings/email-templates">
                    <Mail className="h-4 w-4 mr-2" />
                    Manage Templates
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>
                Manage authentication and access control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    <h3 className="font-medium">Authentication</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Two-factor authentication and session settings
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/settings/security">
                      <Shield className="h-4 w-4 mr-2" />
                      Configure
                    </Link>
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-orange-500" />
                    <h3 className="font-medium">User Roles</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage user permissions and access levels
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/users">
                      <User className="h-4 w-4 mr-2" />
                      Manage Roles
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="h-5 w-5" />
                  Receipt Printers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure receipt printers and printing settings
                </p>
                <Button asChild className="w-full">
                  <Link href="/settings/printers">
                    <Printer className="h-4 w-4 mr-2" />
                    Manage Printers
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Barcode className="h-5 w-5" />
                  Barcode Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure barcode generation and scanning
                </p>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/settings/barcode">
                    <Barcode className="h-4 w-4 mr-2" />
                    Configure
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Tables & Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage tables, services, and seating arrangements
                </p>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/settings/tables">
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage Tables
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Management</CardTitle>
              <CardDescription>
                Backup, maintenance, and system configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-green-500" />
                    <h3 className="font-medium">Backup & Restore</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Export and import system data
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <RotateCw className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium">System Maintenance</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Clear cache, optimize database, and system checks
                  </p>
                  <Button variant="outline" size="sm">
                    <RotateCw className="h-4 w-4 mr-2" />
                    Run Maintenance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Settings
        </Button>
        <Button variant="outline">
          <RotateCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}