import { Box, Input, Typography } from '@mui/material';

export default function Friends() {
  return (
    <Box p='2rem'>
      <Typography variant='h3' pb='1rem'>
        Add Friend
      </Typography>
      <Input
        sx={{
          width: '20rem',
          p: '.5rem'
        }}
        name='username'
        autoComplete='off'
        placeholder='Enter username to search'
      />
    </Box>
  );
}
