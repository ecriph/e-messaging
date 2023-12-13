"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const zod_1 = require("zod");
const public_route_decorator_1 = require("./public-route.decorator");
const roles_decorator_1 = require("./roles/roles.decorator");
const auth_context_1 = require("./auth-context");
const prisma_client_service_1 = require("../internals/database/prisma-client.service");
const jwt_service_1 = require("../internals/api/jwt.service");
const AuthTokenSchema = zod_1.z
    .string()
    .optional()
    .refine((s) => s == undefined || s.startsWith('Bearer '))
    .transform((s) => {
    if (s == null) {
        return undefined;
    }
    return s.replace('Bearer ', '');
});
let AuthGuard = class AuthGuard {
    constructor(reflector, prismaClient, jwtService) {
        this.reflector = reflector;
        this.prismaClient = prismaClient;
        this.jwtService = jwtService;
    }
    async canActivate(context) {
        if (context.getType() !== 'http') {
            throw new Error('Unknown execution context');
        }
        const request = context
            .switchToHttp()
            .getRequest();
        const isPublic = this.reflector.get(public_route_decorator_1.PUBLIC_ROUTE_METADATA_KEY, context.getHandler());
        if (isPublic) {
            return true;
        }
        else {
            const authTokenIdValidationResult = AuthTokenSchema.safeParse(request.header('authorization'));
            if (!authTokenIdValidationResult.success) {
                throw new common_1.UnauthorizedException();
            }
            const authToken = authTokenIdValidationResult.data;
            if (authToken) {
                const decodedIdToken = await (async () => {
                    try {
                        return await this.jwtService.verifyToken(authToken);
                    }
                    catch (err) {
                        throw new common_1.UnauthorizedException('Token-expired');
                    }
                })();
                if (!decodedIdToken.success) {
                    throw new common_1.UnauthorizedException('Token failed');
                }
                await this.prismaClient.getClient().$transaction(async (tx) => {
                    const user = await tx.user.findFirst({
                        where: { id: decodedIdToken.user.id },
                    });
                    if (!user) {
                        throw new common_1.UnauthorizedException();
                    }
                    else {
                        request.authContext = new auth_context_1.AuthContext({
                            user: { id: user.id, role: user.role },
                        });
                    }
                });
            }
            else {
                throw new common_1.UnauthorizedException('What happened here');
            }
            if (request.authContext) {
                const rolesMetadata = this.reflector.get(roles_decorator_1.ROUTE_ROLES_METADATA_KEY, context.getHandler());
                if (rolesMetadata) {
                    const currentUserRole = request.authContext.user.role;
                    const isAllowed = rolesMetadata.allowedRoles.includes(currentUserRole);
                    if (isAllowed) {
                        return true;
                    }
                    else {
                        throw new common_1.ForbiddenException();
                    }
                }
                return true;
            }
            else {
                throw new common_1.UnauthorizedException('public error');
            }
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_client_service_1.PrismaClientService,
        jwt_service_1.JwtService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map