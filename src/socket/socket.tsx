import http from 'http';
import { Server } from 'socket.io';

export const setupSocketIO = (server: http.Server) => {
  const io = new Server(server);
};
