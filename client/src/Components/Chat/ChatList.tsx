import { useState, MouseEvent } from 'react';
import { Box, Grid, List, Typography } from '@mui/material';
import mongoose, { Document } from 'mongoose';
import ChatListItem from './ChatListItem';
import { useAuth } from '../../Providers/auth';

export interface IMessage {
  username: string;
  text: string;
  roomId: mongoose.Types.ObjectId;
  hidden: boolean;
}

export interface IMessageDoc extends IMessage, Document {}

export interface IRoom {
  name?: string;
  isDirect: boolean;
  users: string[];
  invitedUsers?: string[];
  messages: IMessageDoc[];
  disabled: boolean;
}

export interface IRoomDoc extends IRoom, Document {}

export default function ChatList() {
  const user = useAuth().user;
  const [rooms, setRooms] = useState<IRoomDoc[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleChatSelection = (event: MouseEvent<HTMLDivElement>) => {
    const id = event.currentTarget.id;
    setSelectedChatId(id);
  };

  return (
    <Box sx={{ padding: '1.5rem .75rem .75rem' }}>
      <Grid container direction='column'>
        <Grid item sx={{ width: '100%' }}>
          <Typography variant='h5' color='primary' sx={{ ml: '1rem' }}>
            Chats
          </Typography>
          <List sx={{ mb: '1rem' }}>
            {rooms
              .filter((room) => !room.isDirect)
              .map((room) => (
                <ChatListItem
                  room={room}
                  selectedChatId={selectedChatId}
                  handleChatSelection={handleChatSelection}
                  key={room._id}
                />
              ))}
          </List>
        </Grid>
        <Grid item>
          <Typography variant='h5' color='primary' sx={{ ml: '1rem' }}>
            Friends
          </Typography>
          <List>
            {rooms
              .filter((room) => room.isDirect)
              .map((room) => (
                <ChatListItem
                  room={room}
                  selectedChatId={selectedChatId}
                  handleChatSelection={handleChatSelection}
                  key={room._id}
                />
              ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
}
