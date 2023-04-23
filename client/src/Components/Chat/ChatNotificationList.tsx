import { useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Box,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Popper,
  Tooltip,
  Typography
} from '@mui/material';
import { ClickAwayListener } from '@mui/base';
import { Circle, Mail } from '@mui/icons-material';
import { v4 as uuid } from 'uuid';
import { getRoomName } from '../../utils/parse';
import theme from '../../Providers/theme';
import { useChat } from '../../Providers/chat';
import { useAuth } from '../../Providers/auth';
import { formatDistance } from 'date-fns';

interface Props {
  unreadNotificationCount: number;
  setSelectedChatId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ChatNotificationList({
  unreadNotificationCount,
  setSelectedChatId
}: Props) {
  const navigate = useNavigate();
  const chat = useChat();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    if (anchorEl) setAnchorEl(null);
  };

  const handleNotificationClick = (event: MouseEvent<HTMLElement>) => {
    const notificationId = event.currentTarget.id;
    const notification = chat.notifications.find(
      (notification) => notification._id === notificationId
    );
    if (notification) {
      const { type } = notification;
      if (type === 'friend-request-received') {
        chat.markNotificationAsRead(notificationId);
        navigate('/friend');
      } else if (type === 'friend-request-accepted' && user) {
        chat.markNotificationAsRead(notificationId);
        const newFriendUsername = notification.text;
        const match = chat.rooms.find(
          (room) =>
            room.isDirect &&
            getRoomName(room, user.username) === newFriendUsername
        );
        if (match) setSelectedChatId(match._id);
      }
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'popper' : undefined;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        <Tooltip title={open ? '' : 'Notifications'}>
          <Button
            size='large'
            sx={{
              p: 0,
              minWidth: 'unset'
            }}
            onClick={handleMenuClick}
          >
            <Badge badgeContent={unreadNotificationCount} color='primary'>
              <Mail color='action' />
            </Badge>
          </Button>
        </Tooltip>
        <Popper id={id} open={open} anchorEl={anchorEl} sx={{ zIndex: 1201 }}>
          <Paper>
            {chat.notifications.length ? (
              <List sx={{ p: '0.25rem' }}>
                {chat.notifications.map((notification, index) => {
                  const durationSinceNotification = formatDistance(
                    new Date(notification.createdAt),
                    Date.now(),
                    { addSuffix: true }
                  );

                  return (
                    <ListItem
                      key={uuid()}
                      sx={{
                        p: 0,
                        mb:
                          index === chat.notifications.length - 1
                            ? 0
                            : '0.25rem'
                      }}
                    >
                      <ListItemButton
                        onClick={handleNotificationClick}
                        id={notification._id}
                        disabled={notification.isRead}
                        sx={{
                          p: '0.5rem',
                          borderRadius: '5px',
                          '&.Mui-selected:hover': {
                            backgroundColor: theme.palette.primary.light,
                            opacity: 0.8
                          },
                          '&.Mui-disabled': {
                            opacity: 0.8
                          }
                        }}
                      >
                        <Box
                          display='flex'
                          flexDirection='row'
                          alignItems='center'
                        >
                          <Box display='flex' flexDirection='column'>
                            <Typography component='p' variant='body2'>
                              {notification.type ===
                                'friend-request-received' &&
                                `${notification.text} has sent you a friend request.`}
                              {notification.type ===
                                'friend-request-accepted' &&
                                `${notification.text} has accepted your friend request.`}
                            </Typography>
                            <Typography
                              component='p'
                              variant='caption'
                              color='primary'
                            >
                              {durationSinceNotification}
                            </Typography>
                          </Box>
                          {!notification.isRead ? (
                            <Tooltip title='unread' enterDelay={400}>
                              <Circle
                                color='primary'
                                sx={{
                                  width: '1rem',
                                  height: '1rem',
                                  ml: '0.5rem'
                                }}
                              />
                            </Tooltip>
                          ) : undefined}
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Typography p='0.5rem' variant='body2' component='p'>
                There are currently no notifications.
              </Typography>
            )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
