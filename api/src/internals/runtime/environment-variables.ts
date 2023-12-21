import { z } from 'zod';

const APP_ENV = process.env.APP_ENV;

const schema = z
  .object({
    PORT:
      APP_ENV === 'local'
        ? z.union([z.undefined(), z.coerce.number().optional()])
        : z.coerce.number(),
    LOG_DEBUG: z.coerce
      .boolean()
      .optional()
      .transform((v) => {
        if (process.env.NODE_ENV === 'development') {
          return true;
        } else {
          return v;
        }
      }),
    NODE_ENV: z.union([
      z.literal('development'),
      z.literal('test'),
      z.literal('production'),
    ]),
    APP_ENV: z.union([
      z.literal('local'),
      z.literal('staging'),
      z.literal('production'),
    ]),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    EXPO_ACCESS_TOKEN: z.string(),
  })
  .required();

const environmentVariablesValidationResult = schema.parse({
  ...process.env,
});

export const EnvironmentVariables = environmentVariablesValidationResult;
