# Product and Inventory Management

## Overview

The product and inventory management system provides comprehensive tools for managing products, tracking stock levels, and generating alerts. It includes features for product CRUD operations, inventory adjustments, barcode generation, and automated alerting.

## Features Implemented

### 1. Product Management
- **CRUD Operations**: Create, read, update, and delete products
- **Product Variants**: Support for product variants (sizes, colors, etc.)
- **Image Upload**: Support for product images
- **Category Management**: Organize products into categories
- **Barcode Generation**: Generate barcodes for products
- **Product History**: Track all changes to products

### 2. Inventory Management
- **Stock Tracking**: Real-time stock level tracking
- **Stock Adjustment**: Manual stock level adjustments
- **Low Stock Alerts**: Automatic alerts when stock falls below minimum levels
- **Overstock Alerts**: Automatic alerts when stock exceeds maximum levels
- **Import/Export**: Bulk import and export of products via CSV

### 3. Search and Filtering
- **Advanced Search**: Search by name, SKU, or barcode
- **Category Filtering**: Filter products by category
- **Stock Status Filtering**: Filter by low stock or out of stock status
- **Price Range Filtering**: Filter by price ranges

### 4. Barcode Integration
- **Barcode Validation**: Validate products by barcode
- **Barcode Generation**: Generate barcodes for products
- **Barcode Scanning**: API endpoints for barcode scanning

## API Endpoints

### Products
- `GET /api/products` - Get all products with pagination and filtering
- `POST /api/products` - Create a new product
- `GET /api/products/{id}` - Get a specific product
- `PUT /api/products/{id}` - Update a product
- `DELETE /api/products/{id}` - Delete a product
- `GET /api/products/{id}/history` - Get product history

### Product Variants
- `GET /api/products/{productId}/variants` - Get all variants for a product
- `POST /api/products/{productId}/variants` - Create a new variant
- `GET /api/products/{productId}/variants/{variantId}` - Get a specific variant
- `PUT /api/products/{productId}/variants/{variantId}` - Update a variant
- `DELETE /api/products/{productId}/variants/{variantId}` - Delete a variant

### Inventory
- `PUT /api/stock` - Update product stock
- `POST /api/stock/adjustment` - Adjust product stock
- `GET /api/inventory/adjust` - Stock adjustment page

### Alerts
- `GET /api/alerts/low-stock` - Check for low stock products and generate alerts

### Bulk Operations
- `POST /api/bulk/import` - Import products from CSV
- `GET /api/bulk/export` - Export products to CSV

### Barcode
- `GET /api/barcode?code={barcode}` - Validate product by barcode
- `POST /api/barcode` - Create/update product by barcode
- `GET /api/barcode/generate?text={text}` - Generate barcode

### Cron Jobs
- `POST /api/cron` - Trigger cron jobs manually

## Database Schema

### Product Model
- `id` - Unique identifier
- `name` - Product name
- `description` - Product description
- `sku` - Stock Keeping Unit
- `barcode` - Barcode
- `price` - Selling price
- `cost` - Cost price
- `stock` - Current stock level
- `minStock` - Minimum stock level
- `maxStock` - Maximum stock level
- `isActive` - Product status
- `categoryId` - Category reference
- `imageUrl` - Product image URL
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### ProductVariant Model
- `id` - Unique identifier
- `productId` - Parent product reference
- `name` - Variant name
- `sku` - Variant SKU
- `barcode` - Variant barcode
- `price` - Variant price
- `cost` - Variant cost
- `stock` - Variant stock level
- `imageUrl` - Variant image URL
- `attributes` - JSON attributes for variant properties
- `isActive` - Variant status
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### ProductHistory Model
- `id` - Unique identifier
- `productId` - Product reference
- `action` - Action performed
- `oldValue` - Previous value
- `newValue` - New value
- `userId` - User who performed the action
- `createdAt` - Timestamp of the action

## Implementation Details

### Authentication and Authorization
- All API endpoints require authentication
- Role-based access control (ADMIN, MANAGER, STAFF)
- Row Level Security (RLS) for data protection

### Real-time Updates
- Stock levels are updated in real-time
- Alerts are generated automatically based on stock thresholds
- Product history is logged for all changes

### Data Validation
- Input validation for all API endpoints
- Stock level validation during sales transactions
- Barcode uniqueness validation

### Error Handling
- Comprehensive error handling for all operations
- Proper HTTP status codes
- Detailed error messages

## Usage Examples

### Creating a Product
```bash
curl -X POST /api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "sku": "WM-001",
    "barcode": "1234567890123",
    "price": 29.99,
    "cost": 15.50,
    "stock": 45,
    "minStock": 10,
    "maxStock": 100
  }'
```

### Adjusting Stock
```bash
curl -X POST /api/stock/adjustment \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "product-id",
    "adjustment": -5,
    "reason": "Sold 5 units"
  }'
```

### Generating Alerts
```bash
curl -X GET /api/alerts/low-stock
```

### Importing Products
```bash
curl -X POST /api/bulk/import \
  -F "file=@products.csv" \
  -F "entityType=products"
```

## Future Enhancements

### 1. Advanced Inventory Features
- Expiration date tracking for perishable items
- Batch and lot tracking
- Serial number tracking
- Multi-location inventory support

### 2. Enhanced Reporting
- Inventory turnover reports
- Stock aging reports
- Profit margin analysis
- Best-selling product analytics

### 3. Integration Features
- Supplier management
- Purchase order creation
- Stock transfer between locations
- Third-party integrations (e.g., Shopify, Amazon)

### 4. Mobile Features
- Mobile-responsive POS interface
- Barcode scanner hardware integration
- Offline mode with sync capability

## Security Considerations

### Data Protection
- Row Level Security (RLS) policies
- Role-based access control
- Input validation and sanitization
- Secure password storage

### API Security
- JWT-based authentication
- Rate limiting
- CORS protection
- Secure session management

## Performance Optimization

### Database Optimization
- Indexes on frequently queried fields
- Query optimization
- Connection pooling
- Caching strategies

### Frontend Optimization
- Lazy loading
- Pagination
- Efficient state management
- Code splitting