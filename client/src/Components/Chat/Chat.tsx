import { useEffect, useRef, useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import theme from '../../Providers/theme';
import { IMessageDoc, INotificationDoc, IRoomDoc } from '../../types/Rooms';
import { sortByName, sortByFriendName } from '../../utils/sort';
import { useAuth } from '../../Providers/auth';
import { useSocket } from '../../Providers/socket';
import {
  useChat,
  getStatusColor,
  FriendStatusText,
  FriendStatus
} from '../../Providers/chat';
import ChatDrawer from './ChatDrawer';
import ChatHeader from './ChatHeader';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';

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
  const {
    isInitialDataLoaded,
    rooms,
    loadInitialData,
    addNotification,
    addRoom,
    addFriendInvite,
    newMessage,
    updateFriendStatus
  } = useChat();
  // state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<IRoomDoc | null>(null);
  const [displayMessages, setDisplayMessages] = useState<IMessageDoc[]>([]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const fetchInitialData = async () => {
    if (!user) return;

    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';
    let fetchedRooms: IRoomDoc[] = [];
    let fetchedFriendStatuses: FriendStatus[] = [];

    await Promise.all(
      user.rooms
        .map(async (room) => {
          const response = await fetch(`/api/rooms/${room}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${parsedToken}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            const roomDocument: IRoomDoc = await response.json();
            fetchedRooms.push(roomDocument);
          }
        })
        .concat(
          user.friends.map(async (friend) => {
            const response = await fetch(`/api/users/friend/status`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${parsedToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ username: friend })
            });
            if (response.ok) {
              const { status }: { status: FriendStatusText } =
                await response.json();
              const friendStatus = {
                username: friend,
                status,
                statusColor: getStatusColor(status)
              };
              fetchedFriendStatuses.push(friendStatus);
            }
          })
        )
    );

    loadInitialData({
      notifications: user.notifications,
      friendStatuses: fetchedFriendStatuses,
      rooms: fetchedRooms,
      roomInvites: user.roomInvites,
      friends: user.friends,
      friendInvites: user.friendInvites
    });
  };

  useEffect(() => {
    if (!isInitialDataLoaded) {
      fetchInitialData();
    }

    if (socket.disconnected) socket.connect();

    if (user) {
      socket.emit('user-data', user);
    }

    socket.on('message', (message: IMessageDoc) => {
      newMessage(message);

      if (isChatComponentMounted.current)
        messageRef?.current?.lastElementChild?.scrollIntoView(true);
    });

    socket.on(
      'friend-request',
      (username: string, notification: INotificationDoc) => {
        addFriendInvite(username);
        addNotification(notification);
      }
    );

    socket.on(
      'friend-request-accepted',
      (
        newRoom: IRoomDoc,
        friendUsername: string,
        friendStatus: FriendStatusText
      ) => {
        addRoom(newRoom);
        updateFriendStatus(friendUsername, friendStatus);
      }
    );

    return () => {
      isChatComponentMounted.current = false;
      socket.off('message');
      socket.off('friend-request');
      socket.off('friend-request-accepted');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedChatId === null && rooms.length > 0) {
      const groups = rooms.filter((room) => !room.isDirect);
      if (isChatComponentMounted.current) {
        if (groups.length > 0) {
          setSelectedChatId(groups.sort(sortByName)[0]._id);
        } else {
          setSelectedChatId(
            rooms.sort((a, b) => sortByFriendName(a, b, user))[0]._id
          );
        }
      }
    }

    const roomSelection = rooms.find((room) => room._id === selectedChatId);
    if (roomSelection && isChatComponentMounted.current) {
      setSelectedRoom(roomSelection);
      setDisplayMessages(selectedRoom ? selectedRoom.messages : []);
      messageRef?.current?.lastElementChild?.scrollIntoView(false);
    }
  }, [rooms, user, selectedChatId, selectedRoom, displayMessages]);

  return (
    <Box sx={{ display: 'flex', backgroundColor: theme.palette.grey[100] }}>
      <ChatDrawer
        drawerWidth={drawerWidth}
        drawerOpen={drawerOpen}
        handleDrawerToggle={handleDrawerToggle}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
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
          selectedRoom={selectedRoom}
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
