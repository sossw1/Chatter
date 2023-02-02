import { useRef, FormEvent } from 'react';
import { Button, Grid, Input, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { IRoomDoc, IMessageDoc } from '../../types/Rooms';
import { useSocket } from '../../api/socket';

interface Props {
  drawerWidth: string;
  selectedRoom: IRoomDoc | null;
  setRooms: React.Dispatch<React.SetStateAction<IRoomDoc[]>>;
}

export default function ChatInput({
  drawerWidth,
  selectedRoom,
  setRooms
}: Props) {
  const messageRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const inputEl = messageRef.current;
    const message = inputEl ? inputEl.value : '';
    const roomId: string = selectedRoom ? selectedRoom._id : '';
    let token = localStorage.getItem('token');
    if (token) token = JSON.parse(token);

    const response = await fetch(`/api/rooms/${roomId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: message })
    });

    const responseMessage: IMessageDoc = await response.json();

    socket.emit('message', responseMessage);

    if (inputEl) inputEl.value = '';
  };

  return (
    <Paper
      component='form'
      sx={{
        m: '1rem',
        p: '0.75rem',
        width: 'calc(100% - 2rem)'
      }}
      onSubmit={handleSubmit}
    >
      <Grid container direction='row'>
        <Grid item sx={{ mr: '1rem', width: 'calc(100% - 7rem)' }}>
          <Input
            sx={{ width: '100%', '.MuiInput-input': { p: '5px 0' } }}
            name='message'
            autoComplete='off'
            placeholder='Type a message here...'
            inputRef={messageRef}
            disableUnderline
          />
        </Grid>
        <Grid item>
          <Button variant='contained' type='submit' endIcon={<SendIcon />}>
            send
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
