import { NextResponse } from 'next/server'
import { getIO } from '@/lib/socket'

// POST /api/inventory/test-websocket - Test WebSocket functionality
export async function POST(request: Request) {
  try {
    // Parse JSON body with error handling
    let body = {};
    
    try {
      body = await request.json();
    } catch (jsonError) {
      console.log('No JSON body or parsing error, using empty object');
      body = {}; // Use empty object as fallback
    }
    
    console.log('Received request with body:', body);
    
    // Emit inventory update via WebSocket
    const io = getIO();
    if (io) {
      const timestamp = new Date().toISOString();
      
      io.emit('inventoryUpdate', {
        productId: (body as any).productId || 'test-product-123',
        stock: (body as any).stock !== undefined ? (body as any).stock : 10,
        productName: (body as any).productName || 'Test Product',
        timestamp: timestamp
      });
      
      console.log('Emitted inventoryUpdate event');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Inventory update sent via WebSocket' 
      })
    } else {
      console.log('WebSocket server not available');
      return NextResponse.json({ 
        success: false, 
        message: 'WebSocket server not available' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error testing WebSocket:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to test WebSocket functionality',
      error: (error as Error).message
    }, { status: 500 })
  }
}