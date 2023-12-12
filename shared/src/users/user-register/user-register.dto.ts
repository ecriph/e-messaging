export class UserRegisterDTO {
  fullname!: string;
  password!: string;
  phone!: string;
  email!: string;
}

export class UserRegisterResponseDTO {
  token!: string;
  refresh_token!: string;
  userId!: string;
}
