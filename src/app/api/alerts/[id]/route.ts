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

// GET /api/alerts/[id] - Get a specific alert
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get alert
    const alert = await db.inventoryAlert.findUnique({
      where: {
        id: (await params).id
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
    
    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
    }
    
    return NextResponse.json(alert)
  } catch (error) {
    console.error('Error fetching alert:', error)
    return NextResponse.json({ error: 'Failed to fetch alert' }, { status: 500 })
  }
}

// PUT /api/alerts/[id] - Update an alert
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get request body
    const body = await request.json()
    
    // Check if alert exists
    const existingAlert = await db.inventoryAlert.findUnique({
      where: {
        id: (await params).id
      }
    })
    
    if (!existingAlert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
    }
    
    // Update alert
    const alert = await db.inventoryAlert.update({
      where: {
        id: (await params).id
      },
      data: {
        isRead: body.isRead,
        message: body.message
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
    console.error('Error updating alert:', error)
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 })
  }
}

// DELETE /api/alerts/[id] - Delete an alert
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN and MANAGER can delete alerts)
    if (session.user && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user?.id || '', session.user?.role || '')

    // Check if alert exists
    const existingAlert = await db.inventoryAlert.findUnique({
      where: {
        id: (await params).id
      }
    })
    
    if (!existingAlert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
    }
    
    // Delete alert
    await db.inventoryAlert.delete({
      where: {
        id: (await params).id
      }
    })
    
    return NextResponse.json({ message: 'Alert deleted successfully' })
  } catch (error) {
    console.error('Error deleting alert:', error)
    return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 })
  }
}