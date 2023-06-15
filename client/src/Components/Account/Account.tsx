import { Avatar, Box, Paper, Typography, useMediaQuery } from '@mui/material';
import { format } from 'date-fns';
import theme from '../../Providers/theme';
import { useAuth } from '../../Providers/auth';

export default function Account() {
  const xs = useMediaQuery(theme.breakpoints.down('sm'));
  const auth = useAuth();

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      p='5%'
      bgcolor={theme.palette.grey[100]}
      height={`calc(100vh - ${xs ? '56' : '64'}px)`}
    >
      <Paper sx={{ width: '100%' }}>
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          bgcolor={theme.palette.primary.main}
          height='6rem'
          pt='3rem'
          sx={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}
        >
          <Avatar sx={{ width: '6rem', height: '6rem' }} />
        </Box>
        <Box
          p='4rem 2rem 2rem'
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <Typography variant='h5' component='p'>
            {auth.user?.username}
          </Typography>
          <Typography
            variant='subtitle2'
            component='p'
            mb='1rem'
            fontWeight={300}
          >
            Joined:{' '}
            {auth.user
              ? format(new Date(auth.user?.createdAt), 'M/d/yyyy')
              : ''}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
