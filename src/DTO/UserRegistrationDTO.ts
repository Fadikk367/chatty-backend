import { IsString, MinLength, IsEmail,MaxLength, Matches } from "class-validator";

export class UserRegistrationDTO {
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

  @IsString()
  @MinLength(2, { message: 'First name must have at least 2 characters' })
  @MaxLength(15, { message: 'First name must have 15 characters at most' })
  firstName: string;

  @IsString()
  @MinLength(2, { message: 'Nickname must have at least 2 characters' })
  @MaxLength(15, { message: 'Nickname must have 15 characters at most' })
  lastName: string;

  @IsString()
  @MinLength(3, { message: 'Last name must have at least 3 characters' })
  @MaxLength(15, { message: 'Last name must have 15 characters at most' })
  nickname: string;


  constructor(email: string, password: string, firstName: string, lastName: string, nickname: string) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickname = nickname;
  }
}