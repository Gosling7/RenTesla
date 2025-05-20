import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserInfoDto } from '../types/ApiResults';
import { AuthRequest } from '../types/ApiRequests';

interface AuthContextType {
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    login: (request: AuthRequest) => Promise<void>;
    register: (request: AuthRequest) => Promise<void>;
    user: UserInfoDto | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserInfoDto | null>(null)
    
    const checkAuth = async () => {
        try {
            const response = await axios.get<UserInfoDto>('/api/auth/me');
            if (response.data) {
                setIsAuthenticated(true);
                setUser(response.data);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }      
        } catch {
            setIsAuthenticated(false);
            setUser(null);
        }
    };
        
    const logout = async () => {
        await axios.post('/api/auth/logout');
        setIsAuthenticated(false);
        setUser(null);
    };
    
    const login = async (request: AuthRequest) => {
        try {
            const response = await axios.post<UserInfoDto>('/api/auth/login', request);
            
            setIsAuthenticated(true);
            setUser(response.data);
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
            logout, 
            login,
            register,
            user
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