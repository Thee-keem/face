/*
  Warnings:

  - You are about to drop the column `paidBy` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `purchase_orders` table. All the data in the column will be lost.
  - You are about to drop the column `adjustedBy` on the `stock_adjustments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `sales_representatives` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `purchase_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adjustedById` to the `stock_adjustments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_paidBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."purchase_orders" DROP CONSTRAINT "purchase_orders_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."stock_adjustments" DROP CONSTRAINT "stock_adjustments_adjustedBy_fkey";

-- DropIndex
DROP INDEX "public"."payments_transactionId_idx";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paidBy",
DROP COLUMN "transactionId",
ADD COLUMN     "paidById" TEXT,
ADD COLUMN     "purchaseOrderId" TEXT,
ADD COLUMN     "saleId" TEXT;

-- AlterTable
ALTER TABLE "purchase_orders" DROP COLUMN "createdBy",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "stock_adjustments" DROP COLUMN "adjustedBy",
ADD COLUMN     "adjustedById" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "payments_saleId_idx" ON "payments"("saleId");

-- CreateIndex
CREATE INDEX "payments_purchaseOrderId_idx" ON "payments"("purchaseOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "sales_representatives_userId_key" ON "sales_representatives"("userId");

-- CreateIndex
CREATE INDEX "suppliers_email_idx" ON "suppliers"("email");

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_adjustments" ADD CONSTRAINT "stock_adjustments_adjustedById_fkey" FOREIGN KEY ("adjustedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_paidById_fkey" FOREIGN KEY ("paidById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "purchase_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
