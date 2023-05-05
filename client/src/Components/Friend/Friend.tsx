import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getRoomName } from '../../utils/parse';
import { IRoomDoc, IMessageDoc, INotificationDoc } from '../../types/Rooms';
import { useAuth } from '../../Providers/auth';
import { useSocket } from '../../Providers/socket';
import { useChat, FriendStatusText } from '../../Providers/chat';
import { fetchInitialData } from '../../utils/fetch';
import FriendRequest from './FriendRequest';
import FriendRequestList from './FriendRequestList';
import FriendList from './FriendList';

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
      'room-invite',
      (roomId: string, notification: INotificationDoc) => {
        chat.addRoomInvite(roomId);
        chat.addNotification(notification);
      }
    );

    return () => {
      isFriendComponentMounted.current = false;
      socket.off('friend-request');
      socket.off('friend-request-accepted');
      socket.off('message');
      socket.off('status-update');
      socket.off('delete-friend');
      socket.off('delete-notifications');
      socket.off('room-invite');
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
      </Box>
      <FriendList />
    </Box>
  );
}
