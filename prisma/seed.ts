import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.saleItem.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.inventoryAlert.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  await prisma.businessLocation.deleteMany()

  // Hash the default password
  const defaultPassword = await bcrypt.hash('password', 10)

  // Create users with different roles and passwords
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
      password: defaultPassword
    }
  })

  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@example.com',
      name: 'Manager User',
      role: 'MANAGER',
      password: defaultPassword
    }
  })

  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@example.com',
      name: 'Staff User',
      role: 'STAFF',
      password: defaultPassword
    }
  })

  // Create a business location
  const businessLocation = await prisma.businessLocation.create({
    data: {
      name: 'Test Business Location',
      code: 'TEST001',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
      email: 'info@testbusiness.com',
      baseCurrency: 'USD',
      localCurrency: 'USD',
      isActive: true,
    }
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        description: 'Electronic devices and accessories'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Clothing',
        description: 'Apparel and fashion items'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Food & Beverages',
        description: 'Food items and beverages'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies'
      }
    })
  ])

  // Create products
  const products = await Promise.all(
    Array.from({ length: 50 }).map(async (_, i) => {
      const category = categories[Math.floor(Math.random() * categories.length)]
      
      return prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
          barcode: faker.string.numeric(12),
          price: parseFloat(faker.commerce.price({ min: 5, max: 500 })),
          cost: parseFloat(faker.commerce.price({ min: 1, max: 300 })),
          stock: faker.number.int({ min: 0, max: 100 }),
          minStock: faker.number.int({ min: 5, max: 20 }),
          maxStock: faker.number.int({ min: 80, max: 200 }),
          isActive: true,
          categoryId: category.id,
          imageUrl: faker.image.urlLoremFlickr({ category: 'business' })
        }
      })
    })
  )

  // Create some sales
  const sales = await Promise.all(
    Array.from({ length: 30 }).map(async (_, i) => {
      const user = [adminUser, managerUser, staffUser][Math.floor(Math.random() * 3)]
      
      // Create sale
      const sale = await prisma.sale.create({
        data: {
          invoiceNo: `INV-${faker.string.numeric(6)}`,
          totalAmount: 0,
          discount: faker.number.float({ min: 0, max: 50 }),
          tax: 0,
          finalAmount: 0,
          paymentMethod: 'CASH', // Using string literal instead of enum
          status: 'COMPLETED',
          userId: user.id,
          notes: faker.lorem.sentence()
        }
      })

      // Create sale items
      const itemCount = faker.number.int({ min: 1, max: 5 })
      let totalAmount = 0
      
      for (let j = 0; j < itemCount; j++) {
        const product = products[Math.floor(Math.random() * products.length)]
        const quantity = faker.number.int({ min: 1, max: 3 })
        const totalPrice = product.price * quantity
        totalAmount += totalPrice
        
        await prisma.saleItem.create({
          data: {
            saleId: sale.id,
            productId: product.id,
            quantity,
            unitPrice: product.price,
            totalPrice
          }
        })
      }

      // Update sale with calculated amounts
      const tax = totalAmount * 0.08 // 8% tax
      const finalAmount = totalAmount + tax - sale.discount
      
      return prisma.sale.update({
        where: { id: sale.id },
        data: {
          totalAmount,
          tax,
          finalAmount
        }
      })
    })
  )

  // Create expenses
  await Promise.all(
    Array.from({ length: 20 }).map(async (_, i) => {
      const user = [adminUser, managerUser, staffUser][Math.floor(Math.random() * 3)]
      
      return prisma.expense.create({
        data: {
          title: faker.commerce.department(),
          description: faker.lorem.sentence(),
          amount: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
          category: 'OTHER', // Using string literal instead of enum
          date: faker.date.recent({ days: 30 }),
          userId: user.id
        }
      })
    })
  )

  // Create inventory alerts
  await Promise.all(
    products.slice(0, 10).map(async (product) => {
      return prisma.inventoryAlert.create({
        data: {
          productId: product.id,
          type: 'LOW_STOCK',
          message: `Low stock alert for ${product.name}. Current stock: ${product.stock}`
        }
      })
    })
  )

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })