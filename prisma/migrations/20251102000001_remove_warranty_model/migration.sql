-- Remove Warranty model and related fields
-- Drop foreign key constraint first
ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_warrantyId_fkey";

-- Remove warrantyId column from products table
ALTER TABLE "products" DROP COLUMN IF EXISTS "warrantyId";

-- Drop Warranty table
DROP TABLE IF EXISTS "warranties";

-- Drop WarrantyType enum
DROP TYPE IF EXISTS "WarrantyType";