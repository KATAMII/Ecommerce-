import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class Product {
  static async findAll(filters = {}) {
    const { category, minPrice, maxPrice, search } = filters;
    
    const where = {
      AND: [
        category ? { category } : {},
        {
          price: {
            gte: minPrice || 0,
            lte: maxPrice || Number.MAX_SAFE_INTEGER
          }
        },
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : {}
      ]
    };

    return prisma.product.findMany({ where });
  }

  static async create(data) {
    return prisma.product.create({ data });
  }

  static async update(id, data) {
    return prisma.product.update({
      where: { id },
      data
    });
  }

  static async delete(id) {
    return prisma.product.delete({ where: { id } });
  }

  static async findById(id) {
    return prisma.product.findUnique({ where: { id } });
  }
}
