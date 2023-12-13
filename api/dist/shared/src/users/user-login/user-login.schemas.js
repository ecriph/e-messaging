"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginSchema = void 0;
const zod_1 = require("zod");
exports.UserLoginSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string(),
});
//# sourceMappingURL=user-login.schemas.js.map