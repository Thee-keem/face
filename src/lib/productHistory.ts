import { db } from '@/lib/db'

export interface ProductChange {
  field: string
  oldValue: any
  newValue: any
}

export async function logProductChange(
  productId: string,
  userId: string,
  action: string,
  changes: ProductChange[]
) {
  try {
    // Log each change as a separate history entry
    for (const change of changes) {
      await db.productHistory.create({
        data: {
          productId,
          action: `${action}: ${change.field}`,
          oldValue: change.oldValue ? change.oldValue.toString() : null,
          newValue: change.newValue ? change.newValue.toString() : null,
          userId
        }
      })
    }
  } catch (error) {
    console.error('Error logging product change:', error)
  }
}

export async function logProductCreation(
  productId: string,
  userId: string
) {
  try {
    await db.productHistory.create({
      data: {
        productId,
        action: 'Product Created',
        userId
      }
    })
  } catch (error) {
    console.error('Error logging product creation:', error)
  }
}

export async function logProductDeletion(
  productId: string,
  userId: string,
  productName: string
) {
  try {
    await db.productHistory.create({
      data: {
        productId,
        action: 'Product Deleted',
        newValue: productName,
        userId
      }
    })
  } catch (error) {
    console.error('Error logging product deletion:', error)
  }
}