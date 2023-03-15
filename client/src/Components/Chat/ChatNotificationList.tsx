import { useState, MouseEvent } from 'react';
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
import { Mail } from '@mui/icons-material';
import { v4 as uuid } from 'uuid';
import theme from '../../Providers/theme';
import { useChat } from '../../Providers/chat';
import { formatDistance } from 'date-fns';

interface Props {
  unreadNotificationCount: number;
}

export default function ChatNotificationList({
  unreadNotificationCount
}: Props) {
  const { notifications } = useChat();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    if (anchorEl) setAnchorEl(null);
  };

  const handleNotificationClick = (event: MouseEvent<HTMLElement>) => {};

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
            {notifications.length ? (
              <List sx={{ p: '0.25rem' }}>
                {notifications.map((notification, index) => {
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
                        mb: index === notifications.length - 1 ? 0 : '0.25rem'
                      }}
                    >
                      <ListItemButton
                        onClick={handleNotificationClick}
                        sx={{
                          p: '0.5rem',
                          borderRadius: '5px',
                          '&.Mui-selected:hover': {
                            backgroundColor: theme.palette.primary.light,
                            opacity: 0.8
                          }
                        }}
                      >
                        <Box display='flex' flexDirection='column'>
                          <Typography component='p' variant='body2'>
                            {notification.text}
                          </Typography>
                          <Typography
                            component='p'
                            variant='caption'
                            color='primary'
                          >
                            {durationSinceNotification}
                          </Typography>
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
