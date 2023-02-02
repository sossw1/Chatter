import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Button, Input, InputAdornment, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import theme from '../../Providers/theme';
import { useAuth } from '../../Providers/auth';
import { useSocket } from '../../api/socket';

export default function FriendRequest() {
  const [isValidUsername, setIsValidUsername] = useState(false);
  const [isSuccessfulFriendRequest, setIsSuccessfulFriendRequest] =
    useState<boolean>(true);
  const [friendRequestMessage, setFriendRequestMessage] = useState<string>('');
  const { user } = useAuth();
  const socket = useSocket();

  const checkUsernameInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const input = event.target.value;
    if (input.length >= 8 && input.length <= 20) {
      setIsValidUsername(true);
    } else {
      setIsValidUsername(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = event.currentTarget.querySelector('input')?.value;
    event.currentTarget.reset();
    const token = localStorage.getItem('token');
    if (!username || !token) return;

    const url = '/api/users/friend/invite';
    const parsedToken = JSON.parse(token);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + parsedToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ username })
    });

    if (response.ok) {
      setFriendRequestMessage('Friend request sent successfully!');
      socket.emit('friend-request', {
        requester: user ? user.username : '',
        requested: username
      });
    } else {
      const error = await response.json();
      setIsSuccessfulFriendRequest(false);
      setFriendRequestMessage('Error: ' + error.error);
    }
  };

  return (
    <Box
      component='form'
      display='flex'
      flexDirection='column'
      onSubmit={handleSubmit}
      mb={friendRequestMessage === '' ? '3.75rem' : '2rem'}
    >
      <Typography variant='h3' pb='1rem'>
        Add Friend
      </Typography>
      <Input
        sx={{
          p: '.5rem',
          mr: '1rem',
          mb: '.5rem'
        }}
        fullWidth
        name='username'
        autoComplete='off'
        placeholder='Enter username'
        startAdornment={
          <InputAdornment position='start'>
            <Search />
          </InputAdornment>
        }
        error={!isSuccessfulFriendRequest}
        onChange={(e) => {
          checkUsernameInput(e);
          setIsSuccessfulFriendRequest(true);
          setFriendRequestMessage('');
        }}
      />
      <Button
        variant='contained'
        fullWidth
        type='submit'
        disabled={!isValidUsername}
      >
        Send Friend Request
      </Button>
      <Typography
        variant='subtitle1'
        color={
          isSuccessfulFriendRequest
            ? theme.palette.success.main
            : theme.palette.error.main
        }
      >
        {friendRequestMessage}
      </Typography>
    </Box>
  );
}
