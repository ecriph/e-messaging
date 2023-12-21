import { Schema, z } from 'zod';
import { RegisterPushTokenDTO } from './register-push-token.dto';

export const RegisterPushTokenSchema: Schema<RegisterPushTokenDTO> = z.object({
  token: z.string(),
});
