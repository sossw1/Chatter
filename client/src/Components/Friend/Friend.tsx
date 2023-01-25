import { useState } from 'react';
import { Box } from '@mui/material';
import FriendRequest from './FriendRequest';
import FriendRequestList from './FriendRequestList';
import { useAuth } from '../../Providers/auth';

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
