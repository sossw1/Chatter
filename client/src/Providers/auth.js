import { createContext, useContext, useState } from 'react';
import {
  useLocation,
  Navigate
} from 'react-router-dom';

const auth = {
  isAuthenticated: false,
  async signup(username, email, password) {
    try {
      const url = '/api/users';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });
      if (response.ok) {
        this.isAuthenticated = true;
      }
      return response;
    } catch (error) {
      return error;
    }
  },
  async login(email, password) {
    try {
      const url = '/api/users/login';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        this.isAuthenticated = true;
      }
      return response;
    } catch (error) {
      return error;
    }
  },
  async logout() {
    try {
      const token = localStorage.getItem('token');
      const url = '/api/users/logout';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authentication': 'Bearer ' + token
        }
      });
      localStorage.removeItem('token');
      this.isAuthenticated = false;
      return response;
    } catch (error) {
      return error;
    }
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signup = async (username, email, password) => {
    const response = await auth.signup(username, email, password);
    const { user } = await response.json();
    if (response.ok) {
      setUser(user);
    }
    return response;
  }

  const login = async (email, password) => {
    const response = await auth.login(email, password);
    const { user } = await response.json();
    if (response.ok) {
      setUser(user);
    }
    return response;
  }

  const logout = async () => {
    const response = await auth.logout();
    console.log(response);
    setUser(null);
  }

  let value = { user, signup, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to='/' state={{ from: location }} replace />;
  }

  return children;
}
