-- Create audit table for archived sales
CREATE TABLE IF NOT EXISTS "sales_audit" (
    "id" TEXT NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalAmount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "customerId" TEXT,
    "userId" TEXT NOT NULL,
    "customerCurrency" TEXT NOT NULL DEFAULT 'USD',
    "reference" TEXT,
    "locationId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archiveReason" TEXT,
    
    CONSTRAINT "sales_audit_pkey" PRIMARY KEY ("id")
);

-- Create audit table for expired inventory
CREATE TABLE IF NOT EXISTS "inventory_audit" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "inventory_audit_pkey" PRIMARY KEY ("id")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "sales_audit_created_at_idx" ON "sales_audit"("createdAt");
CREATE INDEX IF NOT EXISTS "sales_audit_archived_at_idx" ON "sales_audit"("archivedAt");
CREATE INDEX IF NOT EXISTS "inventory_audit_archived_at_idx" ON "inventory_audit"("archivedAt");
CREATE INDEX IF NOT EXISTS "inventory_audit_expired_at_idx" ON "inventory_audit"("expiredAt");

-- Move sales older than 2 years to audit table
-- Note: This is a sample query. In practice, this would be run as a scheduled job
-- INSERT INTO "sales_audit" 
-- SELECT *, CURRENT_TIMESTAMP as "archivedAt", 'OLD_SALE' as "archiveReason"
-- FROM "sales" 
-- WHERE "createdAt" < NOW() - INTERVAL '2 years';

-- Remove old sales from main table
-- Note: This is a sample query. In practice, this would be run as a scheduled job
-- DELETE FROM "sales" 
-- WHERE "createdAt" < NOW() - INTERVAL '2 years';