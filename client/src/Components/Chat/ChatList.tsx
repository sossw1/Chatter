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
          <Grid container direction='row' alignItems='center'>
            <Typography variant='h5' color='primary' sx={{ ml: '1rem' }}>
              Chats
            </Typography>
            <Typography variant='subtitle1' color='primary' p='2px 0 0 0.5rem'>
              [{groupRooms.length}]
            </Typography>
          </Grid>
          <List>
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
          <Grid container direction='row' alignItems='center'>
            <Typography variant='h5' color='primary' sx={{ ml: '1rem' }}>
              Friends
            </Typography>
            <Typography variant='subtitle1' color='primary' p='2px 0 0 0.5rem'>
              [{directRooms.length}]
            </Typography>
          </Grid>
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
