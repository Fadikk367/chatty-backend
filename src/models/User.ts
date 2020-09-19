import { ChatUserType } from './Types';

export class User {
  roomIds: string[] = [];

  constructor(
    public nick: string,
    public id: string,
    public type: ChatUserType = ChatUserType.GUEST,
  ) {}
}