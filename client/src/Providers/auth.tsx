import { createContext, useState, ReactChildren, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Jwt } from 'jsonwebtoken';

interface User {
  username: string;
  password: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  setUserWithToken: () => Promise<User | { error: string }>;
  signUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<Error | undefined>;
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
    const stringToken = localStorage.getItem('token');
    if (!stringToken) return;
    const parsedToken: User = JSON.parse(stringToken);
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
}

const auth = Auth.getInstance();

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactChildren }) => {
  const [user, setUser] = useState<User | null>(null);

  const setUserWithToken = async () => {
    const response = await auth.getUserWithToken();
    if (!response) return { error: 'No token' };
    if (response.ok) {
      const { user }: { user: User } = await response.json();
      setUser(user);
      return user;
    } else {
      const error: { error: string } = await response.json();
      return error;
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    const response = await auth.postSignUp(username, email, password);
    if (!response) return;
    if (response.ok) {
      const { user, token }: { user: User; token: Jwt } = await response.json();
      setUser(user);
      localStorage.setItem('token', JSON.stringify(token));
    } else {
      const error: Error = await response.json();
      return error;
    }
  };

  let value = { user, setUserWithToken, signUp };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext)!;
};

export const RequireAuth = ({ children }: { children: ReactChildren }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to='/' state={{ from: location }} replace />;
  }

  return children;
};
