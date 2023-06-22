import mongoose, { Document } from 'mongoose';

export interface IMessage {
  username: string;
  text: string;
  roomId: mongoose.Types.ObjectId;
  hidden: boolean;
  createdAt: string;
}

export interface IMessageDoc extends IMessage, Document {}

export interface IRoom {
  name?: string;
  isDirect: boolean;
  users: string[];
  invitedUsers?: string[];
  messages: IMessageDoc[];
  disabled: boolean;
}

export interface IRoomDoc extends IRoom, Document {}

export type NotificationType =
  | 'system'
  | 'friend-request-received'
  | 'friend-request-accepted'
  | 'room-invite-received';

export interface INotification {
  type: NotificationType;
  text: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface INotificationDoc extends INotification, Document {}
