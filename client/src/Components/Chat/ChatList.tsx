import { useState, MouseEvent } from 'react';
import { Box, Grid, List, Typography } from '@mui/material';
import { v4 as uuid } from 'uuid';
import mongoose, { Document } from 'mongoose';
import ChatListItem from './ChatListItem';

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

interface Chat {
  name: string;
  _id: string;
  type: string;
}

const chats: Chat[] = [
  { name: 'user1', _id: uuid(), type: 'direct' },
  { name: 'user2', _id: uuid(), type: 'direct' },
  { name: 'group1', _id: uuid(), type: 'group' },
  { name: 'group2', _id: uuid(), type: 'group' },
  { name: 'group3', _id: uuid(), type: 'group' }
];

export default function ChatList() {
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
            {chats
              .filter((chat) => chat.type === 'group')
              .map((chat) => (
                <ChatListItem
                  chat={chat}
                  selectedChatId={selectedChatId}
                  handleChatSelection={handleChatSelection}
                  key={chat._id}
                />
              ))}
          </List>
        </Grid>
        <Grid item>
          <Typography variant='h5' color='primary' sx={{ ml: '1rem' }}>
            Friends
          </Typography>
          <List>
            {chats
              .filter((chat) => chat.type === 'direct')
              .map((chat) => (
                <ChatListItem
                  chat={chat}
                  selectedChatId={selectedChatId}
                  handleChatSelection={handleChatSelection}
                  key={chat._id}
                />
              ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
}
