import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Box,
  Grid,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Circle, Mail, Person } from '@mui/icons-material';
import { useAuth } from '../../Providers/auth';
import theme from '../../Providers/theme';
import { useSocket } from '../../Providers/socket';
import { useChat, StatusColor } from '../../Providers/chat';

interface Props {
  isChatComponentMounted: React.MutableRefObject<boolean>;
}

export default function ChatStatus({ isChatComponentMounted }: Props) {
  const navigate = useNavigate();
  const { status } = useChat();
  const [statusColor, setStatusColor] = useState<StatusColor>('error');
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const smDown = useMediaQuery(theme.breakpoints.down('md'));
  const mdDown = useMediaQuery(theme.breakpoints.down('lg'));
  const betweenMdLg = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const { user } = useAuth();
  const username = user?.username;
  const socket = useSocket();

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
      case 'Invisible':
        setStatusColor('error');
        break;
      default:
        break;
    }
  }, [status]);

  useEffect(() => {
    socket.on('friend-request', (username: string) => {
      if (username === user?.username || !isChatComponentMounted.current)
        return;
      setNotificationCount((prev) => prev + 1);
    });

    return () => {
      socket.off('friend-request');
    };
  }, [user?.username, socket, isChatComponentMounted]);

  return (
    <Box
      sx={{
        padding: '1rem',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      <Grid container direction='row' alignItems='center' spacing={1}>
        <Grid item xs={3} md={2} lg={2}>
          <Avatar />
        </Grid>
        <Grid item xs={5} md={7} lg={8}>
          <Grid container direction='column'>
            <Typography
              variant='body1'
              sx={{
                width: mdDown ? (smDown ? '5rem' : '9rem') : undefined,
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
        <Grid
          item
          xs={2}
          md={1}
          sx={{ mr: betweenMdLg ? '0.75rem' : undefined }}
        >
          <Tooltip title='Friends'>
            <Button
              size='large'
              sx={{ p: 0, minWidth: 'unset' }}
              onClick={() => navigate('/friend')}
            >
              <Person color='action' />
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={2} md={1}>
          <Tooltip title='Notifications'>
            <Button
              size='large'
              sx={{
                p: 0,
                minWidth: 'unset'
              }}
            >
              <Badge badgeContent={notificationCount} color='primary'>
                <Mail color='action' />
              </Badge>
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
}
