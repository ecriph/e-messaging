export class UserDTO {
  id!: string;
  fullname!: string;
  email!: string;
  refresh_token!: string;
  password!: string;
}

export class UserWithOutPassword {
  id!: string;
  fullname!: string;
  email!: string;
}
