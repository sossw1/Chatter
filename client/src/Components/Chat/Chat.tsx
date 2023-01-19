import { useEffect, useRef, useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { getSocket } from '../../api/socket';
import theme from '../../Providers/theme';
import { IMessageDoc, IRoomDoc } from '../../types/Rooms';
import { useAuth, IUserDoc } from '../../Providers/auth';
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

const socket = getSocket();

export default function Chat() {
  const smDown = useMediaQuery(theme.breakpoints.down('md'));
  const mdDown = useMediaQuery(theme.breakpoints.down('lg'));
  const drawerWidth = smDown ? '15rem' : mdDown ? '20rem' : '30rem';
  const { user } = useAuth();
  const [rooms, setRooms] = useState<IRoomDoc[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<IRoomDoc | null>(null);
  const [selectedRoomName, setSelectedRoomName] = useState<string | null>(null);
  const [displayMessages, setDisplayMessages] = useState<IMessageDoc[]>([]);
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  const messageRef = useRef<null | HTMLDivElement>(null);

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

    if (user) {
      socket.emit('user-data', user);
    }

    socket.on('message', (message: IMessageDoc) => {
      setRooms((rooms) => {
        return rooms.map((room) => {
          if (room._id === message.roomId) {
            room.messages.push(message);
          }
          return room;
        });
      });

      if (
        messageRef &&
        messageRef.current &&
        messageRef.current.lastElementChild
      ) {
        messageRef.current.lastElementChild.scrollIntoView(false);
      }
    });

    return () => {
      socket.disconnect();
    };
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

    const roomSelection = rooms.find((room) => room._id === selectedChatId);
    if (roomSelection) {
      setSelectedRoom(roomSelection);
      if (user) setSelectedRoomName(getRoomName(roomSelection, user.username));
      setDisplayMessages(selectedRoom ? selectedRoom.messages : []);
    }
  }, [user, rooms, selectedChatId, selectedRoom, displayMessages]);

  return (
    <Box sx={{ display: 'flex', backgroundColor: theme.palette.grey[100] }}>
      <ChatDrawer
        drawerWidth={drawerWidth}
        drawerOpen={drawerOpen}
        handleDrawerToggle={handleDrawerToggle}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        rooms={rooms}
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
        <ChatInput
          drawerWidth={drawerWidth}
          selectedRoom={selectedRoom}
          setRooms={setRooms}
        />
      </Box>
    </Box>
  );
}
