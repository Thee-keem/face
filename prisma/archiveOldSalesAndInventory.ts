import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function archiveOldSalesAndInventory() {
  try {
    console.log('Starting archiving process...');
    
    // Archive sales older than 2 years
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    
    // Get old sales
    const oldSales = await prisma.sale.findMany({
      where: {
        createdAt: {
          lt: twoYearsAgo
        }
      }
    });
    
    console.log(`Found ${oldSales.length} sales older than 2 years`);
    
    // Move old sales to audit table
    for (const sale of oldSales) {
      // Create audit record
      await prisma.$executeRaw`
        INSERT INTO "sales_audit" 
        (id, "invoiceNo", "totalAmount", discount, tax, "finalAmount", "paymentMethod", status, "customerId", "userId", "customerCurrency", reference, "locationId", notes, "createdAt", "updatedAt", "archivedAt", "archiveReason")
        VALUES 
        (${sale.id}, ${sale.invoiceNo}, ${sale.totalAmount}, ${sale.discount}, ${sale.tax}, ${sale.finalAmount}, ${sale.paymentMethod}, ${sale.status}, ${sale.customerId}, ${sale.userId}, ${sale.customerCurrency}, ${sale.reference}, ${sale.locationId}, ${sale.notes}, ${sale.createdAt}, ${sale.updatedAt}, NOW(), 'OLD_SALE')
      `;
    }
    
    // Delete old sales from main table
    if (oldSales.length > 0) {
      await prisma.sale.deleteMany({
        where: {
          createdAt: {
            lt: twoYearsAgo
          }
        }
      });
      
      console.log(`Archived and deleted ${oldSales.length} old sales`);
    }
    
    // For inventory, we would typically archive expired items
    // This is a placeholder for where you might have expiration dates on products
    console.log('Inventory archiving would be implemented based on specific business rules');
    
    console.log('Archiving process completed successfully');
  } catch (error) {
    console.error('Error during archiving process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the archiving process if this script is executed directly
if (require.main === module) {
  archiveOldSalesAndInventory();
}

export default archiveOldSalesAndInventory;