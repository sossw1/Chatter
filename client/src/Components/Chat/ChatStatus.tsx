import { useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Box,
  Grid,
  Popover,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import { ArrowDropDown, ArrowDropUp, Mail, Person } from '@mui/icons-material';
import { useAuth } from '../../Providers/auth';
import theme from '../../Providers/theme';
import { useSocket } from '../../Providers/socket';
import { useChat, getStatusColor } from '../../Providers/chat';

interface Props {
  isChatComponentMounted: React.MutableRefObject<boolean>;
}

export default function ChatStatus({ isChatComponentMounted }: Props) {
  const smDown = useMediaQuery(theme.breakpoints.down('md'));
  const mdDown = useMediaQuery(theme.breakpoints.down('lg'));
  const betweenMdLg = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const navigate = useNavigate();
  const { userStatus } = useChat();
  const { user } = useAuth();
  const username = user?.username;
  const socket = useSocket();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const handlePopoverAnchorClick = (event: MouseEvent<HTMLElement>) =>
    setPopoverAnchorEl(event.currentTarget);

  const handlePopoverClose = () => setPopoverAnchorEl(null);

  const open = Boolean(popoverAnchorEl);
  const id = open ? 'status-popover' : undefined;

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
          <Badge
            overlap='circular'
            variant='dot'
            color={getStatusColor(userStatus)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{
              '& .MuiBadge-badge': {
                boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
              }
            }}
          >
            <Avatar />
          </Badge>
        </Grid>
        <Grid item xs={5} md={7} lg={8}>
          <Grid container direction='column'>
            <Grid item>
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
            </Grid>
            <Grid item>
              <Button
                variant='text'
                color='primary'
                disableRipple
                sx={{
                  fontSize: '0.875rem',
                  p: '0',
                  minWidth: 'unset',
                  textTransform: 'none'
                }}
                aria-describedby={id}
                onClick={handlePopoverAnchorClick}
              >
                {userStatus}
                {open && <ArrowDropUp />}
                {!open && <ArrowDropDown />}
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={popoverAnchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
              ></Popover>
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
