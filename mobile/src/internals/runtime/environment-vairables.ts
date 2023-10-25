import { z } from 'zod';

export const EnvironmentVariables = z
  .object({
    APP_ENV: z.union([z.literal('local'), z.literal('production')]),
    MAIN_API_URL: z.string(),
    LOG_DEBUG: z.boolean(),
    DISABLE_LOGGING_LIMIT: z.boolean(),
  })
  .parse({
    APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
    MAIN_API_URL: process.env.EXPO_PUBLIC_MAIN_API_URL,
    LOG_DEBUG: __DEV__,
    DISABLE_LOGGING_LIMIT: __DEV__,
  });
