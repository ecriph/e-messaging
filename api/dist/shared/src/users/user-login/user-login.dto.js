"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginResponseDTO = exports.UserLoginDTO = void 0;
const openapi = require("@nestjs/swagger");
class UserLoginDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
}
exports.UserLoginDTO = UserLoginDTO;
class UserLoginResponseDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { access_token: { required: true, type: () => String }, refresh_token: { required: true, type: () => String }, conversation: { required: true, type: () => [require("../../messages/conversation.dto").ConversationDTO] }, fullname: { required: true, type: () => String }, userId: { required: true, type: () => String } };
    }
}
exports.UserLoginResponseDTO = UserLoginResponseDTO;
//# sourceMappingURL=user-login.dto.js.map