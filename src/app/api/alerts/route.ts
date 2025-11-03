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

// GET /api/alerts - Get all alerts
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const isRead = searchParams.get('isRead')
    const type = searchParams.get('type')
    
    // Build where clause
    const where: any = {}
    
    if (isRead !== null) {
      where.isRead = isRead === 'true'
    }
    
    if (type) {
      where.type = type
    }
    
    // Get alerts
    const [alerts, total] = await Promise.all([
      db.inventoryAlert.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              stock: true,
              minStock: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.inventoryAlert.count({ where })
    ])
    
    return NextResponse.json({
      alerts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}

// POST /api/alerts - Create a new alert
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN and MANAGER can create alerts)
    if (session.user && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user?.id || '', session.user?.role || '')

    // Get request body
    const body = await request.json()
    
    // Create alert
    const alert = await db.inventoryAlert.create({
      data: {
        productId: body.productId,
        type: body.type,
        message: body.message,
        isRead: body.isRead || false
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            stock: true,
            minStock: true
          }
        }
      }
    })
    
    return NextResponse.json(alert)
  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 })
  }
}