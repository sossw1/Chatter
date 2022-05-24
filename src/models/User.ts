import {
  Document,
  model,
  Model,
  Schema,
  SchemaDefinitionProperty
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt, { Jwt } from 'jsonwebtoken';

interface IToken extends Document {
  token: string;
}

interface IRoomInfo {
  roomName: string;
  roomId: string;
}

export interface IUser {
  username: string;
  password: string;
  email: string;
  rooms: IRoomInfo[];
  tokens: IToken[];
}

export interface IUserDoc extends IUser, Document {
  generateAuthToken(): Jwt;
}

enum PropertyNames {
  USERNAME = 'username',
  PASSWORD = 'password',
  EMAIL = 'email',
  ROOMS = 'rooms',
  TOKENS = 'tokens'
}

export interface IUserModel extends Model<IUserDoc> {
  findByCredentials(email: string, password: string): Promise<IUserDoc>;
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
  ],
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
    email: string,
    password: string
  ): Promise<IUserDoc> {
    const user: IUserDoc = await this.findOne({ email });

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

export default UserCollection;
