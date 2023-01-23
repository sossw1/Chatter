import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Typography
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import theme from '../../Providers/theme';

interface Props {
  friendRequests: string[];
}

export default function FriendRequestList({ friendRequests }: Props) {
  const replyFriendRequest = async (username: string, accept: boolean) => {
    const token = localStorage.getItem('token');
    let parsedToken: string = '';
    if (token) parsedToken = JSON.parse(token);

    const url = '/api/users/friend/reply';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + parsedToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ username, accept })
    });

    if (response.ok) {
      if (accept) {
      } else {
      }
    } else {
      const data = await response.json();
    }
  };

  return (
    <Box display='flex' flexDirection='column'>
      <Typography variant='h3' mb='1.5rem'>
        Friend Requests
      </Typography>
      <Divider />
      <List>
        {friendRequests.map((username) => (
          <>
            <ListItem>
              <Box
                display='flex'
                flexDirection='row'
                alignItems='center'
                p='0.25rem 0'
              >
                <Avatar
                  sx={{ width: '2.5rem', height: '2.5rem', mr: '1.5rem' }}
                />
                <Typography variant='h5' mr='1rem'>
                  {username}
                </Typography>
                <Button
                  sx={{ color: theme.palette.success.main }}
                  onClick={() => replyFriendRequest(username, true)}
                >
                  <Check />
                </Button>
                <Button
                  sx={{ color: theme.palette.error.main }}
                  onClick={() => replyFriendRequest(username, false)}
                >
                  <Close />
                </Button>
              </Box>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </Box>
  );
}
