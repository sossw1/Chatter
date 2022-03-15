import {
  Document,
  model,
  Model,
  Schema,
  SchemaDefinitionProperty
} from 'mongoose';
import validator from 'validator';

interface IRoomInfo {
  roomName: string;
  roomId: string;
}

export interface IUser {
  username: string;
  password: string;
  email: string;
  rooms: IRoomInfo[];
}

export interface IUserDoc extends IUser, Document {}

enum PropertyNames {
  USERNAME = 'username',
  PASSWORD = 'password',
  EMAIL = 'email',
  ROOMS = 'rooms'
}

export interface IUserModel extends Model<IUserDoc> {
  PropertyNames: typeof PropertyNames;
}

const UserSchemaFields: Record<keyof IUser, SchemaDefinitionProperty> = {
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate: (value: string) => {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    }
  },
  rooms: [
    {
      roomName: {
        type: String,
        required: true
      },
      roomId: {
        type: String,
        required: true,
        unique: true
      }
    }
  ]
};

const UserSchema = new Schema(UserSchemaFields, {
  timestamps: true
});

const UserCollection = model<IUserDoc, IUserModel>('users', UserSchema);

export default UserCollection;
