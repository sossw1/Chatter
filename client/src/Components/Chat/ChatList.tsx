import { useEffect, useState, MouseEvent } from 'react';
import { Box, Grid, List, Typography } from '@mui/material';
import mongoose, { Document } from 'mongoose';
import ChatListItem from './ChatListItem';
import { useAuth, IUserDoc } from '../../Providers/auth';

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

const sortByName = (a: IRoomDoc, b: IRoomDoc) => {
  if (a.name && b.name) {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
  }
  return 0;
};

const sortByFriendName = (a: IRoomDoc, b: IRoomDoc, user: IUserDoc | null) => {
  if (user) {
    const friendA = a.users.filter((roomUser) => roomUser !== user.username)[0];
    const friendB = b.users.filter((roomUser) => roomUser !== user.username)[0];
    if (friendA > friendB) return 1;
    if (friendA < friendB) return -1;
    return 0;
  }
  return 0;
};

export default function ChatList() {
  const user = useAuth().user;
  const [rooms, setRooms] = useState<IRoomDoc[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleChatSelection = (event: MouseEvent<HTMLDivElement>) => {
    const id = event.currentTarget.id;
    setSelectedChatId(id);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      let fetchedRooms: IRoomDoc[] = [];
      const token = JSON.parse(localStorage.getItem('token') || '');
      if (user) {
        for (let roomId of user.rooms) {
          const response = await fetch(`/api/rooms/${roomId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            const roomDocument: IRoomDoc = await response.json();
            fetchedRooms.push(roomDocument);
          }
        }
      }
      setRooms(() => [...fetchedRooms]);
    };

    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedChatId === null && rooms.length > 0) {
      const groups = rooms.filter((room) => !room.isDirect);
      if (groups.length > 0) {
        setSelectedChatId(groups.sort(sortByName)[0]._id);
      } else {
        setSelectedChatId(
          rooms.sort((a, b) => sortByFriendName(a, b, user))[0]._id
        );
      }
    }
  }, [user, rooms, selectedChatId]);

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
              .sort(sortByName)
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
              .sort((a, b) => sortByFriendName(a, b, user))
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
