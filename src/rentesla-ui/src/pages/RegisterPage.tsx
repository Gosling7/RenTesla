import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { AuthRequest } from '../types/ApiRequests';
import { useAuth } from '../contexts/AuthContext';
import { FormInput } from '../components/FormInput';

const RegisterPage = () => {
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
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError('');
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <FormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            required
          />
          
          <FormInput
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={handlePasswordChange}
            error={passwordError}
            required
          />
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
        Register
        </button>
      </form>
    </div>
  );
};

export{ RegisterPage };