import { Button, Grid, Input, Paper, useMediaQuery } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import theme from '../../Providers/theme';

interface Props {
  drawerWidth: string;
}

export default function ChatInput(props: Props) {
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      component='form'
      sx={{
        p: '0.75rem',
        position: 'fixed',
        bottom: '1rem',
        width: smDown
          ? 'calc(100% - 2rem)'
          : `calc(100% - ${props.drawerWidth} - 2rem)`
      }}
    >
      <Grid container direction='row'>
        <Grid item sx={{ mr: '1rem', width: 'calc(100% - 7rem)' }}>
          <Input
            sx={{ width: '100%', '.MuiInput-input': { p: '5px 0' } }}
            name='message'
            placeholder='Type a message here...'
            disableUnderline
          ></Input>
        </Grid>
        <Grid item>
          <Button variant='contained' endIcon={<SendIcon />}>
            send
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
