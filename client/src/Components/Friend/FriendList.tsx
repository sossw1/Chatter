import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material';
import { v4 as uuid } from 'uuid';
import { useChat } from '../../Providers/chat';

export default function FriendList() {
  const { friends } = useChat();

  return (
    <Box ml='3rem' mt='3rem'>
      <Typography variant='h3'>Friends List</Typography>
      <List>
        <Divider />
        {friends.sort().map((friend) => (
          <>
            <ListItem key={uuid()}>
              <ListItemAvatar>
                <Avatar sx={{ width: '2rem', height: '2rem' }} />
              </ListItemAvatar>
              <ListItemText primary={friend}></ListItemText>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </Box>
  );
}
