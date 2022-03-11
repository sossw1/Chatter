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
}

export interface IRoomDoc extends IRoom, Document {}

enum PropertyNames {
  NAME = 'name',
  USERS = 'users'
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
      required: true,
      unique: true
    }
  ]
};

const RoomSchema = new Schema(RoomSchemaFields, {
  timestamps: true
});

const RoomCollection = model<IRoomDoc, IRoomModel>('rooms', RoomSchema);

export default RoomCollection;
