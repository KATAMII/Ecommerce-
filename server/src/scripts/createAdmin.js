import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const adminData = {
      name: 'Admi',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN'
    };

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const admin = await prisma.user.create({
      data: adminData
    });

    console.log('Admin user created successfully:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
