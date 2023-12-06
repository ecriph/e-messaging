export class UserTokenDTO {
  id!: string;
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
