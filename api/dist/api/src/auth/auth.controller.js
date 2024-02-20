"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const user_login_dto_1 = require("../../../shared/src/users/user-login/user-login.dto");
const user_login_schemas_1 = require("../../../shared/src/users/user-login/user-login.schemas");
const common_1 = require("@nestjs/common");
const public_route_decorator_1 = require("./public-route.decorator");
const prisma_client_service_1 = require("../internals/database/prisma-client.service");
const resource_not_found_exception_1 = require("../internals/server/resource-not-found.exception");
const validation_pipe_1 = require("../internals/validation/validation.pipe");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_service_1 = require("../internals/api/jwt.service");
const user_register_schemas_1 = require("../../../shared/src/users/user-register/user-register.schemas");
const user_register_dto_1 = require("../../../shared/src/users/user-register/user-register.dto");
const client_1 = require("@prisma/client");
const user_token_schemas_1 = require("../../../shared/src/users/user-token/user-token.schemas");
const user_token_dto_1 = require("../../../shared/src/users/user-token/user-token.dto");
const auth_context_1 = require("./auth-context");
const auth_context_decorator_1 = require("./auth-context.decorator");
const reister_push_token_schemas_1 = require("../../../shared/src/users/user-push-token/reister-push-token.schemas");
const register_push_token_dto_1 = require("../../../shared/src/users/user-push-token/register-push-token.dto");
let AuthController = class AuthController {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async loginUser(userLogin) {
        return this.prisma.getClient().$transaction(async (tx) => {
            const userData = await tx.user.findUnique({
                where: { email: userLogin.email },
                include: { conversations: true },
            });
            if (!userData) {
                throw new resource_not_found_exception_1.ResourceNotFoundException();
            }
            const checkValidPassword = await bcrypt.compare(userLogin.password, userData.password);
            if (checkValidPassword) {
                const accesspayload = {
                    id: userData.id,
                    role: userData.role,
                    duration: '300s',
                };
                const refreshpayload = {
                    id: userData.id,
                    role: userData.role,
                    duration: '10d',
                };
                const accessToken = await this.jwtService.signToken(accesspayload);
                const refreshToken = await this.jwtService.signToken(refreshpayload);
                if (accessToken.success) {
                    await tx.user.update({
                        where: { id: userData.id },
                        data: { refresh_token: refreshToken.token },
                    });
                    return {
                        access_token: accessToken.token,
                        refresh_token: refreshToken.token,
                        conversation: userData.conversations,
                        fullname: userData.fullname,
                        userId: userData.id,
                    };
                }
                else {
                    throw new common_1.BadRequestException('Failed to generate token');
                }
            }
            else {
                throw new common_1.UnauthorizedException('invalid password');
            }
        });
    }
    async registerUser(userRegister) {
        return this.prisma.getClient().$transaction(async (tx) => {
            const checkUniqueEmail = await tx.user.findFirst({
                where: { email: userRegister.email },
            });
            if (checkUniqueEmail) {
                throw new common_1.BadRequestException('User already exist');
            }
            const hashedPassword = await bcrypt.hash(userRegister.password, 10);
            if (!hashedPassword) {
                throw new common_1.BadRequestException('Password hashing failed');
            }
            const registerUser = await tx.user.create({
                data: {
                    fullname: userRegister.fullname,
                    email: userRegister.email,
                    password: hashedPassword,
                    refresh_token: '',
                    role: client_1.UserRole.USER,
                },
                include: {
                    conversations: true,
                },
            });
            const payload = {
                id: registerUser.id,
                role: registerUser.role,
                duration: '300s',
            };
            const getToken = await this.jwtService.signToken(payload);
            const refreshToken = await this.jwtService.signToken({
                id: registerUser.id,
                role: registerUser.role,
                duration: '10d',
            });
            await tx.user.update({
                data: {
                    refresh_token: refreshToken.token,
                },
                where: { id: registerUser.id },
            });
            if (getToken.success) {
                return {
                    userId: registerUser.id,
                    access_token: getToken.token,
                    refresh_token: refreshToken.token,
                    conversation: registerUser.conversations,
                    fullname: registerUser.fullname,
                };
            }
            else {
                throw new common_1.BadRequestException('Token-signin-error');
            }
        });
    }
    async refreshToken(userAuthToken) {
        return this.prisma.getClient().$transaction(async (tx) => {
            const checkUser = await tx.user.findFirst({
                where: { refresh_token: userAuthToken.refreshToken },
            });
            if (!checkUser)
                throw new common_1.UnauthorizedException('user-not-found');
            const accesspayload = {
                id: checkUser.id,
                role: checkUser.role,
                duration: '300s',
            };
            const newAccessToken = await this.jwtService.signToken(accesspayload);
            return {
                access_token: newAccessToken.token,
                fullname: checkUser.fullname,
                userId: checkUser.id,
                status: 'success',
            };
        });
    }
    async registerPushtoken(authContext, registerToken) {
        return await this.prisma.getClient().$transaction(async (tx) => {
            const findUser = await tx.pushToken.findFirst({
                where: { userId: authContext.user.id },
            });
            if (findUser) {
                await tx.pushToken.update({
                    where: { userId: authContext.user.id },
                    data: { token: registerToken.token },
                });
            }
            else {
                const register = await tx.pushToken.create({
                    data: { token: registerToken.token, userId: authContext.user.id },
                });
                return register;
            }
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/login'),
    (0, public_route_decorator_1.PublicRoute)(),
    openapi.ApiResponse({ status: 201, type: require("../../../shared/src/users/user-login/user-login.dto").UserLoginResponseDTO }),
    __param(0, (0, common_1.Body)(new validation_pipe_1.ValidationPipe(user_login_schemas_1.UserLoginSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_login_dto_1.UserLoginDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Post)('/register'),
    (0, public_route_decorator_1.PublicRoute)(),
    openapi.ApiResponse({ status: 201, type: require("../../../shared/src/users/user-register/user-register.dto").UserRegisterResponseDTO }),
    __param(0, (0, common_1.Body)(new validation_pipe_1.ValidationPipe(user_register_schemas_1.UserRegisterSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_register_dto_1.UserRegisterDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)('/refresh-token'),
    (0, public_route_decorator_1.PublicRoute)(),
    openapi.ApiResponse({ status: 201, type: require("../../../shared/src/users/user-token/user-token.dto").UserAuthResponseDTO }),
    __param(0, (0, common_1.Body)(new validation_pipe_1.ValidationPipe(user_token_schemas_1.UserAuthTokenSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_token_dto_1.UserAuthTokenDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('/register-token'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, auth_context_decorator_1.WithAuthContext)()),
    __param(1, (0, common_1.Body)(new validation_pipe_1.ValidationPipe(reister_push_token_schemas_1.RegisterPushTokenSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_context_1.AuthContext,
        register_push_token_dto_1.RegisterPushTokenDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerPushtoken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('/auth'),
    __metadata("design:paramtypes", [prisma_client_service_1.PrismaClientService,
        jwt_service_1.JwtService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map