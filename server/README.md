# Real-Time E-commerce Catalog

A modern e-commerce product catalog with real-time updates using Express.js, WebSocket, and PostgreSQL.

## Features

- User Authentication with JWT
- Role-based Access Control (Admin/User)
- Real-time Product Catalog Updates
- Image Upload with Cloudinary
- WebSocket Integration for Live Updates
- PostgreSQL Database with Prisma ORM
- Input Validation and Sanitization
- Rate Limiting
- Comprehensive Error Handling
- Winston Logging

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Cloudinary Account

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

## Project Structure

```
src/
├── controllers/        # Business logic
│   ├── authController.js
│   ├── productController.js
│   └── socketController.js
├── models/            # Database schemas
│   ├── User.js
│   ├── Product.js
│   └── index.js
├── routes/            # API routes
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── socketRoutes.js
├── middleware/        # Middleware functions
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── corsMiddleware.js
├── utils/            # Utility functions
│   ├── cloudinary.js
│   ├── validators.js
│   ├── constants.js
│   └── logger.js
├── config/           # Configuration files
│   ├── db.js
│   ├── env.js
│   └── socket.js
├── app.js           # Express app setup
└── server.js        # Server entry point
```

## Running the Application

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Products
- GET `/api/products` - Get all products
- POST `/api/products` - Create a product (Admin only)
- PUT `/api/products/:id` - Update a product (Admin only)
- DELETE `/api/products/:id` - Delete a product (Admin only)

## WebSocket Events

- `filter-products` - Filter products in real-time
- `filtered-products` - Receive filtered products
- `product-updated` - Product update notification

## Security

- JWT for authentication
- bcrypt for password hashing
- Input validation and sanitization
- CORS protection
- Rate limiting
- Secure session handling

## Testing

Run tests:
```bash
npm test
```
