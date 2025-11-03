import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database migration...');
  
  // Run the migration SQL file
  const fs = await import('fs');
  const path = await import('path');
  
  try {
    const migrationPath = path.join(__dirname, 'migrations', '20251031052800_extensions', 'migration.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the migration into individual statements
    const statements = migrationSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Executing ${statements.length} statements...`);
    
    for (const statement of statements) {
      try {
        await prisma.$executeRawUnsafe(statement);
        console.log('Statement executed successfully');
      } catch (error) {
        console.error('Error executing statement:', error);
        console.log('Statement:', statement.substring(0, 100) + '...');
      }
    }
    
    console.log('Database migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
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