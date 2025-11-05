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
    
    // Check permissions (all roles can view locations)
    if (!['ADMIN', 'MANAGER', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    
    // Build query conditions
    const where: any = {};
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    // Get business locations
    const locations = await db.businessLocation.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(locations);
    
  } catch (error) {
    console.error('Error fetching business locations:', error);
    return NextResponse.json({ error: 'Failed to fetch business locations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can create business locations
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const {
      name,
      code,
      address,
      city,
      state,
      postalCode,
      country,
      phone,
      email,
      baseCurrency,
      localCurrency,
      isActive = true,
    } = body;
    
    // Validate input
    if (!name || !code) {
      return NextResponse.json({ error: 'Name and code are required' }, { status: 400 });
    }
    
    // Validate currency
    if (baseCurrency && !Object.values(Currency).includes(baseCurrency)) {
      return NextResponse.json({ error: 'Invalid base currency' }, { status: 400 });
    }
    
    if (localCurrency && !Object.values(Currency).includes(localCurrency)) {
      return NextResponse.json({ error: 'Invalid local currency' }, { status: 400 });
    }
    
    // Validate that code is unique
    const existingLocation = await db.businessLocation.findUnique({
      where: { code },
    });
    
    if (existingLocation) {
      return NextResponse.json({ error: 'Business location with this code already exists' }, { status: 400 });
    }
    
    // Create business location
    const location = await db.businessLocation.create({
      data: {
        name,
        code,
        address,
        city,
        state,
        postalCode,
        country,
        phone,
        email,
        baseCurrency: baseCurrency || Currency.USD,
        localCurrency: localCurrency || Currency.USD,
        isActive,
      },
    });
    
    return NextResponse.json(location);
    
  } catch (error) {
    console.error('Error creating business location:', error);
    return NextResponse.json({ error: 'Failed to create business location' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can update business locations
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
    
    // Validate currencies if provided
    if (updateData.baseCurrency && !Object.values(Currency).includes(updateData.baseCurrency)) {
      return NextResponse.json({ error: 'Invalid base currency' }, { status: 400 });
    }
    
    if (updateData.localCurrency && !Object.values(Currency).includes(updateData.localCurrency)) {
      return NextResponse.json({ error: 'Invalid local currency' }, { status: 400 });
    }
    
    // Update business location
    const location = await db.businessLocation.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(location);
    
  } catch (error) {
    console.error('Error updating business location:', error);
    return NextResponse.json({ error: 'Failed to update business location' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can delete business locations
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
    
    // Check if location has related data
    const relatedData = await db.sale.count({
      where: { locationId: id },
    });
    
    if (relatedData > 0) {
      return NextResponse.json({ error: 'Cannot delete location with related sales data' }, { status: 400 });
    }
    
    // Delete business location
    await db.businessLocation.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting business location:', error);
    return NextResponse.json({ error: 'Failed to delete business location' }, { status: 500 });
  }
}