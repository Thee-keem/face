// Centralized mock data for the application
// This ensures consistency across all components and pages

// Supported currencies
export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'KSH', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' }
]

// Currency exchange rates (mock data)
export const MOCK_CURRENCY_RATES = [
  {
    id: '1',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    rate: 0.85,
    lastUpdated: '2024-01-15 10:30:00',
    source: 'European Central Bank'
  },
  {
    id: '2',
    fromCurrency: 'USD',
    toCurrency: 'GBP',
    rate: 0.73,
    lastUpdated: '2024-01-15 10:30:00',
    source: 'Bank of England'
  },
  {
    id: '3',
    fromCurrency: 'USD',
    toCurrency: 'CAD',
    rate: 1.27,
    lastUpdated: '2024-01-15 10:30:00',
    source: 'Bank of Canada'
  },
  {
    id: '4',
    fromCurrency: 'USD',
    toCurrency: 'KSH',
    rate: 120.50,
    lastUpdated: '2024-01-15 10:30:00',
    source: 'Central Bank of Kenya'
  },
  {
    id: '5',
    fromCurrency: 'USD',
    toCurrency: 'ZAR',
    rate: 18.25,
    lastUpdated: '2024-01-15 10:30:00',
    source: 'South African Reserve Bank'
  }
]

// Customer mock data
export const MOCK_CUSTOMERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    totalSpent: 1250.75,
    orders: 12,
    status: 'active',
    group: 'Premium'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Ave, City, State 12345',
    totalSpent: 875.50,
    orders: 8,
    status: 'active',
    group: 'Regular'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1 (555) 456-7890',
    address: '789 Pine Rd, City, State 12345',
    totalSpent: 2100.00,
    orders: 24,
    status: 'inactive',
    group: 'VIP'
  }
]

// Customer groups mock data
export const MOCK_CUSTOMER_GROUPS = [
  {
    id: '1',
    name: 'Regular Customers',
    description: 'Standard customers with no special discounts',
    customerCount: 142,
    discount: '0%',
    status: 'active'
  },
  {
    id: '2',
    name: 'Premium Customers',
    description: 'Loyal customers with 10% discount',
    customerCount: 87,
    discount: '10%',
    status: 'active'
  },
  {
    id: '3',
    name: 'VIP Customers',
    description: 'Top-tier customers with 15% discount and priority support',
    customerCount: 24,
    discount: '15%',
    status: 'active'
  },
  {
    id: '4',
    name: 'Wholesale Customers',
    description: 'Business customers with bulk pricing',
    customerCount: 15,
    discount: '20%',
    status: 'inactive'
  }
]

// Suppliers mock data
export const MOCK_SUPPLIERS = [
  {
    id: '1',
    name: 'Tech Solutions Inc.',
    contactPerson: 'John Smith',
    email: 'john@techsolutions.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Park, Silicon Valley, CA 94000',
    products: 42,
    totalSpent: 12500.75,
    status: 'active',
    paymentTerms: 'Net 30'
  },
  {
    id: '2',
    name: 'Global Electronics',
    contactPerson: 'Jane Doe',
    email: 'jane@globalelectronics.com',
    phone: '+1 (555) 987-6543',
    address: '456 Electronics Blvd, Tech City, TX 75000',
    products: 28,
    totalSpent: 8750.50,
    status: 'active',
    paymentTerms: 'Net 15'
  },
  {
    id: '3',
    name: 'Office Supplies Co.',
    contactPerson: 'Bob Johnson',
    email: 'bob@officesupplies.com',
    phone: '+1 (555) 456-7890',
    address: '789 Office Park, Business District, NY 10001',
    products: 15,
    totalSpent: 3200.00,
    status: 'inactive',
    paymentTerms: 'Net 45'
  }
]

// Products mock data
export const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Wireless Headphones',
    sku: 'WH-001',
    category: 'Electronics',
    brand: 'TechBrand',
    price: 129.99,
    cost: 80.00,
    stock: 42,
    minStock: 10,
    status: 'active'
  },
  {
    id: '2',
    name: 'USB Cable',
    sku: 'UC-002',
    category: 'Electronics',
    brand: 'CableCorp',
    price: 12.99,
    cost: 5.00,
    stock: 156,
    minStock: 50,
    status: 'active'
  },
  {
    id: '3',
    name: 'Keyboard',
    sku: 'KB-003',
    category: 'Electronics',
    brand: 'TechBrand',
    price: 49.99,
    cost: 25.00,
    stock: 28,
    minStock: 15,
    status: 'active'
  },
  {
    id: '4',
    name: 'Smartphone',
    sku: 'SP-004',
    category: 'Electronics',
    brand: 'MobileTech',
    price: 699.99,
    cost: 450.00,
    stock: 15,
    minStock: 5,
    status: 'active'
  }
]

// Sales mock data
export const MOCK_SALES = [
  {
    id: '1',
    invoice: 'INV-001',
    customer: 'John Doe',
    date: '2024-01-15',
    amount: 156.00,
    status: 'completed',
    items: 3
  },
  {
    id: '2',
    invoice: 'INV-002',
    customer: 'Jane Smith',
    date: '2024-01-14',
    amount: 89.50,
    status: 'completed',
    items: 2
  },
  {
    id: '3',
    invoice: 'INV-003',
    customer: 'Bob Johnson',
    date: '2024-01-13',
    amount: 234.00,
    status: 'pending',
    items: 5
  },
  {
    id: '4',
    invoice: 'INV-004',
    customer: 'Alice Brown',
    date: '2024-01-12',
    amount: 67.25,
    status: 'completed',
    items: 1
  }
]

// Expenses mock data
export const MOCK_EXPENSES = [
  {
    id: '1',
    category: 'Office Supplies',
    description: 'Printer paper and ink',
    date: '2024-01-15',
    amount: 125.75,
    status: 'paid'
  },
  {
    id: '2',
    category: 'Utilities',
    description: 'Electricity bill',
    date: '2024-01-10',
    amount: 250.00,
    status: 'paid'
  },
  {
    id: '3',
    category: 'Marketing',
    description: 'Social media advertising',
    date: '2024-01-05',
    amount: 500.00,
    status: 'pending'
  }
]

// Users mock data
export const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
    status: 'active',
    lastLogin: '2024-01-15 09:30:00'
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@example.com',
    role: 'MANAGER',
    status: 'active',
    lastLogin: '2024-01-15 08:45:00'
  },
  {
    id: '3',
    name: 'Staff User',
    email: 'staff@example.com',
    role: 'STAFF',
    status: 'active',
    lastLogin: '2024-01-15 08:30:00'
  }
]

// Business locations mock data
export const MOCK_BUSINESS_LOCATIONS = [
  {
    id: '1',
    name: 'Main Store',
    address: '123 Main Street, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'main@store.com',
    status: 'active'
  },
  {
    id: '2',
    name: 'Warehouse',
    address: '456 Industrial Blvd, City, State 12345',
    phone: '+1 (555) 987-6543',
    email: 'warehouse@store.com',
    status: 'active'
  }
]

// Tax rates mock data
export const MOCK_TAX_RATES = [
  {
    id: '1',
    name: 'Standard VAT',
    rate: 20.0,
    isCompound: false,
    status: 'active'
  },
  {
    id: '2',
    name: 'Reduced Rate',
    rate: 5.0,
    isCompound: false,
    status: 'active'
  }
]

// Stock adjustments mock data
export const MOCK_STOCK_ADJUSTMENTS = [
  {
    id: 'ADJ-001',
    product: 'Wireless Headphones',
    sku: 'WH-001',
    date: '2024-01-15',
    adjustedBy: 'John Smith',
    quantity: -15,
    reason: 'Damaged items',
    location: 'Main Warehouse'
  },
  {
    id: 'ADJ-002',
    product: 'USB Cable',
    sku: 'UC-002',
    date: '2024-01-14',
    adjustedBy: 'Jane Doe',
    quantity: 50,
    reason: 'New shipment received',
    location: 'Main Warehouse'
  }
]

// Stock transfers mock data
export const MOCK_STOCK_TRANSFERS = [
  {
    id: 'TRF-001',
    product: 'Wireless Headphones',
    sku: 'WH-001',
    fromLocation: 'Main Warehouse',
    toLocation: 'Store 1',
    date: '2024-01-15',
    transferredBy: 'John Smith',
    quantity: 25,
    status: 'completed'
  },
  {
    id: 'TRF-002',
    product: 'USB Cable',
    sku: 'UC-002',
    fromLocation: 'Main Warehouse',
    toLocation: 'Store 2',
    date: '2024-01-14',
    transferredBy: 'Jane Doe',
    quantity: 50,
    status: 'pending'
  }
]

// Purchase orders mock data
export const MOCK_PURCHASE_ORDERS = [
  {
    id: 'PO-001',
    supplier: 'Tech Solutions Inc.',
    date: '2024-01-15',
    expectedDelivery: '2024-01-25',
    total: 12500.75,
    status: 'received',
    items: 42,
    received: 38
  },
  {
    id: 'PO-002',
    supplier: 'Global Electronics',
    date: '2024-01-10',
    expectedDelivery: '2024-01-20',
    total: 8750.50,
    status: 'pending',
    items: 28,
    received: 0
  }
]

// Purchase requisitions mock data
export const MOCK_PURCHASE_REQUISITIONS = [
  {
    id: 'REQ-001',
    date: '2024-01-15',
    requestedBy: 'John Smith',
    department: 'Sales',
    status: 'approved',
    items: 5,
    total: 1250.75
  },
  {
    id: 'REQ-002',
    date: '2024-01-14',
    requestedBy: 'Jane Doe',
    department: 'Marketing',
    status: 'pending',
    items: 3,
    total: 875.50
  }
]

// Purchase returns mock data
export const MOCK_PURCHASE_RETURNS = [
  {
    id: 'PR-001',
    purchaseId: 'PO-001',
    supplier: 'Tech Solutions Inc.',
    date: '2024-01-15',
    total: 1250.75,
    status: 'processed',
    items: 3
  },
  {
    id: 'PR-002',
    purchaseId: 'PO-002',
    supplier: 'Global Electronics',
    date: '2024-01-14',
    total: 875.50,
    status: 'pending',
    items: 2
  }
]

// Utility functions for mock data
export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)
  const symbol = currency?.symbol || currencyCode
  const decimalPlaces = ['KSH', 'JPY'].includes(currencyCode) ? 0 : 2
  return `${symbol}${amount.toFixed(decimalPlaces)}`
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const generateId = (prefix: string = 'ID'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}