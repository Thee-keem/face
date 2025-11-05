import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database migration...');
  
  // This script is kept for backward compatibility
  // For new projects, use `npx prisma migrate dev` instead
  console.log('This script is deprecated. Please use `npx prisma migrate dev` for migrations.');
  console.log('Running `npx prisma migrate dev` automatically...');
  
  // Instead of running raw SQL, we'll use Prisma's built-in migration system
  // This avoids the issue of trying to re-apply migrations that already exist
  try {
    // Run Prisma migrations using the CLI
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    const { stdout, stderr } = await execAsync('npx prisma migrate dev --skip-generate');
    console.log(stdout);
    if (stderr) {
      console.error('stderr:', stderr);
    }
    
    console.log('Database migration completed successfully using Prisma migrate!');
  } catch (error) {
    console.error('Migration failed:', error);
    console.log('Falling back to manual migration check...');
    
    // If Prisma CLI fails, we can add manual migration logic here if needed
    console.log('Manual migration logic would go here if needed.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });