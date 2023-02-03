import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FriendRequest from './FriendRequest';
import FriendRequestList from './FriendRequestList';
import { useAuth } from '../../Providers/auth';
import { useSocket } from '../../api/socket';

export default function Friend() {
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
