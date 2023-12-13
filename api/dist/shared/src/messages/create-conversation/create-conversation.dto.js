"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversationDTO = void 0;
const openapi = require("@nestjs/swagger");
class createConversationDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { recipientId: { required: true, type: () => String } };
    }
}
exports.createConversationDTO = createConversationDTO;
//# sourceMappingURL=create-conversation.dto.js.map