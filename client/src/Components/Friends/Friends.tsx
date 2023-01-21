import { Box, Input, InputAdornment, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';

export default function Friends() {
  return (
    <Box p='2rem'>
      <Typography variant='h3' pb='1rem'>
        Add Friend
      </Typography>
      <Box>
        <Input
          sx={{
            width: '20rem',
            p: '.5rem'
          }}
          name='username'
          autoComplete='off'
          placeholder='Search username'
          startAdornment={
            <InputAdornment position='start'>
              <Search />
            </InputAdornment>
          }
        />
      </Box>
    </Box>
  );
}
