import { UserRole } from '@prisma/client';
export declare class AuthContext {
    user: {
        id: string;
        role: UserRole;
    };
    constructor(params: {
        user: {
            id: string;
            role: UserRole;
        };
    });
}
