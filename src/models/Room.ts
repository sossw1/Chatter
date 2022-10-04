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
}

export interface IRoom {
  name: string;
  users: string[];
  invitedUsers: string[];
  messages: IMessage[];
}

export interface IMessageDoc extends IMessage, Document {}

export interface IRoomDoc extends IRoom, Document {}

enum MessagePropertyNames {
  USERNAME = 'username',
  TEXT = 'text'
}

enum RoomPropertyNames {
  NAME = 'name',
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
  text: String
};

const MessageSchema = new Schema(MessageSchemaFields, { timestamps: true });

const RoomSchemaFields: Record<keyof IRoom, SchemaDefinitionProperty> = {
  name: {
    type: String,
    required: true
  },
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

export default RoomCollection;
