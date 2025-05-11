import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

const LoginPage = () => {
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
      
      // const response = await axios.post<ApiResult<UserInfoDto>>('/api/auth/login', request);

      // setAuthenticated(true);
      // setLoggedInUserEmail(response.data.data.email);

      // setUserRoles(response.data.data.roles);

      // navigate('/', { state: { loginSuccess: true } });
    } catch (error: any) {
      setMessage(error.message);
      alert(error.message);
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
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

export { LoginPage };