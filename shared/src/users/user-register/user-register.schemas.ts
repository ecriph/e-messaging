import { Schema, z } from 'zod';
import { UserRegisterDTO } from './user-register.dto';

export const UserRegisterSchema: Schema<UserRegisterDTO> = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(11),
  fullname: z.string(),
});
