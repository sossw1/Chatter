import React, { useContext } from 'react';
import io from 'socket.io-client';

export const socket = io();
export const SocketContext = React.createContext(socket);

export const useSocket = () => {
  return useContext(SocketContext);
};

window.onbeforeunload = function () {
  socket.disconnect();
};
