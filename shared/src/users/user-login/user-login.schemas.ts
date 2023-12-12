import { Schema, z } from 'zod';
import { UserLoginDTO } from './user-login.dto';

export const UserLoginSchema: Schema<UserLoginDTO> = z.object({
  email: z.string(),
  password: z.string(),
});
