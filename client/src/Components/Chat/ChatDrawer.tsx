import { Box, Drawer, Toolbar } from '@mui/material';

interface Props {
  drawerWidth: string;
  drawerOpen: boolean;
  handleDrawerToggle: () => void;
}

const drawerContent = <div></div>;

export default function ChatDrawer({
  drawerWidth,
  drawerOpen,
  handleDrawerToggle
}: Props) {
  return (
    <Box
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 }
      }}
      aria-label='chat drawer'
    >
      <Drawer
        variant='temporary'
        open={drawerOpen}
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
        {drawerContent}
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
        {drawerContent}
      </Drawer>
    </Box>
  );
}
