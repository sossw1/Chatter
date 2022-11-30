import http from 'http';
import { Server } from 'socket.io';
import { IUserDoc } from '../models/User';

export const setupSocketIO = (server: http.Server) => {
  const io = new Server(server);
  let user: IUserDoc | null;

  io.on('connection', (socket) => {
    socket.on('user-data', (userData: IUserDoc) => {
      user = userData;

      for (let room of user.rooms) {
        socket.join(room + '');
      }
    });
  });
};
