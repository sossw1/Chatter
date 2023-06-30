import { useRef, FormEvent } from 'react';
import { Button, Grid, Paper, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { IRoomDoc, IMessageDoc } from '../../types/Rooms';
import { useSocket } from '../../Providers/socket';

interface Props {
  selectedRoom: IRoomDoc | null;
}

export default function ChatInput({ selectedRoom }: Props) {
  const messageRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const inputEl = messageRef.current;
    const message = inputEl ? inputEl.value : '';
    const roomId = selectedRoom ? `${selectedRoom._id}` : '';
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';

    const response = await fetch(`/api/rooms/${roomId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${parsedToken}`,
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
      <Grid container direction='row' spacing={2}>
        <Grid item xs={11}>
          <TextField
            sx={{ height: '100%' }}
            InputProps={{ sx: { height: '100%' } }}
            fullWidth
            name='message'
            autoComplete='off'
            placeholder='Type a message here...'
            variant='standard'
            inputRef={messageRef}
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            variant='contained'
            type='submit'
            endIcon={<SendIcon />}
            disabled={!selectedRoom}
          >
            send
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
