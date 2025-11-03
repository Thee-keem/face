import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    
    // Check permissions (ADMIN, MANAGER, and STAFF can view stock adjustments)
    if (!['ADMIN', 'MANAGER', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const productId = searchParams.get('productId') || '';
    const locationId = searchParams.get('locationId') || '';
    const type = searchParams.get('type') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build query conditions
    const where: any = {};
    
    if (productId) {
      where.productId = productId;
    }
    
    if (locationId) {
      where.locationId = locationId;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }
    
    // Get stock adjustments
    const [adjustments, total] = await Promise.all([
      db.stockAdjustment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
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
      }),
      db.stockAdjustment.count({ where }),
    ]);
    
    return NextResponse.json({
      adjustments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Error fetching stock adjustments:', error);
    return NextResponse.json({ error: 'Failed to fetch stock adjustments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check permissions (ADMIN, MANAGER, and STAFF can create stock adjustments)
    if (!['ADMIN', 'MANAGER', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const {
      productId,
      locationId,
      type,
      quantity,
      reason,
      reference,
    } = body;
    
    // Validate input
    if (!productId || !locationId || !type || !quantity) {
      return NextResponse.json({ error: 'Product ID, location ID, type, and quantity are required' }, { status: 400 });
    }
    
    // Validate adjustment type
    const validTypes = ['ADD', 'REMOVE', 'DAMAGE', 'EXPIRY'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid adjustment type' }, { status: 400 });
    }
    
    // Get current product stock
    const product = await db.product.findUnique({
      where: { id: productId },
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Calculate new stock level
    let newStock = product.stock;
    if (type === 'ADD') {
      newStock += quantity;
    } else {
      newStock -= quantity;
    }
    
    // Ensure stock doesn't go negative
    if (newStock < 0) {
      return NextResponse.json({ error: 'Adjustment would result in negative stock' }, { status: 400 });
    }
    
    // Create stock adjustment
    const adjustment = await db.stockAdjustment.create({
      data: {
        productId,
        locationId,
        type,
        quantity,
        reason,
        reference,
        adjustedById: session.user.id,
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
    
    // Update product stock
    await db.product.update({
      where: { id: productId },
      data: { stock: newStock },
    });
    
    return NextResponse.json(adjustment);
    
  } catch (error) {
    console.error('Error creating stock adjustment:', error);
    return NextResponse.json({ error: 'Failed to create stock adjustment' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can update stock adjustments
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const { id, ...updateData } = body;
    
    // Validate input
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    // Update stock adjustment
    const adjustment = await db.stockAdjustment.update({
      where: { id },
      data: updateData,
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
    
    return NextResponse.json(adjustment);
    
  } catch (error) {
    console.error('Error updating stock adjustment:', error);
    return NextResponse.json({ error: 'Failed to update stock adjustment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can delete stock adjustments
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
    
    // Delete stock adjustment
    await db.stockAdjustment.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting stock adjustment:', error);
    return NextResponse.json({ error: 'Failed to delete stock adjustment' }, { status: 500 });
  }
}