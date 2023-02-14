import { createContext, useContext, useState } from 'react';
import { IRoomDoc } from '../types/Rooms';

interface ChatData {
  rooms: IRoomDoc[];
  roomInvites: string[];
  friends: string[];
  friendInvites: string[];
}

interface ChatContextProps {
  rooms: IRoomDoc[];
  roomInvites: string[];
  friends: string[];
  friendInvites: string[];
  loadInitialData: (data: ChatData) => void;
  addFriend: (username: string) => void;
  removeFriend: (username: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: JSX.Element }) => {
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

  let value = {
    rooms,
    roomInvites,
    friends,
    friendInvites,
    loadInitialData,
    addFriend,
    removeFriend
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const chatContext = useContext(ChatContext);

  if (!chatContext)
    throw new Error('No context provider found when calling useChat.');

  return chatContext;
};
