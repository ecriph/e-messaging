import { z } from 'zod';

const schema = z
  .object({
    LOG_DEBUG: z
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
  })
  .required();

const environmentVariablesValidationResult = schema.parse({
  ...process.env,
});

export const EnvironmentVariables = environmentVariablesValidationResult;
