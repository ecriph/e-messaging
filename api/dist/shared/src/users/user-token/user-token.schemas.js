"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthTokenSchema = exports.UserTokenSchema = void 0;
const zod_1 = require("zod");
exports.UserTokenSchema = zod_1.z
    .object({
    id: zod_1.z.string(),
    role: zod_1.z.string(),
})
    .strict();
exports.UserAuthTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string(),
});
//# sourceMappingURL=user-token.schemas.js.map