import http from 'http';
import { Server } from 'socket.io';
import { IMessageDoc } from '../models/Room';
import {
  UserCollection,
  IUserDoc,
  Status,
  INotificationDoc,
  NotificationCollection
} from '../models/User';

export const setupSocketIO = (server: http.Server) => {
  const io = new Server(server);

  const emitStatusToFriends = async (user: IUserDoc, status: Status) => {
    for (let username of user.friends) {
      const friendUserDocument = await UserCollection.findOne({ username });
      if (friendUserDocument)
        io.to(friendUserDocument.socketIds).emit(
          'status-update',
          user.username,
          status
        );
    }
  };

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

        if (userDocument.status !== 'Invisible') {
          await emitStatusToFriends(userDocument, userDocument.status);
        }
      }
    });

    socket.on('status-update', async (newStatus: Status) => {
      if (!user) return;

      const userDocument = await UserCollection.findById(user._id);

      if (!userDocument) return;

      const previousStatus = userDocument.status;
      if (newStatus === previousStatus) return;

      userDocument.status = newStatus;
      await userDocument.save();

      if (newStatus === 'Online' || newStatus === 'Away') {
        await emitStatusToFriends(userDocument, userDocument.status);
      } else if (newStatus === 'Offline') {
        if (previousStatus === 'Invisible') return;
        await emitStatusToFriends(userDocument, userDocument.status);
      } else if (newStatus === 'Invisible') {
        if (previousStatus === 'Offline') return;
        await emitStatusToFriends(userDocument, 'Offline');
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

        const notification = new NotificationCollection({
          type: 'friend-request-received',
          title: 'Friend Request',
          text: '' + requester,
          viewed: false
        });

        requestedUser.notifications.unshift(notification);
        await requestedUser.save();
        await notification.save();

        requestedUser.socketIds.forEach((id) => {
          io.to(id).emit('friend-request', requester, notification);
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
            userDocument.save();
            await emitStatusToFriends(userDocument, userDocument.status);
          } else {
            await userDocument.save();
          }
        }
      }
    });
  });

  return io;
};
