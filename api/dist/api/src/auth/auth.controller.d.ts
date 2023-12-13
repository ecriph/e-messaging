import { UserLoginDTO, UserLoginResponseDTO } from '@/shared/users/user-login/user-login.dto';
import { PrismaClientService } from 'src/internals/database/prisma-client.service';
import { JwtService } from 'src/internals/api/jwt.service';
import { UserRegisterDTO, UserRegisterResponseDTO } from '@/shared/users/user-register/user-register.dto';
import { UserAuthTokenDTO } from '@/shared/users/user-token/user-token.dto';
import { AuthContext } from './auth-context';
export declare class AuthController {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaClientService, jwtService: JwtService);
    getSession(authContext: AuthContext): Promise<{
        user: {
            id: string;
        };
    }>;
    loginUser(userLogin: UserLoginDTO): Promise<UserLoginResponseDTO>;
    registerUser(userRegister: UserRegisterDTO): Promise<UserRegisterResponseDTO>;
    getToken(param: UserAuthTokenDTO): Promise<string>;
}
