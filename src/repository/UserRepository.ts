import { AuthCredentialsDto, UserRegistrationDTO } from 'DTO';
import * as bcrypt from 'bcrypt';
import HttpError from 'http-errors';
import { Repository, EntityRepository } from 'typeorm';
import jwt from 'jsonwebtoken';
import { User } from '../entity/User';


@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(userRegistrationDto: UserRegistrationDTO): Promise<User> {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      nickname 
    } = userRegistrationDto;

    const user = new User();
    user.email = email;
    user.nickname = nickname;
    user.firstName = firstName;
    user.lastName = lastName;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    // return user;

    try {
      await user.save();
      return user;
    } catch(error) {
      if (error.code === '23505') { // duplicate username
        throw new HttpError.Conflict('User with given email already exists');
      } else {
        throw new HttpError.InternalServerError('Problem during database operation');
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<[User, string]> {
    const { email, password } = authCredentialsDto;

    const user = await this.findOne({ email });

    if (user && await user.validatePassword(password)) {
      const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
      const token = await jwt.sign({ userId: user.id }, TOKEN_SECRET);
      return [user, token];
    } else {
      throw new HttpError.Unauthorized('Invalid email or password')
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}