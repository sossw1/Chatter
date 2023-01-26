import { Fragment } from 'react';
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
import { v4 as uuid } from 'uuid';
import theme from '../../Providers/theme';
import { useAuth } from '../../Providers/auth';

interface Props {
  friendRequests: string[];
  deleteRequest: (username: string) => void;
}

export default function FriendRequestList({
  friendRequests,
  deleteRequest
}: Props) {
  const { addOrRemoveFriend } = useAuth();

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
        addOrRemoveFriend(username, true);
        deleteRequest(username);
      } else {
        addOrRemoveFriend(username, false);
        deleteRequest(username);
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
          <Fragment key={uuid()}>
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
          </Fragment>
        ))}
      </List>
    </Box>
  );
}
