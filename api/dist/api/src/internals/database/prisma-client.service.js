"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClientService = void 0;
const client_1 = require("@prisma/client");
class PrismaClientService {
    constructor() {
        this.prismaClient = new client_1.PrismaClient();
    }
    getClient() {
        return this.prismaClient;
    }
}
exports.PrismaClientService = PrismaClientService;
//# sourceMappingURL=prisma-client.service.js.map