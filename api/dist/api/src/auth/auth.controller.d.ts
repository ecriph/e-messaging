import { UserLoginDTO, UserLoginResponseDTO } from '@/shared/users/user-login/user-login.dto';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';
import { JwtService } from 'src/internals/api/jwt.service';
import { UserRegisterDTO, UserRegisterResponseDTO } from '@/shared/users/user-register/user-register.dto';
import { UserAuthResponseDTO, UserAuthTokenDTO } from '@/shared/users/user-token/user-token.dto';
import { AuthContext } from './auth-context';
import { RegisterPushTokenDTO } from '@/shared/users/user-push-token/register-push-token.dto';
export declare class AuthController {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaClientService, jwtService: JwtService);
    loginUser(userLogin: UserLoginDTO): Promise<UserLoginResponseDTO>;
    registerUser(userRegister: UserRegisterDTO): Promise<UserRegisterResponseDTO>;
    refreshToken(userAuthToken: UserAuthTokenDTO): Promise<UserAuthResponseDTO>;
    registerPushtoken(authContext: AuthContext, registerToken: RegisterPushTokenDTO): Promise<{
        id: string;
        userId: string;
        token: string;
    } | undefined>;
}
