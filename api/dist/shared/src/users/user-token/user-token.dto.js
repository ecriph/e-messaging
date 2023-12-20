"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTokenStatus = exports.UserAuthTokenDTO = exports.UserTokenDTO = void 0;
const openapi = require("@nestjs/swagger");
class UserTokenDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, role: { required: true, type: () => String } };
    }
}
exports.UserTokenDTO = UserTokenDTO;
class UserAuthTokenDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { refreshToken: { required: true, type: () => String }, accessToken: { required: true, type: () => String } };
    }
}
exports.UserAuthTokenDTO = UserAuthTokenDTO;
class UserTokenStatus {
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: true, type: () => Boolean }, message: { required: true, type: () => String }, user: { required: true, type: () => require("./user-token.dto").UserTokenDTO } };
    }
}
exports.UserTokenStatus = UserTokenStatus;
//# sourceMappingURL=user-token.dto.js.map