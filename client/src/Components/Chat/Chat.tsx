import { useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import theme from '../../Providers/theme';
import ChatDrawer from './ChatDrawer';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';

export default function Chat() {
  const smDown = useMediaQuery(theme.breakpoints.down('md'));
  const mdDown = useMediaQuery(theme.breakpoints.down('lg'));
  const drawerWidth = smDown ? '15rem' : mdDown ? '20rem' : '30rem';

  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', backgroundColor: theme.palette.grey[300] }}>
      <ChatDrawer
        drawerWidth={drawerWidth}
        drawerOpen={drawerOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}`
        }}
      >
        <ChatHeader handleDrawerToggle={handleDrawerToggle} />
        <ChatInput drawerWidth={drawerWidth} />
      </Box>
    </Box>
  );
}
