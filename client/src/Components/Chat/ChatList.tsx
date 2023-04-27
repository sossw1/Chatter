import { useState, MouseEvent, FormEvent } from 'react';
import {
  Box,
  Button,
  Grid,
  List,
  Modal,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { Add } from '@mui/icons-material';
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
  const chat = useChat();

  const [roomNameInput, setRoomNameInput] = useState<string>('');
  const [open, setOpen] = useState(false);
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

  const groupRooms = chat.rooms
    .filter((room) => !room.isDirect)
    .sort(sortByName);
  const directRooms = chat.rooms
    .filter((room) => room.isDirect)
    .sort((a, b) => sortByFriendName(a, b, user));

  const handleChatSelection = (event: MouseEvent<HTMLDivElement>) => {
    const id = event.currentTarget.id;
    setSelectedChatId(id);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = roomNameInput;
    setRoomNameInput('');

    handleModalClose();
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
            <Button
              variant='outlined'
              size='small'
              focusRipple={false}
              sx={{ ml: 'auto', mr: '0.625rem', p: 0, minWidth: 'unset' }}
              onClick={handleModalOpen}
            >
              <Add sx={{ width: '1.25rem', height: '1.25rem' }} />
            </Button>
            <Modal
              open={open}
              onClose={handleModalClose}
              aria-labelledby='modal-form'
              aria-describedby='modal-create-room-form'
            >
              <Paper
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: 12,
                  p: '2rem'
                }}
              >
                <Box
                  component='form'
                  title='create-room-form'
                  display='flex'
                  flexDirection='column'
                  onSubmit={handleFormSubmit}
                >
                  <Typography variant='h5' mb='1rem'>
                    Create a New Chat Room
                  </Typography>
                  <TextField
                    id='room-name'
                    label='Room Name'
                    variant='outlined'
                    autoFocus
                    onChange={(e) => setRoomNameInput(e.target.value)}
                    sx={{ mb: '0.5rem' }}
                  />
                  <Button variant='contained' type='submit'>
                    Submit
                  </Button>
                </Box>
              </Paper>
            </Modal>
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
