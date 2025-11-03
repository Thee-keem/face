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

// GET /api/analytics - Get analytics data
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
    const period = searchParams.get('period') || '7d' // 7d, 30d, 90d, 1y
    
    // Calculate date range
    const endDate = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }
    
    // Build where clause for date range
    const dateFilter = {
      gte: startDate,
      lte: endDate
    }
    
    // Get sales data
    const salesData = await db.sale.findMany({
      where: {
        createdAt: dateFilter,
        status: 'COMPLETED'
      },
      select: {
        id: true,
        finalAmount: true,
        createdAt: true
      }
    })
    
    // Get expense data
    const expenseData = await db.expense.findMany({
      where: {
        date: dateFilter
      },
      select: {
        id: true,
        amount: true,
        date: true
      }
    })
    
    // Get product data
    const productData = await db.product.findMany({
      select: {
        id: true,
        name: true,
        stock: true,
        minStock: true,
        price: true,
        cost: true
      }
    })
    
    // Calculate sales metrics
    const totalSales = salesData.reduce((sum, sale) => sum + sale.finalAmount, 0)
    const salesCount = salesData.length
    
    // Calculate expense metrics
    const totalExpenses = expenseData.reduce((sum, expense) => sum + expense.amount, 0)
    const expenseCount = expenseData.length
    
    // Calculate profit
    const profit = totalSales - totalExpenses
    
    // Calculate daily sales data for chart
    const dailySales: { date: string; amount: number }[] = []
    const dailyMap: { [key: string]: number } = {}
    
    // Initialize daily map
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      dailyMap[dateStr] = 0
    }
    
    // Populate daily sales
    salesData.forEach(sale => {
      const dateStr = sale.createdAt.toISOString().split('T')[0]
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + sale.finalAmount
    })
    
    // Convert to array
    Object.keys(dailyMap).forEach(date => {
      dailySales.push({
        date,
        amount: dailyMap[date]
      })
    })
    
    // Get top selling products
    const topProducts = await db.saleItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    })
    
    // Get product details for top products
    const topProductDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await db.product.findUnique({
          where: { id: item.productId }
        })
        return {
          ...item,
          product: product ? { name: product.name, sku: product.sku } : null
        }
      })
    )
    
    // Get low stock products
    const lowStockProducts = productData.filter(product => product.stock <= product.minStock)
    
    // Prepare response
    const analytics = {
      period,
      startDate,
      endDate,
      metrics: {
        totalSales,
        salesCount,
        totalExpenses,
        expenseCount,
        profit,
        profitMargin: totalSales > 0 ? (profit / totalSales) * 100 : 0
      },
      dailySales,
      topProducts: topProductDetails.filter(item => item.product !== null),
      lowStockProducts: lowStockProducts.slice(0, 5)
    }
    
    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}