"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisterSchema = void 0;
const zod_1 = require("zod");
exports.UserRegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    phone: zod_1.z.string().min(11),
    fullname: zod_1.z.string(),
});
//# sourceMappingURL=user-register.schemas.js.map