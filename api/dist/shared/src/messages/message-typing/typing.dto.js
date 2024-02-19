"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypingDTO = void 0;
const openapi = require("@nestjs/swagger");
class TypingDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { conversationId: { required: true, type: () => String }, username: { required: true, type: () => String }, userId: { required: true, type: () => String } };
    }
}
exports.TypingDTO = TypingDTO;
//# sourceMappingURL=typing.dto.js.map