import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FriendRequest from './FriendRequest';
import FriendRequestList from './FriendRequestList';
import { useAuth } from '../../Providers/auth';
import { getSocket } from '../../api/socket';

const socket = getSocket();

export default function Friend() {
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState<string[]>(
    user?.friendInvites || []
  );

  const deleteRequest = (username: string) => {
    setFriendRequests((prev) => {
      const next = prev.filter((request) => request !== username);
      return next;
    });
  };

  useEffect(() => {
    if (user) socket.emit('user-data', user);

    socket.on('friend-request', (username: string) => {
      setFriendRequests((prev) => {
        const next = [...prev, username];
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box display='flex' flexDirection='row' p='2rem'>
      <Box display='flex' flexDirection='column'>
        <FriendRequest />
        <FriendRequestList
          friendRequests={friendRequests}
          deleteRequest={deleteRequest}
        />
      </Box>
    </Box>
  );
}
