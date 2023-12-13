"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatScreenDTO = void 0;
const openapi = require("@nestjs/swagger");
class ChatScreenDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, messages: { required: true, type: () => [require("./message.dto").MessageDTO] }, users: { required: true, type: () => require("../users/user.dto").UserWithOutPassword } };
    }
}
exports.ChatScreenDTO = ChatScreenDTO;
//# sourceMappingURL=chats-screen.dto.js.map