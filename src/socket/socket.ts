import http from 'http';
import { Server } from 'socket.io';

export const setupSocketIO = (server: http.Server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    socket.on('join', (rooms: string[], callback: Function) => {
      for (let room of rooms) {
        socket.join(room);
        socket.to(room).emit('test', room);
      }
    });
  });
};
