# API Documentation

## Authentication

All API endpoints require authentication via NextAuth. Users must be logged in to access any endpoints.

## Products

### Get Products
```
GET /api/products?page=1&limit=10&search=keyword&categoryId=category_id
```

Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for name, SKU, or barcode
- `categoryId` (optional): Filter by category ID

### Create Product
```
POST /api/products
```

Body:
```json
{
  "name": "Product Name",
  "description": "Product Description",
  "sku": "SKU123",
  "barcode": "123456789012",
  "price": 19.99,
  "cost": 10.00,
  "stock": 50,
  "minStock": 10,
  "maxStock": 100,
  "isActive": true,
  "categoryId": "category_id",
  "imageUrl": "https://example.com/image.jpg"
}
```

### Get Product by ID
```
GET /api/products/{id}
```

### Update Product
```
PUT /api/products/{id}
```

Body: Same as create product

### Delete Product
```
DELETE /api/products/{id}
```

## Categories

### Get Categories
```
GET /api/categories
```

### Create Category
```
POST /api/categories
```

Body:
```json
{
  "name": "Category Name",
  "description": "Category Description"
}
```

### Get Category by ID
```
GET /api/categories/{id}
```

### Update Category
```
PUT /api/categories/{id}
```

Body: Same as create category

### Delete Category
```
DELETE /api/categories/{id}
```

## Sales

### Get Sales
```
GET /api/sales?page=1&limit=10&startDate=2023-01-01&endDate=2023-12-31
```

Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `startDate` (optional): Filter sales from this date
- `endDate` (optional): Filter sales to this date

### Create Sale
```
POST /api/sales
```

Body:
```json
{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2
    }
  ],
  "paymentMethod": "CASH",
  "customerId": "customer_id",
  "notes": "Sale notes",
  "discount": 5.00
}
```

### Get Sale by ID
```
GET /api/sales/{id}
```

### Update Sale
```
PUT /api/sales/{id}
```

Body:
```json
{
  "status": "COMPLETED",
  "notes": "Updated notes"
}
```

### Delete Sale
```
DELETE /api/sales/{id}
```

## Users

### Get Users
```
GET /api/users?page=1&limit=10
```

Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### Create User
```
POST /api/users
```

Body:
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "role": "STAFF"
}
```

### Get User by ID
```
GET /api/users/{id}
```

### Update User
```
PUT /api/users/{id}
```

Body:
```json
{
  "name": "Updated Name",
  "role": "MANAGER"
}
```

### Delete User
```
DELETE /api/users/{id}
```

## Alerts

### Get Alerts
```
GET /api/alerts?page=1&limit=10&isRead=false&type=LOW_STOCK
```

Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `isRead` (optional): Filter by read status
- `type` (optional): Filter by alert type (LOW_STOCK, OUT_OF_STOCK, OVERSTOCK)

### Create Alert
```
POST /api/alerts
```

Body:
```json
{
  "productId": "product_id",
  "type": "LOW_STOCK",
  "message": "Low stock alert message",
  "isRead": false
}
```

### Get Alert by ID
```
GET /api/alerts/{id}
```

### Update Alert
```
PUT /api/alerts/{id}
```

Body:
```json
{
  "isRead": true,
  "message": "Updated message"
}
```

### Delete Alert
```
DELETE /api/alerts/{id}
```

## Expenses

### Get Expenses
```
GET /api/expenses?page=1&limit=10&startDate=2023-01-01&endDate=2023-12-31&category=RENT
```

Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `startDate` (optional): Filter expenses from this date
- `endDate` (optional): Filter expenses to this date
- `category` (optional): Filter by expense category

### Create Expense
```
POST /api/expenses
```

Body:
```json
{
  "title": "Expense Title",
  "description": "Expense Description",
  "amount": 100.00,
  "category": "RENT",
  "date": "2023-01-01",
  "receiptUrl": "https://example.com/receipt.jpg"
}
```

### Get Expense by ID
```
GET /api/expenses/{id}
```

### Update Expense
```
PUT /api/expenses/{id}
```

Body: Same as create expense

### Delete Expense
```
DELETE /api/expenses/{id}
```

## Analytics

### Get Analytics
```
GET /api/analytics?period=30d
```

Parameters:
- `period` (optional): Time period (7d, 30d, 90d, 1y) (default: 7d)

## Stock

### Update Stock
```
PUT /api/stock
```

Body:
```json
{
  "productId": "product_id",
  "quantity": 25
}
```

### Adjust Stock
```
POST /api/stock/adjustment
```

Body:
```json
{
  "productId": "product_id",
  "adjustment": -5
}
```

## Barcode

### Validate Barcode
```
GET /api/barcode?code=123456789012
```

Parameters:
- `code`: Barcode to validate

### Create/Update Product by Barcode
```
POST /api/barcode
```

Body:
```json
{
  "barcode": "123456789012",
  "name": "Product Name",
  "description": "Product Description",
  "sku": "SKU123",
  "price": 19.99,
  "cost": 10.00,
  "stock": 50,
  "minStock": 10,
  "maxStock": 100,
  "isActive": true,
  "categoryId": "category_id",
  "imageUrl": "https://example.com/image.jpg"
}
```

## Bulk Operations

### Import Data
```
POST /api/bulk/import
```

Form Data:
- `file`: CSV file
- `entityType`: products or categories

### Export Data
```
GET /api/bulk/export?entityType=products
```

Parameters:
- `entityType`: products or categories