import { createContext, useContext, useState } from 'react';
import { IMessageDoc, IRoomDoc } from '../types/Rooms';

export type Status = 'Online' | 'Away' | 'Invisible' | 'Offline';
export type StatusColor = 'success' | 'warning' | 'error' | 'disabled';

interface ChatData {
  rooms: IRoomDoc[];
  roomInvites: string[];
  friends: string[];
  friendInvites: string[];
}

interface ChatContextProps {
  isInitialDataLoaded: boolean;
  status: Status;
  rooms: IRoomDoc[];
  roomInvites: string[];
  friends: string[];
  friendInvites: string[];
  loadInitialData: (data: ChatData) => void;
  updateStatus: (status: Status) => void;
  addRoom: (room: IRoomDoc) => void;
  removeRoom: (room: string) => void;
  addFriend: (username: string) => void;
  removeFriend: (username: string) => void;
  addFriendInvite: (username: string) => void;
  removeFriendInvite: (username: string) => void;
  newMessage: (message: IMessageDoc) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: JSX.Element }) => {
  const [isInitialDataLoaded, setIsInitialDataLoaded] =
    useState<boolean>(false);
  const [status, setStatus] = useState<Status>('Offline');
  const [rooms, setRooms] = useState<IRoomDoc[]>([]);
  const [roomInvites, setRoomInvites] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [friendInvites, setFriendInvites] = useState<string[]>([]);

  const loadInitialData = ({
    rooms,
    roomInvites,
    friends,
    friendInvites
  }: ChatData) => {
    setRooms(rooms);
    setRoomInvites(roomInvites);
    setFriends(friends);
    setFriendInvites(friendInvites);
    setIsInitialDataLoaded(true);
  };

  const updateStatus = (status: Status) => {
    setStatus(status);
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
    status,
    rooms,
    roomInvites,
    friends,
    friendInvites,
    updateStatus,
    loadInitialData,
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
