import React, { useContext } from 'react';
import io from 'socket.io-client';

export const socket = io();
const SocketContext = React.createContext(socket);

export const SocketProvider = (props: { children: JSX.Element }) => {
  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

window.onbeforeunload = function () {
  socket.disconnect();
};
