import { IRoomDoc } from '../types/Rooms';

const getRoomName = (room: IRoomDoc, username: string) => {
  if (!username) return null;
  if (room.isDirect) {
    const friend = room.users.find((user) => user !== username);
    return friend ? friend : '';
  } else {
    return room.name ? room.name : '';
  }
};

export { getRoomName };
