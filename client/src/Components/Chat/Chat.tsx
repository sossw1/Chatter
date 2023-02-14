import { useEffect, useRef, useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import theme from '../../Providers/theme';
import { IMessageDoc, IRoomDoc } from '../../types/Rooms';
import { useAuth, IUserDoc } from '../../Providers/auth';
import { useSocket } from '../../Providers/socket';
import { useChat } from '../../Providers/chat';
import ChatDrawer from './ChatDrawer';
import ChatHeader from './ChatHeader';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';

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

const getRoomName = (room: IRoomDoc, username: string) => {
  if (!username) return null;
  if (room.isDirect) {
    const friend = room.users.find((user) => user !== username);
    return friend ? friend : '';
  } else {
    return room.name ? room.name : '';
  }
};

export default function Chat() {
  // refs
  const isChatComponentMounted = useRef(true);
  const messageRef = useRef<null | HTMLDivElement>(null);
  // styling
  const smDown = useMediaQuery(theme.breakpoints.down('md'));
  const mdDown = useMediaQuery(theme.breakpoints.down('lg'));
  const drawerWidth = smDown ? '15rem' : mdDown ? '20rem' : '30rem';
  // hooks
  const { user } = useAuth();
  const socket = useSocket();
  const chat = useChat();
  // state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<IRoomDoc | null>(null);
  const [selectedRoomName, setSelectedRoomName] = useState<string | null>(null);
  const [displayMessages, setDisplayMessages] = useState<IMessageDoc[]>([]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      let fetchedRooms: IRoomDoc[] = [];
      const token = JSON.parse(localStorage.getItem('token') || '');
      if (user) {
        await Promise.all(
          user.rooms.map(async (room) => {
            const response = await fetch(`/api/rooms/${room}`, {
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
          })
        );
        chat.loadInitialData({
          rooms: fetchedRooms,
          roomInvites: user.roomInvites,
          friends: user.friends,
          friendInvites: user.friendInvites
        });
      }
    };

    fetchRooms();

    if (socket.disconnected) socket.connect();

    if (user) {
      socket.emit('user-data', user);
    }

    socket.on('message', (message: IMessageDoc) => {
      chat.newMessage(message);

      if (isChatComponentMounted.current)
        messageRef?.current?.lastElementChild?.scrollIntoView(true);
    });

    return () => {
      isChatComponentMounted.current = false;
      socket.off('message');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedChatId === null && chat.rooms.length > 0) {
      const groups = chat.rooms.filter((room) => !room.isDirect);
      if (isChatComponentMounted.current) {
        if (groups.length > 0) {
          setSelectedChatId(groups.sort(sortByName)[0]._id);
        } else {
          setSelectedChatId(
            chat.rooms.sort((a, b) => sortByFriendName(a, b, user))[0]._id
          );
        }
      }
    }

    const roomSelection = chat.rooms.find(
      (room) => room._id === selectedChatId
    );
    if (roomSelection && isChatComponentMounted.current) {
      setSelectedRoom(roomSelection);
      if (user) setSelectedRoomName(getRoomName(roomSelection, user.username));
      setDisplayMessages(selectedRoom ? selectedRoom.messages : []);
      messageRef?.current?.lastElementChild?.scrollIntoView(false);
    }
  }, [chat, user, selectedChatId, selectedRoom, displayMessages]);

  return (
    <Box sx={{ display: 'flex', backgroundColor: theme.palette.grey[100] }}>
      <ChatDrawer
        drawerWidth={drawerWidth}
        drawerOpen={drawerOpen}
        handleDrawerToggle={handleDrawerToggle}
        isChatComponentMounted={isChatComponentMounted}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        rooms={chat.rooms}
        sortByName={sortByName}
        sortByFriendName={sortByFriendName}
      />
      <Box
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}`
        }}
      >
        <ChatHeader
          handleDrawerToggle={handleDrawerToggle}
          selectedRoomName={selectedRoomName}
        />
        <ChatHistory
          displayMessages={displayMessages}
          messageRef={messageRef}
        />
        <ChatInput selectedRoom={selectedRoom} />
      </Box>
    </Box>
  );
}
