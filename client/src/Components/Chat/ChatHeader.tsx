import { useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { IRoomDoc } from '../../types/Rooms';
import { getRoomName } from '../../utils/parse';
import theme from '../../Providers/theme';
import { useAuth } from '../../Providers/auth';

type Status = 'Online' | 'Away' | 'Offline' | 'Loading';
type StatusColor = 'success' | 'warning' | 'error' | 'neutral';

interface Props {
  handleDrawerToggle: () => void;
  selectedRoom: IRoomDoc | null;
}

export default function ChatHeader({
  handleDrawerToggle,
  selectedRoom
}: Props) {
  const [status, setStatus] = useState<Status>('Loading');
  const [statusColor, setStatusColor] = useState<StatusColor>('neutral');
  const down400 = useMediaQuery(theme.breakpoints.down(400));
  const { user } = useAuth();

  const selectedRoomName =
    selectedRoom && user ? getRoomName(selectedRoom, user.username) : '';

  useEffect(() => {
    switch (status) {
      case 'Online':
        setStatusColor('success');
        break;
      case 'Away':
        setStatusColor('warning');
        break;
      case 'Offline':
        setStatusColor('error');
        break;
      case 'Loading':
        setStatusColor('neutral');
        break;
      default:
        break;
    }
  }, [status]);

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
          onClick={handleDrawerToggle}
          sx={{ mr: '0.5rem', display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        {selectedRoomName && (
          <>
            <Grid item sx={{ mr: '1rem' }}>
              <Badge
                overlap='circular'
                variant='dot'
                color={statusColor}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{
                  '& .MuiBadge-badge': {
                    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
                  }
                }}
              >
                <Avatar sx={{ width: '2.5rem', height: '2.5rem' }} />
              </Badge>
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
                  {selectedRoomName}
                </Typography>
                <Grid item>
                  <Typography variant='body2' color='text.secondary'>
                    {status}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        {!selectedRoomName && <Box height='2.5rem'></Box>}
      </Grid>
    </Box>
  );
}
