export class UserRegisterDTO {
  username!: string;
  password!: string;
  phone!: string;
  email!: string;
}

export class UserRegisterResponseDTO {
  success!: boolean;
  token!: string;
  refresh_token!: string;
}
