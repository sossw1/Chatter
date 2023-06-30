import { useState, FormEvent } from 'react';
import { Button, Grid, Paper, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { IRoomDoc, IMessageDoc } from '../../types/Rooms';
import { useSocket } from '../../Providers/socket';

interface Props {
  selectedRoom: IRoomDoc | null;
}

export default function ChatInput({ selectedRoom }: Props) {
  const [messageInput, setMessageInput] = useState<string>('');
  const socket = useSocket();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!messageInput) return;
    const text = messageInput;
    setMessageInput('');
    const roomId = selectedRoom ? `${selectedRoom._id}` : '';
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';

    const response = await fetch(`/api/rooms/${roomId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${parsedToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    const responseMessage: IMessageDoc = await response.json();

    socket.emit('message', responseMessage);
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
            value={messageInput}
            onChange={(e) => setMessageInput(e.currentTarget.value)}
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
