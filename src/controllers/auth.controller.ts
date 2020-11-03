import { RequestHandler } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, validateOrReject } from 'class-validator';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repository/UserRepository'
import { UserRegistrationDTO, AuthCredentialsDto} from '../DTO';
import { User } from '../entity/User';




export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const userRepository = getCustomRepository(UserRepository);
    const userRegistrationDto = plainToClass(UserRegistrationDTO, req.body)[0];
    await validateOrReject(userRegistrationDto);
    const user = await userRepository.signUp(userRegistrationDto);
    res.status(201).json({ user });
  } catch(err) {
    console.error(err);
    next(err);
  }
}

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const userRepository = getCustomRepository(UserRepository);
    const authCredentialsDto = plainToClass(AuthCredentialsDto, req.body)[0];
    await validate(authCredentialsDto);
    const [user, token] = await userRepository.signIn(authCredentialsDto);
    res.status(200).json({ user, token });
  } catch(err) {
    console.error(err);
    next(err);
  }
}
