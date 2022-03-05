import { generateLocationMessage, generateMessage } from './utils/messages';
import { addUser, getUser, getUsersInRoom, removeUser } from './utils/users';
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
  socket.on('join', ({ username, room }, callback) => {
    const id = parseInt(socket.id);

    const { error, user } = addUser({ id, username, room });

    if (!user) {
      callback(error);
    } else {
      socket.join(user.room);
      socket.emit('message', generateMessage('Welcome to the room!'));
      socket.broadcast
        .to(room)
        .emit('message', generateMessage(`${username} has joined`));
    }

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback(generateMessage('Profanity is not allowed.'));
    }

    io.emit('message', generateMessage(message));
    callback();
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left'));
  });

  socket.on('sendLocation', (location: Location, callback) => {
    io.emit('locationMessage', generateLocationMessage(location));
    callback();
  });
});

server.listen(PORT, () => {
  console.log('Server running on PORT', chalk.yellow(PORT));
});
