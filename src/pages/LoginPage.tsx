import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { language } = useLanguage();

  const content = {
    pt: {
      title: "Entrar",
      email: "Email",
      password: "Senha",
      button: "Entrar",
      noAccount: "Não tem conta?",
      signup: "Registrar-se",
      error: "Email ou senha inválidos"
    },
    en: {
      title: "Login",
      email: "Email",
      password: "Password",
      button: "Login",
      noAccount: "Don't have an account?",
      signup: "Sign up",
      error: "Invalid email or password"
    }
  };

  const contentData = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        // Show error message
        setError(contentData.error);
      }
    } catch (err) {
      setError(contentData.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top: Navbar */}
      <Navbar />
      
      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-sm w-full">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            {contentData.title}
          </h1>
          
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {contentData.email}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            {/* Password input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {contentData.password}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            {/* Error message */}
            {error && (
              <div className="text-red-500 text-sm mb-4">
                {error}
              </div>
            )}
            
            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              {contentData.button}
            </button>
          </form>
          
          {/* Below form: Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {contentData.noAccount}{' '}
              <a 
                href="/register" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {contentData.signup}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

