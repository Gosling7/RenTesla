import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ApiResult, UserInfoDto } from '../types/ApiResults';
import { AuthRequest } from '../types/ApiRequests';

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  setUserEmail: (value: string) => void;
  email: string | null;
  logout: () => Promise<void>;
  login: (request: AuthRequest) => Promise<void>;
  register: (request: AuthRequest) => Promise<void>;
  checkAuth: () => Promise<void>;
  userRoles: string[];
  setUserRoles: (value: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  const checkAuth = async () => {
    try {
      const response = await axios.get<ApiResult<UserInfoDto>>('/api/auth/me');
      if (response.data) {
        setIsAuthenticated(true)
        setEmail(response.data.data.email);
        setUserRoles(response.data.data.roles);
      } else {
        setIsAuthenticated(false);
        setEmail(null);
        setUserRoles([]);
      }      
    } catch {
      setIsAuthenticated(false);
      setEmail(null);
      setUserRoles([]);
    }
  };

  const setUserEmail = (value: string) => setEmail(value);

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setIsAuthenticated(false);
    setEmail(null);
  };

  const login = async (request: AuthRequest) => {
    try {
      const response = await axios.post<UserInfoDto>('/api/auth/login', request);

      setIsAuthenticated(true);
      setEmail(response.data.email);
      setUserRoles(response.data.roles);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    }    
  }

  const register = async (request: AuthRequest) => {
    try {
      await axios.post('/api/auth/register', request, { withCredentials: true });
      await login(request); 
    } catch (error: any) {
      throw error; 
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setAuthenticated: setIsAuthenticated, 
      email, 
      setUserEmail: setUserEmail, 
      logout, 
      login,
      register,
      checkAuth, 
      userRoles,
      setUserRoles 
    }}
    >
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