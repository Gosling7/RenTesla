import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { FormInput } from '../components/FormInput';

export const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            navigate('/', { state: { loginSuccess: true } });
        } catch (error: any) {
            setMessage(error.message || 'Login failed');
            alert(error.message);
        }
    };
    
    return (
        <div className="dark:text-white max-w-md mx-auto mt-10 p-6 rounded shadow-lg border border-gray-200 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <FormInput
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setMessage('');
                    }}
                    required
                />
                
                <FormInput
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setMessage('');
                    }}
                    required
                />
                
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                    Login
                </button>
            </form>
            {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
        </div>
    );
};