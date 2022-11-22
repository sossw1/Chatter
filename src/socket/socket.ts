import http from 'http';
import { Server } from 'socket.io';

export const setupSocketIO = (server: http.Server) => {
  const io = new Server(server);

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    // authenticate token

    next();
  });

  io.on('connection', (socket) => {
    console.log(socket.id, ' connected');
  });
};
