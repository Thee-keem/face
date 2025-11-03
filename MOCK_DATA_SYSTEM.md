# Mock Data System Implementation

## Overview
This document describes the mock data system implementation for the BoltPOS application, which provides consistent mock data across all components and pages.

## Architecture

### 1. Centralized Mock Data (`/src/lib/mockData.ts`)
The core of the mock data system is a centralized file that provides:
- Consistent mock data structures
- Uniform data formats across all components
- Reusable mock data for different modules
- Utility functions for data formatting

### 2. Mock Data Categories
The system includes mock data for:
- Currency rates and supported currencies
- Customers and customer groups
- Suppliers
- Products
- Sales transactions
- Expenses
- Users
- Business locations
- Tax rates
- Stock adjustments and transfers
- Purchase orders, requisitions, and returns

## Implementation Details

### Centralized Data Management
All mock data is stored in a single file (`src/lib/mockData.ts`) to ensure:
- Consistency across all components
- Easy maintenance and updates
- Uniform data structures
- Reduced duplication

### Data Structure Standards
All mock data follows consistent patterns:
- Unique IDs for all entities
- Standardized date formats
- Consistent naming conventions
- Uniform status values
- Proper data types

### Supported Entities

#### Currencies
- Standard currency codes (USD, EUR, GBP, CAD, KSH, ZAR)
- Currency symbols and names
- Exchange rates with sources and timestamps

#### Customers
- Customer details (name, email, phone, address)
- Purchase history and spending
- Status and group associations

#### Suppliers
- Supplier information (company, contact, terms)
- Product counts and spending history
- Status tracking

#### Products
- Product details (name, SKU, category, brand)
- Pricing and cost information
- Stock levels and minimum thresholds

#### Transactions
- Sales, purchases, and expense records
- Status tracking and item counts
- Financial amounts with proper formatting

## Usage Examples

### In Components
```tsx
import { MOCK_CUSTOMERS, MOCK_PRODUCTS } from '@/lib/mockData'

export default function CustomerList() {
  return (
    <div>
      {MOCK_CUSTOMERS.map(customer => (
        <div key={customer.id}>
          <h3>{customer.name}</h3>
          <p>{customer.email}</p>
        </div>
      ))}
    </div>
  )
}
```

### In Pages
```tsx
import { MOCK_SALES } from '@/lib/mockData'
import { formatCurrency } from '@/lib/mockData'

export default function SalesPage() {
  return (
    <table>
      <tbody>
        {MOCK_SALES.map(sale => (
          <tr key={sale.id}>
            <td>{sale.invoice}</td>
            <td>{formatCurrency(sale.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## Data Flow
1. Mock data is defined in `src/lib/mockData.ts`
2. Components import the required mock data
3. Data is filtered and processed as needed
4. Consistent formatting is applied using utility functions
5. All UI displays use the same mock data structures

## Extending the System
To add new mock data categories:
1. Add the data structure to `MOCK_DATA` in `src/lib/mockData.ts`
2. Create utility functions for formatting if needed
3. Import and use the data in relevant components

## Benefits
- **Consistency**: All components use the same mock data
- **Maintainability**: Changes only need to be made in one place
- **Scalability**: Easy to add new data categories
- **Reliability**: Uniform data structures reduce errors
- **Development Speed**: No need to create mock data in each component

## Performance Considerations
- Data is imported only where needed
- Utility functions are optimized for performance
- Mock data size is kept reasonable for development