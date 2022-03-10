import { generateLocationMessage, generateMessage } from './utils/messages';
import { addUser, getUser, getUsersInRoom, removeUser } from './utils/users';
import './db/mongoose';
import chalk from 'chalk';
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import Filter from 'bad-words';

export interface Location {
  latitude: string;
  longitude: string;
}

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = express();

const server = http.createServer(app);
const io = new Server(server);

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.json());
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  socket.on(
    'join',
    (
      { username, room }: { username: string; room: string },
      callback: Function
    ) => {
      const id = socket.id;
      const { error, user } = addUser({ id, username, room });

      if (!user) {
        callback(error);
      } else {
        socket.join(user.room);
        io.to(user.room).emit('roomData', {
          room: user.room,
          users: getUsersInRoom(user.room)
        });
        socket.emit(
          'message',
          generateMessage('System', 'Welcome to the room!')
        );
        socket.broadcast
          .to(room)
          .emit(
            'message',
            generateMessage('System', `${user.username} has joined.`)
          );
        callback();
      }
    }
  );

  socket.on('sendMessage', (message: string, callback: Function) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed.');
    }

    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', generateMessage(user.username, message));
      callback();
    } else {
      callback({ error: 'Undefined user' });
    }
  });

  socket.on('sendLocation', (location: Location, callback: Function) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        'locationMessage',
        generateLocationMessage(user.username, location)
      );
      callback();
    } else {
      callback({ error: 'Undefined user' });
    }
  });

  socket.on('disconnect', () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
      io.to(user.room).emit(
        'message',
        generateMessage('System', `${user.username} has left.`)
      );
    }
  });
});

server.listen(PORT, () => {
  console.log('Server running on PORT', chalk.yellow(PORT));
});
