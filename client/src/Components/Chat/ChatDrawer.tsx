import { Box, Drawer, Toolbar } from '@mui/material';
import { IRoomDoc } from '../../types/Rooms';
import { IUserDoc } from '../../Providers/auth';
import ChatStatus from './ChatStatus';
import ChatList from './ChatList';

interface Props {
  drawerWidth: string;
  drawerOpen: boolean;
  handleDrawerToggle: () => void;
  isChatComponentMounted: React.MutableRefObject<boolean>;
  selectedChatId: string | null;
  setSelectedChatId: React.Dispatch<React.SetStateAction<string | null>>;
  sortByName: (a: IRoomDoc, b: IRoomDoc) => 1 | -1 | 0;
  sortByFriendName: (
    a: IRoomDoc,
    b: IRoomDoc,
    user: IUserDoc | null
  ) => 1 | -1 | 0;
}

export default function ChatDrawer({
  drawerWidth,
  drawerOpen,
  handleDrawerToggle,
  isChatComponentMounted,
  selectedChatId,
  setSelectedChatId,
  sortByName,
  sortByFriendName
}: Props) {
  const drawerContent = (
    <>
      <ChatStatus />
      <ChatList
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        sortByName={sortByName}
        sortByFriendName={sortByFriendName}
      />
    </>
  );

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
