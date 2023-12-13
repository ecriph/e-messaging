"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChatMessageDTO = exports.CreateMessageDTO = void 0;
const openapi = require("@nestjs/swagger");
class CreateMessageDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { content: { required: true, type: () => String }, conversationId: { required: true, type: () => String } };
    }
}
exports.CreateMessageDTO = CreateMessageDTO;
class CreateChatMessageDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { senderId: { required: true, type: () => String }, content: { required: true, type: () => String }, createdAt: { required: true, type: () => Date } };
    }
}
exports.CreateChatMessageDTO = CreateChatMessageDTO;
//# sourceMappingURL=create-message.dto.js.map