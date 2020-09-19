import { v4 as uuidv4 } from 'uuid';

export class Message {
  id = uuidv4();
  timestamp = Date.now();

  constructor(
    public content: string,
    public author: string,
    public authorId: string,
  ) {}
}