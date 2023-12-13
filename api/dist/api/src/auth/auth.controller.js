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
const uuid_1 = require("uuid");
const jwt_service_1 = require("../internals/api/jwt.service");
const user_register_schemas_1 = require("../../../shared/src/users/user-register/user-register.schemas");
const user_register_dto_1 = require("../../../shared/src/users/user-register/user-register.dto");
const client_1 = require("@prisma/client");
const user_token_schemas_1 = require("../../../shared/src/users/user-token/user-token.schemas");
const user_token_dto_1 = require("../../../shared/src/users/user-token/user-token.dto");
const auth_context_1 = require("./auth-context");
const auth_context_decorator_1 = require("./auth-context.decorator");
var ErrorMessage;
(function (ErrorMessage) {
    ErrorMessage["WENT_WRONG"] = "Something went wrong!";
})(ErrorMessage || (ErrorMessage = {}));
let AuthController = class AuthController {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async getSession(authContext) {
        return {
            user: { id: authContext.user.id },
        };
    }
    async loginUser(userLogin) {
        return this.prisma.getClient().$transaction(async (tx) => {
            const userData = await tx.user.findUnique({
                where: { email: userLogin.email },
                include: { messages: true, conversations: true },
            });
            if (!userData) {
                throw new resource_not_found_exception_1.ResourceNotFoundException();
            }
            const checkValidPassword = await bcrypt.compare(userLogin.password, userData.password);
            if (checkValidPassword) {
                const payload = { id: userData.id, role: userData.role };
                const generateToken = await this.jwtService.signToken(payload);
                const refreshToken = (0, uuid_1.v1)();
                if (generateToken.success) {
                    await tx.user.update({
                        where: { id: userData.id },
                        data: { refresh_token: refreshToken },
                    });
                    return {
                        token: generateToken.token,
                        refresh_token: refreshToken,
                        messages: userData.messages,
                        conversations: userData.conversations,
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
            const refreshToken = (0, uuid_1.v1)();
            const registerUser = await tx.user.create({
                data: {
                    fullname: userRegister.fullname,
                    email: userRegister.email,
                    password: hashedPassword,
                    refresh_token: refreshToken,
                    role: client_1.UserRole.USER,
                },
            });
            const payload = { id: registerUser.id, role: registerUser.role };
            const getToken = await this.jwtService.signToken(payload);
            if (getToken.success) {
                return {
                    userId: registerUser.id,
                    token: getToken.token,
                    refresh_token: refreshToken,
                };
            }
            else {
                throw new common_1.BadRequestException('Token-signin-error');
            }
        });
    }
    async getToken(param) {
        const checkUser = await this.prisma
            .getClient()
            .user.findFirst({ where: { refresh_token: param.refreshToken } });
        if (checkUser) {
            const payload = { id: checkUser.id, role: checkUser.role };
            const newToken = await this.jwtService.signToken(payload);
            return newToken.success ? newToken.token : ErrorMessage.WENT_WRONG;
        }
        else {
            return ErrorMessage.WENT_WRONG;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('/session'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, auth_context_decorator_1.WithAuthContext)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_context_1.AuthContext]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSession", null);
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
    (0, common_1.Get)('/token/:refreshToken'),
    (0, public_route_decorator_1.PublicRoute)(),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)(new validation_pipe_1.ValidationPipe(user_token_schemas_1.UserAuthTokenSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_token_dto_1.UserAuthTokenDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('/auth'),
    __metadata("design:paramtypes", [prisma_client_service_1.PrismaClientService,
        jwt_service_1.JwtService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map