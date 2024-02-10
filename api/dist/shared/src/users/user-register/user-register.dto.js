"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisterResponseDTO = exports.UserRegisterDTO = void 0;
const openapi = require("@nestjs/swagger");
class UserRegisterDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { fullname: { required: true, type: () => String }, password: { required: true, type: () => String }, phone: { required: true, type: () => String }, email: { required: true, type: () => String } };
    }
}
exports.UserRegisterDTO = UserRegisterDTO;
class UserRegisterResponseDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { access_token: { required: true, type: () => String }, refresh_token: { required: true, type: () => String }, userId: { required: true, type: () => String }, conversation: { required: true, type: () => [require("../../messages/conversation.dto").ConversationDTO] }, fullname: { required: true, type: () => String } };
    }
}
exports.UserRegisterResponseDTO = UserRegisterResponseDTO;
//# sourceMappingURL=user-register.dto.js.map