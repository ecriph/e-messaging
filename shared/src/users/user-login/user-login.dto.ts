export class UserLoginDTO {
  username!: string;
  password!: string;
}

export class UserLoginResponseDTO {
  token!: string;
  refresh_token!: string;
}
