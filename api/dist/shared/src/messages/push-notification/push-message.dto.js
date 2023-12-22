"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushMessageDTO = void 0;
const openapi = require("@nestjs/swagger");
class PushMessageDTO {
    static _OPENAPI_METADATA_FACTORY() {
        return { to: { required: true, type: () => String }, body: { required: true, type: () => String }, sound: { required: true, type: () => String } };
    }
}
exports.PushMessageDTO = PushMessageDTO;
//# sourceMappingURL=push-message.dto.js.map