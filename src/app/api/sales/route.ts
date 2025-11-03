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

// GET /api/sales - Get all sales
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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Build where clause
    const where: any = {}
    
    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }
    
    // Get sales
    const [sales, total] = await Promise.all([
      db.sale.findMany({
        where,
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
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.sale.count({ where })
    ])
    
    return NextResponse.json({
      sales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 })
  }
}

// POST /api/sales - Create a new sale
export async function POST(request: Request) {
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
    
    // Validate sale items
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Sale must have at least one item' }, { status: 400 })
    }
    
    // Calculate totals
    let totalAmount = 0
    const saleItemsData: any[] = []
    
    for (const item of body.items) {
      // Get product details
      const product = await db.product.findUnique({
        where: { id: item.productId }
      })
      
      if (!product) {
        return NextResponse.json({ error: `Product with ID ${item.productId} not found` }, { status: 400 })
      }
      
      // Check stock
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 })
      }
      
      const unitPrice = product.price
      const totalPrice = unitPrice * item.quantity
      totalAmount += totalPrice
      
      saleItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        totalPrice
      })
    }
    
    // Calculate tax and final amount
    const discount = body.discount || 0
    const tax = totalAmount * 0.08 // 8% tax
    const finalAmount = totalAmount + tax - discount
    
    // Generate unique invoice number
    const invoiceNo = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    // Create sale in a transaction
    const sale = await db.$transaction(async (prisma) => {
      // Create the sale
      const newSale = await prisma.sale.create({
        data: {
          invoiceNo,
          totalAmount,
          discount,
          tax,
          finalAmount,
          paymentMethod: body.paymentMethod,
          status: 'COMPLETED',
          userId: session.user.id,
          customerId: body.customerId,
          notes: body.notes,
          saleItems: {
            create: saleItemsData
          }
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
      
      // Update product stock
      for (const item of body.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }
      
      return newSale
    })
    
    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error creating sale:', error)
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 })
  }
}