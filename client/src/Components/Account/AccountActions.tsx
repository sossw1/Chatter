import { Box, Button, Paper, Typography, useMediaQuery } from '@mui/material';
import theme from '../../Providers/theme';
import { useAuth } from '../../Providers/auth';

export default function AccountActions() {
  const xs = useMediaQuery(theme.breakpoints.down('sm'));
  const auth = useAuth();

  const handleLogoutAll = async () => {
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';

    const response = await fetch('/api/users/logout/all', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${parsedToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) auth.logout();
  };

  return (
    <Paper sx={{ p: '2rem', width: xs ? '100%' : '75%', mb: '1rem' }}>
      <Box display='flex' flexDirection='column' alignItems='center'>
        <Typography variant='h5' component='h2' mb='1rem'>
          Account
        </Typography>
        <Button variant='contained' onClick={handleLogoutAll}>
          Log out of all sessions
        </Button>
      </Box>
    </Paper>
  );
}
