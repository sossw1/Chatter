import { Fragment, useState, MutableRefObject } from 'react';
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
import { useSocket } from '../../Providers/socket';

interface Message {
  text: string;
  invite: RoomInvite;
  error?: any;
}

interface Props {
  isFriendComponentMounted: MutableRefObject<boolean>;
}

export default function FriendRoomInviteList({
  isFriendComponentMounted
}: Props) {
  const chat = useChat();
  const socket = useSocket();
  const [roomInviteMessage, setRoomInviteMessage] = useState<Message | null>(
    null
  );

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
      chat.deleteNotificationByContent('room-invite-received', invite.roomName);

      if (accept) {
        if (isFriendComponentMounted.current)
          setRoomInviteMessage({ text: 'Invite accepted!', invite });
        const room: IRoomDoc = await response.json();
        chat.addRoom(room);
        socket.emit('join-room', room._id);
      } else {
        if (isFriendComponentMounted.current)
          setRoomInviteMessage({ text: 'Invite declined', invite });
      }
    }

    setTimeout(() => {
      if (isFriendComponentMounted.current) setRoomInviteMessage(null);
      chat.removeRoomInvite(invite.roomId);
    }, 3000);
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
                {roomInviteMessage && (
                  <Box>
                    <Typography
                      variant='h6'
                      color={
                        roomInviteMessage.error
                          ? theme.palette.error.main
                          : theme.palette.success.main
                      }
                    >
                      {invite.roomId === roomInviteMessage.invite.roomId
                        ? roomInviteMessage.text
                        : ''}
                    </Typography>
                  </Box>
                )}
              </Box>
            </ListItem>
            <Divider />
          </Fragment>
        ))}
      </List>
    </Box>
  );
}
