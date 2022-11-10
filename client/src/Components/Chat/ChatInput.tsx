import { useRef, FormEvent } from 'react';
import { Button, Grid, Input, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { IRoomDoc } from '../../types/Rooms';

interface Props {
  drawerWidth: string;
  selectedRoom: IRoomDoc | null;
}

export default function ChatInput({ drawerWidth, selectedRoom }: Props) {
  const messageRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const inputEl = messageRef.current;
    const message = inputEl ? inputEl.value : '';
    const roomId: string = selectedRoom ? selectedRoom._id : '';

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
