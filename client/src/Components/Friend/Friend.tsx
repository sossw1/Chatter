import { Box } from '@mui/material';
import FriendRequest from './FriendRequest';
import FriendRequestList from './FriendRequestList';

export default function Friend() {
  return (
    <Box display='flex' flexDirection='row' p='2rem'>
      <Box display='flex' flexDirection='column'>
        <FriendRequest />
        <FriendRequestList />
      </Box>
    </Box>
  );
}
