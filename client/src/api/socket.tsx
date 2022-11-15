import { io } from 'socket.io-client';

export const connectSocket = () => {
  const socket = io();

  socket.on('connect', () => {});

  return socket;
};
