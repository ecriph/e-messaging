export class UserTokenDTO {
  id!: string;
  role!: string;
}

export class UserAuthTokenDTO {
  refreshToken!: string;
}

export class UserAuthResponseDTO {
  access_token!: string;
}

export class UserTokenStatus {
  success!: boolean;
  message!: string;
  user!: UserTokenDTO;
}

export class JwtDTO extends UserTokenDTO {
  iat!: number;
  exp!: number;
}
