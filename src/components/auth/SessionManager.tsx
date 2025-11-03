'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

interface SessionUser {
  id: string;
  role: string;
  name?: string;
  email?: string;
}

// Define the setUserContext function inline to avoid importing server-side code
const setUserContext = (userId: string, userRole: string): void => {
  // In a real implementation, this would set the PostgreSQL session variables
  // for Row Level Security
  console.log(`Setting user context: ${userId}, role: ${userRole}`)
}

export function SessionManager() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      const user = session.user as SessionUser;
      // Set user context for Bolt Database RLS
      setUserContext(user.id, user.role)
    }
  }, [session])

  return null
}