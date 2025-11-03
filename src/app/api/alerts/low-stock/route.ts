import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BoltAuth } from '@/lib/boltAuth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/alerts/low-stock - Check for low stock products and generate alerts
export async function GET(request: Request) {
  try {
    // Check authentication
    const session: any = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Find products with low stock
    const lowStockProducts = await db.product.findMany({
      where: {
        stock: {
          lte: db.product.fields.minStock
        },
        isActive: true
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        minStock: true
      }
    })

    // Check for existing alerts for these products
    const existingAlerts = await db.inventoryAlert.findMany({
      where: {
        productId: {
          in: lowStockProducts.map(p => p.id)
        },
        type: 'LOW_STOCK',
        isRead: false
      },
      select: {
        productId: true
      }
    })

    const existingAlertProductIds = new Set(existingAlerts.map(a => a.productId))

    // Create alerts for products without existing alerts
    const newAlerts: any[] = []
    for (const product of lowStockProducts) {
      if (!existingAlertProductIds.has(product.id)) {
        const alert = await db.inventoryAlert.create({
          data: {
            productId: product.id,
            type: 'LOW_STOCK',
            message: `Low stock alert for ${product.name}. Current stock: ${product.stock}, minimum required: ${product.minStock}`
          }
        })
        newAlerts.push(alert)
      }
    }

    return NextResponse.json({
      message: `Generated ${newAlerts.length} new low stock alerts`,
      alerts: newAlerts
    })
  } catch (error) {
    console.error('Error generating low stock alerts:', error)
    return NextResponse.json({ error: 'Failed to generate low stock alerts' }, { status: 500 })
  }
}