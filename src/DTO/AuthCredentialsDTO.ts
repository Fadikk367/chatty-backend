import { IsString, MinLength, IsEmail,MaxLength, Matches } from "class-validator";

export class AuthCredentialsDto {
  @IsEmail({} ,{ message: 'Invalid email' })
  email: string;

  @IsString()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}