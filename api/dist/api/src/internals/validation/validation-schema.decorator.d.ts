import { z } from 'zod';
export declare const VALIDATION_SCHEMA_KEY = "zod-validation-schema";
export type SupportedValidationSchema = z.ZodType<unknown>;
export declare const ValidationSchema: (schema: SupportedValidationSchema) => import("@nestjs/common").CustomDecorator<string>;
