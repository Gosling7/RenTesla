import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthRequest } from '../types/ApiRequests';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { SectionCard } from '../components/SectionCard';
import { AuthForm } from '../components/AuthForm';

export const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, login } = useAuth();
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const request: AuthRequest = { email, password };

        try {
            await register(request);
        } catch (error: any) {
            setEmailError('');
            setPasswordError('');
            const data = error.response?.data;

            if (data?.errors) {
                setEmailError(data.errors.Email?.join(', ') || '');
                if (data.errors.Password) {
                    setPasswordError(data.errors.Password.join(', '));
                }
            } else if (typeof data === 'string') {
                setEmailError(data);
            } else if (data?.title) {
                setEmailError(data.title);
            } else {
                setEmailError('Registration failed.');
            }

            return;
        }

        try {
            await login(request);
            navigate('/', { state: { loginSuccess: true } });
        } catch (error: any) {
            setEmailError('Registration succeeded, but login failed.');
        }
    };

    return (
        <div className="my-12">
            <Header
                title="Register"
                subtitle="Please enter your credentials to register your account"
            />

            <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
                <SectionCard>
                    <AuthForm
                        mode="register"
                        email={email}
                        password={password}
                        emailError={emailError}
                        passwordError={passwordError}
                        onEmailChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError('');
                        }}
                        onPasswordChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError('');
                        }}
                        onSubmit={handleRegister}
                    />
                </SectionCard>
            </div>
        </div>
    );
};