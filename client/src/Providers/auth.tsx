import { createContext, useState, ReactChildren, useContext } from 'react';

interface User {
  username: string;
  password: string;
  email: string;
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
    if (!response || !response.ok) return;
    const user: User = await response.json();
    if (!user) return;
    this.isAuthenticated = true;
    return user;
  }
}

const auth = Auth.getInstance();

interface AuthContextProps {
  user: User | null;
  setUserWithToken(): Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: ReactChildren }) => {
  const [user, setUser] = useState<User | null>(null);

  const setUserWithToken = async () => {
    const fetchedUser = await auth.getUserWithToken();
    if (!fetchedUser) return;
    setUser(fetchedUser);
  };

  let value = { user, setUserWithToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext)!;
};
