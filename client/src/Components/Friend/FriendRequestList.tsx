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
import { useAuth } from '../../Providers/auth';

interface Props {
  friendRequests: string[];
  deleteRequest: (username: string) => void;
  isFriendComponentMounted: React.MutableRefObject<boolean>;
}

export default function FriendRequestList({
  friendRequests,
  deleteRequest,
  isFriendComponentMounted
}: Props) {
  const [friendRequestMessage, setFriendRequestMessage] = useState<{
    message: string;
    username: string;
    isError: boolean;
  } | null>(null);
  const [disabledRequests, setDisabledRequests] = useState<string[]>([]);
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

    if (!isFriendComponentMounted.current) return;

    if (response.ok) {
      if (accept) {
        setDisabledRequests((prev) => {
          const next = [...prev, username];
          return next;
        });
        setFriendRequestMessage({
          message: 'Friend request accepted!',
          username,
          isError: false
        });
        setTimeout(() => {
          if (isFriendComponentMounted.current) {
            setFriendRequestMessage(null);
            addOrRemoveFriend(username, true);
            deleteRequest(username);
            setDisabledRequests((prev) => {
              const next = prev.filter((user) => user !== username);
              return next;
            });
          }
        }, 3000);
      } else {
        setDisabledRequests((prev) => {
          const next = [...prev, username];
          return next;
        });
        setFriendRequestMessage({
          message: 'Friend request denied',
          username,
          isError: false
        });
        setTimeout(() => {
          if (!isFriendComponentMounted.current) return;
          setFriendRequestMessage(null);
          addOrRemoveFriend(username, false);
          deleteRequest(username);
          setDisabledRequests((prev) => {
            const next = prev.filter((user) => user !== username);
            return next;
          });
        }, 3000);
      }
    } else {
      const data = await response.json();
      setFriendRequestMessage({
        message: 'Error: ' + data.error,
        username,
        isError: true
      });
      setTimeout(() => setFriendRequestMessage(null), 5000);
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
                  <Typography variant='h5' mr='1rem'>
                    {username}
                  </Typography>
                  <Button
                    sx={{ color: theme.palette.success.main }}
                    disabled={disabledRequests.includes(username)}
                    onClick={() => replyFriendRequest(username, true)}
                  >
                    <Check />
                  </Button>
                  <Button
                    sx={{ color: theme.palette.error.main }}
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
