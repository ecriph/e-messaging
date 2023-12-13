"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationPipe = void 0;
const common_1 = require("@nestjs/common");
class ValidationPipe {
    constructor(schema) {
        this.schema = schema;
    }
    transform(incomingValue) {
        const result = this.schema.safeParse(incomingValue);
        if (result.success) {
            return result.data;
        }
        else {
            throw new common_1.BadRequestException(result);
        }
    }
}
exports.ValidationPipe = ValidationPipe;
//# sourceMappingURL=validation.pipe.js.map