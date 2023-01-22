import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Button, Input, InputAdornment, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';

export default function Friends() {
  const [isValidUsername, setIsValidUsername] = useState(false);

  const checkUsernameInput = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    if (input.length >= 8 && input.length <= 20) {
      setIsValidUsername(true);
    } else {
      setIsValidUsername(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
  };

  return (
    <Box p='2rem'>
      <Typography variant='h3' pb='1rem'>
        Add Friend
      </Typography>
      <Box component='form' onSubmit={handleSubmit}>
        <Input
          sx={{
            width: '20rem',
            p: '.5rem',
            mr: '1rem'
          }}
          name='username'
          autoComplete='off'
          placeholder='Enter username'
          startAdornment={
            <InputAdornment position='start'>
              <Search />
            </InputAdornment>
          }
          onChange={checkUsernameInput}
        />
        <Button variant='contained' type='submit' disabled={!isValidUsername}>
          Send Friend Request
        </Button>
      </Box>
    </Box>
  );
}
