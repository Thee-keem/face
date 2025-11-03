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
    
    // Check permissions (ADMIN, MANAGER, and STAFF can view customers)
    if (!['ADMIN', 'MANAGER', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const groupId = searchParams.get('groupId') || '';
    const isActive = searchParams.get('isActive');
    
    // Build query conditions
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (groupId) {
      where.groupId = groupId;
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    // Get customers
    const [customers, total] = await Promise.all([
      db.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          group: {
            select: {
              name: true,
            },
          },
        },
      }),
      db.customer.count({ where }),
    ]);
    
    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check permissions (ADMIN and MANAGER can create customers)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
      dateOfBirth,
      preferredCurrency,
      notes,
      groupId,
      isActive = true,
    } = body;
    
    // Validate input
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    // Validate currency
    if (preferredCurrency && !Object.values(Currency).includes(preferredCurrency)) {
      return NextResponse.json({ error: 'Invalid currency' }, { status: 400 });
    }
    
    // Create customer
    const customer = await db.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        city,
        state,
        postalCode,
        country,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        preferredCurrency: preferredCurrency || Currency.USD,
        notes,
        groupId,
        isActive,
      },
    });
    
    return NextResponse.json(customer);
    
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check permissions (ADMIN and MANAGER can update customers)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const { id, ...updateData } = body;
    
    // Validate input
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    // Validate currency if provided
    if (updateData.preferredCurrency && !Object.values(Currency).includes(updateData.preferredCurrency)) {
      return NextResponse.json({ error: 'Invalid currency' }, { status: 400 });
    }
    
    // Update dateOfBirth if provided
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }
    
    // Update customer
    const customer = await db.customer.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(customer);
    
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can delete customers
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
    
    // Delete customer
    await db.customer.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}