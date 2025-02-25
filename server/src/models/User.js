import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class User {
  static async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async create(data) {
    return prisma.user.create({ data });
  }

  static async findById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  static async update(id, data) {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  static async delete(id) {
    return prisma.user.delete({ where: { id } });
  }
}
