import { createContext, useContext, useState } from 'react';
import { compareAsc } from 'date-fns';
import {
  IMessageDoc,
  IRoomDoc,
  INotificationDoc,
  NotificationType
} from '../types/Rooms';
import { IRoomData } from './auth';

export interface RoomData extends IRoomData {
  unreadMessageCount: number;
}

export interface RoomInvite {
  roomId: string;
  roomName: string;
}

export type UserStatusText = 'Online' | 'Away' | 'Offline' | 'Invisible';
export type FriendStatusText = 'Online' | 'Away' | 'Offline' | 'Loading';
export type StatusColor = 'success' | 'warning' | 'neutral' | 'error';

export interface FriendStatus {
  username: string;
  status: FriendStatusText;
  statusColor: StatusColor;
}

export interface ChatData {
  roomData: RoomData[];
  userStatus: UserStatusText;
  notifications: INotificationDoc[];
  friendStatuses: FriendStatus[];
  rooms: IRoomDoc[];
  roomInvites: RoomInvite[];
  friends: string[];
  friendInvites: string[];
}

interface ChatContextProps {
  isInitialDataLoaded: boolean;
  roomData: RoomData[];
  notifications: INotificationDoc[];
  userStatus: UserStatusText;
  friendStatuses: FriendStatus[];
  rooms: IRoomDoc[];
  roomInvites: RoomInvite[];
  friends: string[];
  friendInvites: string[];
  loadInitialData: (data: ChatData) => void;
  clearChatContext: () => void;
  addNotification: (notification: INotificationDoc) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotificationById: (id: string) => void;
  deleteNotificationByContent: (
    type: NotificationType,
    username: string
  ) => void;
  updateUserStatus: (status: UserStatusText) => void;
  updateFriendStatus: (username: string, status: FriendStatusText) => void;
  findFriendStatus: (
    username: string
  ) => { status: FriendStatusText; statusColor: StatusColor } | undefined;
  addRoom: (room: IRoomDoc) => void;
  removeRoom: (room: string) => void;
  addRoomInvite: (roomInvite: RoomInvite) => void;
  removeRoomInvite: (roomId: string) => void;
  addFriend: (username: string) => void;
  removeFriend: (username: string) => void;
  addFriendInvite: (username: string) => void;
  removeFriendInvite: (username: string) => void;
  newMessage: (message: IMessageDoc) => void;
  updateUnreadMessageCount: (roomId: string) => void;
  incrementUnreadMessageCount: (roomId: string) => void;
}

export const getStatusColor = (
  status: UserStatusText | FriendStatusText
): StatusColor => {
  if (status === 'Online') return 'success';
  else if (status === 'Away') return 'warning';
  else if (status === 'Offline') return 'error';
  else return 'neutral';
};

export const getUnreadMessageCount = (lastReadAt: string, room: IRoomDoc) => {
  if (lastReadAt) {
    const lastReadAtDate = new Date(JSON.parse(lastReadAt));
    const { messages } = room;

    const sum = messages.reduce((acc, curr) => {
      const messageDate = new Date(curr.createdAt);
      const compare = compareAsc(messageDate, lastReadAtDate);
      const result = compare === -1 ? 0 : 1;
      return acc + result;
    }, 0);
    return sum;
  } else {
    return 0;
  }
};

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: JSX.Element }) => {
  const [isInitialDataLoaded, setIsInitialDataLoaded] =
    useState<boolean>(false);
  const [roomData, setRoomData] = useState<RoomData[]>([]);
  const [userStatus, setUserStatus] = useState<UserStatusText>('Offline');
  const [friendStatuses, setFriendStatuses] = useState<FriendStatus[]>([]);
  const [rooms, setRooms] = useState<IRoomDoc[]>([]);
  const [roomInvites, setRoomInvites] = useState<RoomInvite[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [friendInvites, setFriendInvites] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<INotificationDoc[]>([]);

  const loadInitialData = ({
    roomData,
    userStatus,
    notifications,
    friendStatuses,
    rooms,
    roomInvites,
    friends,
    friendInvites
  }: ChatData) => {
    setRoomData(roomData);
    setUserStatus(userStatus);
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

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const matchIndex = prev.findIndex(
        (notification) => notification._id === id
      );
      if (matchIndex === -1) return prev;
      const next = [...prev];
      next[matchIndex].isRead = true;
      return next;
    });

    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';
    const url = `/api/notifications/${id}/mark-read`;
    fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + parsedToken,
        Accept: 'application/json'
      }
    });
  };

  const deleteNotificationById = (id: string) => {
    setNotifications((prev) => {
      return prev.filter((notification) => notification._id !== id);
    });
  };

  const deleteNotificationByContent = async (
    type: NotificationType,
    text: string
  ) => {
    const matchIndex = notifications.findIndex(
      (notification) =>
        notification.text === `${text}` && notification.type === type
    );

    if (matchIndex === -1) return;

    setNotifications((prev) => {
      const next = prev.filter(
        (notification) => notification._id !== notifications[matchIndex]._id
      );
      return next;
    });

    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';
    const notificationId = notifications[matchIndex]._id;
    const url = `/api/notifications/${notificationId}`;
    fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + parsedToken,
        Accept: 'application/json'
      }
    });
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
    const newRoomData: RoomData = {
      roomId: newRoom._id,
      lastReadAt: JSON.stringify(Date.now()),
      unreadMessageCount: 0
    };
    setRoomData((prev) => [...prev, newRoomData]);
  };

  const removeRoom = (roomId: string) => {
    setRooms((rooms) => {
      return rooms.filter((room) => room._id !== roomId);
    });
  };

  const addRoomInvite = (newRoomInvite: RoomInvite) => {
    setRoomInvites((roomInvites) => [...roomInvites, newRoomInvite]);
  };

  const removeRoomInvite = (roomId: string) => {
    setRoomInvites((roomInvites) => {
      return roomInvites.filter((invite) => invite.roomId !== roomId);
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

    setNotifications((prev) => {
      const next = prev.filter(
        (notification) =>
          !(
            notification.text === username &&
            notification.type === 'friend-request-accepted'
          )
      );
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

  const newMessage = (newMessage: IMessageDoc) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room._id !== newMessage.roomId) return room;
        const newRoom: IRoomDoc = Object.assign({}, room, {
          messages: room.messages.concat(newMessage)
        });

        const url = `/api/rooms/${newMessage.roomId}/last-read`;
        const token = localStorage.getItem('token');
        const parsedToken = token ? JSON.parse(token) : '';
        fetch(url, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${parsedToken}`
          }
        });

        return newRoom;
      })
    );
  };

  const updateUnreadMessageCount = async (roomId: string) => {
    const next = [...roomData];
    const matchIndex = next.findIndex((room) => room.roomId === roomId);
    if (matchIndex === -1) return;

    const url = `/api/rooms/${roomId}/last-read`;
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${parsedToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    if (!response.ok) return;
    const { lastReadAt } = await response.json();
    if (typeof lastReadAt !== 'string') return;

    next[matchIndex].lastReadAt = lastReadAt;
    next[matchIndex].unreadMessageCount = 0;
    setRoomData(next);
  };

  const incrementUnreadMessageCount = (roomId: string) => {
    setRoomData((prev) => {
      return prev.map((room) =>
        room.roomId === roomId
          ? {
              ...room,
              unreadMessageCount: room.unreadMessageCount + 1
            }
          : room
      );
    });
  };

  let value = {
    isInitialDataLoaded,
    roomData,
    notifications,
    userStatus,
    friendStatuses,
    rooms,
    roomInvites,
    friends,
    friendInvites,
    addNotification,
    markNotificationAsRead,
    deleteNotificationById,
    deleteNotificationByContent,
    updateUserStatus,
    updateFriendStatus,
    findFriendStatus,
    loadInitialData,
    clearChatContext,
    addRoom,
    removeRoom,
    addRoomInvite,
    removeRoomInvite,
    addFriend,
    removeFriend,
    addFriendInvite,
    removeFriendInvite,
    newMessage,
    updateUnreadMessageCount,
    incrementUnreadMessageCount
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const chatContext = useContext(ChatContext);

  if (!chatContext)
    throw new Error('No context provider found when calling useChat.');

  return chatContext;
};
