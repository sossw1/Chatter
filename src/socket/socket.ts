import http from 'http';
import { Server } from 'socket.io';
import { IMessageDoc } from '../models/Room';
import UserCollection, { IUserDoc } from '../models/User';

export const setupSocketIO = (server: http.Server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    let user: IUserDoc | null;
    socket.on('user-data', async (userData: IUserDoc) => {
      user = userData;

      for (let room of user.rooms) {
        socket.join(room + '');
      }

      const userDocument = await UserCollection.findById(user._id);
      if (userDocument) {
        if (!userDocument.socketIds.includes(socket.id)) {
          userDocument.socketIds.push(socket.id);
        }

        if (userDocument.status !== 'Invisible') {
          userDocument.status = 'Online';
        }

        await userDocument.save();

        for (let username of userDocument.friends) {
          const friendUserDocument = await UserCollection.findOne({
            username
          });
          if (friendUserDocument)
            io.to(friendUserDocument.socketIds).emit(
              'status-update',
              user.username,
              userDocument.status
            );
        }
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

          if (userDocument.status !== 'Invisible') {
            userDocument.status = 'Offline';
          }

          await userDocument.save();

          for (let username of userDocument.friends) {
            const friendUserDocument = await UserCollection.findOne({
              username
            });
            if (friendUserDocument)
              io.to(friendUserDocument.socketIds).emit(
                'status-update',
                user.username,
                userDocument.status
              );
          }
        }
      }
    });
  });

  return io;
};
