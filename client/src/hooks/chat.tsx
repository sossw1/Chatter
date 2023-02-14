import { useState } from 'react';
import { IRoomDoc } from '../types/Rooms';

export const useChat = () => {
  const [rooms, setRooms] = useState<IRoomDoc[]>([]);
  const [roomInvites, setRoomInvites] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [friendInvites, setFriendInvites] = useState<string[]>([]);

  return { rooms, roomInvites, friends, friendInvites };
};
