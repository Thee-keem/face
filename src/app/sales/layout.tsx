import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole="MANAGER">
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  )
}