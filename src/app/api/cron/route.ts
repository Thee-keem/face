import { NextResponse } from 'next/server'
import { checkLowStockAlerts, checkOverstockAlerts } from '@/lib/cron'
import { BoltAuth } from '@/lib/boltAuth'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST /api/cron - Trigger cron jobs manually
export async function POST(request: Request) {
  try {
    // Check authentication
    const session: any = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permissions (only ADMIN can trigger cron jobs)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Set user context for RLS
    await BoltAuth.setUserContext(session.user.id || '', session.user.role || '')

    // Get job type from request body
    const body = await request.json()
    const { job } = body

    let result
    switch (job) {
      case 'low-stock':
        result = await checkLowStockAlerts()
        break
      case 'overstock':
        result = await checkOverstockAlerts()
        break
      default:
        return NextResponse.json({ error: 'Invalid job type' }, { status: 400 })
    }

    return NextResponse.json({
      message: `Job ${job} completed successfully`,
      result
    })
  } catch (error) {
    console.error('Error running cron job:', error)
    return NextResponse.json({ error: 'Failed to run cron job' }, { status: 500 })
  }
}