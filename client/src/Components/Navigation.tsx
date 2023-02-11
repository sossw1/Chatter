import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../Providers/auth';
import { useSocket } from '../Providers/socket';

export default function Navigation() {
  const auth = useAuth();
  const socket = useSocket();

  const handleLogout = async () => {
    try {
      const response = await auth.logout();
      if (response.type === 'confirmation') socket.disconnect();
    } catch (error) {}
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position='fixed'
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              Chatter
            </Typography>
            <Button color='inherit' onClick={handleLogout} hidden={!auth.user}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Toolbar />
      <Outlet />
    </>
  );
}
