"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConversationSchema = void 0;
const zod_1 = require("zod");
exports.CreateConversationSchema = zod_1.z.object({
    recipientId: zod_1.z.string(),
});
//# sourceMappingURL=create-conversation.schemas.js.map