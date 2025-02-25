import request from 'supertest';
import { app } from '../app.js';
import prisma from '../config/db.js';
import jwt from 'jsonwebtoken';

let adminToken;
let testProductId;

beforeAll(async () => {
  // Clear test database
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'hashedpassword',
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  adminToken = jwt.sign(
    { id: adminUser.id, email: adminUser.email, role: adminUser.role },
    process.env.JWT_SECRET
  );
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Product Endpoints', () => {
  describe('POST /api/products', () => {
    it('should create a new product when admin', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Test Product')
        .field('description', 'Test Description')
        .field('price', '99.99')
        .field('category', 'Test Category')
        .field('stock', '100')
        .attach('image', 'src/tests/fixtures/test-image.jpg');

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Product');
      testProductId = res.body.id;
    });

    it('should not create product without auth', async () => {
      const res = await request(app)
        .post('/api/products')
        .field('name', 'Test Product')
        .field('price', '99.99');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update product when admin', async () => {
      const res = await request(app)
        .put(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Product',
          price: 199.99
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Product');
      expect(res.body).toHaveProperty('price', 199.99);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete product when admin', async () => {
      const res = await request(app)
        .delete(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(204);
    });
  });
});
