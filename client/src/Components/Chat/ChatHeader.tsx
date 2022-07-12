import { useState } from 'react';
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Circle, Menu as MenuIcon } from '@mui/icons-material';
import theme from '../../Providers/theme';

interface Props {
  handleDrawerToggle: () => void;
}

export default function ChatHeader(props: Props) {
  const [status, setStatus] = useState<'Online' | 'Away' | 'Offline'>('Online');
  const [statusColor, setStatusColor] = useState<
    'success' | 'warning' | 'error'
  >('success');

  const down400 = useMediaQuery(theme.breakpoints.down(400));

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
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={props.handleDrawerToggle}
          sx={{ mr: '0.5rem', display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Grid item sx={{ mr: '1rem' }}>
          <Avatar sx={{ width: '2.5rem', height: '2.5rem' }} />
        </Grid>
        <Grid item>
          <Grid container direction='column'>
            <Typography
              variant='body1'
              sx={{
                width: down400 ? '9rem' : undefined,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              username
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
