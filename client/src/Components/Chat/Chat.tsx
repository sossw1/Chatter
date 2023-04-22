import { useEffect, useRef, useState } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import theme from '../../Providers/theme';
import { IMessageDoc, INotificationDoc, IRoomDoc } from '../../types/Rooms';
import { sortByName, sortByFriendName } from '../../utils/sort';
import { fetchInitialData } from '../../utils/fetch';
import { getRoomName } from '../../utils/parse';
import { useAuth } from '../../Providers/auth';
import { useSocket } from '../../Providers/socket';
import { useChat, FriendStatusText } from '../../Providers/chat';
import ChatDrawer from './ChatDrawer';
import ChatHeader from './ChatHeader';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';

export default function Chat() {
  const isChatComponentMounted = useRef(true);
  const messageRef = useRef<null | HTMLDivElement>(null);
  const smDown = useMediaQuery(theme.breakpoints.down('md'));
  const mdDown = useMediaQuery(theme.breakpoints.down('lg'));
  const drawerWidth = smDown ? '15rem' : mdDown ? '20rem' : '30rem';
  const { user } = useAuth();
  const socket = useSocket();
  const {
    isInitialDataLoaded,
    rooms,
    loadInitialData,
    addNotification,
    deleteNotificationById,
    addRoom,
    removeRoom,
    addFriend,
    removeFriend,
    addFriendInvite,
    newMessage,
    updateFriendStatus,
    updateUnreadMessageCount,
    incrementUnreadMessageCount
  } = useChat();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<IRoomDoc | null>(null);
  const [displayMessages, setDisplayMessages] = useState<IMessageDoc[]>([]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    if (!isInitialDataLoaded && user) {
      fetchInitialData(user).then((data) => {
        if (data) loadInitialData(data);
      });
    }

    if (socket.disconnected) socket.connect();

    if (user) {
      socket.emit('user-data', user);
    }

    socket.on(
      'friend-request',
      (username: string, notification: INotificationDoc) => {
        addFriendInvite(username);
        if (notification) addNotification(notification);
      }
    );

    socket.on(
      'friend-request-accepted',
      (
        newRoom: IRoomDoc,
        newFriendUsername: string,
        newFriendStatus: FriendStatusText,
        notification: INotificationDoc
      ) => {
        addRoom(newRoom);
        addFriend(newFriendUsername);
        updateFriendStatus(newFriendUsername, newFriendStatus);
        if (notification) addNotification(notification);
        socket.emit('join-room', newRoom._id);
      }
    );

    socket.on('status-update', (username: string, status: FriendStatusText) => {
      updateFriendStatus(username, status);
    });

    socket.on('delete-friend', (username: string) => {
      removeFriend(username);

      if (!user) return;

      const match = rooms.find((room) => {
        return room.isDirect && getRoomName(room, user.username) === username;
      });

      if (!match) return;
      removeRoom(match._id);
    });

    socket.on('delete-notifications', (notifications: string[]) => {
      notifications.forEach((notification) =>
        deleteNotificationById(notification)
      );
    });

    return () => {
      isChatComponentMounted.current = false;
      socket.off('friend-request');
      socket.off('friend-request-accepted');
      socket.off('status-update');
      socket.off('delete-friend');
      socket.off('delete-notifications');
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
      setDisplayMessages(selectedRoom?.messages || []);
      messageRef?.current?.lastElementChild?.scrollIntoView(false);
    }
  }, [rooms, user, selectedChatId, selectedRoom, displayMessages]);

  useEffect(() => {
    updateUnreadMessageCount(selectedChatId || '');

    socket.on('message', (message: IMessageDoc) => {
      newMessage(message);

      if (selectedChatId !== `${message.roomId}`)
        incrementUnreadMessageCount(`${message.roomId}`);

      if (isChatComponentMounted.current)
        messageRef?.current?.lastElementChild?.scrollIntoView(true);
    });

    return () => {
      socket.off('message');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatId]);

  return (
    <Box display='flex' bgcolor={theme.palette.grey[100]}>
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
