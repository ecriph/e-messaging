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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const environment_variables_1 = require("../runtime/environment-variables");
const common_1 = require("@nestjs/common");
const resource_not_found_exception_1 = require("../server/resource-not-found.exception");
class JwtService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verifyToken(authToken) {
        try {
            const decodedToken = jwt.verify(authToken, environment_variables_1.EnvironmentVariables.JWT_SECRET);
            return {
                message: '',
                success: true,
                user: { id: decodedToken.id, role: decodedToken.role },
            };
        }
        catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return {
                    message: '',
                    success: false,
                    user: { id: '', role: '' },
                };
            }
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async signToken({ id, role, duration, }) {
        const payload = { id, role };
        try {
            const token = jwt.sign(payload, environment_variables_1.EnvironmentVariables.JWT_SECRET, {
                expiresIn: duration,
            });
            return { success: true, token: token };
        }
        catch (err) {
            throw new resource_not_found_exception_1.ResourceNotFoundException();
        }
    }
}
exports.JwtService = JwtService;
//# sourceMappingURL=jwt.service.js.map