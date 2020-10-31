import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import helmet from 'helmet';
import http from 'http';
import socket, { Socket } from 'socket.io';
import { createConnection } from 'typeorm';
import "reflect-metadata";

import { roomsRouter, authRouter } from './routes';
import { Room, User, Message, Collection, ChatUserType } from './models';

export const usersCollection = new Collection<User>();
export const roomsCollection = new Collection<Room>();

const admin = new User('nick', '12134', ChatUserType.REGISTERED);
const room1 = new Room('Gaming', admin, [], {  isProtected: false, slots: 100});
const room2 = new Room('Traveling', admin, [], {  isProtected: false, slots: 100});
const room3 = new Room('Rummors', admin, [], {  isProtected: false, slots: 100});
const room4 = new Room('Beauty', admin, [], {  isProtected: false, slots: 100});
const room5 = new Room('Learning', admin, [], {  isProtected: false, slots: 100});
roomsCollection.addMany([room1, room2, room3, room4, room5]);

createConnection()
  .then(() => {
    console.log('Connected to the databse!');
  })
  .catch(err => {
    console.log('Failed to connect to the database!');
    console.error(err);
  });

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

  const connectedUsers = usersCollection.getItems();
  const availableRooms = roomsCollection.getItems();
  socket.emit('chat-state', { connectedUsers, availableRooms, id: socket.id });

  socket.on('new-user', (data: { nickname: string, type: ChatUserType }) => {
    const newUser = new User(data.nickname, socket.id, data.type);
    usersCollection.addOne(newUser);

    io.emit('new-user', newUser);
  });

  socket.on('message', ({ message, roomId}: { message: Message, roomId: string}) => {
    console.log({message, roomId, rooms: io.adapter.rooms});
    const room = roomsCollection.get(roomId);
    room.messages.push(message);
    io.in(roomId).emit('message', { message, roomId });

  })

  socket.on('new-room', (data: { name: string, isProtected?: boolean, password?: string, slots?: number}) => {
    const roomAdmin = usersCollection.get(socket.id);
    const { isProtected, password, slots } = data;
    const roomOptions = {
      isProtected,
      password,
      slots,
    }
    const newRoom = new Room(data.name, roomAdmin, [roomAdmin], roomOptions);
    roomAdmin.roomIds.push(newRoom.id);
    roomsCollection.addOne(newRoom);

    socket.join(newRoom.id);

    io.emit('new-room', newRoom);
  });


  socket.on('join-room', (roomId: string) => {
    try {
      const room = roomsCollection.get(roomId);
      const user = usersCollection.get(socket.id);
      if (room.admin.id === user.id || room.members.includes(user))
        return;

      room.members.push(user);
      socket.join(roomId);
      socket.emit('welcome-to-room', room)
      // socket.to(roomId).broadcast.emit('user-joined-room', { user, roomId });
      socket.broadcast.emit('user-joined-room', { user, roomId });
    } catch (err) {
      return;
    }
  });

  
  socket.on('leave-room', (roomId: string) => {
    try {
      const room = roomsCollection.get(roomId);
      const user = usersCollection.get(socket.id);
      room.removeMember(user.id);
      socket.leave(roomId);
      // socket.to(roomId).broadcast.emit('user-left-room', { user, roomId });
      io.emit('user-left-room', { user, roomId });
    } catch (err) {
      return;
    }
  });


  socket.on('disconnect', () => {
    console.log('user disconnected: ', socket.id);
    try {
      const disconnectedUser = usersCollection.remove(socket.id);
      console.log(disconnectedUser);
      disconnectedUser.roomIds.forEach(roomId => {
        try {
          roomsCollection.get(roomId).removeMember(disconnectedUser.id);
        } catch(err) {
          if (err.name = 'EMPTY_ROOM') {
            roomsCollection.remove(roomId);
            io.emit('room-deleted', roomId);
          }
        }
      })
      io.emit('user-disconnected', socket.id);
    } catch(err) {
      return;
    }
  })
});


app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('common'));

app.use('/room', roomsRouter);
app.use('/auth', authRouter);

// app.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });