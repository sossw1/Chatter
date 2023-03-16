import { createContext, useContext, useState } from 'react';
import { IMessageDoc, IRoomDoc, INotificationDoc } from '../types/Rooms';

export type UserStatusText = 'Online' | 'Away' | 'Offline' | 'Invisible';
export type FriendStatusText = 'Online' | 'Away' | 'Offline' | 'Loading';
export type StatusColor = 'success' | 'warning' | 'neutral' | 'error';

export interface FriendStatus {
  username: string;
  status: FriendStatusText;
  statusColor: StatusColor;
}

interface ChatData {
  notifications: INotificationDoc[];
  friendStatuses: FriendStatus[];
  rooms: IRoomDoc[];
  roomInvites: string[];
  friends: string[];
  friendInvites: string[];
}

interface ChatContextProps {
  isInitialDataLoaded: boolean;
  notifications: INotificationDoc[];
  userStatus: UserStatusText;
  friendStatuses: FriendStatus[];
  rooms: IRoomDoc[];
  roomInvites: string[];
  friends: string[];
  friendInvites: string[];
  loadInitialData: (data: ChatData) => void;
  clearChatContext: () => void;
  addNotification: (notification: INotificationDoc) => void;
  markNotificationAsRead: (id: string) => void;
  updateUserStatus: (status: UserStatusText) => void;
  updateFriendStatus: (username: string, status: FriendStatusText) => void;
  findFriendStatus: (
    username: string
  ) => { status: FriendStatusText; statusColor: StatusColor } | undefined;
  addRoom: (room: IRoomDoc) => void;
  removeRoom: (room: string) => void;
  addFriend: (username: string) => void;
  removeFriend: (username: string) => void;
  addFriendInvite: (username: string) => void;
  removeFriendInvite: (username: string) => void;
  newMessage: (message: IMessageDoc) => void;
}

export const getStatusColor = (
  status: UserStatusText | FriendStatusText
): StatusColor => {
  if (status === 'Online') return 'success';
  else if (status === 'Away') return 'warning';
  else if (status === 'Offline') return 'error';
  else return 'neutral';
};

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: JSX.Element }) => {
  const [isInitialDataLoaded, setIsInitialDataLoaded] =
    useState<boolean>(false);
  const [userStatus, setUserStatus] = useState<UserStatusText>('Offline');
  const [friendStatuses, setFriendStatuses] = useState<FriendStatus[]>([]);
  const [rooms, setRooms] = useState<IRoomDoc[]>([]);
  const [roomInvites, setRoomInvites] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [friendInvites, setFriendInvites] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<INotificationDoc[]>([]);

  const loadInitialData = ({
    notifications,
    friendStatuses,
    rooms,
    roomInvites,
    friends,
    friendInvites
  }: ChatData) => {
    setNotifications(notifications);
    setFriendStatuses(friendStatuses);
    setRooms(rooms);
    setRoomInvites(roomInvites);
    setFriends(friends);
    setFriendInvites(friendInvites);
    setIsInitialDataLoaded(true);
  };

  const clearChatContext = () => {
    setIsInitialDataLoaded(false);
    setUserStatus('Offline');
    setFriendStatuses([]);
    setRooms([]);
    setRoomInvites([]);
    setFriends([]);
    setFriendInvites([]);
    setNotifications([]);
  };

  const addNotification = (notification: INotificationDoc) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markNotificationAsRead = async (id: string) => {
    const token = localStorage.getItem('token');
    let parsedToken: string = '';
    if (token) parsedToken = JSON.parse(token);
    const url = `/api/notifications/${id}/mark-read`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + parsedToken,
        Accept: 'application/json'
      }
    });

    if (response.ok) {
      setNotifications((prev) => {
        const matchIndex = prev.findIndex(
          (notification) => notification._id === id
        );
        if (matchIndex === -1) return prev;
        const next = [...prev];
        next[matchIndex].isRead = true;
        return next;
      });
    }
  };

  const updateUserStatus = (status: UserStatusText) => {
    setUserStatus(status);
  };

  const updateFriendStatus = (username: string, status: FriendStatusText) => {
    const newFriendStatus = {
      username,
      status,
      statusColor: getStatusColor(status)
    };
    setFriendStatuses((prev) => {
      const next = [...prev];
      const friendIndex = next.findIndex(
        (status) => status.username === username
      );
      if (friendIndex === -1) {
        return [...prev, newFriendStatus];
      } else {
        next[friendIndex] = newFriendStatus;
        return next;
      }
    });
  };

  const findFriendStatus = (username: string) => {
    return friendStatuses.find((status) => status.username === username);
  };

  const addRoom = (newRoom: IRoomDoc) => {
    setRooms((rooms) => [...rooms, newRoom]);
  };

  const removeRoom = (roomId: string) => {
    setRooms((rooms) => {
      return rooms.filter((room) => room._id !== roomId);
    });
  };

  const addFriend = (username: string) => {
    if (username) setFriends((prev) => [...prev, username]);
  };

  const removeFriend = (username: string) => {
    if (!username) return;

    setFriends((prev) => {
      const next = prev.filter((user) => user !== username);
      return next;
    });
  };

  const addFriendInvite = (username: string) => {
    setFriendInvites((prev) => [...prev, username]);
  };

  const removeFriendInvite = (username: string) => {
    setFriendInvites((prev) => {
      return prev.filter((invite) => invite !== username);
    });
  };

  const newMessage = (message: IMessageDoc) => {
    setRooms((rooms) => {
      return rooms.map((room) => {
        if (room._id === message.roomId) {
          room.messages.push(message);
        }
        return room;
      });
    });
  };

  let value = {
    isInitialDataLoaded,
    notifications,
    userStatus,
    friendStatuses,
    rooms,
    roomInvites,
    friends,
    friendInvites,
    addNotification,
    markNotificationAsRead,
    updateUserStatus,
    updateFriendStatus,
    findFriendStatus,
    loadInitialData,
    clearChatContext,
    addRoom,
    removeRoom,
    addFriend,
    removeFriend,
    addFriendInvite,
    removeFriendInvite,
    newMessage
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const chatContext = useContext(ChatContext);

  if (!chatContext)
    throw new Error('No context provider found when calling useChat.');

  return chatContext;
};
