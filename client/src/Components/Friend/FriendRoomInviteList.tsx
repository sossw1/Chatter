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
import { IRoomDoc } from '../../types/Rooms';
import theme from '../../Providers/theme';
import { useChat, RoomInvite } from '../../Providers/chat';

export default function FriendRoomInviteList() {
  const chat = useChat();

  const replyRoomInvite = async (invite: RoomInvite, accept: boolean) => {
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';

    const url = `/api/rooms/${invite.roomId}/respond-invite`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + parsedToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ accept })
    });

    if (response.ok) {
      chat.removeRoomInvite(invite.roomId);
      chat.deleteNotificationByContent('room-invite-received', invite.roomName);

      if (accept) {
        const room: IRoomDoc = await response.json();
        chat.addRoom(room);
      }
    }
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
                    onClick={() => replyRoomInvite(invite, true)}
                    sx={{
                      color: theme.palette.success.main,
                      minWidth: 'unset'
                    }}
                  >
                    <Check />
                  </Button>
                  <Button
                    onClick={() => replyRoomInvite(invite, false)}
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
