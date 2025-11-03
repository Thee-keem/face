'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-gray-400 border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const user = session.user as SessionUser;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Profile</CardTitle>
            <CardDescription>
              View and manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Name</label>
              <div className="rounded-md border p-3">
                {user.name || 'Not provided'}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Email</label>
              <div className="rounded-md border p-3">
                {user.email}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Role</label>
              <div className="rounded-md border p-3">
                {user.role}
              </div>
            </div>
            
            <div className="pt-4">
              <LogoutButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}