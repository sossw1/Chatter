import { UserCollection, NotificationCollection } from '../../models/User';
import { RoomCollection, MessageCollection } from '../../models/Room';

export const deleteAllDocs = async () => {
  await UserCollection.deleteMany({});
  await NotificationCollection.deleteMany({});
  await RoomCollection.deleteMany({});
  await MessageCollection.deleteMany({});
};
