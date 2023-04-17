import { Fragment, useState } from 'react';
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
import { useChat } from '../../Providers/chat';

interface Props {
  isFriendComponentMounted: React.MutableRefObject<boolean>;
}

export default function FriendRequestList({ isFriendComponentMounted }: Props) {
  const { deleteNotificationByContent, friendInvites, removeFriendInvite } =
    useChat();
  const [friendRequestMessage, setFriendRequestMessage] = useState<{
    message: string;
    username: string;
    isError: boolean;
  } | null>(null);
  const [disabledRequests, setDisabledRequests] = useState<string[]>([]);

  const handleResponse = (username: string, accept: boolean, error?: any) => {
    if (!error) {
      setDisabledRequests((prev) => {
        const next = [...prev, username];
        return next;
      });
    }

    let message: string;
    if (error) {
      message = `Error: ${error}`;
      setFriendRequestMessage({ message, username, isError: true });
    } else {
      message = accept ? 'Friend request accepted!' : 'Friend request denied';
      setFriendRequestMessage({ message, username, isError: false });
    }

    setTimeout(() => {
      removeFriendInvite(username);
      if (!isFriendComponentMounted.current) return;
      setFriendRequestMessage(null);
      if (!error) {
        setDisabledRequests((prev) => {
          const next = prev.filter((user) => user !== username);
          return next;
        });
      }
    }, 3000);
  };

  const replyFriendRequest = async (username: string, accept: boolean) => {
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';

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

    let error = null;
    if (!response.ok) {
      const data = await response.json();
      error = data.error;
    }

    handleResponse(username, accept, error);
    deleteNotificationByContent('friend-request-received', username);
  };

  return (
    <Box display='flex' flexDirection='column'>
      <Typography variant='h3' mb='1.5rem'>
        Friend Requests
      </Typography>
      <Divider />
      <List>
        {friendInvites.map((username) => (
          <Fragment key={uuid()}>
            <ListItem>
              <Box display='flex' flexDirection='column'>
                <Box
                  display='flex'
                  flexDirection='row'
                  alignItems='center'
                  p='0.25rem 0'
                >
                  <Avatar
                    sx={{ width: '2.5rem', height: '2.5rem', mr: '1.5rem' }}
                  />
                  <Typography variant='body1' mr='1rem'>
                    {username}
                  </Typography>
                  <Button
                    sx={{
                      color: theme.palette.success.main,
                      minWidth: 'unset'
                    }}
                    disabled={disabledRequests.includes(username)}
                    onClick={() => replyFriendRequest(username, true)}
                  >
                    <Check />
                  </Button>
                  <Button
                    sx={{ color: theme.palette.error.main, minWidth: 'unset' }}
                    disabled={disabledRequests.includes(username)}
                    onClick={() => replyFriendRequest(username, false)}
                  >
                    <Close />
                  </Button>
                </Box>
                <Box>
                  <Typography
                    variant='h6'
                    color={
                      friendRequestMessage?.isError
                        ? theme.palette.error.main
                        : theme.palette.success.main
                    }
                  >
                    {username === friendRequestMessage?.username
                      ? friendRequestMessage?.message
                      : ''}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
            <Divider />
          </Fragment>
        ))}
      </List>
    </Box>
  );
}
