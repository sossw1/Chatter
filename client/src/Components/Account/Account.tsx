import {
  Avatar,
  Box,
  Button,
  Paper,
  Typography,
  useMediaQuery
} from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import theme from '../../Providers/theme';
import { useAuth } from '../../Providers/auth';

export default function Account() {
  const xs = useMediaQuery(theme.breakpoints.down('sm'));
  const auth = useAuth();

  return (
    <Box
      p='2rem'
      bgcolor={theme.palette.grey[100]}
      height={`calc(100vh - ${xs ? '56' : '64'}px)`}
    >
      <Link to='/chat'>
        <Box display='flex' flexDirection='row' alignItems='center' mb='1rem'>
          <ArrowBack sx={{ width: '1.5rem', height: '1.5rem', mr: '0.5rem' }} />
          <Typography variant='h6'>Go back to Chat</Typography>
        </Box>
      </Link>
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
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
          <Box
            display='flex'
            flexDirection='row'
            alignItems='center'
            mb='0.5rem'
          >
            <Typography variant='body1' fontSize='1.25rem' mr='0.5rem'>
              Email: {auth.user?.email}
            </Typography>
            <Button sx={{ minWidth: 'unset' }}>
              <Edit />
            </Button>
          </Box>
          <Button sx={{ fontSize: '1rem' }}>Change Password</Button>
        </Box>
      </Paper>
    </Box>
  );
}
