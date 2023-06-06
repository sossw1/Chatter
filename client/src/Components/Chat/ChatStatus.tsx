import { useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Box,
  CircularProgress,
  Grid,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';
import { v4 as uuid } from 'uuid';
import ChatNotificationList from './ChatNotificationList';
import { ArrowDropDown, ArrowDropUp, Person } from '@mui/icons-material';
import { useAuth } from '../../Providers/auth';
import theme from '../../Providers/theme';
import { useSocket } from '../../Providers/socket';
import {
  useChat,
  getStatusColor,
  UserStatusText,
  StatusColor
} from '../../Providers/chat';

const statusOptions: UserStatusText[] = ['Online', 'Away', 'Invisible'];
const statusOptionColors: StatusColor[] = ['success', 'warning', 'neutral'];

interface Props {
  setSelectedChatId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ChatStatus({ setSelectedChatId }: Props) {
  const smDown = useMediaQuery(theme.breakpoints.down('md'));
  const mdDown = useMediaQuery(theme.breakpoints.down('lg'));
  const betweenMdLg = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const navigate = useNavigate();
  const chat = useChat();
  const auth = useAuth();
  const { user } = useAuth();
  const username = user?.username;
  const socket = useSocket();

  const userMenuOptions = [
    'My Account',
    'Avatar',
    'Security',
    'Settings',
    'Log Out'
  ];

  const [statusMenuAnchorEl, setStatusMenuAnchorEl] =
    useState<HTMLElement | null>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const isStatusMenuOpen = Boolean(statusMenuAnchorEl);
  const isUserMenuOpen = Boolean(userMenuAnchorEl);

  const handleStatusMenuClick = (event: MouseEvent<HTMLButtonElement>) =>
    setStatusMenuAnchorEl(event.currentTarget);

  const handleUserMenuClick = (event: MouseEvent<HTMLButtonElement>) =>
    setUserMenuAnchorEl(event.currentTarget);

  const handleStatusMenuClose = (selectedStatus: UserStatusText | null) => {
    if (selectedStatus) {
      chat.updateUserStatus(selectedStatus);
      socket.emit('status-update', selectedStatus);
    }

    setStatusMenuAnchorEl(null);
  };

  const handleUserMenuClose = async (selectedMenuItem: string | null) => {
    if (selectedMenuItem) {
      switch (selectedMenuItem) {
        case 'Log Out':
          try {
            const response = await auth.logout();
            if (response.type === 'confirmation') socket.disconnect();
          } catch (error) {}
          break;
        default:
          break;
      }
    }

    setUserMenuAnchorEl(null);
  };

  const unreadNotificationCount = chat.notifications.reduce((acc, current) => {
    const value = current.isRead ? 0 : 1;
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
          <Button
            id='user-menu-button'
            aria-controls={isUserMenuOpen ? 'user-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={isUserMenuOpen ? 'true' : undefined}
            sx={{
              p: 0,
              minWidth: 'unset',
              ':hover': {
                opacity: 0.8
              }
            }}
            onClick={handleUserMenuClick}
          >
            <Badge
              overlap='circular'
              variant='dot'
              color={
                chat.isInitialDataLoaded
                  ? getStatusColor(chat.userStatus)
                  : 'neutral'
              }
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              sx={{
                '& .MuiBadge-badge': {
                  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
                }
              }}
            >
              <Avatar />
            </Badge>
          </Button>
          <Menu
            id='user-menu'
            anchorEl={userMenuAnchorEl}
            open={isUserMenuOpen}
            MenuListProps={{
              'aria-labelledby': 'user-menu-button'
            }}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            onClose={() => handleUserMenuClose(null)}
          >
            {userMenuOptions.map((option) => (
              <MenuItem
                key={uuid()}
                onClick={() => handleUserMenuClose(option)}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
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
              {chat.isInitialDataLoaded ? (
                <>
                  <Button
                    variant='text'
                    id='status-button'
                    aria-controls={isStatusMenuOpen ? 'status-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={isStatusMenuOpen ? 'true' : undefined}
                    color='primary'
                    disableRipple
                    sx={{
                      fontSize: '0.875rem',
                      p: '0',
                      minWidth: 'unset',
                      textTransform: 'none'
                    }}
                    onClick={handleStatusMenuClick}
                  >
                    {chat.userStatus}
                    {isStatusMenuOpen && <ArrowDropUp />}
                    {!isStatusMenuOpen && <ArrowDropDown />}
                  </Button>
                  <Menu
                    id='status-menu'
                    anchorEl={statusMenuAnchorEl}
                    open={isStatusMenuOpen}
                    onClose={() => handleStatusMenuClose(null)}
                    MenuListProps={{
                      'aria-labelledby': 'status-button'
                    }}
                  >
                    {statusOptions.map((status, index) => (
                      <MenuItem
                        key={status}
                        onClick={() => handleStatusMenuClose(status)}
                      >
                        <Badge
                          variant='dot'
                          color={statusOptionColors[index]}
                          sx={{
                            mr: '0.5rem',
                            border: '7px solid #ddd',
                            borderRadius: '7px',
                            '& .MuiBadge-badge': {
                              boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
                            }
                          }}
                        />
                        {status}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                <CircularProgress size='1rem' sx={{ mt: '0.125rem' }} />
              )}
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
          <ChatNotificationList
            unreadNotificationCount={unreadNotificationCount}
            setSelectedChatId={setSelectedChatId}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
