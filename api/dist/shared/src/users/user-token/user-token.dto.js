"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtDTO = exports.UserTokenStatus = exports.UserAuthResponseDTO = exports.UserAuthTokenDTO = exports.UserTokenDTO = void 0;
const openapi = require("@nestjs/swagger");
class UserTokenDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, role: { required: true, type: () => String } };
    }
}
exports.UserTokenDTO = UserTokenDTO;
class UserAuthTokenDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { refreshToken: { required: true, type: () => String } };
    }
}
exports.UserAuthTokenDTO = UserAuthTokenDTO;
class UserAuthResponseDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { access_token: { required: true, type: () => String }, userId: { required: true, type: () => String }, fullname: { required: true, type: () => String }, status: { required: true, type: () => String } };
    }
}
exports.UserAuthResponseDTO = UserAuthResponseDTO;
class UserTokenStatus {
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: true, type: () => Boolean }, message: { required: true, type: () => String }, user: { required: true, type: () => require("./user-token.dto").UserTokenDTO } };
    }
}
exports.UserTokenStatus = UserTokenStatus;
class JwtDTO extends UserTokenDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { iat: { required: true, type: () => Number }, exp: { required: true, type: () => Number } };
    }
}
exports.JwtDTO = JwtDTO;
//# sourceMappingURL=user-token.dto.js.map