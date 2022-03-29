import { createContext, useState } from 'react';

const auth = {
  isAuthenticated: false,
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
  logout() {
    this.isAuthenticated = false;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const response = await auth.login(email, password);
    const { user } = await response.json();
    if (response.ok) {
      setUser(user);
    }
    return response;
  }

  const logout = () => {
    return auth.logout(() => {
      setUser(null);
    });
  }

  let value = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
