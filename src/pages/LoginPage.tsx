import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginWithEmail, register as registerWithEmail, getAPIBaseURL } from '../utils/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register form state
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const authResponse = await loginWithEmail({ email, password });
      
      if (authResponse) {
        login(authResponse.access_token, authResponse.user);
        navigate('/home');
      } else {
        setError('Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !regEmail || !regPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (regPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Call the backend register endpoint directly
      const response = await fetch(`${getAPIBaseURL()}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: regEmail,
          password: regPassword,
          full_name: fullName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Registration failed');
      }

      const authResponse = await response.json();
      
      if (authResponse.access_token) {
        login(authResponse.access_token, authResponse.user);
        navigate('/home');
      } else {
        setError('Registration successful but login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Tibbiy Hub</h1>
            <p className="text-slate-400">Medical Knowledge Platform</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => {
                setIsRegisterMode(false);
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                !isRegisterMode
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsRegisterMode(true);
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                isRegisterMode
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* LOGIN FORM */}
          {!isRegisterMode && (
            <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
                  disabled={loading}
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {isRegisterMode && (
            <form onSubmit={handleRegister} className="space-y-4 mb-6">
              {/* Full Name Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
                  disabled={loading}
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
                  disabled={loading}
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
                  disabled={loading}
                />
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Info Section - Only show demo accounts, not sign up link */}
          {!isRegisterMode && (
            <div className="text-center mt-8">
              <p className="text-slate-400 text-sm">
                New user?{' '}
                <button
                  onClick={() => {
                    setIsRegisterMode(true);
                    setError('');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
                >
                  Create an account
                </button>
              </p>
            </div>
          )}

          {/* Footer Info - Demo Accounts (only show on login tab) */}
          {!isRegisterMode && (
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <div className="text-center">
                <h3 className="text-white font-semibold mb-3">Demo Accounts</h3>
                <div className="space-y-3 text-sm text-slate-400">
                  <div>
                    <p className="font-semibold text-cyan-400">Admin Account</p>
                    <p>Email: <span className="text-slate-300">admin@example.com</span></p>
                    <p>Password: <span className="text-slate-300">admin123</span></p>
                  </div>
                  <div className="pt-2 border-t border-slate-600/30">
                    <p className="font-semibold text-blue-400">Test Account</p>
                    <p>Email: <span className="text-slate-300">test@example.com</span></p>
                    <p>Password: <span className="text-slate-300">test123</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Your data is encrypted and secure. We never share your information.
        </p>
      </div>
    </div>
  );
}
