import { UserRole } from '@prisma/client';

export class AuthContext {
  user: { id: number; role: UserRole };

  constructor(params: { user: { id: number; role: UserRole } }) {
    this.user = params.user;
  }
}
