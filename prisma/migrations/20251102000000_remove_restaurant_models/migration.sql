-- Remove restaurant/service-specific features
-- Drop foreign key constraints first
ALTER TABLE "sales" DROP CONSTRAINT IF EXISTS "sales_tableId_fkey";
ALTER TABLE "sales" DROP CONSTRAINT IF EXISTS "sales_serviceTypeId_fkey";

-- Remove columns from Sale model
ALTER TABLE "sales" DROP COLUMN IF EXISTS "tableId";
ALTER TABLE "sales" DROP COLUMN IF EXISTS "serviceTypeId";

-- Drop tables
DROP TABLE IF EXISTS "tables";
DROP TABLE IF EXISTS "modifiers";
DROP TABLE IF EXISTS "types_of_service";

-- Drop enum
DROP TYPE IF EXISTS "ServiceType";