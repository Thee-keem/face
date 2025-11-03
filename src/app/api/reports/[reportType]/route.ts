import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Currency } from '@prisma/client';

interface CustomSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
  };
  expires: string;
}

// Report types
const REPORT_TYPES = [
  'profit-loss',
  'purchase-and-sale',
  'tax',
  'supplier-customer',
  'customer-groups',
  'stock',
  'filtered-stock',
  'stock-adjustment',
  'trending-products',
  'items',
  'product-purchase',
  'product-sell',
  'purchase-payment',
  'sell-payment',
  'expense',
  'register',
  'sales-representative',
  'table',
  'service-staff',
  'activity-log'
] as const;

type ReportType = typeof REPORT_TYPES[number];

export async function GET(
  request: Request,
  { params }: { params: { reportType: string } }
) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { reportType } = params;
    
    // Validate report type
    if (!REPORT_TYPES.includes(reportType as ReportType)) {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const locationId = searchParams.get('locationId');
    const format = searchParams.get('format') || 'json';
    const currency = searchParams.get('currency') as Currency || Currency.USD;
    
    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }
    
    let reportData: any;
    
    // Generate report based on type
    switch (reportType) {
      case 'profit-loss':
        reportData = await generateProfitLossReport(dateFilter, locationId, currency);
        break;
      case 'purchase-and-sale':
        reportData = await generatePurchaseAndSaleReport(dateFilter, locationId, currency);
        break;
      case 'tax':
        reportData = await generateTaxReport(dateFilter, locationId, currency);
        break;
      case 'supplier-customer':
        reportData = await generateSupplierCustomerReport(dateFilter, locationId);
        break;
      case 'customer-groups':
        reportData = await generateCustomerGroupsReport();
        break;
      case 'stock':
        reportData = await generateStockReport(locationId);
        break;
      case 'filtered-stock':
        reportData = await generateFilteredStockReport(searchParams);
        break;
      case 'stock-adjustment':
        reportData = await generateStockAdjustmentReport(dateFilter, locationId);
        break;
      case 'trending-products':
        reportData = await generateTrendingProductsReport(dateFilter, locationId);
        break;
      case 'items':
        reportData = await generateItemsReport(dateFilter, locationId);
        break;
      case 'product-purchase':
        reportData = await generateProductPurchaseReport(dateFilter, locationId);
        break;
      case 'product-sell':
        reportData = await generateProductSellReport(dateFilter, locationId);
        break;
      case 'purchase-payment':
        reportData = await generatePurchasePaymentReport(dateFilter, locationId);
        break;
      case 'sell-payment':
        reportData = await generateSellPaymentReport(dateFilter, locationId);
        break;
      case 'expense':
        reportData = await generateExpenseReport(dateFilter, locationId, currency);
        break;
      case 'register':
        reportData = await generateRegisterReport(dateFilter, locationId);
        break;
      case 'sales-representative':
        reportData = await generateSalesRepresentativeReport(dateFilter, locationId);
        break;
      case 'table':
        reportData = await generateTableReport(dateFilter, locationId);
        break;
      case 'service-staff':
        reportData = await generateServiceStaffReport(dateFilter, locationId);
        break;
      case 'activity-log':
        reportData = await generateActivityLogReport(dateFilter, locationId);
        break;
      default:
        return NextResponse.json({ error: 'Report type not implemented' }, { status: 501 });
    }
    
    // Return data in requested format
    if (format === 'csv') {
      return generateCSVReport(reportData, reportType);
    }
    
    return NextResponse.json({
      reportType,
      startDate,
      endDate,
      locationId,
      currency,
      data: reportData,
    });
    
  } catch (error) {
    console.error(`Error generating ${params.reportType} report:`, error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

// Report generation functions
async function generateProfitLossReport(dateFilter: any, locationId: string | null, currency: Currency) {
  // Get sales data
  const sales = await db.sale.findMany({
    where: {
      createdAt: dateFilter,
      status: 'COMPLETED',
      ...(locationId && { locationId }),
    },
    include: {
      saleItems: {
        include: {
          product: true,
        },
      },
    },
  });
  
  // Get expense data
  const expenses = await db.expense.findMany({
    where: {
      date: dateFilter,
      ...(locationId && { locationId }),
    },
  });
  
  // Calculate metrics
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.finalAmount, 0);
  const totalCostOfGoods = sales.reduce(
    (sum, sale) => 
      sum + sale.saleItems.reduce((itemSum, item) => itemSum + (item.product.cost * item.quantity), 0),
    0
  );
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const grossProfit = totalRevenue - totalCostOfGoods;
  const netProfit = grossProfit - totalExpenses;
  
  return {
    summary: {
      totalRevenue,
      totalCostOfGoods,
      grossProfit,
      totalExpenses,
      netProfit,
    },
    sales,
    expenses,
  };
}

async function generatePurchaseAndSaleReport(dateFilter: any, locationId: string | null, currency: Currency) {
  // Get sales data
  const sales = await db.sale.findMany({
    where: {
      createdAt: dateFilter,
      status: 'COMPLETED',
      ...(locationId && { locationId }),
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  
  // Get purchase orders data
  const purchaseOrders = await db.purchaseOrder.findMany({
    where: {
      orderDate: dateFilter,
      ...(locationId && { supplier: { id: locationId } }),
    },
    include: {
      supplier: {
        select: {
          companyName: true,
        },
      },
    },
  });
  
  return {
    sales: sales.map(sale => ({
      id: sale.id,
      invoiceNo: sale.invoiceNo,
      date: sale.createdAt,
      customer: sale.customerId ? 'Registered Customer' : 'Walk-in Customer',
      amount: sale.finalAmount,
      staff: sale.user.name,
    })),
    purchaseOrders: purchaseOrders.map(po => ({
      id: po.id,
      orderNumber: po.orderNumber,
      date: po.orderDate,
      supplier: po.supplier.companyName,
      amount: po.totalAmount,
      status: po.status,
    })),
  };
}

async function generateTaxReport(dateFilter: any, locationId: string | null, currency: Currency) {
  const sales = await db.sale.findMany({
    where: {
      createdAt: dateFilter,
      status: 'COMPLETED',
      ...(locationId && { locationId }),
    },
  });
  
  const totalTax = sales.reduce((sum, sale) => sum + sale.tax, 0);
  
  return {
    totalTax,
    sales: sales.map(sale => ({
      id: sale.id,
      invoiceNo: sale.invoiceNo,
      date: sale.createdAt,
      taxAmount: sale.tax,
    })),
  };
}

async function generateSupplierCustomerReport(dateFilter: any, locationId: string | null) {
  // Get suppliers
  const suppliers = await db.supplier.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      email: true,
      phone: true,
    },
  });
  
  // Get customers
  const customers = await db.customer.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      totalSpent: true,
      purchaseCount: true,
    },
  });
  
  return {
    suppliers,
    customers,
  };
}

async function generateCustomerGroupsReport() {
  const customerGroups = await db.customerGroup.findMany({
    where: {
      isActive: true,
    },
    include: {
      customers: {
        select: {
          id: true,
          name: true,
          totalSpent: true,
          purchaseCount: true,
        },
      },
      rules: true,
    },
  });
  
  return customerGroups;
}

async function generateStockReport(locationId: string | null) {
  const products = await db.product.findMany({
    where: {
      isActive: true,
      ...(locationId && { 
        // This would need to be adjusted based on how location-specific stock is tracked
      }),
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
    },
  });
  
  return products;
}

async function generateFilteredStockReport(searchParams: URLSearchParams) {
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const status = searchParams.get('status'); // low-stock, out-of-stock, overstock
  
  const where: any = {
    isActive: true,
  };
  
  if (category) {
    where.categoryId = category;
  }
  
  if (brand) {
    where.brandId = brand;
  }
  
  if (status) {
    switch (status) {
      case 'low-stock':
        where.stock = {
          lte: db.product.fields.minStock,
        };
        break;
      case 'out-of-stock':
        where.stock = 0;
        break;
      case 'overstock':
        where.stock = {
          gte: db.product.fields.maxStock,
        };
        break;
    }
  }
  
  const products = await db.product.findMany({
    where,
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
          name: true,
        },
      },
      brand: {
        select: {
          name: true,
        },
      },
    },
  });
  
  return products;
}

async function generateStockAdjustmentReport(dateFilter: any, locationId: string | null) {
  const adjustments = await db.stockAdjustment.findMany({
    where: {
      createdAt: dateFilter,
      ...(locationId && { locationId }),
    },
    include: {
      product: {
        select: {
          name: true,
          sku: true,
        },
      },
      location: {
        select: {
          name: true,
        },
      },
      adjustedBy: {
        select: {
          name: true,
        },
      },
    },
  });
  
  return adjustments;
}

async function generateTrendingProductsReport(dateFilter: any, locationId: string | null) {
  const salesItems = await db.saleItem.findMany({
    where: {
      sale: {
        createdAt: dateFilter,
        status: 'COMPLETED',
        ...(locationId && { locationId }),
      },
    },
    include: {
      product: true,
    },
  });
  
  // Group by product and calculate quantities
  const productSales: Record<string, { product: any; quantity: number; revenue: number }> = {};
  
  salesItems.forEach(item => {
    if (!productSales[item.productId]) {
      productSales[item.productId] = {
        product: item.product,
        quantity: 0,
        revenue: 0,
      };
    }
    productSales[item.productId].quantity += item.quantity;
    productSales[item.productId].revenue += item.totalPrice;
  });
  
  // Sort by quantity sold
  const trendingProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 20); // Top 20 trending products
  
  return trendingProducts;
}

async function generateItemsReport(dateFilter: any, locationId: string | null) {
  const products = await db.product.findMany({
    where: {
      isActive: true,
      ...(locationId && { 
        // Location filtering would go here
      }),
    },
    select: {
      id: true,
      name: true,
      sku: true,
      barcode: true,
      price: true,
      cost: true,
      stock: true,
      category: {
        select: {
          name: true,
        },
      },
      brand: {
        select: {
          name: true,
        },
      },
    },
  });
  
  return products;
}

async function generateProductPurchaseReport(dateFilter: any, locationId: string | null) {
  const purchaseItems = await db.purchaseOrderItem.findMany({
    where: {
      purchaseOrder: {
        orderDate: dateFilter,
        ...(locationId && { supplierId: locationId }),
      },
    },
    include: {
      product: {
        select: {
          name: true,
          sku: true,
        },
      },
      purchaseOrder: {
        select: {
          orderNumber: true,
          supplier: {
            select: {
              companyName: true,
            },
          },
        },
      },
    },
  });
  
  return purchaseItems;
}

async function generateProductSellReport(dateFilter: any, locationId: string | null) {
  const saleItems = await db.saleItem.findMany({
    where: {
      sale: {
        createdAt: dateFilter,
        status: 'COMPLETED',
        ...(locationId && { locationId }),
      },
    },
    include: {
      product: {
        select: {
          name: true,
          sku: true,
        },
      },
      sale: {
        select: {
          invoiceNo: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  
  return saleItems;
}

async function generatePurchasePaymentReport(dateFilter: any, locationId: string | null) {
  const payments = await db.payment.findMany({
    where: {
      paymentType: 'PURCHASE',
      paidAt: dateFilter,
      ...(locationId && { 
        // This would need to be adjusted to filter by supplier/location
      }),
    },
    include: {
      purchaseOrder: {
        select: {
          orderNumber: true,
          supplier: {
            select: {
              companyName: true,
            },
          },
        },
      },
    },
  });
  
  return payments;
}

async function generateSellPaymentReport(dateFilter: any, locationId: string | null) {
  const payments = await db.payment.findMany({
    where: {
      paymentType: 'SALE',
      paidAt: dateFilter,
      ...(locationId && { 
        // This would need to be adjusted to filter by location
      }),
    },
    include: {
      sale: {
        select: {
          invoiceNo: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  
  return payments;
}

async function generateExpenseReport(dateFilter: any, locationId: string | null, currency: Currency) {
  const expenses = await db.expense.findMany({
    where: {
      date: dateFilter,
      ...(locationId && { locationId }),
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return {
    totalExpenses,
    expenses: expenses.map(expense => ({
      id: expense.id,
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      staff: expense.user.name,
    })),
  };
}

async function generateRegisterReport(dateFilter: any, locationId: string | null) {
  // This would typically show cash register activity
  // For now, we'll return a simplified version
  const sales = await db.sale.findMany({
    where: {
      createdAt: dateFilter,
      status: 'COMPLETED',
      ...(locationId && { locationId }),
    },
  });
  
  const payments = await db.payment.findMany({
    where: {
      paidAt: dateFilter,
      ...(locationId && { 
        // Location filtering would go here
      }),
    },
  });
  
  return {
    sales,
    payments,
  };
}

async function generateSalesRepresentativeReport(dateFilter: any, locationId: string | null) {
  const salesReps = await db.salesRepresentative.findMany({
    where: {
      isActive: true,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  
  // Get sales for each representative
  const repSales = await Promise.all(
    salesReps.map(async rep => {
      const sales = await db.sale.findMany({
        where: {
          userId: rep.userId,
          createdAt: dateFilter,
          status: 'COMPLETED',
          ...(locationId && { locationId }),
        },
      });
      
      const totalSales = sales.reduce((sum, sale) => sum + sale.finalAmount, 0);
      const commission = totalSales * (rep.commissionRate / 100);
      
      return {
        ...rep,
        salesCount: sales.length,
        totalSales,
        commission,
      };
    })
  );
  
  return repSales;
}

async function generateTableReport(dateFilter: any, locationId: string | null) {
  // Since we've removed table functionality for retail focus, return empty array
  return [];
}

async function generateServiceStaffReport(dateFilter: any, locationId: string | null) {
  // This would show performance data for staff
  // For now, we'll return a simplified version
  const users = await db.user.findMany({
    where: {
      role: {
        in: ['STAFF', 'MANAGER'],
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  
  // Get sales for each staff member
  const staffSales = await Promise.all(
    users.map(async user => {
      const sales = await db.sale.findMany({
        where: {
          userId: user.id,
          createdAt: dateFilter,
          status: 'COMPLETED',
          ...(locationId && { locationId }),
        },
      });
      
      const totalSales = sales.reduce((sum, sale) => sum + sale.finalAmount, 0);
      
      return {
        ...user,
        salesCount: sales.length,
        totalSales,
      };
    })
  );
  
  return staffSales;
}

async function generateActivityLogReport(dateFilter: any, locationId: string | null) {
  // Get recent activity from various sources
  const sales = await db.sale.findMany({
    where: {
      createdAt: dateFilter,
      ...(locationId && { locationId }),
    },
    select: {
      id: true,
      invoiceNo: true,
      createdAt: true,
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });
  
  const products = await db.productHistory.findMany({
    where: {
      createdAt: dateFilter,
    },
    select: {
      id: true,
      action: true,
      createdAt: true,
      product: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });
  
  // Combine and sort activities
  const activities = [
    ...sales.map(sale => ({
      id: sale.id,
      type: 'SALE',
      description: `Sale ${sale.invoiceNo} completed`,
      user: sale.user.name,
      timestamp: sale.createdAt,
    })),
    ...products.map(product => ({
      id: product.id,
      type: 'PRODUCT',
      description: `${product.action} on ${product.product.name}`,
      user: product.user.name,
      timestamp: product.createdAt,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  return activities;
}

// CSV generation function
function generateCSVReport(data: any, reportType: string) {
  let csvContent = '';
  
  // Add CSV headers
  csvContent += 'Report Type,Generated At\n';
  csvContent += `${reportType},${new Date().toISOString()}\n\n`;
  
  // Add data based on report type
  switch (reportType) {
    case 'profit-loss':
      csvContent += 'Metric,Value\n';
      csvContent += `Total Revenue,${data.summary.totalRevenue}\n`;
      csvContent += `Total Cost of Goods,${data.summary.totalCostOfGoods}\n`;
      csvContent += `Gross Profit,${data.summary.grossProfit}\n`;
      csvContent += `Total Expenses,${data.summary.totalExpenses}\n`;
      csvContent += `Net Profit,${data.summary.netProfit}\n`;
      break;
      
    case 'purchase-and-sale':
      csvContent += 'Type,Reference,Date,Amount,Status\n';
      data.sales.forEach((sale: any) => {
        csvContent += `Sale,${sale.invoiceNo},${sale.date.toISOString()},${sale.amount},Completed\n`;
      });
      data.purchaseOrders.forEach((po: any) => {
        csvContent += `Purchase,${po.orderNumber},${po.date.toISOString()},${po.amount},${po.status}\n`;
      });
      break;
      
    default:
      // Generic CSV generation for other report types
      csvContent += 'Data\n';
      csvContent += JSON.stringify(data, null, 2);
  }
  
  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${reportType}-report-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}