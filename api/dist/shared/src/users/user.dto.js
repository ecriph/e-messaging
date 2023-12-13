"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWithOutPassword = exports.UserDTO = void 0;
const openapi = require("@nestjs/swagger");
class UserDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, fullname: { required: true, type: () => String }, email: { required: true, type: () => String }, refresh_token: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
}
exports.UserDTO = UserDTO;
class UserWithOutPassword {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, fullname: { required: true, type: () => String }, email: { required: true, type: () => String } };
    }
}
exports.UserWithOutPassword = UserWithOutPassword;
//# sourceMappingURL=user.dto.js.map