import { Box } from '@mui/material';
import FriendRequest from './FriendRequest';

export default function Friend() {
  return (
    <Box display='flex' flexDirection='row'>
      <Box display='flex' flexDirection='column'>
        <FriendRequest />
      </Box>
    </Box>
  );
}
