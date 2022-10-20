import mongoose from 'mongoose';
import {
  Document,
  model,
  Model,
  Schema,
  SchemaDefinitionProperty
} from 'mongoose';

export interface IMessage {
  username: string;
  text: string;
  roomId: mongoose.Types.ObjectId;
}

export interface IMessageDoc extends IMessage, Document {}

export interface IRoom {
  name: string;
  isDirect: boolean;
  users: string[];
  invitedUsers: string[];
  messages: IMessageDoc[];
}

export interface IRoomDoc extends IRoom, Document {}

enum MessagePropertyNames {
  USERNAME = 'username',
  TEXT = 'text',
  ROOM_ID = 'roomId'
}

enum RoomPropertyNames {
  NAME = 'name',
  IS_DIRECT = 'isDirect',
  USERS = 'users',
  INVITED_USERS = 'invitedUsers',
  MESSAGES = 'messages'
}

export interface IMessageModel extends Model<IMessageDoc> {
  PropertyNames: typeof MessagePropertyNames;
}

export interface IRoomModel extends Model<IRoomDoc> {
  PropertyNames: typeof RoomPropertyNames;
}

const MessageSchemaFields: Record<keyof IMessage, SchemaDefinitionProperty> = {
  username: {
    type: String,
    required: true
  },
  text: String,
  roomId: {
    type: mongoose.Types.ObjectId,
    required: true
  }
};

const MessageSchema = new Schema(MessageSchemaFields, { timestamps: true });

const RoomSchemaFields: Record<keyof IRoom, SchemaDefinitionProperty> = {
  name: {
    type: String,
    required: true
  },
  isDirect: Boolean,
  users: [
    {
      type: String,
      required: true
    }
  ],
  invitedUsers: [
    {
      type: String,
      required: true
    }
  ],
  messages: [MessageSchema]
};

const RoomSchema = new Schema(RoomSchemaFields);

const RoomCollection = model<IRoomDoc, IRoomModel>('rooms', RoomSchema);
const MessageCollection = model<IMessageDoc, IMessageModel>(
  'messages',
  MessageSchema
);

export { RoomCollection, MessageCollection };
