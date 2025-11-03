# Deployment Instructions

## Prerequisites

1. Node.js 18+  
2. Docker and Docker Compose  
3. PostgreSQL (via Docker)  
4. AWS Account (for cloud deployment)

## Local Development Setup

### Environment Variables
Create a `.env` file with:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/face_db
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Database Setup
1. Start the PostgreSQL database:
   ```bash
   docker-compose up -d
   ```

2. Wait for the database to initialize (this may take a minute or two).

3. Run the database migrations:
   ```bash
   npm run db:migrate-full
   ```

4. Seed the database with sample data:
   ```bash
   npm run db:seed
   ```

### Starting the Application
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

## Production Deployment (AWS)

### Prerequisites
1. AWS CLI configured with appropriate credentials
2. Elastic Beanstalk CLI installed
3. Docker installed for containerization

### Deployment Steps

#### 1. Prepare Environment
1. Create a production `.env.production` file with:
   ```env
   DATABASE_URL=your_production_database_url
   NEXTAUTH_SECRET=your_production_secret
   NEXTAUTH_URL=your_production_url
   ```

#### 2. Build the Application
```bash
npm run build
```

#### 3. Deploy to AWS Elastic Beanstalk
1. Initialize Elastic Beanstalk application:
   ```bash
   eb init
   ```

2. Create environment:
   ```bash
   eb create production
   ```

3. Deploy application:
   ```bash
   eb deploy
   ```

#### 4. Configure Environment Variables
Set the following environment variables in the AWS Elastic Beanstalk console:
- DATABASE_URL
- NEXTAUTH_SECRET
- NEXTAUTH_URL

### Alternative Deployment Options

#### Docker Deployment
1. Build the Docker image:
   ```bash
   docker build -t inventory-management-pro .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 inventory-management-pro
   ```

#### Manual Server Deployment
1. Upload the built application to your server
2. Install dependencies:
   ```bash
   npm install --production
   ```
3. Set environment variables
4. Start the application:
   ```bash
   npm start
   ```

## Database Management

### Migrations
When making changes to the database schema:

1. Create a new migration:
   ```bash
   npx prisma migrate dev --name migration_name
   ```

2. Apply migrations to production:
   ```bash
   npx prisma migrate deploy
   ```

### Seeding
To seed the database with initial data:
```bash
npm run db:seed
```

## Monitoring and Maintenance

### Health Checks
The application includes a health check endpoint at `/api/health` that returns the status of the application and its dependencies.

### Logging
Application logs are output to stdout/stderr and can be captured by your deployment platform's logging system.

### Backup Strategy
Regular database backups should be configured through your database provider or using custom scripts.

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - If port 3000 is in use, the application will automatically use the next available port
   - Check the console output for the actual port being used

2. **Database Connection Issues**
   - Verify the DATABASE_URL environment variable
   - Ensure the database is running and accessible
   - Check firewall settings if deploying to a remote database

3. **Authentication Errors**
   - Verify NEXTAUTH_SECRET and NEXTAUTH_URL environment variables
   - Ensure the secret is consistent across environments

### Support
For issues not covered in this document, please check the GitHub issues or contact the development team.