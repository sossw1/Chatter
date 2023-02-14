import { createContext, useContext, useState } from 'react';
import { IRoomDoc } from '../types/Rooms';

interface ChatContextProps {
  rooms: IRoomDoc[];
  roomInvites: string[];
  friends: string[];
  friendInvites: string[];
  addFriend: (username: string) => void;
  removeFriend: (username: string) => void;
}

const ChatContext = createContext<ChatContextProps | null>(null);

export const ChatProvider = ({ children }: { children: JSX.Element }) => {
  const [rooms, setRooms] = useState<IRoomDoc[]>([]);
  const [roomInvites, setRoomInvites] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [friendInvites, setFriendInvites] = useState<string[]>([]);

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
    addFriend,
    removeFriend
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  return useContext(ChatContext);
};
