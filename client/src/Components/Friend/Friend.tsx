import { Box } from '@mui/material';
import FriendRequest from './FriendRequest';
import FriendRequestList from './FriendRequestList';
import { useAuth } from '../../Providers/auth';

export default function Friend() {
  const { user } = useAuth();
  let friendRequests: string[] = [];
  if (user) friendRequests = user.friendInvites;

  return (
    <Box display='flex' flexDirection='row' p='2rem'>
      <Box display='flex' flexDirection='column'>
        <FriendRequest />
        <FriendRequestList friendRequests={friendRequests} />
      </Box>
    </Box>
  );
}
