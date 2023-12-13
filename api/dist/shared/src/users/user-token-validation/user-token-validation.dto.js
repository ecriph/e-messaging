"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayloadDTO = void 0;
const openapi = require("@nestjs/swagger");
class PayloadDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String } };
    }
}
exports.PayloadDTO = PayloadDTO;
//# sourceMappingURL=user-token-validation.dto.js.map