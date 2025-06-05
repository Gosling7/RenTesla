import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { SectionCard } from '../components/SectionCard';
import { Header } from '../components/Header';
import { AuthForm } from '../components/AuthForm';

export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await login({ email, password });
            navigate('/', { state: { loginSuccess: true } });
        } catch (error: any) {
            const message = error?.message || 'Login failed';
            setEmailError(message);
            setPasswordError(message);
        }
    };
    
    return (
        <div className="my-12">
            <Header
                title="Login"
                subtitle="Please enter your credentials to access your account"
            />
            
            <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
                <SectionCard>
                    <AuthForm
                        mode="login"
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
                        onSubmit={handleLogin}
                    />
                </SectionCard>
            </div>
        </div>
    );
};