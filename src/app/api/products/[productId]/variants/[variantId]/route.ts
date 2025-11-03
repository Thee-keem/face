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

// GET /api/products/[productId]/variants/[variantId] - Get a specific variant
export async function GET(
  request: Request,
  { params }: { params: { productId: string, variantId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get variant
    const variant = await db.productVariant.findUnique({
      where: {
        id: params.variantId,
        productId: params.productId
      }
    })
    
    if (!variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 })
    }
    
    return NextResponse.json(variant)
  } catch (error) {
    console.error('Error fetching product variant:', error)
    return NextResponse.json({ error: 'Failed to fetch product variant' }, { status: 500 })
  }
}

// PUT /api/products/[productId]/variants/[variantId] - Update a variant
export async function PUT(
  request: Request,
  { params }: { params: { productId: string, variantId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN and MANAGER can update variants)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Check if variant exists
    const existingVariant = await db.productVariant.findUnique({
      where: {
        id: params.variantId,
        productId: params.productId
      }
    })
    
    if (!existingVariant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 })
    }
    
    // Get request body
    const body = await request.json()
    
    // Update variant
    const variant = await db.productVariant.update({
      where: {
        id: params.variantId
      },
      data: {
        name: body.name,
        sku: body.sku,
        barcode: body.barcode,
        price: parseFloat(body.price),
        cost: parseFloat(body.cost),
        stock: parseInt(body.stock),
        imageUrl: body.imageUrl,
        attributes: body.attributes,
        isActive: body.isActive
      }
    })
    
    return NextResponse.json(variant)
  } catch (error) {
    console.error('Error updating product variant:', error)
    return NextResponse.json({ error: 'Failed to update product variant' }, { status: 500 })
  }
}

// DELETE /api/products/[productId]/variants/[variantId] - Delete a variant
export async function DELETE(
  request: Request,
  { params }: { params: { productId: string, variantId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN and MANAGER can delete variants)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Check if variant exists
    const existingVariant = await db.productVariant.findUnique({
      where: {
        id: params.variantId,
        productId: params.productId
      }
    })
    
    if (!existingVariant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 })
    }
    
    // Delete variant
    await db.productVariant.delete({
      where: {
        id: params.variantId
      }
    })
    
    return NextResponse.json({ message: 'Variant deleted successfully' })
  } catch (error) {
    console.error('Error deleting product variant:', error)
    return NextResponse.json({ error: 'Failed to delete product variant' }, { status: 500 })
  }
}