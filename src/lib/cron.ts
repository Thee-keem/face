import { db } from '@/lib/db'
import { InventoryAlert, AlertType } from '@prisma/client'

export async function checkLowStockAlerts() {
  try {
    // Find products with low stock
    const lowStockProducts = await db.product.findMany({
      where: {
        AND: [
          {
            stock: {
              lte: 10 // Default value, will be overridden below
            }
          },
          {
            isActive: true
          }
        ]
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
        type: 'LOW_STOCK' as AlertType,
        isRead: false
      },
      select: {
        productId: true
      }
    })

    const existingAlertProductIds = new Set(existingAlerts.map(a => a.productId))

    // Create alerts for products without existing alerts
    const newAlerts: InventoryAlert[] = []
    for (const product of lowStockProducts) {
      // Check if stock is actually below minStock
      if (product.stock > product.minStock) continue;
      
      if (!existingAlertProductIds.has(product.id)) {
        const alert = await db.inventoryAlert.create({
          data: {
            productId: product.id,
            type: 'LOW_STOCK' as AlertType,
            message: `Low stock alert for ${product.name}. Current stock: ${product.stock}, minimum required: ${product.minStock}`
          }
        })
        newAlerts.push(alert)
      }
    }

    console.log(`Generated ${newAlerts.length} new low stock alerts`)
    return newAlerts
  } catch (error) {
    console.error('Error generating low stock alerts:', error)
    throw error
  }
}

export async function checkOverstockAlerts() {
  try {
    // Find products with overstock
    const overstockProducts = await db.product.findMany({
      where: {
        AND: [
          {
            stock: {
              gte: 100 // Default value, will be overridden below
            }
          },
          {
            isActive: true
          }
        ]
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        maxStock: true
      }
    })

    // Check for existing alerts for these products
    const existingAlerts = await db.inventoryAlert.findMany({
      where: {
        productId: {
          in: overstockProducts.map(p => p.id)
        },
        type: 'OVERSTOCK' as AlertType,
        isRead: false
      },
      select: {
        productId: true
      }
    })

    const existingAlertProductIds = new Set(existingAlerts.map(a => a.productId))

    // Create alerts for products without existing alerts
    const newAlerts: InventoryAlert[] = []
    for (const product of overstockProducts) {
      // Check if stock is actually above maxStock
      if (product.stock < product.maxStock) continue;
      
      if (!existingAlertProductIds.has(product.id)) {
        const alert = await db.inventoryAlert.create({
          data: {
            productId: product.id,
            type: 'OVERSTOCK' as AlertType,
            message: `Overstock alert for ${product.name}. Current stock: ${product.stock}, maximum recommended: ${product.maxStock}`
          }
        })
        newAlerts.push(alert)
      }
    }

    console.log(`Generated ${newAlerts.length} new overstock alerts`)
    return newAlerts
  } catch (error) {
    console.error('Error generating overstock alerts:', error)
    throw error
  }
}