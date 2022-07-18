import { Button, Grid, Input, Paper } from '@mui/material';
import { FormEvent } from 'react';
import SendIcon from '@mui/icons-material/Send';

interface Props {
  drawerWidth: string;
}

export default function ChatInput(props: Props) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
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
            placeholder='Type a message here...'
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
