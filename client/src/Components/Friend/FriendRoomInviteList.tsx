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

  const replyRoomInvite = async (roomId: string, accept: boolean) => {
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';

    const url = `/api/rooms/${roomId}/respond-invite`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + parsedToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ accept })
    });
  };

  return (
    <Box display='flex' flexDirection='column'>
      <Typography variant='h3' mb='1.5rem'>
        Room Invites
      </Typography>
      <Divider />
      <List>
        {chat.roomInvites.map((invite) => (
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
                    {invite.roomName}
                  </Typography>
                  <Button
                    onClick={() => replyRoomInvite(invite.roomId, true)}
                    sx={{
                      color: theme.palette.success.main,
                      minWidth: 'unset'
                    }}
                  >
                    <Check />
                  </Button>
                  <Button
                    onClick={() => replyRoomInvite(invite.roomId, false)}
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
