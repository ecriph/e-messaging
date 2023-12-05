export class UserTokenDTO {
  id!: number;
  role!: string;
}

export class UserAuthTokenDTO {
  token!: string;
  refreshToken!: string;
}

export class UserTokenStatus {
  success!: boolean;
  message!: string;
  user!: UserTokenDTO;
}
