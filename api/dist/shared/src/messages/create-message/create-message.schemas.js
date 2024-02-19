"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMessageSchema = void 0;
const zod_1 = require("zod");
exports.CreateMessageSchema = zod_1.z.object({
    content: zod_1.z.string(),
    userId: zod_1.z.string(),
    conversationId: zod_1.z.string(),
    category: zod_1.z.string(),
});
//# sourceMappingURL=create-message.schemas.js.map