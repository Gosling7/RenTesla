import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  setUserEmail: (value: string) => void;
  email: string | null;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data) {
        setIsAuthenticated(true)
        setEmail(res.data);
      } else {
        setIsAuthenticated(false);
        setEmail(null);
      }      
    } catch {
      setIsAuthenticated(false);
      setEmail(null);
    }
  };

  const setUserEmail = (value: string) => setEmail(value);

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setIsAuthenticated(false);
    setEmail(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated: setIsAuthenticated, email, setUserEmail: setUserEmail, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};