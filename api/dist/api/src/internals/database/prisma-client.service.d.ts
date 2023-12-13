import { PrismaClient } from '@prisma/client';
export declare class PrismaClientService {
    private prismaClient;
    constructor();
    getClient(): PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
