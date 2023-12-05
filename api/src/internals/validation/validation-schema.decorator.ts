import { SetMetadata } from '@nestjs/common';
import { z } from 'zod';

export const VALIDATION_SCHEMA_KEY = 'zod-validation-schema';

export type SupportedValidationSchema = z.ZodType<unknown>;

export const ValidationSchema = (schema: SupportedValidationSchema) =>
  SetMetadata(VALIDATION_SCHEMA_KEY, schema);
