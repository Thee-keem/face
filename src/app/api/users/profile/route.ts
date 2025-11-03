import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BoltAuth } from '@/lib/boltAuth'
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

// PUT /api/users/profile - Update user profile
export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as CustomSession | null
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get request body
    const body = await request.json()
    const { name, email, currentPassword, newPassword } = body

    // Prepare update data
    const updateData: any = {}
    
    if (name) {
      updateData.name = name
    }
    
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await db.user.findFirst({
        where: {
          email,
          NOT: {
            id: session.user.id
          }
        }
      })
      
      if (existingUser) {
        return NextResponse.json({ error: 'Email is already taken' }, { status: 400 })
      }
      
      updateData.email = email
    }
    
    // Handle password update
    if (currentPassword && newPassword) {
      // Get current user to verify current password
      const currentUser = await db.user.findUnique({
        where: { id: session.user.id }
      })
      
      if (!currentUser || !currentUser.password) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      
      // Verify current password
      const isValid = await BoltAuth.verifyPassword(currentPassword, currentUser.password)
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }
      
      // Hash new password
      const hashedPassword = await BoltAuth.hashPassword(newPassword)
      updateData.password = hashedPassword
    }
    
    // Update user
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: updateData
    })
    
    // Return updated user data (without password)
    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role
    })
    
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}