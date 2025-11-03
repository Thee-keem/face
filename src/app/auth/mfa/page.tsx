'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function MFASetupPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'setup' | 'verify'>('setup')
  const [qrCode, setQrCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSetupMFA = async () => {
    setLoading(true)
    setError('')

    try {
      // In a real implementation, you would generate a QR code for TOTP
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate QR code generation
      setQrCode('https://placehold.co/200x200?text=QR+Code')
      setStep('verify')
    } catch (err) {
      setError('Failed to setup MFA')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setLoading(true)
    setError('')

    try {
      // In a real implementation, you would verify the TOTP code
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate successful verification
      setSuccess(true)
    } catch (err) {
      setError('Invalid code')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
              </div>
              <CardTitle className="text-center text-2xl">MFA Enabled</CardTitle>
              <CardDescription className="text-center">
                Two-factor authentication has been enabled on your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center">
                Your account is now more secure with two-factor authentication.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
            </div>
            <CardTitle className="text-center text-2xl">
              {step === 'setup' ? 'Setup Multi-Factor Authentication' : 'Verify Authentication'}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 'setup' 
                ? 'Scan the QR code with your authenticator app' 
                : 'Enter the code from your authenticator app'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {step === 'setup' ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-48 h-48 flex items-center justify-center">
                    {qrCode ? (
                      <img src={qrCode} alt="QR Code" className="w-40 h-40" />
                    ) : (
                      <span className="text-gray-500">QR Code</span>
                    )}
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500">
                  Scan this QR code with Google Authenticator, Authy, or another TOTP app
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="code">Authentication Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {step === 'setup' ? (
              <Button className="w-full" onClick={handleSetupMFA} disabled={loading}>
                {loading ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                ) : null}
                {loading ? 'Generating...' : 'Next'}
              </Button>
            ) : (
              <Button className="w-full" onClick={handleVerifyCode} disabled={loading}>
                {loading ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                ) : null}
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>
            )}
            <Button 
              variant="link" 
              className="w-full"
              onClick={() => router.push('/dashboard')}
            >
              Skip for now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}