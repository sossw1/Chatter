import { io, Socket } from 'socket.io-client';

class SocketFactory {
  private static instance: SocketFactory;
  socket: Socket;

  private constructor() {
    this.socket = io();
  }

  static getInstance() {
    let instance: SocketFactory;

    if (!SocketFactory.instance) {
      this.instance = new SocketFactory();
      instance = this.instance;
    } else {
      instance = this.instance;
    }

    if (!instance.socket.connected) {
      console.log('reconnecting');
      instance.socket.connect();
    }

    return instance;
  }
}

export const getSocket = () => {
  const { socket } = SocketFactory.getInstance();

  socket.on('connect', () => {});

  return socket;
};
