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
import { useSocket } from '../../Providers/socket';

type Status = 'Online' | 'Away' | 'Offline' | 'Loading';
type StatusColor = 'success' | 'warning' | 'error' | 'neutral';

interface UserStatusObject {
  username: string;
  status: Status;
  statusColor: StatusColor;
}

interface Props {
  handleDrawerToggle: () => void;
  selectedRoom: IRoomDoc | null;
}

export default function ChatHeader({
  handleDrawerToggle,
  selectedRoom
}: Props) {
  const [friendStatuses, setFriendStatuses] = useState<UserStatusObject[]>([]);
  const down400 = useMediaQuery(theme.breakpoints.down(400));
  const { user } = useAuth();
  const socket = useSocket();

  const selectedRoomName =
    selectedRoom && user ? getRoomName(selectedRoom, user.username) : '';

  const getStatusColor = (status: Status): StatusColor => {
    if (status === 'Online') return 'success';
    else if (status === 'Away') return 'warning';
    else return 'error';
  };

  const getFriendStatuses = async () => {
    const friends = user?.friends;
    if (!friends) return;
    const token = JSON.parse(localStorage.getItem('token') || '');
    for (let friend of friends) {
      try {
        const response = await fetch(`/api/users/friend/status`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: friend })
        });
        if (response.ok) {
          const { status }: { status: Status } = await response.json();
          const friendStatusObject = {
            username: friend,
            status,
            statusColor: getStatusColor(status)
          };
          setFriendStatuses((prev) => {
            return [...prev, friendStatusObject];
          });
        }
      } catch (error) {}
    }
  };

  const findFriendStatus = (username: string) => {
    const friendStatusObject = friendStatuses.find(
      (status) => status.username === username
    );
    if (friendStatusObject) {
      return {
        status: friendStatusObject.status,
        statusColor: friendStatusObject.statusColor
      };
    }
  };

  useEffect(() => {
    getFriendStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on('status-update', (username: string, status: Status) => {
      const statusColor = getStatusColor(status);
      const newFriendStatus = { username, status, statusColor };

      setFriendStatuses((prev) => {
        const next = [...prev];
        const friendIndex = next.findIndex(
          (status) => status.username === username
        );
        next[friendIndex] = newFriendStatus;
        return next;
      });
    });

    return () => {
      socket.off('status-update');
    };
  }, [socket]);

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
                color={
                  selectedRoom?.isDirect
                    ? findFriendStatus(selectedRoomName)?.statusColor
                    : 'neutral'
                }
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
                    {selectedRoom?.isDirect
                      ? findFriendStatus(selectedRoomName)?.status
                      : 'Loading'}
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
