-- CreateEnum for Currency
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'GBP', 'CAD', 'KSH', 'ZAR');

-- CreateEnum for CustomerGroupRuleType
CREATE TYPE "CustomerGroupRuleType" AS ENUM ('SPENDING_THRESHOLD', 'PURCHASE_FREQUENCY', 'LOCATION');

-- CreateEnum for WarrantyType
CREATE TYPE "WarrantyType" AS ENUM ('MANUFACTURER', 'EXTENDED', 'LIFETIME');

-- CreateEnum for ServiceType
CREATE TYPE "ServiceType" AS ENUM ('DINE_IN', 'TAKEAWAY', 'DELIVERY');

-- CreateEnum for ReportFrequency
CREATE TYPE "ReportFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum for ReportStatus
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable for Supplier
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "website" TEXT,
    "paymentTerms" TEXT,
    "preferredCurrency" "Currency" NOT NULL DEFAULT 'USD',
    "taxId" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Customer
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "preferredCurrency" "Currency" NOT NULL DEFAULT 'USD',
    "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastPurchaseDate" TIMESTAMP(3),
    "purchaseCount" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "groupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable for CustomerGroup
CREATE TABLE "customer_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable for CustomerGroupRule
CREATE TABLE "customer_group_rules" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "ruleType" "CustomerGroupRuleType" NOT NULL,
    "value" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_group_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Unit
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Brand
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "website" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Warranty
CREATE TABLE "warranties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL, -- in days
    "durationUnit" TEXT NOT NULL DEFAULT 'days', -- days, months, years
    "warrantyType" "WarrantyType" NOT NULL DEFAULT 'MANUFACTURER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warranties_pkey" PRIMARY KEY ("id")
);

-- CreateTable for BusinessLocation
CREATE TABLE "business_locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "baseCurrency" "Currency" NOT NULL DEFAULT 'USD',
    "localCurrency" "Currency" NOT NULL DEFAULT 'USD',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable for TaxRate
CREATE TABLE "tax_rates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "locationId" TEXT,
    "currency" "Currency",
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Table
CREATE TABLE "tables" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 4,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Modifier
CREATE TABLE "modifiers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modifiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable for TypeOfService
CREATE TABLE "types_of_service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "serviceType" "ServiceType" NOT NULL DEFAULT 'DINE_IN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "types_of_service_pkey" PRIMARY KEY ("id")
);

-- CreateTable for ReceiptPrinter
CREATE TABLE "receipt_printers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "connectionType" TEXT NOT NULL, -- USB, Network, Bluetooth
    "ipAddress" TEXT,
    "port" TEXT,
    "paperWidth" INTEGER NOT NULL DEFAULT 80, -- 58mm, 80mm
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receipt_printers_pkey" PRIMARY KEY ("id")
);

-- CreateTable for BarcodeSettings
CREATE TABLE "barcode_settings" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "barcodeType" TEXT NOT NULL DEFAULT 'CODE128', -- CODE128, CODE39, EAN13, etc.
    "width" INTEGER NOT NULL DEFAULT 2,
    "height" INTEGER NOT NULL DEFAULT 50,
    "displayValue" BOOLEAN NOT NULL DEFAULT true,
    "fontSize" INTEGER NOT NULL DEFAULT 12,
    "margin" INTEGER NOT NULL DEFAULT 10,
    "showCurrency" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barcode_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable for SalesRepresentative
CREATE TABLE "sales_representatives" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employeeId" TEXT,
    "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_representatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable for ProductLabel
CREATE TABLE "product_labels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productId" TEXT,
    "template" TEXT NOT NULL, -- JSON template for label design
    "width" INTEGER NOT NULL DEFAULT 60,
    "height" INTEGER NOT NULL DEFAULT 40,
    "unit" TEXT NOT NULL DEFAULT 'mm',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable for SellingPriceGroup
CREATE TABLE "selling_price_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "selling_price_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable for SellingPriceGroupPrice
CREATE TABLE "selling_price_group_prices" (
    "id" TEXT NOT NULL,
    "priceGroupId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "selling_price_group_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable for StockAdjustment
CREATE TABLE "stock_adjustments" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "type" TEXT NOT NULL, -- ADD, REMOVE, DAMAGE, EXPIRY
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "reference" TEXT,
    "adjustedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable for PurchaseOrder
CREATE TABLE "purchase_orders" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "reference" TEXT,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedDeliveryDate" TIMESTAMP(3),
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, RECEIVED, CANCELLED
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable for PurchaseOrderItem
CREATE TABLE "purchase_order_items" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "receivedQuantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Payment
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL, -- SALE, PURCHASE
    "transactionId" TEXT NOT NULL, -- saleId or purchaseOrderId
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "paidBy" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable for ScheduledReport
CREATE TABLE "scheduled_reports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reportType" TEXT NOT NULL, -- profit_loss, sales, inventory, etc.
    "frequency" "ReportFrequency" NOT NULL,
    "cronExpression" TEXT,
    "nextRunAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable for ReportScheduleHistory
CREATE TABLE "report_schedule_histories" (
    "id" TEXT NOT NULL,
    "scheduledReportId" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filePath" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_schedule_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable for EmailTemplate
CREATE TABLE "email_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable for CurrencyRate
CREATE TABLE "currency_rates" (
    "id" TEXT NOT NULL,
    "fromCurrency" "Currency" NOT NULL,
    "toCurrency" "Currency" NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "currency_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable for ProductPrice
CREATE TABLE "product_prices" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_prices_pkey" PRIMARY KEY ("id")
);

-- Add columns to existing tables
-- Extend Sale model
ALTER TABLE "sales" 
ADD COLUMN "customerCurrency" "Currency" NOT NULL DEFAULT 'USD',
ADD COLUMN "reference" TEXT,
ADD COLUMN "locationId" TEXT,
ADD COLUMN "serviceTypeId" TEXT,
ADD COLUMN "tableId" TEXT;

-- Add columns to Product model
ALTER TABLE "products" 
ADD COLUMN "unitId" TEXT,
ADD COLUMN "brandId" TEXT,
ADD COLUMN "warrantyId" TEXT,
ADD COLUMN "sellingPriceGroupId" TEXT;

-- Add columns to ProductVariant model
ALTER TABLE "product_variants" 
ADD COLUMN "unitId" TEXT;

-- Add columns to Expense model
ALTER TABLE "expenses" 
ADD COLUMN "currency" "Currency" NOT NULL DEFAULT 'USD',
ADD COLUMN "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN "locationId" TEXT;

-- CreateIndexes
CREATE UNIQUE INDEX "suppliers_email_key" ON "suppliers"("email");
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");
CREATE UNIQUE INDEX "customer_groups_name_key" ON "customer_groups"("name");
CREATE UNIQUE INDEX "units_name_key" ON "units"("name");
CREATE UNIQUE INDEX "units_symbol_key" ON "units"("symbol");
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");
CREATE UNIQUE INDEX "business_locations_code_key" ON "business_locations"("code");
CREATE UNIQUE INDEX "purchase_orders_orderNumber_key" ON "purchase_orders"("orderNumber");
CREATE INDEX "suppliers_companyName_idx" ON "suppliers"("companyName");
CREATE INDEX "customers_name_idx" ON "customers"("name");
CREATE INDEX "customers_email_idx" ON "customers"("email");
CREATE INDEX "products_name_idx" ON "products"("name");
CREATE INDEX "sales_customerId_idx" ON "sales"("customerId");
CREATE INDEX "sales_locationId_idx" ON "sales"("locationId");
CREATE INDEX "sales_createdAt_idx" ON "sales"("createdAt");
CREATE INDEX "purchase_orders_supplierId_idx" ON "purchase_orders"("supplierId");
CREATE INDEX "purchase_orders_orderDate_idx" ON "purchase_orders"("orderDate");
CREATE INDEX "payments_transactionId_idx" ON "payments"("transactionId");
CREATE INDEX "payments_paidAt_idx" ON "payments"("paidAt");
CREATE INDEX "currency_rates_fromCurrency_toCurrency_date_idx" ON "currency_rates"("fromCurrency", "toCurrency", "date");

-- AddForeignKeys
ALTER TABLE "customers" ADD CONSTRAINT "customers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "customer_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "customer_group_rules" ADD CONSTRAINT "customer_group_rules_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "customer_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tables" ADD CONSTRAINT "tables_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "business_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "receipt_printers" ADD CONSTRAINT "receipt_printers_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "business_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "barcode_settings" ADD CONSTRAINT "barcode_settings_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "business_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sales_representatives" ADD CONSTRAINT "sales_representatives_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "product_labels" ADD CONSTRAINT "product_labels_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "selling_price_group_prices" ADD CONSTRAINT "selling_price_group_prices_priceGroupId_fkey" FOREIGN KEY ("priceGroupId") REFERENCES "selling_price_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "selling_price_group_prices" ADD CONSTRAINT "selling_price_group_prices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "business_locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_adjustedBy_fkey" FOREIGN KEY ("adjustedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_paidBy_fkey" FOREIGN KEY ("paidBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "report_schedule_histories" ADD CONSTRAINT "report_schedule_histories_scheduledReportId_fkey" FOREIGN KEY ("scheduledReportId") REFERENCES "scheduled_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sales" ADD CONSTRAINT "sales_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "business_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "sales" ADD CONSTRAINT "sales_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "types_of_service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "sales" ADD CONSTRAINT "sales_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_warrantyId_fkey" FOREIGN KEY ("warrantyId") REFERENCES "warranties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_sellingPriceGroupId_fkey" FOREIGN KEY ("sellingPriceGroupId") REFERENCES "selling_price_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "business_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "tax_rates" ADD CONSTRAINT "tax_rates_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "business_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;