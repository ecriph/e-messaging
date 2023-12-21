import { UserTokenStatus } from '@/shared/users/user-token/user-token.dto';
import { PrismaClientService } from '../database/prisma-client.service';
import { UserRole } from '@prisma/client';
export declare class JwtService {
    private readonly prisma;
    constructor(prisma: PrismaClientService);
    verifyToken(authToken: string): Promise<UserTokenStatus>;
    signToken({ id, role, duration, }: {
        id: string;
        role: UserRole;
        duration: string;
    }): Promise<{
        success: boolean;
        token: string;
    }>;
}
