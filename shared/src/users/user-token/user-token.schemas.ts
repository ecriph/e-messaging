import { Schema, z } from 'zod';
import { UserAuthTokenDTO, UserTokenDTO } from './user-token.dto';

export const UserTokenSchema: Schema<UserTokenDTO> = z
  .object({
    id: z.string(),
    role: z.string(),
  })
  .strict();

export const UserAuthTokenSchema: Schema<UserAuthTokenDTO> = z.object({
  refreshToken: z.string(),
});
