# Database Setup Instructions

## Prerequisites

1. Docker and Docker Compose installed
2. Node.js and npm installed

## Setting up PostgreSQL with Docker

1. Start the PostgreSQL database:
   ```bash
   docker-compose up -d
   ```

2. Wait for the database to initialize (this may take a minute or two).

3. Run the database migrations:
   ```bash
   npm run db:migrate-full
   ```

## Manual PostgreSQL Setup (Alternative)

If you prefer to use a local PostgreSQL installation:

1. Install PostgreSQL on your system
2. Create a database named `face_db`
3. Update the DATABASE_URL in the `.env` file with your database credentials
4. Run the database migrations:
   ```bash
   npm run db:migrate-full
   ```

## Database Schema and Migrations

The database schema is defined in `prisma/schema.prisma`. When you make changes to this file, you need to create a migration:

```bash
npx prisma migrate dev --name your_migration_name
```

## Seeding the Database

The database can be seeded with sample data using:

```bash
npm run db:seed
```

## Row Level Security (RLS)

Row Level Security policies are automatically applied when using the docker-compose setup. These policies ensure that users can only access data they are authorized to see based on their role.

## Connection Details

- Host: localhost
- Port: 5432
- Database: face_db
- Username: postgres
- Password: password