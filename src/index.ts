import chalk from 'chalk';
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = express();

const server = http.createServer(app);
const io = new Server(server);

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.json());
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  socket.broadcast.emit('message', 'A new user has joined!');
  socket.on('sendMessage', (message) => {
    io.emit('sendMessage', message);
  });
});

server.listen(PORT, () => {
  console.log('Server running on PORT', chalk.yellow(PORT));
});
