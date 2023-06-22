import { IRoomDoc } from '../types/Rooms';
import { IUserDoc } from '../Providers/auth';
import {
  getStatusColor,
  getUnreadMessageCount,
  ChatData,
  FriendStatus,
  FriendStatusText,
  RoomData
} from '../Providers/chat';

export const fetchInitialData = async (
  user: IUserDoc
): Promise<ChatData | undefined> => {
  if (!user) return;

  const token = localStorage.getItem('token');
  const parsedToken = token ? JSON.parse(token) : '';
  let fetchedRooms: IRoomDoc[] = [];
  let fetchedFriendStatuses: FriendStatus[] = [];

  await Promise.all(
    user.rooms
      .map(async (room) => {
        const response = await fetch(`/api/rooms/${room.roomId}`, {
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

  const status = user.status === 'Invisible' ? 'Invisible' : 'Online';

  const roomData: RoomData[] = user.rooms.map((userRoom) => {
    const matchingRoom = fetchedRooms.find(
      (room) => room._id === userRoom.roomId
    );
    const unreadMessageCount = matchingRoom
      ? getUnreadMessageCount(userRoom.lastReadAt, matchingRoom)
      : 0;
    return {
      ...userRoom,
      unreadMessageCount
    };
  });

  return {
    roomData: roomData,
    userStatus: status,
    notifications: user.notifications,
    friendStatuses: fetchedFriendStatuses,
    rooms: fetchedRooms,
    roomInvites: user.roomInvites,
    friends: user.friends,
    friendInvites: user.friendInvites
  };
};
