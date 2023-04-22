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
  const {
    isInitialDataLoaded,
    rooms,
    loadInitialData,
    addNotification,
    deleteNotificationById,
    addRoom,
    removeRoom,
    addFriend,
    removeFriend,
    addFriendInvite,
    updateFriendStatus,
    newMessage,
    incrementUnreadMessageCount
  } = useChat();

  useEffect(() => {
    if (!isInitialDataLoaded && user) {
      fetchInitialData(user).then((data) => {
        if (data) loadInitialData(data);
      });
    }

    if (socket.disconnected) socket.connect();

    if (user) socket.emit('user-data', user);

    socket.on(
      'friend-request',
      (username: string, notification: INotificationDoc) => {
        addFriendInvite(username);
        if (notification) addNotification(notification);
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
        addRoom(newRoom);
        addFriend(newFriendUsername);
        updateFriendStatus(newFriendUsername, newFriendStatus);
        if (notification) addNotification(notification);
        socket.emit('join-room', newRoom._id);
      }
    );

    socket.on('message', (message: IMessageDoc) => {
      newMessage(message);
      incrementUnreadMessageCount(`${message.roomId}`);
    });

    socket.on('status-update', (username: string, status: FriendStatusText) => {
      updateFriendStatus(username, status);
    });

    socket.on('delete-friend', (username: string) => {
      removeFriend(username);

      if (!user) return;

      const match = rooms.find((room) => {
        return room.isDirect && getRoomName(room, user.username) === username;
      });

      if (!match) return;
      removeRoom(match._id);
    });

    socket.on('delete-notifications', (notifications: string[]) => {
      notifications.forEach((notification) =>
        deleteNotificationById(notification)
      );
    });

    return () => {
      isFriendComponentMounted.current = false;
      socket.off('friend-request');
      socket.off('friend-request-accepted');
      socket.off('message');
      socket.off('status-update');
      socket.off('delete-friend');
      socket.off('delete-notifications');
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
