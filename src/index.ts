import { generateLocationMessage, generateMessage } from './utils/messages';
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
  socket.on('join', ({ username, room }) => {
    socket.join(room);
    socket.emit('message', generateMessage('Welcome to the room!'));
    socket.to(room).emit('message', `${username} has joined`);
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
