import { MouseEvent } from 'react';
import { Box, Grid, List, Typography } from '@mui/material';
import ChatListItem from './ChatListItem';
import { IRoomDoc } from '../../types/Rooms';
import { useAuth, IUserDoc } from '../../Providers/auth';
import { useChat } from '../../Providers/chat';

interface Props {
  selectedChatId: string | null;
  setSelectedChatId: React.Dispatch<React.SetStateAction<string | null>>;
  sortByName: (a: IRoomDoc, b: IRoomDoc) => 1 | -1 | 0;
  sortByFriendName: (
    a: IRoomDoc,
    b: IRoomDoc,
    user: IUserDoc | null
  ) => 1 | -1 | 0;
}

export default function ChatList({
  selectedChatId,
  setSelectedChatId,
  sortByName,
  sortByFriendName
}: Props) {
  const user = useAuth().user;
  const { rooms } = useChat();

  const groupRooms = rooms.filter((room) => !room.isDirect).sort(sortByName);
  const directRooms = rooms
    .filter((room) => room.isDirect)
    .sort((a, b) => sortByFriendName(a, b, user));

  const handleChatSelection = (event: MouseEvent<HTMLDivElement>) => {
    const id = event.currentTarget.id;
    setSelectedChatId(id);
  };

  return (
    <Box sx={{ padding: '1.5rem .75rem .75rem' }}>
      <Grid container direction='column'>
        <Grid item sx={{ width: '100%' }}>
          <Typography variant='h5' color='primary' sx={{ ml: '1rem' }}>
            Chats
          </Typography>
          <List sx={{ mb: '1rem' }}>
            {groupRooms.map((room) => (
              <ChatListItem
                room={room}
                selectedChatId={selectedChatId}
                handleChatSelection={handleChatSelection}
                key={room._id}
              />
            ))}
          </List>
        </Grid>
        <Grid item>
          <Typography variant='h5' color='primary' sx={{ ml: '1rem' }}>
            Friends
          </Typography>
          <List>
            {directRooms.map((room) => (
              <ChatListItem
                room={room}
                selectedChatId={selectedChatId}
                handleChatSelection={handleChatSelection}
                key={room._id}
              />
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
}
