"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationSchema = exports.VALIDATION_SCHEMA_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.VALIDATION_SCHEMA_KEY = 'zod-validation-schema';
const ValidationSchema = (schema) => (0, common_1.SetMetadata)(exports.VALIDATION_SCHEMA_KEY, schema);
exports.ValidationSchema = ValidationSchema;
//# sourceMappingURL=validation-schema.decorator.js.map