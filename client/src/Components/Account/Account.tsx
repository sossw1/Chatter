import { Box, Typography, useMediaQuery } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import theme from '../../Providers/theme';
import AccountUserInfo from './AccountUserInfo';
import AccountChangePassword from './AccountChangePassword';
import AccountActions from './AccountActions';

export default function Account() {
  const xs = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      p={xs ? '1rem' : '2rem'}
      bgcolor={theme.palette.grey[100]}
      height={`calc(100vh - ${xs ? '56' : '64'}px)`}
    >
      <Link to='/chat'>
        <Box display='flex' flexDirection='row' alignItems='center' mb='1rem'>
          <ArrowBack sx={{ width: '1.5rem', height: '1.5rem', mr: '0.5rem' }} />
          <Typography variant='h6'>Go back to Chat</Typography>
        </Box>
      </Link>
      <Box display='flex' flexDirection='column' alignItems='center'>
        <AccountUserInfo />
        <AccountChangePassword />
        <AccountActions />
      </Box>
    </Box>
  );
}
