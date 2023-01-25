import { useState } from 'react';
import { Box } from '@mui/material';
import FriendRequest from './FriendRequest';
import FriendRequestList from './FriendRequestList';
import { useAuth } from '../../Providers/auth';

export default function Friend() {
  const [friendRequests, setFriendRequests] = useState<string[]>([]);
  const { user } = useAuth();

  if (user) setFriendRequests(user.friendInvites);

  return (
    <Box display='flex' flexDirection='row' p='2rem'>
      <Box display='flex' flexDirection='column'>
        <FriendRequest />
        <FriendRequestList
          friendRequests={friendRequests}
          setFriendRequests={setFriendRequests}
        />
      </Box>
    </Box>
  );
}
