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

// GET /api/products/[productId]/variants - Get all variants for a product
export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Check if product exists
    const product = await db.product.findUnique({
      where: {
        id: params.productId
      }
    })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Get variants
    const variants = await db.productVariant.findMany({
      where: {
        productId: params.productId
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    
    return NextResponse.json(variants)
  } catch (error) {
    console.error('Error fetching product variants:', error)
    return NextResponse.json({ error: 'Failed to fetch product variants' }, { status: 500 })
  }
}

// POST /api/products/[productId]/variants - Create a new variant for a product
export async function POST(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN and MANAGER can create variants)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Check if product exists
    const product = await db.product.findUnique({
      where: {
        id: params.productId
      }
    })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Get request body
    const body = await request.json()
    
    // Create variant
    const variant = await db.productVariant.create({
      data: {
        productId: params.productId,
        name: body.name,
        sku: body.sku,
        barcode: body.barcode,
        price: parseFloat(body.price),
        cost: parseFloat(body.cost),
        stock: parseInt(body.stock) || 0,
        imageUrl: body.imageUrl,
        attributes: body.attributes,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    })
    
    return NextResponse.json(variant)
  } catch (error) {
    console.error('Error creating product variant:', error)
    return NextResponse.json({ error: 'Failed to create product variant' }, { status: 500 })
  }
}