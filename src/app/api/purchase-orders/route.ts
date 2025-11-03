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

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check permissions (ADMIN and MANAGER can view purchase orders)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const supplierId = searchParams.get('supplierId') || '';
    const status = searchParams.get('status') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build query conditions
    const where: any = {};
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (supplierId) {
      where.supplierId = supplierId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (startDate || endDate) {
      where.orderDate = {};
      if (startDate) {
        where.orderDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.orderDate.lte = new Date(endDate);
      }
    }
    
    // Get purchase orders
    const [purchaseOrders, total] = await Promise.all([
      db.purchaseOrder.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          supplier: {
            select: {
              companyName: true,
            },
          },
          createdBy: {
            select: {
              name: true,
            },
          },
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              receivedQuantity: true,
              unitPrice: true,
              totalPrice: true,
              product: {
                select: {
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
      }),
      db.purchaseOrder.count({ where }),
    ]);
    
    return NextResponse.json({
      purchaseOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json({ error: 'Failed to fetch purchase orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check permissions (ADMIN and MANAGER can create purchase orders)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const {
      supplierId,
      orderNumber,
      reference,
      orderDate,
      expectedDeliveryDate,
      currency,
      exchangeRate,
      notes,
      items, // Array of { productId, quantity, unitPrice, taxRate }
    } = body;
    
    // Validate input
    if (!supplierId || !orderNumber || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Supplier ID, order number, and items are required' }, { status: 400 });
    }
    
    // Validate currency
    if (currency && !Object.values(Currency).includes(currency)) {
      return NextResponse.json({ error: 'Invalid currency' }, { status: 400 });
    }
    
    // Validate that order number is unique
    const existingOrder = await db.purchaseOrder.findUnique({
      where: { orderNumber },
    });
    
    if (existingOrder) {
      return NextResponse.json({ error: 'Purchase order with this number already exists' }, { status: 400 });
    }
    
    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;
    let totalAmount = 0;
    
    const orderItems = items.map((item: any) => {
      const itemTaxAmount = item.unitPrice * item.quantity * (item.taxRate || 0) / 100;
      const itemTotal = (item.unitPrice * item.quantity) + itemTaxAmount;
      
      subtotal += item.unitPrice * item.quantity;
      taxAmount += itemTaxAmount;
      totalAmount += itemTotal;
      
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate || 0,
        taxAmount: itemTaxAmount,
        totalPrice: itemTotal,
        receivedQuantity: 0,
      };
    });
    
    // Create purchase order
    const purchaseOrder = await db.purchaseOrder.create({
      data: {
        supplierId,
        orderNumber,
        reference,
        orderDate: orderDate ? new Date(orderDate) : new Date(),
        expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : undefined,
        currency: currency || Currency.USD,
        exchangeRate: exchangeRate || 1,
        subtotal,
        taxAmount,
        totalAmount,
        notes,
        status: 'PENDING',
        createdById: session.user.id,
        items: {
          create: orderItems,
        },
      },
      include: {
        supplier: {
          select: {
            companyName: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            receivedQuantity: true,
            unitPrice: true,
            totalPrice: true,
            product: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    });
    
    return NextResponse.json(purchaseOrder);
    
  } catch (error) {
    console.error('Error creating purchase order:', error);
    return NextResponse.json({ error: 'Failed to create purchase order' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check permissions (ADMIN and MANAGER can update purchase orders)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const { id, items, ...updateData } = body;
    
    // Validate input
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    // Update order date if provided
    if (updateData.orderDate) {
      updateData.orderDate = new Date(updateData.orderDate);
    }
    
    // Update expected delivery date if provided
    if (updateData.expectedDeliveryDate) {
      updateData.expectedDeliveryDate = new Date(updateData.expectedDeliveryDate);
    }
    
    // Update purchase order
    const purchaseOrder = await db.purchaseOrder.update({
      where: { id },
      data: updateData,
      include: {
        supplier: {
          select: {
            companyName: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });
    
    // Update items if provided
    if (items && Array.isArray(items)) {
      // Delete existing items
      await db.purchaseOrderItem.deleteMany({
        where: { purchaseOrderId: id },
      });
      
      // Create new items
      const orderItems = items.map((item: any) => ({
        purchaseOrderId: id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate || 0,
        taxAmount: item.unitPrice * item.quantity * (item.taxRate || 0) / 100,
        totalPrice: (item.unitPrice * item.quantity) + (item.unitPrice * item.quantity * (item.taxRate || 0) / 100),
        receivedQuantity: item.receivedQuantity || 0,
      }));
      
      await db.purchaseOrderItem.createMany({
        data: orderItems,
      });
    }
    
    return NextResponse.json(purchaseOrder);
    
  } catch (error) {
    console.error('Error updating purchase order:', error);
    return NextResponse.json({ error: 'Failed to update purchase order' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can delete purchase orders
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const { id } = body;
    
    // Validate input
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    // Delete purchase order (this will cascade delete items)
    await db.purchaseOrder.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    return NextResponse.json({ error: 'Failed to delete purchase order' }, { status: 500 });
  }
}