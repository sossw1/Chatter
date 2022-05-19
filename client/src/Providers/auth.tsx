import { createContext, useState, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Jwt } from 'jsonwebtoken';

interface User {
  username: string;
  password: string;
  email: string;
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
  user: User | null;
  setUserWithToken: () => Promise<ApiConfirmation | ApiError>;
  signUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<ApiConfirmation | ApiError>;
  login: (
    email: string,
    password: string
  ) => Promise<ApiConfirmation | ApiError>;
  logout: () => Promise<ApiConfirmation | ApiError>;
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

  async postLogin(email: string, password: string) {
    const url = '/api/users/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (response.ok) {
      this.isAuthenticated = true;
    }
    return response;
  }

  async postLogout() {
    const token = localStorage.getItem('token');
    const url = '/api/users/logout';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authentication: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    return response;
  }
}

const auth = Auth.getInstance();

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User | null>(null);

  const setUserWithToken = async () => {
    const response = await auth.getUserWithToken();
    // No token was present
    if (!response) {
      return {
        type: 'error',
        error: 'Not authenticated'
      } as ApiError;
    }

    if (response.ok) {
      const { user }: { user: User } = await response.json();
      setUser(user);
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
      const { user, token }: { user: User; token: Jwt } = await response.json();
      setUser(user);
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

  const login = async (email: string, password: string) => {
    const response = await auth.postLogin(email, password);
    if (response.ok) {
      const { user, token }: { user: User; token: Jwt } = await response.json();
      setUser(user);
      localStorage.setItem('token', JSON.stringify(token));
      return {
        type: 'confirmation',
        confirmation: 'Login successful'
      } as ApiConfirmation;
    } else {
      const error: ApiError = await response.json();
      error.type = 'error';
      return error;
    }
  };

  const logout = async () => {
    const response = await auth.postLogout();
    setUser(null);
    if (response.ok) {
      return {
        type: 'confirmation',
        confirmation: 'Logout successful'
      } as ApiConfirmation;
    } else {
      return { type: 'error', error: 'Logout unsuccessful' } as ApiError;
    }
  };

  let value: AuthContextProps = {
    user,
    setUserWithToken,
    signUp,
    login,
    logout
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
