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

// GET /api/products/[productId]/history - Get product history
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
    
    // Get history
    const history = await db.productHistory.findMany({
      where: {
        productId: params.productId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(history)
  } catch (error) {
    console.error('Error fetching product history:', error)
    return NextResponse.json({ error: 'Failed to fetch product history' }, { status: 500 })
  }
}