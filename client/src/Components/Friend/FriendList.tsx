import { Fragment } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { v4 as uuid } from 'uuid';
import { useChat } from '../../Providers/chat';
import theme from '../../Providers/theme';

export default function FriendList() {
  const { friends, findFriendStatus } = useChat();

  const handleDeleteFriend = (username: string) => {
    const url = '/api/users/friend';
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';
    fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${parsedToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });
  };

  return (
    <Box ml='3rem' mt='3rem'>
      <Typography variant='h3' pb='1rem'>
        Friends List
      </Typography>
      <List>
        <Divider />
        {friends.sort().map((friend) => (
          <Fragment key={uuid()}>
            <ListItem>
              <ListItemAvatar>
                <Badge
                  overlap='circular'
                  variant='dot'
                  color={findFriendStatus(friend)?.statusColor || 'neutral'}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  sx={{
                    '& .MuiBadge-badge': {
                      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
                    }
                  }}
                >
                  <Avatar sx={{ width: '2rem', height: '2rem' }} />
                </Badge>
              </ListItemAvatar>
              <ListItemText sx={{ mr: '1rem' }} primary={friend}></ListItemText>
              <Button
                sx={{ minWidth: 'unset ' }}
                onClick={() => handleDeleteFriend(friend)}
              >
                <Delete />
              </Button>
            </ListItem>
            <Divider />
          </Fragment>
        ))}
      </List>
    </Box>
  );
}
