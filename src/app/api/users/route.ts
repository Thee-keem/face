import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BoltAuth, getServerBoltAuth } from '@/lib/boltAuth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface SessionUser {
  id: string
  name?: string
  email?: string
  role?: string
}

interface CustomSession {
  user: SessionUser
  expires: string
}

// GET /api/users - Get all users
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN can view all users)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Get users
    const [users, total] = await Promise.all([
      db.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      db.user.count()
    ])
    
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN can create users)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get request body
    const body = await request.json()
    const { email, name, role, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Validate role
    if (role && !['ADMIN', 'MANAGER', 'STAFF'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Create user with ServerBoltAuth
    const serverBoltAuth = await getServerBoltAuth()
    if (!serverBoltAuth) {
      return NextResponse.json({ error: 'User creation not available' }, { status: 500 })
    }

    const user = await serverBoltAuth.createUser(
      email, 
      password, 
      name, 
      role as any || 'STAFF'
    )

    if (!user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Return created user (BoltUser doesn't include password)
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
