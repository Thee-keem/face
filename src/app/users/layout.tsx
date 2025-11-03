import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  )
}