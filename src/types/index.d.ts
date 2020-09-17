import 'express';
import { UserDoc } from 'models';


declare module 'express' {
  export interface Request {
    user?: UserDoc;
  }
}