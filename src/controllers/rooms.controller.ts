import { RequestHandler } from 'express';
import { BadRequest } from 'http-errors';
import { v4 as uuidv4 } from 'uuid';

import { Room, User } from '../models';


export const createTemporaryRoom: RequestHandler = (req, res, next) => {
  console.log(req.params);

  // const { admin_name as admiNName, room_name } = req.query;
  // if (!name || !admin) 
  //   throw new BadRequest('name and admin are required reqest params!');

  // const admin = new User('nick1')
  // const room = new Room('room1', admin);

  res.json({ message: 'OK' });
}

export const test: RequestHandler = (req, res, next) => {
  console.log(req.body);

  // const { admin_name as admiNName, room_name } = req.query;
  // if (!name || !admin) 
  //   throw new BadRequest('name and admin are required reqest params!');

  // const admin = new User('nick1')
  // const room = new Room('room1', admin);

  res.json({ message: 'OK' });
}