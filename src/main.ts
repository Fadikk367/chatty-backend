import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import helmet from 'helmet';
import http from 'http';
import socket, { Socket } from 'socket.io';
import { HttpError } from 'http-errors';

import { roomsRouter } from './routes';
import { Room, User, Message, Collection } from './models';

export const usersCollection = new Collection<User>();
export const roomsCollection = new Collection<Room>();


// Load environmental variables if in development
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const whitelist = ['http://localhost:3001'];
const corsOptions = {
  credentials: true,
  origin: (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
    if (requestOrigin && whitelist.includes(requestOrigin))
      return callback(null, true);

    callback(new Error('Not allowed by CORS'));
  }
}
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app).listen(3000);
const io = socket.listen(server).sockets;

io.on('connection', (socket: Socket) => {
  console.log('user connected: ', socket.id);
  socket.join('test room');
  console.log(socket.adapter.rooms);

  socket.on('new-user', (data: User) => {
    const user = new User(data.nick, socket.id, data.type);

    usersCollection.addOne(user);
    socket.emit('user-connected', user);
  })

  socket.on('join-room', (user: User) => {
    const chatUser = usersCollection.get(user.socketId);
    socket.broadcast.emit('user-joined', chatUser);
  })

  socket.on('message', (message: Message) => {
    console.log({message});
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
    console.log(socket.adapter.rooms);
  })
});


app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('common'));

app.use('/room', roomsRouter);

// app.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });