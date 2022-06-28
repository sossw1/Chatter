import { useState } from 'react';
import { Avatar, Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { Circle } from '@mui/icons-material';
import { useAuth } from '../../Providers/auth';
import theme from '../../Providers/theme';

export default function ChatStatus() {
  const [status, setStatus] = useState<'Online' | 'Away' | 'Offline'>('Online');
  const [statusColor, setStatusColor] = useState<
    'success' | 'warning' | 'error'
  >('success');

  const smDown = useMediaQuery(theme.breakpoints.down('md'));
  const mdDown = useMediaQuery(theme.breakpoints.down('lg'));

  const auth = useAuth();
  const username = auth.user!.username;

  return (
    <Box
      sx={{
        padding: '1.25rem 1.25rem',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      <Grid
        container
        direction='row'
        sx={{ height: '100%' }}
        alignItems='center'
      >
        <Grid item sx={{ mr: '1rem' }}>
          <Avatar sx={{ width: '2.5rem', height: '2.5rem' }} />
        </Grid>
        <Grid item>
          <Grid container direction='column'>
            <Typography
              variant='body1'
              sx={{
                width: mdDown ? (smDown ? '8rem' : '13rem') : '23rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {username}
            </Typography>
            <Grid item>
              <Grid container direction='row' alignItems='center'>
                <Grid item sx={{ mr: '0.25rem' }}>
                  <Circle
                    sx={{ width: '0.75rem', height: '0.75rem' }}
                    color={statusColor}
                  />
                </Grid>
                <Grid item>
                  <Typography variant='body2' color='text.secondary'>
                    {status}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
