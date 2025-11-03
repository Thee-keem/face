'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to view this page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="bg-red-100 border-2 border-dashed border-red-300 rounded-xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-muted-foreground">
              You don't have the necessary permissions to access this page. 
              Please contact your administrator if you believe this is an error.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}