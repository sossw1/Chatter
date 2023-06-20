import { createContext, useState, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Jwt } from 'jsonwebtoken';
import { Document } from 'mongoose';
import { INotificationDoc } from '../types/Rooms';
import { useSocket } from './socket';
import { RoomInvite, useChat, UserStatusText } from './chat';

export interface IRoomData {
  roomId: string;
  lastReadAt: string;
}

interface IToken extends Document {
  token: string;
}

export interface IUser {
  username: string;
  password: string;
  email: string;
  status: UserStatusText;
  rooms: IRoomData[];
  roomInvites: RoomInvite[];
  notifications: INotificationDoc[];
  friendInvites: string[];
  friends: string[];
  currentSocketId: string;
  tokens: IToken[];
  createdAt: string;
}

export interface IUserDoc extends IUser, Document {
  generateAuthToken(): Jwt;
}

interface ApiError {
  type: 'error';
  error: string;
}

interface ApiConfirmation {
  type: 'confirmation';
  confirmation: string;
}

interface AuthContextProps {
  user: IUserDoc | null;
  setUserWithToken: () => Promise<ApiConfirmation | ApiError>;
  signUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<ApiConfirmation | ApiError>;
  login: (
    username: string,
    password: string
  ) => Promise<ApiConfirmation | ApiError>;
  logout: () => Promise<ApiConfirmation | ApiError>;
  emailChange: (email: string) => Promise<ApiConfirmation | ApiError>;
  passwordChange: (password: string) => Promise<ApiConfirmation | ApiError>;
}

class Auth {
  private isAuthenticated: boolean;
  private static instance: Auth;

  private constructor() {
    this.isAuthenticated = false;
  }

  static getInstance() {
    if (Auth.instance) {
      return this.instance;
    }
    this.instance = new Auth();
    return this.instance;
  }

  async getUserWithToken() {
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';
    const url = '/api/users/me';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${parsedToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
    if (response.ok) {
      this.isAuthenticated = true;
    }
    return response;
  }

  async postSignUp(username: string, email: string, password: string) {
    const url = '/api/users';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    if (response.ok) {
      this.isAuthenticated = true;
    }
    return response;
  }

  async postLogin(username: string, password: string) {
    const url = '/api/users/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    if (response.ok) {
      this.isAuthenticated = true;
    }
    return response;
  }

  async postLogout() {
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';
    const url = '/api/users/logout';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + parsedToken,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    return response;
  }

  async patchEmailChange(email: string) {
    const url = 'api/users/email';
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${parsedToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    return response;
  }

  async patchPasswordChange(password: string) {
    const url = '/api/users/me';
    const token = localStorage.getItem('token');
    const parsedToken = token ? JSON.parse(token) : '';
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${parsedToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ password })
    });
    return response;
  }
}

const auth = Auth.getInstance();

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const chat = useChat();
  const socket = useSocket();
  const [user, setUser] = useState<IUserDoc | null>(null);

  const setUserWithToken = async () => {
    const response = await auth.getUserWithToken();
    if (!response) {
      return {
        type: 'error',
        error: 'Not authenticated'
      } as ApiError;
    }

    if (response.ok) {
      const user = await response.json();
      setUser(user);

      if (chat.userStatus !== 'Invisible') {
        socket.emit('status-update', 'Online');
        chat.updateUserStatus('Online');
      }

      return {
        type: 'confirmation',
        confirmation: 'Successful login with token'
      } as ApiConfirmation;
    } else {
      return {
        type: 'error',
        error: 'Not authenticated'
      } as ApiError;
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    const response = await auth.postSignUp(username, email, password);
    if (response.ok) {
      const { user, token }: { user: IUserDoc; token: Jwt } =
        await response.json();
      setUser(user);

      socket.emit('status-update', 'Online');
      chat.updateUserStatus('Online');

      localStorage.setItem('token', JSON.stringify(token));
      return {
        type: 'confirmation',
        confirmation: 'Sign up successful'
      } as ApiConfirmation;
    } else {
      const error: ApiError = await response.json();
      error.type = 'error';
      return error;
    }
  };

  const login = async (username: string, password: string) => {
    const response = await auth.postLogin(username, password);
    if (response.ok) {
      const { user, token }: { user: IUserDoc; token: Jwt } =
        await response.json();
      setUser(user);

      if (chat.userStatus !== 'Invisible') {
        socket.emit('status-update', 'Online');
        chat.updateUserStatus('Online');
      }

      localStorage.setItem('token', JSON.stringify(token));
      return {
        type: 'confirmation',
        confirmation: 'Login successful'
      } as ApiConfirmation;
    } else {
      return { type: 'error', error: 'Invalid username/password' } as ApiError;
    }
  };

  const logout = async () => {
    chat.clearChatContext();

    const response = await auth.postLogout();
    setUser(null);

    if (chat.userStatus !== 'Invisible') {
      socket.emit('status-update', 'Offline');
      chat.updateUserStatus('Offline');
    }

    if (response?.ok) {
      return {
        type: 'confirmation',
        confirmation: 'Logout successful'
      } as ApiConfirmation;
    } else {
      return { type: 'error', error: 'Logout unsuccessful' } as ApiError;
    }
  };

  const emailChange = async (email: string) => {
    const response = await auth.patchEmailChange(email);
    if (!response) {
      return { type: 'error', error: 'Not authenticated' } as ApiError;
    }
    if (response.ok) {
      setUser((prev) => {
        const next = Object.assign({}, prev);
        next.email = email;
        return next;
      });

      return {
        type: 'confirmation',
        confirmation: 'Email changed successfully'
      } as ApiConfirmation;
    } else {
      const error = await response.json();
      return {
        type: 'error',
        error
      } as ApiError;
    }
  };

  const passwordChange = async (password: string) => {
    const response = await auth.patchPasswordChange(password);
    if (!response) {
      return { type: 'error', error: 'Not authenticated' } as ApiError;
    }
    if (response.ok) {
      return {
        type: 'confirmation',
        confirmation: 'Password changed successfully'
      } as ApiConfirmation;
    } else {
      const error = await response.json();
      return {
        type: 'error',
        error
      } as ApiError;
    }
  };

  let value: AuthContextProps = {
    user,
    setUserWithToken,
    signUp,
    login,
    logout,
    emailChange,
    passwordChange
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext)!;
};

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to='/' state={{ from: location }} replace />;
  }

  return children;
};
