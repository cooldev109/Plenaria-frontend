import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth';

const content = {
  pt: {
    title: "Entrar",
    email: "Email",
    password: "Senha",
    button: "Entrar",
    loading: "Entrando...",
    noAccount: "Não tem conta?",
    signup: "Registrar-se",
    error: "Email ou senha inválidos"
  },
  en: {
    title: "Login",
    email: "Email",
    password: "Password",
    button: "Login",
    loading: "Logging in...",
    noAccount: "Don't have an account?",
    signup: "Sign up",
    error: "Invalid email or password"
  }
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { login } = useAuth();
  const contentData = content[language];
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      
      // Get the user data from localStorage to determine role
      const userData = authService.getStoredUser();
      if (userData) {
        // Navigate based on user role
        const userRole = userData.role;
        switch (userRole) {
          case 'admin':
            navigate('/');
            break;
          case 'lawyer':
            navigate('/lawyer');
            break;
          case 'customer':
            navigate('/customer');
            break;
          default:
            navigate('/');
        }
      } else {
        // Fallback navigation
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || contentData.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
    
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl shadow-2xl mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
              <span className="text-3xl font-bold text-white relative z-10">P</span>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl blur opacity-30"></div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-3">
              {contentData.title}
            </h1>
            <p className="text-blue-100 text-lg font-medium">
              {language === 'pt' ? 'Acesse sua conta para continuar' : 'Sign in to your account to continue'}
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
            <div className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-semibold text-white/90 tracking-wide">
                    {contentData.email}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={contentData.email}
                      required
                      className="relative w-full border-2 border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/15"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="password" className="block text-sm font-semibold text-white/90 tracking-wide">
                    {contentData.password}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={contentData.password}
                      required
                      className="relative w-full border-2 border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/15"
                    />
                  </div>
                </div>
              
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-sm p-4 rounded-2xl">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-300 font-medium">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-white/20"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {contentData.loading}
                      </div>
                    ) : (
                      contentData.button
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-10 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white/70 font-medium">
                      {language === 'pt' ? 'ou' : 'or'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-8 text-sm text-white/80">
                  {contentData.noAccount}{' '}
                  <Link 
                    to="/register" 
                    className="font-bold text-blue-300 hover:text-blue-200 hover:underline transition-all duration-300 relative group"
                  >
                    <span className="relative z-10">{contentData.signup}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 text-white/50 text-sm">
              <div className="w-1 h-1 bg-white/30 rounded-full"></div>
              <span>
                {language === 'pt' 
                  ? '© 2024 Plenaria. Todos os direitos reservados.' 
                  : '© 2024 Plenaria. All rights reserved.'
                }
              </span>
              <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}