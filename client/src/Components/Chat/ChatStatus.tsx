import { Avatar, Box, Grid, Typography } from '@mui/material';
import { useAuth } from '../../Providers/auth';

export default function ChatStatus() {
  const auth = useAuth();
  const username = auth.user!.username;

  return (
    <Box
      sx={{
        padding: '.5rem',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      <Grid
        container
        direction='row'
        sx={{ height: '100%' }}
        alignItems='center'
      >
        <Grid item sx={{ mr: '0.5rem' }}>
          <Avatar sx={{ width: '2.5rem', height: '2.5rem' }} />
        </Grid>
        <Grid item>
          <Typography
            variant='subtitle1'
            sx={{
              lineHeight: '1.5rem',
              fontWeight: 300
            }}
          >
            {username}
          </Typography>
          <Typography variant='subtitle2'>status</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
