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

// GET /api/sales/[id] - Get a specific sale
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get sale
    const sale = await db.sale.findUnique({
      where: {
        id: params.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        saleItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true
              }
            }
          }
        }
      }
    })
    
    if (!sale) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 })
    }
    
    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error fetching sale:', error)
    return NextResponse.json({ error: 'Failed to fetch sale' }, { status: 500 })
  }
}

// PUT /api/sales/[id] - Update a sale (limited functionality)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN and MANAGER can update sales)
    if (session.user && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user?.id || '', session.user?.role || '')

    // Get request body
    const body = await request.json()
    
    // Check if sale exists
    const existingSale = await db.sale.findUnique({
      where: {
        id: params.id
      }
    })
    
    if (!existingSale) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 })
    }
    
    // Update sale (limited to status and notes)
    const sale = await db.sale.update({
      where: {
        id: params.id
      },
      data: {
        status: body.status,
        notes: body.notes
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        saleItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true
              }
            }
          }
        }
      }
    })
    
    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error updating sale:', error)
    return NextResponse.json({ error: 'Failed to update sale' }, { status: 500 })
  }
}

// DELETE /api/sales/[id] - Delete a sale (with stock reversal)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN and MANAGER can delete sales)
    if (session.user && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user?.id || '', session.user?.role || '')

    // Check if sale exists
    const existingSale = await db.sale.findUnique({
      where: {
        id: params.id
      },
      include: {
        saleItems: true
      }
    })
    
    if (!existingSale) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 })
    }
    
    // Delete sale and reverse stock in a transaction
    await db.$transaction(async (prisma) => {
      // Reverse stock for each item
      for (const item of existingSale.saleItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        })
      }
      
      // Delete sale (cascade will delete sale items)
      await prisma.sale.delete({
        where: {
          id: params.id
        }
      })
    })
    
    return NextResponse.json({ message: 'Sale deleted successfully and stock reversed' })
  } catch (error) {
    console.error('Error deleting sale:', error)
    return NextResponse.json({ error: 'Failed to delete sale' }, { status: 500 })
  }
}