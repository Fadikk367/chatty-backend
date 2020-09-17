import { v4 as uuidv4 } from 'uuid';

export enum UserType {
  GUEST = 'GUEST',
  REGISTERED_USER = 'REGUSTERED_UESR',
}

export class User {
  id = uuidv4();

  constructor(
    public nick: string,
    public socketId: string,
    public type: UserType = UserType.GUEST,
  ) {}
}