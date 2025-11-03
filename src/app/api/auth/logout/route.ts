import { NextRequest } from 'next/server'
import { BoltAuth } from '@/lib/boltAuth'

export async function POST(req: NextRequest) {
  try {
    // Clear user context
    await BoltAuth.setUserContext('', '')
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to logout' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}