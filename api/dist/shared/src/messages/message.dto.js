"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDTO = void 0;
const openapi = require("@nestjs/swagger");
class MessageDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, content: { required: true, type: () => String }, senderId: { required: true, type: () => String }, conversationId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, pushToken: { required: true, type: () => String } };
    }
}
exports.MessageDTO = MessageDTO;
//# sourceMappingURL=message.dto.js.map