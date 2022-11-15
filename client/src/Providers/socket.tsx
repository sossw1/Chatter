import { createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket;
}

class UserSocket {
  private static instance: UserSocket;
  socket;

  private constructor() {
    this.socket = io();
  }

  static getInstance() {
    if (UserSocket.instance) {
      return this.instance;
    }
    this.instance = new UserSocket();
    return this.instance;
  }
}

const SocketContext = createContext<SocketContextProps | null>(null);

export const SocketProvider = ({ children }: { children: JSX.Element }) => {
  const userSocket = UserSocket.getInstance();

  let value: SocketContextProps = {
    socket: userSocket.socket
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext)!;
};
