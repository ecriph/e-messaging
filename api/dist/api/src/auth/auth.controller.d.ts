import { UserLoginDTO, UserLoginResponseDTO } from '@/shared/users/user-login/user-login.dto';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';
import { JwtService } from 'src/internals/api/jwt.service';
import { UserRegisterDTO, UserRegisterResponseDTO } from '@/shared/users/user-register/user-register.dto';
import { UserAuthResponseDTO, UserAuthTokenDTO } from '@/shared/users/user-token/user-token.dto';
import { AuthContext } from './auth-context';
import { RegisterPushTokenDTO } from '@/shared/users/user-push-token/register-push-token.dto';
import { EventGateway } from 'src/event/event.gateway';
export declare class AuthController {
    private readonly prisma;
    private readonly jwtService;
    private readonly event;
    constructor(prisma: PrismaClientService, jwtService: JwtService, event: EventGateway);
    getSession(authContext: AuthContext): Promise<{
        user: {
            id: string;
        };
    }>;
    loginUser(userLogin: UserLoginDTO): Promise<UserLoginResponseDTO>;
    registerUser(userRegister: UserRegisterDTO): Promise<UserRegisterResponseDTO>;
    refreshToken(userAuthToken: UserAuthTokenDTO): Promise<UserAuthResponseDTO>;
    registerPushtoken(authContext: AuthContext, registerToken: RegisterPushTokenDTO): Promise<{
        id: string;
        userId: string;
        token: string;
    }>;
}
