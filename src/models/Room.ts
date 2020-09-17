import { v4 as uuidv4 } from 'uuid';
import { User } from './User';

export class Room {
  id = uuidv4();
  members: User[] = [];

  constructor(
    public name: string,
    public admin: User,
    public roomId: string,
  ) {}
}