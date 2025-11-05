import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="STAFF">
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}