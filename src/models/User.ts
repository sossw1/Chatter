import mongoose, {
  Document,
  model,
  Model,
  Schema,
  SchemaDefinitionProperty
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt, { Jwt } from 'jsonwebtoken';

export type Status = 'Online' | 'Away' | 'Invisible' | 'Offline';

export interface IRoomData {
  roomId: mongoose.Types.ObjectId;
  lastReadAt: string;
}

type NotificationType =
  | 'system'
  | 'friend-request-received'
  | 'friend-request-accepted'
  | 'group-invite-received';

export interface INotification {
  type: NotificationType;
  text: string;
  isRead: boolean;
}

export interface INotificationDoc extends INotification, Document {}

interface IToken extends Document {
  token: string;
}

export interface IUser {
  username: string;
  password: string;
  email: string;
  status: Status;
  rooms: IRoomData[];
  notifications: INotificationDoc[];
  roomInvites: mongoose.Types.ObjectId[];
  friendInvites: string[];
  friends: string[];
  socketIds: string[];
  tokens: IToken[];
}

export interface IUserDoc extends IUser, Document {
  generateAuthToken(): Jwt;
}

enum UserPropertyNames {
  USERNAME = 'username',
  PASSWORD = 'password',
  EMAIL = 'email',
  STATUS = 'status',
  ROOMS = 'rooms',
  ROOM_INVITES = 'roomInvites',
  NOTIFICATIONS = 'notifications',
  FRIEND_INVITES = 'friendInvites',
  FRIENDS = 'friends',
  SOCKET_IDS = 'socketIds',
  TOKENS = 'tokens'
}

enum NotificationPropertyNames {
  TYPE = 'type',
  TEXT = 'text',
  IS_READ = 'isRead'
}

export interface INotificationModel extends Model<INotificationDoc> {
  PropertyNames: typeof NotificationPropertyNames;
}

export interface IUserModel extends Model<IUserDoc> {
  findByCredentials(email: string, password: string): Promise<IUserDoc>;
  PropertyNames: typeof UserPropertyNames;
}

const notificationSchemaFields: Record<
  keyof INotification,
  SchemaDefinitionProperty
> = {
  type: String,
  text: String,
  isRead: Boolean
};

const NotificationSchema = new Schema(notificationSchemaFields, {
  timestamps: true
});

const UserSchemaFields: Record<keyof IUser, SchemaDefinitionProperty> = {
  username: {
    type: String,
    unique: true,
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
    required: true,
    trim: true,
    lowercase: true,
    validate: (value: string) => {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    }
  },
  status: String,
  rooms: [
    {
      roomId: mongoose.Types.ObjectId,
      lastReadAt: String
    }
  ],
  roomInvites: [mongoose.Types.ObjectId],
  notifications: [NotificationSchema],
  friendInvites: [
    {
      type: String,
      required: true
    }
  ],
  friends: [
    {
      type: String,
      required: true
    }
  ],
  socketIds: [String],
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
};

const UserSchema = new Schema(UserSchemaFields, {
  timestamps: true
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const secret: string = process.env.JWT_SECRET || 'd^e#f@a*u$l%t';
  const token = jwt.sign({ _id: user._id.toString() }, secret, {
    expiresIn: '7d'
  });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.methods.toJSON = function () {
  const user: any = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

UserSchema.static(
  'findByCredentials',
  async function findByCredentials(
    username: string,
    password: string
  ): Promise<IUserDoc> {
    const user: IUserDoc = await this.findOne({ username });

    if (!user) {
      throw new Error('Unable to login');
    }

    const isMatchingPassword = await bcrypt.compare(password, user.password);

    if (!isMatchingPassword) {
      throw new Error('Unable to login');
    }

    return user;
  }
);

UserSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const UserCollection = model<IUserDoc, IUserModel>('users', UserSchema);
const NotificationCollection = model<INotification, INotificationModel>(
  'notifications',
  NotificationSchema
);

export { UserCollection, NotificationCollection };
