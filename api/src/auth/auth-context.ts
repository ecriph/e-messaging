import { UserRole } from '@prisma/client';

export class AuthContext {
  user: { id: string; role: UserRole };

  constructor(params: { user: { id: string; role: UserRole } }) {
    this.user = params.user;
  }
}
