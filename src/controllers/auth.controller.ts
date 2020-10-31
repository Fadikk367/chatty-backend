import { RequestHandler } from 'express';
import { User } from '../entity/User';


export const registerUser: RequestHandler = (req, res, next) => {
  console.log(req.body);
  const user = new User();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.nickname = req.body.nickname;
  user.email = req.body.email;
  user.password = req.body.password;
  user.salt = 'salt';
  user.save();
  console.log(user);
  res.json({ message: 'OK' });
}

export const signIn: RequestHandler = async (req, res, next) => {
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) return res.json('not found');
  res.json({ user });
}
