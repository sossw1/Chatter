import http from 'http';
import { Server } from 'socket.io';
import { IMessageDoc } from '../models/Room';
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

    socket.on('message', (message: IMessageDoc) => {
      io.to(message.roomId + '').emit('message', message);
    });

    socket.on(
      'friend-request',
      async ({
        requester,
        requested
      }: {
        requester: string;
        requested: string;
      }) => {
        const requestedUser = await UserCollection.findOne({
          username: requested
        });
        if (!requestedUser) return;

        requestedUser.socketIds.forEach((id) => {
          io.to(id).emit('friend-request', requester);
        });
      }
    );

    socket.on('disconnect', async () => {
      if (user) {
        const userDocument = await UserCollection.findById(user);
        if (userDocument) {
          userDocument.socketIds = userDocument.socketIds.filter(
            (socketId) => socketId !== socket.id
          );
          await userDocument.save();
        }
      }
    });
  });
};
