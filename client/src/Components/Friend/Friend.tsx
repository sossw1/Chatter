import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import FriendRequest from './FriendRequest';
import FriendRequestList from './FriendRequestList';
import { useAuth } from '../../Providers/auth';
import { useSocket } from '../../api/socket';

export default function Friend() {
  const isFriendComponentMounted = useRef(true);
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState<string[]>(
    user?.friendInvites || []
  );
  const socket = useSocket();

  const deleteRequest = (username: string) => {
    setFriendRequests((prev) => {
      const next = prev.filter((request) => request !== username);
      return next;
    });
  };

  useEffect(() => {
    if (socket.disconnected) socket.connect();

    if (user) socket.emit('user-data', user);

    socket.on('friend-request', (username: string) => {
      setFriendRequests((prev) => {
        const next = [...prev, username];
        return next;
      });
    });

    return () => {
      socket.disconnect();
      isFriendComponentMounted.current = false;
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
        <FriendRequest />
        <FriendRequestList
          friendRequests={friendRequests}
          deleteRequest={deleteRequest}
          isFriendComponentMounted={isFriendComponentMounted}
        />
      </Box>
    </Box>
  );
}
