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

## WebSocket

### Overview

The application implements real-time functionality using WebSocket via Socket.IO. This enables real-time inventory updates to be broadcast to all connected clients.

### Architecture

The WebSocket implementation uses Socket.IO with a custom Next.js server setup:

1. **Server**: Custom server in [server.ts](server.ts) that integrates Socket.IO with Next.js
2. **Client**: React components using socket.io-client library
3. **Events**: Custom events for inventory updates

### Server Setup

The WebSocket server is initialized in [server.ts](server.ts):

```typescript
// Create HTTP server that will handle both Next.js and Socket.IO
const server = createServer((req, res) => {
  // Skip socket.io requests from Next.js handler
  if (req.url?.startsWith('/api/socketio')) {
    return;
  }
  handle(req, res);
});

// Setup Socket.IO
const io = new Server(server, {
  path: '/api/socketio',
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

setupSocket(io);
```

### Socket Event Handling

The socket event handling is implemented in [src/lib/socket.ts](src/lib/socket.ts):

```typescript
export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle inventory updates
    socket.on('inventoryUpdate', (data: { productId: string; stock: number; productName: string }) => {
      // Broadcast inventory update to all connected clients
      io.emit('inventoryUpdate', {
        productId: data.productId,
        stock: data.stock,
        productName: data.productName,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
```

### API Integration

The stock API routes in [src/app/api/stock/route.ts](src/app/api/stock/route.ts) emit WebSocket events when inventory is updated:

```typescript
// Emit real-time inventory update via WebSocket
const io = getIO();
if (io) {
  io.emit('inventoryUpdate', {
    productId: updatedProduct.id,
    stock: updatedProduct.stock,
    productName: updatedProduct.name,
    timestamp: new Date().toISOString()
  });
}
```

### Client-Side Implementation

The client-side WebSocket connection is handled with a custom hook [src/hooks/useSocket.ts](src/hooks/useSocket.ts):

```typescript
export const useSocket = (options: SocketOptions = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection
    const socketInstance = io({
      path: options.path || '/api/socketio',
    });

    socketRef.current = socketInstance;

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    // Clean up on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [options.path]);

  return {
    socket: socketRef.current,
    isConnected,
    emit,
  };
};
```

### Usage Examples

#### Listening for Inventory Updates

```typescript
const { socket } = useSocket();

useEffect(() => {
  if (!socket) return;

  // Listen for inventory updates
  socket.on('inventoryUpdate', (data: InventoryUpdate) => {
    console.log('Inventory update received:', data);
    // Update UI or refetch data
  });

  // Clean up listener on unmount
  return () => {
    socket.off('inventoryUpdate');
  };
}, [socket]);
```

#### Emitting Inventory Updates

```typescript
const { emit } = useSocket();

const handleSendUpdate = () => {
  emit('inventoryUpdate', {
    productId: 'product-123',
    productName: 'Test Product',
    stock: 10,
  });
};
```

### Test Endpoint

#### POST /api/inventory/test-websocket

Test endpoint to send inventory updates via WebSocket from the server side.

**Request Body:**
```json
{
  "productId": "string",
  "productName": "string",
  "stock": "number"
}
```

**Response:**
```json
{
  "success": "boolean",
  "message": "string"
}
```

### Testing

A test page is available at `/inventory/realtime-demo` to test the WebSocket functionality:

1. Visit the demo page
2. Ensure the connection status shows "Connected"
3. Send an inventory update using either:
   - Client-side emit (sends directly from browser)
   - Server-side emit (sends through API endpoint)
4. Observe the received updates in the "Recent Updates" section

### Security Considerations

1. **Authentication**: WebSocket connections don't currently implement authentication. In a production environment, you should:
   - Implement authentication middleware for WebSocket connections
   - Validate user permissions before allowing certain actions
   - Use secure WebSocket (wss://) in production

2. **Rate Limiting**: Consider implementing rate limiting to prevent abuse:
   - Limit the number of events a client can emit per minute
   - Implement connection limits per IP address

3. **Data Validation**: Always validate data received from clients:
   - Sanitize input data
   - Validate data types and ranges
   - Implement proper error handling

### Future Improvements

1. **Authentication**: Add JWT-based authentication for WebSocket connections
2. **Room-based Messaging**: Implement rooms for location-specific updates
3. **Message Persistence**: Store important messages for clients that reconnect
4. **Compression**: Enable compression for large payloads
5. **Monitoring**: Add monitoring and logging for WebSocket events
