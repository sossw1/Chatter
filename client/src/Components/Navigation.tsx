import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../Providers/auth';

export default function Navigation() {
  const auth = useAuth();

  const handleLogout = async () => {
    await auth.logout();
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
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
      <Outlet />
    </>
  );
}
