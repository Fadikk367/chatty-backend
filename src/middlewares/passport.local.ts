import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

export const passportLocal = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  
})