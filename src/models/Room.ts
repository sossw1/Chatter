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
  hidden: boolean;
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

enum MessagePropertyNames {
  USERNAME = 'username',
  TEXT = 'text',
  ROOM_ID = 'roomId',
  HIDDEN = 'hidden'
}

enum RoomPropertyNames {
  NAME = 'name',
  IS_DIRECT = 'isDirect',
  USERS = 'users',
  INVITED_USERS = 'invitedUsers',
  MESSAGES = 'messages',
  DISABLED = 'disabled'
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
  },
  hidden: {
    type: Boolean,
    required: true
  }
};

const MessageSchema = new Schema(MessageSchemaFields, { timestamps: true });

const RoomSchemaFields: Record<keyof IRoom, SchemaDefinitionProperty> = {
  name: String,
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
  messages: [MessageSchema],
  disabled: Boolean
};

const RoomSchema = new Schema(RoomSchemaFields);

RoomSchema.methods.toJSON = function () {
  const room: any = this;
  const roomObject = room.toObject();

  if (roomObject.isDirect) {
    delete roomObject.name;
    delete roomObject.invitedUsers;
  }

  delete roomObject.disabled;

  roomObject.messages = roomObject.messages.filter(
    (message: IMessageDoc) => message.hidden === false
  );

  return roomObject;
};

const RoomCollection = model<IRoomDoc, IRoomModel>('rooms', RoomSchema);
const MessageCollection = model<IMessageDoc, IMessageModel>(
  'messages',
  MessageSchema
);

export { RoomCollection, MessageCollection };
