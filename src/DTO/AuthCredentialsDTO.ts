import { IsString, MinLength, IsEmail,MaxLength, Matches } from "class-validator";

export class AuthCredentialsDto {
  @IsEmail({} ,{ message: 'Invalid email' })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
    { message: 'Password too weak!' },
  )
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}