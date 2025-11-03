'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface CustomSession {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    id?: string
  }
  expires: string
}

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'ADMIN' | 'MANAGER' | 'STAFF'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string }
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    if (requiredRole) {
      const roleHierarchy = {
        'STAFF': 1,
        'MANAGER': 2,
        'ADMIN': 3
      }
      
      const userRole = session.user?.role || 'STAFF'
      const userRoleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
      const requiredRoleLevel = roleHierarchy[requiredRole] || 0
      
      if (userRoleLevel < requiredRoleLevel) {
        router.push('/unauthorized')
        return
      }
    }
  }, [session, status, router, requiredRole])

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-gray-400 border-t-transparent" />
      </div>
    )
  }

  // If no session, don't render anything (redirect will happen in useEffect)
  if (!session) {
    return null
  }

  // Check role permissions
  if (requiredRole) {
    const roleHierarchy = {
      'STAFF': 1,
      'MANAGER': 2,
      'ADMIN': 3
    }
    
    const userRole = session.user?.role || 'STAFF'
    const userRoleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0
    
    if (userRoleLevel < requiredRoleLevel) {
      return null
    }
  }

  // If we get here, the user is authenticated and has the required permissions
  return <>{children}</>
}