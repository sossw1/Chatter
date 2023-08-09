import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getRoomName } from '../../utils/parse';
import {
  IRoomDoc,
  IMessageDoc,
  INotificationDoc,
  NotificationType
} from '../../types/Rooms';
import { useAuth } from '../../Providers/auth';
import { useSocket } from '../../Providers/socket';
import { useChat, FriendStatusText, RoomInvite } from '../../Providers/chat';
import { fetchInitialData } from '../../utils/fetch';
import FriendRequest from './FriendRequest';
import FriendRequestList from './FriendRequestList';
import FriendList from './FriendList';
import FriendRoomInviteList from './FriendRoomInviteList';

export default function Friend() {
  const isFriendComponentMounted = useRef(true);
  const { user } = useAuth();
  const socket = useSocket();
  const chat = useChat();

  useEffect(() => {
    if (!chat.isInitialDataLoaded && user) {
      fetchInitialData(user).then((data) => {
        if (data) chat.loadInitialData(data);
      });
    }

    if (socket.disconnected) socket.connect();

    if (user) socket.emit('user-data', user);

    socket.on(
      'friend-request',
      (username: string, notification: INotificationDoc) => {
        chat.addFriendInvite(username);
        if (notification) chat.addNotification(notification);
      }
    );

    socket.on(
      'friend-request-accepted',
      (
        newRoom: IRoomDoc,
        newFriendUsername: string,
        newFriendStatus: FriendStatusText,
        notification: INotificationDoc
      ) => {
        chat.addRoom(newRoom);
        chat.addFriend(newFriendUsername);
        chat.updateFriendStatus(newFriendUsername, newFriendStatus);
        if (notification) chat.addNotification(notification);
        socket.emit('join-room', newRoom._id);
      }
    );

    socket.on('message', (message: IMessageDoc) => {
      chat.newMessage(message);
      chat.incrementUnreadMessageCount(`${message.roomId}`);
    });

    socket.on('status-update', (username: string, status: FriendStatusText) => {
      chat.updateFriendStatus(username, status);
    });

    socket.on('delete-friend', (username: string) => {
      chat.removeFriend(username);

      if (!user) return;

      const match = chat.rooms.find((room) => {
        return room.isDirect && getRoomName(room, user.username) === username;
      });

      if (!match) return;
      chat.removeRoom(match._id);
    });

    socket.on('delete-notifications', (notifications: string[]) => {
      notifications.forEach((notification) =>
        chat.deleteNotificationById(notification)
      );
    });

    socket.on(
      'delete-notification-by-content',
      (type: NotificationType, text: string) => {
        if (!(typeof type === 'string') || !(typeof text === 'string')) return;
        if (type === 'friend-request-received' && text === user?.username)
          return;
        chat.deleteNotificationByContent(type, text);
      }
    );

    socket.on('delete-friend-request', (username: string) => {
      chat.removeFriendInvite(username);
    });

    socket.on(
      'room-invite',
      (roomInvite: RoomInvite, notification: INotificationDoc) => {
        chat.addRoomInvite(roomInvite);
        chat.addNotification(notification);
      }
    );

    socket.on('delete-room-invite', (roomId: string, roomName: string) => {
      chat.removeRoomInvite(roomId);
      chat.deleteNotificationByContent('room-invite-received', roomName);
    });

    socket.on('leave-room', (roomId: string) => {
      chat.removeRoom(roomId);
    });

    return () => {
      isFriendComponentMounted.current = false;
      socket.off('friend-request');
      socket.off('friend-request-accepted');
      socket.off('message');
      socket.off('status-update');
      socket.off('delete-friend');
      socket.off('delete-notifications');
      socket.off('delete-notification-by-content');
      socket.off('delete-friend-request');
      socket.off('room-invite');
      socket.off('delete-room-invite');
      socket.off('leave-room');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box display='flex' flexDirection='row' p='2rem'>
      <Box display='flex' flexDirection='column'>
        <Link to='/chat'>
          <Box display='flex' flexDirection='row' alignItems='center' mb='1rem'>
            <ArrowBack
              sx={{ width: '1.5rem', height: '1.5rem', mr: '0.5rem' }}
            />
            <Typography variant='h6'>Go back to Chat</Typography>
          </Box>
        </Link>
        <FriendRequest isFriendComponentMounted={isFriendComponentMounted} />
        <FriendRequestList
          isFriendComponentMounted={isFriendComponentMounted}
        />
        <FriendRoomInviteList
          isFriendComponentMounted={isFriendComponentMounted}
        />
      </Box>
      <FriendList />
    </Box>
  );
}
