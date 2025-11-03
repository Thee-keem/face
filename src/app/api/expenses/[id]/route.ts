import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BoltAuth } from '@/lib/boltAuth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface SessionUser {
  id: string;
  role: string;
  name?: string;
  email?: string;
}

interface CustomSession {
  user: SessionUser;
  expires: string;
}

// GET /api/expenses/[id] - Get a specific expense
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get expense
    const expense = await db.expense.findUnique({
      where: {
        id: params.id
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
    
    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }
    
    // Check permissions (users can only view their own expenses, ADMIN and MANAGER can view all)
    if (expense.userId !== (session.user.id || '') && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    return NextResponse.json(expense)
  } catch (error) {
    console.error('Error fetching expense:', error)
    return NextResponse.json({ error: 'Failed to fetch expense' }, { status: 500 })
  }
}

// PUT /api/expenses/[id] - Update an expense
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get request body
    const body = await request.json()
    
    // Check if expense exists
    const existingExpense = await db.expense.findUnique({
      where: {
        id: params.id
      }
    })
    
    if (!existingExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }
    
    // Check permissions (users can only update their own expenses, ADMIN and MANAGER can update all)
    if (existingExpense.userId !== (session.user.id || '') && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // Update expense
    const expense = await db.expense.update({
      where: {
        id: params.id
      },
      data: {
        title: body.title,
        description: body.description,
        amount: parseFloat(body.amount),
        category: body.category,
        date: new Date(body.date),
        receiptUrl: body.receiptUrl
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
    
    return NextResponse.json(expense)
  } catch (error) {
    console.error('Error updating expense:', error)
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 })
  }
}

// DELETE /api/expenses/[id] - Delete an expense
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Check if expense exists
    const existingExpense = await db.expense.findUnique({
      where: {
        id: params.id
      }
    })
    
    if (!existingExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }
    
    // Check permissions (users can only delete their own expenses, ADMIN and MANAGER can delete all)
    if (existingExpense.userId !== (session.user.id || '') && session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // Delete expense
    await db.expense.delete({
      where: {
        id: params.id
      }
    })
    
    return NextResponse.json({ message: 'Expense deleted successfully' })
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 })
  }
}