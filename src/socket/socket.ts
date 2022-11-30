import http from 'http';
import { Server } from 'socket.io';
import UserCollection, { IUserDoc } from '../models/User';

export const setupSocketIO = (server: http.Server) => {
  const io = new Server(server);
  let user: IUserDoc | null;

  io.on('connection', (socket) => {
    socket.on('user-data', async (userData: IUserDoc) => {
      user = userData;

      for (let room of user.rooms) {
        socket.join(room + '');
      }

      const userDocument = await UserCollection.findById(user._id);
      if (userDocument) {
        userDocument.socketIds.push(socket.id);
        await userDocument.save();
      }
    });
  });
};
