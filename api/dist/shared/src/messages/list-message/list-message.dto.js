"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMessageDTO = void 0;
const openapi = require("@nestjs/swagger");
class ListMessageDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { conversationId: { required: true, type: () => String } };
    }
}
exports.ListMessageDTO = ListMessageDTO;
//# sourceMappingURL=list-message.dto.js.map