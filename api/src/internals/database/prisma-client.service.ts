import { PrismaClient } from '@prisma/client';

export class PrismaClientService {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  getClient() {
    return this.prismaClient;
  }
}
