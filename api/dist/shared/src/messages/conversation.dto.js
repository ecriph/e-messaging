"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationResponseListDTO = exports.ConversationDTO = void 0;
const openapi = require("@nestjs/swagger");
class ConversationDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, userId: { required: true, type: () => String }, recipientId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date } };
    }
}
exports.ConversationDTO = ConversationDTO;
class ConversationResponseListDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, userId: { required: true, type: () => String }, recipientId: { required: true, type: () => String }, recipientName: { required: true, type: () => String }, userName: { required: true, type: () => String }, messages: { required: true, type: () => require("./message.dto").MessageDTO }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.ConversationResponseListDTO = ConversationResponseListDTO;
//# sourceMappingURL=conversation.dto.js.map