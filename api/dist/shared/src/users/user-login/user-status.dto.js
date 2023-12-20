"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = void 0;
const openapi = require("@nestjs/swagger");
class UserStatus {
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String }, status: { required: true, type: () => String } };
    }
}
exports.UserStatus = UserStatus;
//# sourceMappingURL=user-status.dto.js.map