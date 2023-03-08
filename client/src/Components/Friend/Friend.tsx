import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import FriendRequest from './FriendRequest';
import FriendRequestList from './FriendRequestList';
import { IRoomDoc } from '../../types/Rooms';
import { useAuth } from '../../Providers/auth';
import { useSocket } from '../../Providers/socket';
import { useChat, FriendStatusText } from '../../Providers/chat';

export default function Friend() {
  const isFriendComponentMounted = useRef(true);
  const { user } = useAuth();
  const socket = useSocket();
  const { addRoom, addFriendInvite, updateFriendStatus } = useChat();

  useEffect(() => {
    if (socket.disconnected) socket.connect();

    if (user) socket.emit('user-data', user);

    socket.on('friend-request', (username: string) => {
      addFriendInvite(username);
    });

    socket.on('friend-request-accepted', (newRoom: IRoomDoc) => {
      addRoom(newRoom);
    });

    return () => {
      isFriendComponentMounted.current = false;
      socket.off('friend-request');
      socket.off('friend-request-accepted');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on(
      'friend-request-accepted',
      (
        newRoom: IRoomDoc,
        friendUsername: string,
        friendStatus: FriendStatusText
      ) => {
        addRoom(newRoom);
        updateFriendStatus(friendUsername, friendStatus);
      }
    );

    return () => {
      socket.off('friend-request-accepted');
    };
  });

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
    </Box>
  );
}
