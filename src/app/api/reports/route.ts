import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BoltAuth } from '@/lib/boltAuth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/reports - Get detailed reports
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext((session.user as any).id, (session.user as any).role)

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') || 'sales'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const format = searchParams.get('format') || 'json'
    
    // Build date filter
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate)
    }
    
    let reportData: any = {}
    
    switch (reportType) {
      case 'sales':
        reportData = await generateSalesReport(dateFilter)
        break
      case 'inventory':
        reportData = await generateInventoryReport()
        break
      case 'profit':
        reportData = await generateProfitReport(dateFilter)
        break
      case 'customer':
        reportData = await generateCustomerReport(dateFilter)
        break
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }
    
    // Return data in requested format
    if (format === 'csv') {
      return generateCSVReport(reportData, reportType)
    }
    
    return NextResponse.json({
      reportType,
      startDate,
      endDate,
      data: reportData
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}

async function generateSalesReport(dateFilter: any) {
  // Get sales data
  const sales = await db.sale.findMany({
    where: {
      createdAt: dateFilter,
      status: 'COMPLETED'
    },
    include: {
      saleItems: {
        include: {
          product: true
        }
      },
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
  
  // Calculate summary metrics
  const totalSales = sales.length
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.finalAmount, 0)
  const totalDiscounts = sales.reduce((sum, sale) => sum + sale.discount, 0)
  const totalTax = sales.reduce((sum, sale) => sum + sale.tax, 0)
  
  // Group by date for chart data
  const dailySales: { [key: string]: { count: number; revenue: number } } = {}
  sales.forEach(sale => {
    const date = sale.createdAt.toISOString().split('T')[0]
    if (!dailySales[date]) {
      dailySales[date] = { count: 0, revenue: 0 }
    }
    dailySales[date].count += 1
    dailySales[date].revenue += sale.finalAmount
  })
  
  // Top selling products
  const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {}
  sales.forEach(sale => {
    sale.saleItems.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          name: item.product.name,
          quantity: 0,
          revenue: 0
        }
      }
      productSales[item.productId].quantity += item.quantity
      productSales[item.productId].revenue += item.totalPrice
    })
  })
  
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10)
  
  return {
    summary: {
      totalSales,
      totalRevenue,
      totalDiscounts,
      totalTax,
      averageSaleValue: totalSales > 0 ? totalRevenue / totalSales : 0
    },
    dailySales: Object.entries(dailySales).map(([date, data]) => ({
      date,
      ...data
    })),
    topProducts,
    recentSales: sales.slice(0, 10).map(sale => ({
      id: sale.id,
      invoiceNo: sale.invoiceNo,
      date: sale.createdAt,
      customer: sale.customerId ? 'Registered Customer' : 'Walk-in Customer',
      items: sale.saleItems.length,
      total: sale.finalAmount,
      staff: sale.user.name
    }))
  }
}

async function generateInventoryReport() {
  // Get all products with stock information
  const products = await db.product.findMany({
    where: {
      isActive: true
    },
    select: {
      id: true,
      name: true,
      sku: true,
      stock: true,
      minStock: true,
      maxStock: true,
      price: true,
      cost: true,
      category: {
        select: {
          name: true
        }
      }
    }
  })
  
  // Calculate inventory metrics
  const totalProducts = products.length
  const totalStockValue = products.reduce((sum, product) => sum + (product.stock * product.price), 0)
  const totalCostValue = products.reduce((sum, product) => sum + (product.stock * product.cost), 0)
  const totalProfitValue = totalStockValue - totalCostValue
  
  // Low stock products
  const lowStockProducts = products.filter(product => product.stock <= product.minStock)
  
  // Overstock products
  const overStockProducts = products.filter(product => product.stock >= product.maxStock)
  
  // Stock by category
  const categoryStock: { [key: string]: { count: number; value: number } } = {}
  products.forEach(product => {
    const categoryName = product.category?.name || 'Uncategorized'
    if (!categoryStock[categoryName]) {
      categoryStock[categoryName] = { count: 0, value: 0 }
    }
    categoryStock[categoryName].count += 1
    categoryStock[categoryName].value += product.stock * product.price
  })
  
  return {
    summary: {
      totalProducts,
      totalStockValue,
      totalCostValue,
      totalProfitValue,
      lowStockItems: lowStockProducts.length,
      overStockItems: overStockProducts.length
    },
    stockAlerts: {
      lowStock: lowStockProducts.map(product => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        currentStock: product.stock,
        minStock: product.minStock,
        category: product.category?.name
      })),
      overStock: overStockProducts.map(product => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        currentStock: product.stock,
        maxStock: product.maxStock,
        category: product.category?.name
      }))
    },
    categoryBreakdown: Object.entries(categoryStock).map(([category, data]) => ({
      category,
      ...data
    })),
    products: products.map(product => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      stock: product.stock,
      minStock: product.minStock,
      maxStock: product.maxStock,
      price: product.price,
      cost: product.cost,
      profit: product.price - product.cost,
      category: product.category?.name
    }))
  }
}

async function generateProfitReport(dateFilter: any) {
  // Get sales data
  const sales = await db.sale.findMany({
    where: {
      createdAt: dateFilter,
      status: 'COMPLETED'
    },
    include: {
      saleItems: {
        include: {
          product: true
        }
      }
    }
  })
  
  // Get expense data
  const expenses = await db.expense.findMany({
    where: {
      date: dateFilter
    }
  })
  
  // Calculate sales revenue
  const totalSalesRevenue = sales.reduce((sum, sale) => sum + sale.finalAmount, 0)
  const totalCostOfGoods = sales.reduce((sum, sale) => {
    return sum + sale.saleItems.reduce((itemSum, item) => {
      return itemSum + (item.product.cost * item.quantity)
    }, 0)
  }, 0)
  
  // Calculate expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  // Calculate profit metrics
  const grossProfit = totalSalesRevenue - totalCostOfGoods
  const netProfit = grossProfit - totalExpenses
  const grossProfitMargin = totalSalesRevenue > 0 ? (grossProfit / totalSalesRevenue) * 100 : 0
  const netProfitMargin = totalSalesRevenue > 0 ? (netProfit / totalSalesRevenue) * 100 : 0
  
  return {
    summary: {
      totalSalesRevenue,
      totalCostOfGoods,
      totalExpenses,
      grossProfit,
      netProfit,
      grossProfitMargin,
      netProfitMargin
    },
    sales: sales.map(sale => ({
      id: sale.id,
      invoiceNo: sale.invoiceNo,
      date: sale.createdAt,
      revenue: sale.finalAmount,
      costOfGoods: sale.saleItems.reduce((sum, item) => sum + (item.product.cost * item.quantity), 0),
      grossProfit: sale.finalAmount - sale.saleItems.reduce((sum, item) => sum + (item.product.cost * item.quantity), 0)
    })),
    expenses: expenses.map(expense => ({
      id: expense.id,
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      date: expense.date
    }))
  }
}

async function generateCustomerReport(dateFilter: any) {
  // Get sales with customer information
  const sales = await db.sale.findMany({
    where: {
      createdAt: dateFilter,
      status: 'COMPLETED',
      customerId: {
        not: null
      }
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })
  
  // Get customer data
  const customers = await db.user.findMany({
    where: {
      id: {
        in: sales.map(sale => sale.customerId).filter(Boolean) as string[]
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  })
  
  // Group sales by customer
  const customerSales: { [key: string]: { customer: any; sales: any[]; totalSpent: number; purchaseCount: number } } = {}
  
  sales.forEach(sale => {
    if (sale.customerId) {
      if (!customerSales[sale.customerId]) {
        const customer = customers.find(c => c.id === sale.customerId)
        customerSales[sale.customerId] = {
          customer,
          sales: [],
          totalSpent: 0,
          purchaseCount: 0
        }
      }
      customerSales[sale.customerId].sales.push(sale)
      customerSales[sale.customerId].totalSpent += sale.finalAmount
      customerSales[sale.customerId].purchaseCount += 1
    }
  })
  
  // Sort by total spent
  const topCustomers = Object.values(customerSales)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 20)
  
  return {
    summary: {
      totalCustomers: customers.length,
      totalPurchases: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + sale.finalAmount, 0),
      averageCustomerValue: customers.length > 0 ? 
        sales.reduce((sum, sale) => sum + sale.finalAmount, 0) / customers.length : 0
    },
    topCustomers: topCustomers.map(customerData => ({
      id: customerData.customer?.id,
      name: customerData.customer?.name,
      email: customerData.customer?.email,
      totalSpent: customerData.totalSpent,
      purchaseCount: customerData.purchaseCount,
      averageOrderValue: customerData.purchaseCount > 0 ? 
        customerData.totalSpent / customerData.purchaseCount : 0,
      firstPurchase: customerData.sales.length > 0 ? 
        customerData.sales[customerData.sales.length - 1].createdAt : null
    }))
  }
}

function generateCSVReport(data: any, reportType: string) {
  let csvContent = ''
  
  switch (reportType) {
    case 'sales':
      csvContent = generateSalesCSV(data)
      break
    case 'inventory':
      csvContent = generateInventoryCSV(data)
      break
    case 'profit':
      csvContent = generateProfitCSV(data)
      break
    case 'customer':
      csvContent = generateCustomerCSV(data)
      break
    default:
      csvContent = 'Invalid report type'
  }
  
  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${reportType}-report-${new Date().toISOString().split('T')[0]}.csv"`
    }
  })
}

function generateSalesCSV(data: any) {
  let csv = 'Date,Invoice Number,Customer,Items,Total,Staff\n'
  data.recentSales.forEach((sale: any) => {
    csv += `${sale.date.toISOString().split('T')[0]},${sale.invoiceNo},"${sale.customer}",${sale.items},${sale.total},"${sale.staff}"\n`
  })
  return csv
}

function generateInventoryCSV(data: any) {
  let csv = 'Product Name,SKU,Stock,Min Stock,Max Stock,Price,Cost,Category\n'
  data.products.forEach((product: any) => {
    csv += `"${product.name}",${product.sku},${product.stock},${product.minStock},${product.maxStock},${product.price},${product.cost},"${product.category}"\n`
  })
  return csv
}

function generateProfitCSV(data: any) {
  let csv = 'Date,Invoice Number,Revenue,Cost of Goods,Gross Profit\n'
  data.sales.forEach((sale: any) => {
    csv += `${sale.date.toISOString().split('T')[0]},${sale.invoiceNo},${sale.revenue},${sale.costOfGoods},${sale.grossProfit}\n`
  })
  return csv
}

function generateCustomerCSV(data: any) {
  let csv = 'Customer Name,Email,Total Spent,Purchase Count,Average Order Value,First Purchase\n'
  data.topCustomers.forEach((customer: any) => {
    csv += `"${customer.name || ''}","${customer.email || ''}",${customer.totalSpent},${customer.purchaseCount},${customer.averageOrderValue},"${customer.firstPurchase ? customer.firstPurchase.toISOString().split('T')[0] : ''}"\n`
  })
  return csv
}