import { Fragment, MouseEvent } from 'react';
import {
  Avatar,
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

export default function FriendList() {
  const { friends } = useChat();

  const handleDeleteFriend = (username: string) => {};

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
                <Avatar sx={{ width: '2rem', height: '2rem' }} />
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
