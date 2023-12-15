"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentVariables = void 0;
const zod_1 = require("zod");
const APP_ENV = process.env.APP_ENV;
const schema = zod_1.z
    .object({
    PORT: APP_ENV === 'local'
        ? zod_1.z.union([zod_1.z.undefined(), zod_1.z.coerce.number().optional()])
        : zod_1.z.coerce.number(),
    LOG_DEBUG: zod_1.z.coerce
        .boolean()
        .optional()
        .transform((v) => {
        if (process.env.NODE_ENV === 'development') {
            return true;
        }
        else {
            return v;
        }
    }),
    NODE_ENV: zod_1.z.union([
        zod_1.z.literal('development'),
        zod_1.z.literal('test'),
        zod_1.z.literal('production'),
    ]),
    APP_ENV: zod_1.z.union([
        zod_1.z.literal('local'),
        zod_1.z.literal('staging'),
        zod_1.z.literal('production'),
    ]),
    DATABASE_URL: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
})
    .required();
const environmentVariablesValidationResult = schema.parse(Object.assign({}, process.env));
exports.EnvironmentVariables = environmentVariablesValidationResult;
//# sourceMappingURL=environment-variables.js.map