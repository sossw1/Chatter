import { useState } from 'react';
import { Box, Drawer, IconButton, Toolbar } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const drawerWidth = '15rem';

export default function Chat() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      Dolor non ipsum in consectetur. Aliqua est eiusmod non esse officia
      occaecat cupidatat amet occaecat occaecat laborum Lorem. Tempor labore
      sint laboris enim esse irure dolor consequat aliquip ullamco est aute ex
      dolore. Dolore nisi elit anim ut tempor irure exercitation ex est labore
      mollit cupidatat Lorem ut.
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 }
        }}
        aria-label='chat drawer'
      >
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
          open
        >
          <Toolbar />
          {drawer}
        </Drawer>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}` }
        }}
      >
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        Enim anim cillum nisi eu fugiat ad nostrud sint ad adipisicing sit.
        Culpa pariatur et consequat cillum aliqua amet anim aliquip exercitation
        quis. Qui aliqua est esse nisi in. Ipsum velit velit elit non in duis
        labore sint. Sit ad est adipisicing magna consectetur reprehenderit
        excepteur elit Lorem dolor.
      </Box>
    </Box>
  );
}
