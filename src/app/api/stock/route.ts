import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BoltAuth } from '@/lib/boltAuth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Extend the default session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    }
  }
}

// PUT /api/stock - Update product stock
export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN and MANAGER can update stock)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get request body
    const body = await request.json()
    
    // Validate input
    if (!body.productId || body.quantity === undefined) {
      return NextResponse.json({ error: 'Product ID and quantity are required' }, { status: 400 })
    }
    
    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: {
        id: body.productId
      }
    })
    
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Update stock
    const updatedProduct = await db.product.update({
      where: {
        id: body.productId
      },
      data: {
        stock: body.quantity
      }
    })
    
    // Check if we need to generate alerts
    let alert: any = null
    if (updatedProduct.stock <= updatedProduct.minStock) {
      // Check if alert already exists
      const existingAlert = await db.inventoryAlert.findFirst({
        where: {
          productId: updatedProduct.id,
          type: 'LOW_STOCK',
          isRead: false
        }
      })
      
      if (!existingAlert) {
        // Create low stock alert
        alert = await db.inventoryAlert.create({
          data: {
            productId: updatedProduct.id,
            type: 'LOW_STOCK',
            message: `Low stock alert for ${updatedProduct.name}. Current stock: ${updatedProduct.stock}`
          }
        })
      }
    }
    
    return NextResponse.json({
      product: updatedProduct,
      alert
    })
  } catch (error) {
    console.error('Error updating stock:', error)
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 })
  }
}

// POST /api/stock/adjustment - Create stock adjustment
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN and MANAGER can adjust stock)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get request body
    const body = await request.json()
    
    // Validate input
    if (!body.productId || body.adjustment === undefined) {
      return NextResponse.json({ error: 'Product ID and adjustment are required' }, { status: 400 })
    }
    
    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: {
        id: body.productId
      }
    })
    
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Calculate new stock
    const newStock = existingProduct.stock + body.adjustment
    
    // Update stock
    const updatedProduct = await db.product.update({
      where: {
        id: body.productId
      },
      data: {
        stock: newStock
      }
    })
    
    // Create adjustment record (you might want to create a separate table for this)
    // For now, we'll just log it
    
    // Check if we need to generate alerts
    let alert: any = null
    if (updatedProduct.stock <= updatedProduct.minStock) {
      // Check if alert already exists
      const existingAlert = await db.inventoryAlert.findFirst({
        where: {
          productId: updatedProduct.id,
          type: 'LOW_STOCK',
          isRead: false
        }
      })
      
      if (!existingAlert) {
        // Create low stock alert
        alert = await db.inventoryAlert.create({
          data: {
            productId: updatedProduct.id,
            type: 'LOW_STOCK',
            message: `Low stock alert for ${updatedProduct.name}. Current stock: ${updatedProduct.stock}`
          }
        })
      }
    }
    
    return NextResponse.json({
      product: updatedProduct,
      adjustment: body.adjustment,
      alert
    })
  } catch (error) {
    console.error('Error adjusting stock:', error)
    return NextResponse.json({ error: 'Failed to adjust stock' }, { status: 500 })
  }
}