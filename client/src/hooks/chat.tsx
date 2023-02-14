import { useState } from 'react';
import { IRoomDoc } from '../types/Rooms';

export const useChat = () => {
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

  return {
    rooms,
    roomInvites,
    friends,
    friendInvites,
    addFriend,
    removeFriend
  };
};
