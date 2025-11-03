import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    // Test database connection
    const { db } = await import('@/lib/db')
    await db.$queryRaw`SELECT 1`
    
    // Test authentication system
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      auth: session ? 'authenticated' : 'unauthenticated'
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}