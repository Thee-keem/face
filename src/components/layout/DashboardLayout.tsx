'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { 
  PackageIcon, 
  ShoppingCartIcon, 
  BarChartIcon, 
  UsersIcon, 
  SettingsIcon, 
  LogOutIcon,
  MenuIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  FileTextIcon,
  UserIcon,
  BuildingIcon,
  TagIcon,
  WrenchIcon,
  PrinterIcon,
  CalendarIcon,
  TrendingUpIcon,
  CoinsIcon,
  DatabaseIcon,
  MailIcon,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface CustomSession {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    id?: string
  }
  expires: string
}

// Updated navigation structure with collapsible dropdowns
const navigationItems = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: PackageIcon, 
    roles: ['STAFF', 'MANAGER', 'ADMIN'] 
  },
  { 
    name: 'Point of Sale', 
    href: '/pos', 
    icon: ShoppingCartIcon, 
    roles: ['STAFF', 'MANAGER', 'ADMIN'] 
  },
  { 
    name: 'Products', 
    href: '/inventory', 
    icon: PackageIcon, 
    roles: ['MANAGER', 'ADMIN'],
    children: [
      { name: 'All Products', href: '/inventory', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Adjust Inventory', href: '/inventory/adjust', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Import Products', href: '/inventory/import', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Realtime Demo', href: '/inventory/realtime-demo', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Connection Test', href: '/inventory/realtime-demo/test-connection', roles: ['MANAGER', 'ADMIN'] },
    ]
  },
  { 
    name: 'Contacts', 
    href: '/contacts', 
    icon: UserIcon, 
    roles: ['MANAGER', 'ADMIN'],
    children: [
      { name: 'Customers', href: '/contacts/customers', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Customer Groups', href: '/contacts/customer-groups', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Suppliers', href: '/contacts/suppliers', roles: ['MANAGER', 'ADMIN'] },
    ]
  },
  { 
    name: 'Sales', 
    href: '/sales', 
    icon: BarChartIcon, 
    roles: ['MANAGER', 'ADMIN'] 
  },
  { 
    name: 'Purchases', 
    href: '/purchases', 
    icon: DatabaseIcon, 
    roles: ['MANAGER', 'ADMIN'],
    children: [
      { name: 'Purchase Requisitions', href: '/purchases/requisitions', roles: ['MANAGER', 'ADMIN'] },
      { name: 'List Purchases', href: '/purchases/list', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Purchase Returns', href: '/purchases/returns', roles: ['MANAGER', 'ADMIN'] },
    ]
  },
  { 
    name: 'Expenses', 
    href: '/expenses', 
    icon: CoinsIcon, 
    roles: ['MANAGER', 'ADMIN'] 
  },
  { 
    name: 'Stock', 
    href: '/stock', 
    icon: DatabaseIcon, 
    roles: ['MANAGER', 'ADMIN'],
    children: [
      { name: 'Adjustments', href: '/stock/adjustments', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Transfers', href: '/stock/transfers', roles: ['MANAGER', 'ADMIN'] },
    ]
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: FileTextIcon, 
    roles: ['MANAGER', 'ADMIN'],
    children: [
      { name: 'Profit & Loss', href: '/reports/profit-loss', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Sales Report', href: '/reports/sales', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Inventory Report', href: '/reports/inventory', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Tax Report', href: '/reports/tax', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Customer Report', href: '/reports/customers', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Supplier Report', href: '/reports/suppliers', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Expense Report', href: '/reports/expenses', roles: ['MANAGER', 'ADMIN'] },
      { name: 'Scheduled Reports', href: '/reports/scheduled', roles: ['ADMIN'] },
    ]
  },
  { 
    name: 'Users', 
    href: '/users', 
    icon: UsersIcon, 
    roles: ['ADMIN'] 
  },
  { 
    name: 'Profile', 
    href: '/profile', 
    icon: UserIcon, 
    roles: ['STAFF', 'MANAGER', 'ADMIN'] 
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: SettingsIcon, 
    roles: ['ADMIN'],
    children: [
      { name: 'Business Locations', href: '/settings/locations', roles: ['ADMIN'] },
      { name: 'Business Settings', href: '/settings/business', roles: ['ADMIN'] },
      { name: 'Invoice Settings', href: '/settings/invoice', roles: ['ADMIN'] },
      { name: 'Tax Rates', href: '/settings/tax-rates', roles: ['ADMIN'] },
      { name: 'Receipt Printers', href: '/settings/printers', roles: ['ADMIN'] },
      { name: 'Barcode Settings', href: '/settings/barcode', roles: ['ADMIN'] },
      { name: 'Email Templates', href: '/settings/email-templates', roles: ['ADMIN'] },
    ]
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession() as { data: CustomSession | null }
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [selectedLocation, setSelectedLocation] = useState<{name: string, address: string} | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Remove the useEffect that redirects unauthenticated users since that's handled by ProtectedRoute

  const userRole = session?.user?.role || 'STAFF'
  
  // Memoize filtered navigation to prevent recreation on every render
  const filteredNavigation = useMemo(() => 
    navigationItems.filter(item => 
      item.roles.includes('STAFF') || 
      item.roles.includes(userRole)
    ), [userRole])

  // Load selected location from localStorage
  useEffect(() => {
    const savedLocationId = localStorage.getItem('selectedBusinessLocation')
    if (savedLocationId) {
      // Mock data for business locations
      const businessLocations = [
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
      
      const location = businessLocations.find(loc => loc.id === savedLocationId)
      if (location) {
        setSelectedLocation({ name: location.name, address: location.address })
      }
    }
  }, [])

  // Listen for changes to the selected business location
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedBusinessLocation') {
        const businessLocations = [
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
        
        const location = businessLocations.find(loc => loc.id === e.newValue)
        if (location) {
          setSelectedLocation({ name: location.name, address: location.address })
        } else {
          setSelectedLocation(null)
        }
      }
    }

    // Listen for custom event dispatched from business settings page
    const handleBusinessLocationChange = (e: CustomEvent) => {
      setSelectedLocation({ name: e.detail.name, address: e.detail.address })
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('businessLocationChanged', handleBusinessLocationChange as EventListener)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('businessLocationChanged', handleBusinessLocationChange as EventListener)
    }
  }, [])

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // md breakpoint
        setSidebarCollapsed(true)
      } else {
        setSidebarCollapsed(false)
      }
    }

    // Set initial state
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = async () => {
    try {
      // Call our custom logout API to clear user context
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      // Sign out from NextAuth
      const { signOut } = await import('next-auth/react')
      await signOut({ redirect: false })
      
      // Redirect to login page
      router.push('/auth/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }))
  }

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev)
  }, [])

  // Auto-expand sections based on current path
  // Memoize the effect dependencies to prevent infinite loop
  const navigationDeps = useMemo(() => 
    filteredNavigation.map(item => item.name + item.href).join(','), 
    [filteredNavigation]
  )

  useEffect(() => {
    const activeSection = filteredNavigation.find(item => 
      item.href !== '/' && pathname.startsWith(item.href)
    )
    
    if (activeSection) {
      setExpandedSections(prev => ({
        ...prev,
        [activeSection.name]: true
      }))
    }
  }, [pathname, navigationDeps])

  const renderNavItem = (item: typeof navigationItems[0], isMobile: boolean = false, isCollapsed: boolean = false) => {
    const Icon = item.icon
    const isActive = pathname === item.href
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedSections[item.name]
    
    // Filter children based on user role
    const filteredChildren = item.children?.filter(child => 
      child.roles.includes('STAFF') || 
      child.roles.includes(userRole)
    ) || []
    
    const showChildren = hasChildren && filteredChildren.length > 0 && isExpanded

    if (isCollapsed) {
      // Collapsed view - only show icon
      return (
        <div key={item.name} className="relative group">
          <Link
            href={item.href}
            onClick={(e) => {
              if (isMobile) setSidebarOpen(false)
              if (hasChildren) {
                e.preventDefault()
                toggleSection(item.name)
              }
            }}
            className={`flex items-center justify-center rounded-lg p-2 text-sm transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title={item.name}
          >
            <Icon className="h-5 w-5" />
          </Link>
          {/* Tooltip for collapsed items */}
          <div className="absolute left-full ml-2 top-0 bg-background border rounded-md px-2 py-1 text-sm whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
            {item.name}
          </div>
          
          {showChildren && !isMobile && (
            <div className="absolute left-full ml-2 top-0 bg-background border rounded-md p-2 shadow-lg z-40 min-w-[200px]">
              <ul className="space-y-1">
                {filteredChildren.map((child) => {
                  const childIsActive = pathname === child.href
                  return (
                    <li key={child.name}>
                      <Link
                        href={child.href}
                        onClick={() => isMobile && setSidebarOpen(false)}
                        className={`flex items-center gap-2 rounded px-2 py-1 text-sm transition-colors ${
                          childIsActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <span className="text-xs">•</span>
                        <span>{child.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      )
    }

    return (
      <div key={item.name}>
        <Link
          href={item.href}
          onClick={(e) => {
            if (isMobile) setSidebarOpen(false)
            if (hasChildren) {
              e.preventDefault()
              toggleSection(item.name)
            }
          }}
          className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-4 w-4" />
            {item.name}
          </div>
          {hasChildren && (
            isExpanded ? 
              <ChevronDownIcon className="h-4 w-4" /> : 
              <ChevronRightIcon className="h-4 w-4" />
          )}
        </Link>
        
        {showChildren && (
          <ul className={`ml-4 mt-1 space-y-1 ${isMobile ? '' : 'border-l border-muted pl-2'}`}>
            {filteredChildren.map((child) => {
              const childIsActive = pathname === child.href
              return (
                <li key={child.name}>
                  <Link
                    href={child.href}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      childIsActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span className="text-xs">•</span>
                    {child.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar trigger */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-50 md:hidden"
          >
            <MenuIcon className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <div className="flex items-center gap-2">
                <PackageIcon className="h-6 w-6" />
                <span className="text-lg font-semibold">Inventory Management Pro</span>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-2">
                {filteredNavigation.map((item) => renderNavItem(item, true))}
              </ul>
            </nav>
            <div className="border-t p-4">
              {/* Removed logout button from mobile sidebar */}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className={`hidden border-r bg-background md:flex flex-col transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="border-b p-4">
          <div className={`flex items-center gap-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <PackageIcon className="h-6 w-6" />
            {!sidebarCollapsed && (
              <span className="text-lg font-semibold truncate">Inventory Management Pro</span>
            )}
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className={`space-y-1 ${sidebarCollapsed ? 'px-1' : 'px-2'}`}>
            {filteredNavigation.map((item) => renderNavItem(item, false, sidebarCollapsed))}
          </ul>
        </nav>
        <div className="border-t p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="w-full flex justify-center"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-background px-6 py-4">
          <div className="md:hidden">
            <h1 className="text-xl font-bold">Inventory Management Pro</h1>
          </div>
          <div className="hidden md:block">
            {selectedLocation ? (
              <div>
                <h1 className="text-2xl font-bold">{selectedLocation.name}</h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{selectedLocation.address}</span>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold">Inventory Management Pro</h1>
                <p className="text-muted-foreground">
                  Welcome back, {session?.user?.name || session?.user?.email || 'User'}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span className="text-sm font-medium hidden md:inline">
                {session?.user?.name || session?.user?.email || 'Profile'}
              </span>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOutIcon className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}