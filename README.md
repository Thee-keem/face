# 🚀 Inventory Management Pro - Retail Management System

A modern, production-ready **Retail Management System** with **Point of Sale**, **Inventory Management**, **Multi-Currency Support**, and **Comprehensive Reporting** capabilities.

---

## ✨ Key Features

### 🛒 Point of Sale System
- Barcode scanning and product search  
- Shopping cart management  
- Multi-currency payment processing (Cash, Credit Card, Debit Card, Mobile Payment, Bank Transfer)  
- Receipt generation with PDF export  
- Customer management during checkout  
- Tax calculation and discount application  

### 📦 Product Management
- Product catalog with categories, brands, and units  
- Real-time stock level tracking  
- Inventory alerts for low stock, out of stock, and overstock  
- Stock adjustment functionality  
- Multi-location support  
- Barcode generation and printing  
- Product variants support (sizes, colors, etc.)  

### 💰 Multi-Currency Support
- Support for USD, EUR, GBP, CAD, KSH, and ZAR  
- Currency conversion with exchange rates  
- Multi-currency pricing for products  
- Currency-aware reporting and analytics  
- Base currency and local currency separation per location  

### 📊 Sales Reporting and Analytics
- Sales performance tracking  
- Profit and loss reports  
- Inventory analysis  
- Customer and supplier reports  
- Scheduled report generation and email delivery  
- 20+ detailed report types  
- Data visualization with charts and graphs  

### 👥 Customer Management
- Customer database with contact information  
- Customer groups with dynamic rules  
- Purchase history tracking  
- Loyalty points system  

### 💸 Expense Tracking
- Expense categorization  
- Receipt attachment support  
- Expense reporting  

### 🛒 Purchase Management
- Supplier database  
- Purchase order creation and tracking  
- Purchase requisitions  
- Purchase returns  

### 🏢 Multi-Location Support
- Business location management  
- Location-specific currency settings  
- Location-based reporting  

---

## 🛠 Technology Stack

### 🎯 Core Framework
- ⚡ **Next.js 15** – React framework with App Router  
- 📘 **TypeScript 5** – Type-safe JavaScript  
- 🎨 **Tailwind CSS 4** – Utility-first CSS framework  

### 🧩 UI Components & Styling
- 🧩 **shadcn/ui** – Accessible, high-quality UI components  
- 🎯 **Lucide React** – Beautiful, consistent icons  
- 🌈 **Framer Motion** – Smooth animations  

### 📋 Forms & Validation
- 🎣 **React Hook Form** – Performant forms  
- ✅ **Zod** – Type-safe schema validation  

### 🔄 State Management & Data Fetching
- 🐻 **Zustand** – Lightweight state management  
- 🔄 **TanStack Query** – Data synchronization  
- 🌐 **Axios** – Promise-based HTTP client  

### 🗄️ Database & Backend
- 🗄️ **Prisma** – Modern ORM for Node.js and TypeScript  
- 🔐 **NextAuth.js** – Authentication and session management  
- 📡 **Socket.IO** – Real-time communication  

### 🎨 Advanced UI Features
- 📊 **TanStack Table** – Data grids and tables  
- 🖱️ **DND Kit** – Drag and drop support  
- 📈 **Recharts** – Data visualization  
- 🖼️ **Sharp** – High-performance image processing  

---

## 🏗 Local Development Setup

### Prerequisites
- Node.js 18+  
- Docker and Docker Compose  
- PostgreSQL (via Docker)

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

---

## 📡 API Endpoints

Refer to [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API endpoint documentation.

---

## ☁️ Deployment

Refer to [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions for various environments including AWS.

---

## 🔐 Authentication

The application uses NextAuth.js for authentication with JWT tokens and role-based access control (Admin, Manager, Staff).

---

## 🧪 Testing

Run the test suite with:
```bash
npm test
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.