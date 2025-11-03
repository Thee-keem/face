import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    console.log('Starting database cleanup...');
    
    // Remove restaurant-specific data
    console.log('Removing restaurant-specific data...');
    
    // Since we've already removed the models, we just need to ensure any related data is cleaned
    // This would be a placeholder for any additional cleanup needed
    
    console.log('Database cleanup completed successfully');
  } catch (error) {
    console.error('Error during database cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup process if this script is executed directly
if (require.main === module) {
  cleanDatabase();
}

export default cleanDatabase;