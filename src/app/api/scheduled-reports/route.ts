import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ReportFrequency } from '@prisma/client';

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
    
    // Only ADMIN users can access scheduled reports
    if (session.user.role !== 'ADMIN') {
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
    
    // Get scheduled reports
    const scheduledReports = await db.scheduledReport.findMany({
      where,
      include: {
        histories: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Get last 5 histories
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(scheduledReports);
    
  } catch (error) {
    console.error('Error fetching scheduled reports:', error);
    return NextResponse.json({ error: 'Failed to fetch scheduled reports' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can create scheduled reports
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const { name, reportType, frequency, cronExpression, isActive = true } = body;
    
    // Validate input
    if (!name || !reportType || !frequency) {
      return NextResponse.json({ error: 'Name, reportType, and frequency are required' }, { status: 400 });
    }
    
    // Validate frequency
    if (!Object.values(ReportFrequency).includes(frequency)) {
      return NextResponse.json({ error: 'Invalid frequency' }, { status: 400 });
    }
    
    // Create scheduled report
    const scheduledReport = await db.scheduledReport.create({
      data: {
        name,
        reportType,
        frequency,
        cronExpression,
        isActive,
      },
    });
    
    return NextResponse.json(scheduledReport);
    
  } catch (error) {
    console.error('Error creating scheduled report:', error);
    return NextResponse.json({ error: 'Failed to create scheduled report' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can update scheduled reports
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
    
    // Update scheduled report
    const scheduledReport = await db.scheduledReport.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(scheduledReport);
    
  } catch (error) {
    console.error('Error updating scheduled report:', error);
    return NextResponse.json({ error: 'Failed to update scheduled report' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can delete scheduled reports
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
    
    // Delete scheduled report
    await db.scheduledReport.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting scheduled report:', error);
    return NextResponse.json({ error: 'Failed to delete scheduled report' }, { status: 500 });
  }
}