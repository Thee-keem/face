# Multi-Currency Support and Advanced Reporting System

This document outlines the comprehensive enhancements made to the BoltPOS system to support multi-currency operations and advanced reporting capabilities.

## Table of Contents
1. [Database Schema Extensions](#database-schema-extensions)
2. [Multi-Currency Support](#multi-currency-support)
3. [Advanced Reporting System](#advanced-reporting-system)
4. [API Endpoints](#api-endpoints)
5. [Frontend Components](#frontend-components)
6. [Navigation Updates](#navigation-updates)

## Database Schema Extensions

### New Models Added

1. **Supplier** - Track supplier information, contact details, payment terms, and preferred currency
2. **Customer** - Enhanced customer data with purchase history, loyalty information, and currency preference
3. **CustomerGroup** - Group customers with dynamic rules (spending thresholds, purchase frequency, location)
4. **Unit** - Different measurement units for products
5. **Brand** - Product brand management
6. **Warranty** - Product warranty tracking
7. **BusinessLocation** - Multi-location support with location-specific currency settings
8. **TaxRate** - Flexible tax configuration by location and currency
9. **Table** - Restaurant/service staff assignments
10. **Modifier** - Product customization options
11. **TypeOfService** - Service-based businesses
12. **ReceiptPrinter** - Printer configuration
13. **BarcodeSettings** - Barcode generation preferences
14. **SalesRepresentative** - Track sales staff performance
15. **ProductLabel** - Print label management
16. **SellingPriceGroup** - Bulk pricing strategies with multi-currency support
17. **StockAdjustment** - Inventory adjustments tracking
18. **PurchaseOrder** - Track product purchases from suppliers with currency conversion
19. **Payment** - Track purchase and sale payments separately with multi-currency support
20. **ScheduledReport** - Store scheduled report configurations with email recipients and cron expressions
21. **ReportScheduleHistory** - Track generated reports and delivery status
22. **EmailTemplate** - Customizable report email templates
23. **CurrencyRate** - Store exchange rates (USD, EUR, GBP, CAD, KSH, ZAR)

### Enhanced Existing Models

1. **Sale** - Extended with customer currency, reference, and additional payment tracking
2. **Product** - Added relationships to units, brands, warranties, and selling price groups
3. **Expense** - Added currency and exchange rate support

## Multi-Currency Support

### Supported Currencies
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- KSH (Kenyan Shilling)
- ZAR (South African Rand)

### Key Features

1. **Currency Configuration System**
   - Supports all six currencies with proper symbols and formatting
   - Base currency and local currency separation per location
   - Currency-aware calculations for taxes, discounts, and totals

2. **Currency Converter Utility**
   - Real-time exchange rate calculations with fallback rates
   - Automatic daily exchange rate sync from external API
   - Fallback mechanism using cached rates when API is unavailable

3. **Multi-Currency Pricing**
   - Products can have different prices in different currencies
   - Automatic currency conversion in reports
   - Currency selection in all relevant forms

4. **Exchange Rate Management**
   - Manual rate updates through admin interface
   - API configuration for automatic sync
   - Rate history tracking

## Advanced Reporting System

### Report Types (20 Total)
1. Profit & Loss Report
2. Purchase and Sale Report
3. Tax Report
4. Supplier & Customer Report
5. Customer Groups Report
6. Stock Report
7. Filtered Stock Report
8. Stock Adjustment Report
9. Trending Products Report
10. Items Report
11. Product Purchase Report
12. Product Sell Report
13. Purchase Payment Report
14. Sell Payment Report
15. Expense Report
16. Register Report
17. Sales Representative Report
18. Table Report
19. Service Staff Report
20. Activity Log Report

### Scheduled Report Engine
- Background job processing using node-cron
- Daily, weekly, and monthly scheduling with timezone support
- Email delivery service with retry logic and failure handling
- Report history tracking with download links
- Failed report retry mechanism with exponential backoff

### Email Templates
- Customizable report email templates
- Variable placeholders for dynamic content
- HTML and plain text format support

## API Endpoints

### Currency Management
- `POST /api/currency/convert` - Convert amounts between currencies
- `GET /api/currency/rates` - Get exchange rates
- `POST /api/currency/rates` - Save exchange rates
- `PUT /api/currency/rates` - Sync exchange rates from external API

### Reports
- `GET /api/reports/[reportType]` - Generate specific report type
- `POST /api/scheduled-reports` - Create scheduled report
- `GET /api/scheduled-reports` - List scheduled reports
- `PUT /api/scheduled-reports` - Update scheduled report
- `DELETE /api/scheduled-reports` - Delete scheduled report
- `POST /api/reports/generate` - Generate report manually
- `PUT /api/reports/generate` - Generate all due scheduled reports

### Suppliers & Customers
- `GET /api/suppliers` - List suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers` - Update supplier
- `DELETE /api/suppliers` - Delete supplier
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `PUT /api/customers` - Update customer
- `DELETE /api/customers` - Delete customer

### Products
- `GET /api/products` - List products with multi-currency pricing
- `POST /api/products` - Create product with multi-currency prices
- `PUT /api/products` - Update product with multi-currency prices
- `DELETE /api/products` - Delete product

### Purchases
- `GET /api/purchase-orders` - List purchase orders
- `POST /api/purchase-orders` - Create purchase order
- `PUT /api/purchase-orders` - Update purchase order
- `DELETE /api/purchase-orders` - Delete purchase order

### Stock Management
- `GET /api/stock-adjustments` - List stock adjustments
- `POST /api/stock-adjustments` - Create stock adjustment
- `PUT /api/stock-adjustments` - Update stock adjustment
- `DELETE /api/stock-adjustments` - Delete stock adjustment

### Business Settings
- `GET /api/locations` - List business locations
- `POST /api/locations` - Create business location
- `PUT /api/locations` - Update business location
- `DELETE /api/locations` - Delete business location

### Email Templates
- `GET /api/email-templates` - List email templates
- `POST /api/email-templates` - Create email template
- `PUT /api/email-templates` - Update email template
- `DELETE /api/email-templates` - Delete email template

## Frontend Components

### UI Components
1. `CurrencySelector` - Dropdown for currency selection
2. `CurrencyInput` - Input field with currency symbol
3. `MultiCurrencyPrice` - Display prices in multiple currencies
4. `ProductPriceManager` - Manage multi-currency product pricing
5. `CurrencyRateManager` - Manage exchange rates
6. `ReportScheduler` - Configure scheduled reports
7. `SupplierForm` - Create/edit suppliers
8. `CustomerForm` - Create/edit customers
9. `PurchaseOrderForm` - Create/edit purchase orders
10. `StockAdjustmentForm` - Create/edit stock adjustments
11. `BusinessLocationForm` - Create/edit business locations

## Navigation Updates

### Collapsible Dropdowns
1. **Reports** - All 20 report types + scheduling
2. **Products** - Product management with categories, brands, units
3. **Contacts** - Customers, customer groups, suppliers
4. **Settings** - Business locations, currency rates, email templates

### Role-Based Access Control
- Proper permissions for each menu item
- ADMIN, MANAGER, and STAFF role restrictions
- Breadcrumb navigation for nested pages

## Technical Implementation

### Backend Architecture
- Prisma ORM for database operations
- Next.js API routes for RESTful endpoints
- Currency conversion utilities
- Background job processing with node-cron
- Email delivery with retry mechanisms

### Frontend Architecture
- React components with TypeScript
- shadcn/ui component library
- Responsive design for all devices
- Role-based UI rendering
- Form validation and error handling

### Security Features
- Authentication with NextAuth.js
- Role-based access control
- Input validation and sanitization
- SQL injection prevention through Prisma

### Performance Optimizations
- Database indexing for common queries
- Pagination for large datasets
- Caching of exchange rates
- Efficient data loading strategies

## Deployment Considerations

### Environment Variables
- Database connection strings
- API keys for exchange rate services
- Email service credentials
- NextAuth configuration

### Database Migration
- Prisma migration files included
- Backward compatibility maintained
- Data seeding for initial setup

### Scaling Recommendations
- Use of connection pooling
- Caching strategies for exchange rates
- Background job queue for report generation
- CDN for static assets

This comprehensive enhancement provides a robust foundation for multi-currency operations and advanced business reporting while maintaining the existing functionality of the BoltPOS system.