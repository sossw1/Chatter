import {
  Document,
  model,
  Model,
  Schema,
  SchemaDefinitionProperty
} from 'mongoose';

export interface IRoom {
  name: string;
  users: string[];
  messages: {
    username: string;
    text: string;
    timestamp: string;
  }[];
}

export interface IRoomDoc extends IRoom, Document {}

enum PropertyNames {
  NAME = 'name',
  USERS = 'users',
  MESSAGES = 'messages'
}

export interface IRoomModel extends Model<IRoomDoc> {
  PropertyNames: typeof PropertyNames;
}

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
  messages: [{ username: String, text: String, timestamp: String }]
};

const RoomSchema = new Schema(RoomSchemaFields);

const RoomCollection = model<IRoomDoc, IRoomModel>('rooms', RoomSchema);

export default RoomCollection;
