import { Fragment } from 'react';
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Typography
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { v4 as uuid } from 'uuid';
import theme from '../../Providers/theme';
import { useChat } from '../../Providers/chat';

export default function FriendRoomInviteList() {
  const chat = useChat();

  return (
    <Box display='flex' flexDirection='column'>
      <Typography variant='h3' mb='1.5rem'>
        Room Invites
      </Typography>
      <Divider />
      <List>
        {chat.roomInvites.map((room) => (
          <Fragment key={uuid()}>
            <ListItem>
              <Box display='flex' flexDirection='column'>
                <Box
                  display='flex'
                  flexDirection='row'
                  alignItems='center'
                  p='0.25rem 0'
                >
                  <Typography variant='body1' mr='1rem'>
                    {room}
                  </Typography>
                  <Button
                    sx={{
                      color: theme.palette.success.main,
                      minWidth: 'unset'
                    }}
                  >
                    <Check />
                  </Button>
                  <Button
                    sx={{ color: theme.palette.error.main, minWidth: 'unset' }}
                  >
                    <Close />
                  </Button>
                </Box>
              </Box>
            </ListItem>
            <Divider />
          </Fragment>
        ))}
      </List>
    </Box>
  );
}
