import { useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Box,
  Grid,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import { ArrowDropDown, ArrowDropUp, Mail, Person } from '@mui/icons-material';
import { useAuth } from '../../Providers/auth';
import theme from '../../Providers/theme';
import { useSocket } from '../../Providers/socket';
import { useChat, getStatusColor, UserStatusText } from '../../Providers/chat';

interface Props {
  isChatComponentMounted: React.MutableRefObject<boolean>;
}

const statusOptions: UserStatusText[] = ['Online', 'Away', 'Invisible'];

export default function ChatStatus({ isChatComponentMounted }: Props) {
  const smDown = useMediaQuery(theme.breakpoints.down('md'));
  const mdDown = useMediaQuery(theme.breakpoints.down('lg'));
  const betweenMdLg = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const navigate = useNavigate();
  const { notifications, userStatus, updateUserStatus } = useChat();
  const { user } = useAuth();
  const username = user?.username;
  const socket = useSocket();
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(menuAnchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) =>
    setMenuAnchorEl(event.currentTarget);

  const handleClose = (selectedStatus: UserStatusText | null) => {
    if (selectedStatus) {
      updateUserStatus(selectedStatus);
      socket.emit('status-update', selectedStatus);
    }

    setMenuAnchorEl(null);
  };

  const unreadNotificationCount = notifications.reduce((acc, current) => {
    const value = current.viewed ? 0 : 1;
    return acc + value;
  }, 0);

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
                id='status-button'
                aria-controls={open ? 'status-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                color='primary'
                disableRipple
                sx={{
                  fontSize: '0.875rem',
                  p: '0',
                  minWidth: 'unset',
                  textTransform: 'none'
                }}
                onClick={handleClick}
              >
                {userStatus}
                {open && <ArrowDropUp />}
                {!open && <ArrowDropDown />}
              </Button>
              <Menu
                id='status-menu'
                anchorEl={menuAnchorEl}
                open={open}
                onClose={() => handleClose(null)}
                MenuListProps={{
                  'aria-labelledby': 'status-button'
                }}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} onClick={() => handleClose(status)}>
                    {status}
                  </MenuItem>
                ))}
              </Menu>
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
              <Badge badgeContent={unreadNotificationCount} color='primary'>
                <Mail color='action' />
              </Badge>
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
}
