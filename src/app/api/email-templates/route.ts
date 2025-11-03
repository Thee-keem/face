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
    
    // Only ADMIN users can access email templates
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
    
    // Get email templates
    const emailTemplates = await db.emailTemplate.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(emailTemplates);
    
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json({ error: 'Failed to fetch email templates' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can create email templates
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get request body
    const body = await request.json();
    const { name, subject, body: templateBody, isActive = true } = body;
    
    // Validate input
    if (!name || !subject || !templateBody) {
      return NextResponse.json({ error: 'Name, subject, and body are required' }, { status: 400 });
    }
    
    // Create email template
    const emailTemplate = await db.emailTemplate.create({
      data: {
        name,
        subject,
        body: templateBody,
        isActive,
      },
    });
    
    return NextResponse.json(emailTemplate);
    
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json({ error: 'Failed to create email template' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can update email templates
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
    
    // Update email template
    const emailTemplate = await db.emailTemplate.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(emailTemplate);
    
  } catch (error) {
    console.error('Error updating email template:', error);
    return NextResponse.json({ error: 'Failed to update email template' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only ADMIN users can delete email templates
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
    
    // Delete email template
    await db.emailTemplate.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting email template:', error);
    return NextResponse.json({ error: 'Failed to delete email template' }, { status: 500 });
  }
}