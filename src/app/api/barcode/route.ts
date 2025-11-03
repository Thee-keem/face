import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BoltAuth } from '@/lib/boltAuth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface SessionUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

interface CustomSession {
  user: SessionUser;
  expires: string;
}

// GET /api/barcode?code=... - Validate barcode
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const barcode = searchParams.get('code')
    
    // Validate input
    if (!barcode) {
      return NextResponse.json({ error: 'Barcode is required' }, { status: 400 })
    }
    
    // Find product by barcode
    const product = await db.product.findUnique({
      where: {
        barcode
      },
      include: {
        category: true
      }
    })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        sku: product.sku,
        barcode: product.barcode,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        minStock: product.minStock,
        maxStock: product.maxStock,
        isActive: product.isActive,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl,
        category: product.category
      }
    })
  } catch (error) {
    console.error('Error validating barcode:', error)
    return NextResponse.json({ error: 'Failed to validate barcode' }, { status: 500 })
  }
}

// POST /api/barcode - Create or update product with barcode
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN and MANAGER can create/update products)
    if (session.user && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user?.id || '', session.user?.role || '')

    // Get request body
    const body = await request.json()
    
    // Validate input
    if (!body.barcode) {
      return NextResponse.json({ error: 'Barcode is required' }, { status: 400 })
    }
    
    // Check if product with this barcode already exists
    const existingProduct = await db.product.findUnique({
      where: {
        barcode: body.barcode
      }
    })
    
    let product
    
    if (existingProduct) {
      // Update existing product
      product = await db.product.update({
        where: {
          id: existingProduct.id
        },
        data: {
          name: body.name || existingProduct.name,
          description: body.description || existingProduct.description,
          sku: body.sku || existingProduct.sku,
          price: body.price !== undefined ? parseFloat(body.price) : existingProduct.price,
          cost: body.cost !== undefined ? parseFloat(body.cost) : existingProduct.cost,
          stock: body.stock !== undefined ? parseInt(body.stock) : existingProduct.stock,
          minStock: body.minStock !== undefined ? parseInt(body.minStock) : existingProduct.minStock,
          maxStock: body.maxStock !== undefined ? parseInt(body.maxStock) : existingProduct.maxStock,
          isActive: body.isActive !== undefined ? body.isActive : existingProduct.isActive,
          categoryId: body.categoryId || existingProduct.categoryId,
          imageUrl: body.imageUrl || existingProduct.imageUrl
        },
        include: {
          category: true
        }
      })
    } else {
      // Create new product
      product = await db.product.create({
        data: {
          name: body.name,
          description: body.description,
          sku: body.sku,
          barcode: body.barcode,
          price: parseFloat(body.price),
          cost: parseFloat(body.cost),
          stock: parseInt(body.stock),
          minStock: parseInt(body.minStock),
          maxStock: parseInt(body.maxStock),
          isActive: body.isActive !== undefined ? body.isActive : true,
          categoryId: body.categoryId,
          imageUrl: body.imageUrl
        },
        include: {
          category: true
        }
      })
    }
    
    return NextResponse.json({
      product,
      created: !existingProduct
    })
  } catch (error) {
    console.error('Error processing barcode:', error)
    return NextResponse.json({ error: 'Failed to process barcode' }, { status: 500 })
  }
}