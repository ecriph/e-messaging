"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPushTokenDTO = void 0;
const openapi = require("@nestjs/swagger");
class RegisterPushTokenDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { token: { required: true, type: () => String } };
    }
}
exports.RegisterPushTokenDTO = RegisterPushTokenDTO;
//# sourceMappingURL=register-push-token.dto.js.map