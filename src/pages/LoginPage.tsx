import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginWithEmail, googleLogin } from '../utils/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const googleInitialized = useRef(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  // Initialize Google Sign-In (works with any host/port)
  useEffect(() => {
    if (googleInitialized.current) return;
    googleInitialized.current = true;

    const initializeGoogle = () => {
      if (window.google && window.google.accounts) {
        // Initialize without hosted_domain to work from any origin
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy',
          callback: handleGoogleResponse,
          ux_mode: 'popup', // Use popup instead of redirect to avoid origin mismatch
        });

        const buttonDiv = document.getElementById('google-signin-button');
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            type: 'standard',
            size: 'large',
            locale: 'en',
            theme: 'outline',
          });
        }
      }
    };

    const timer = setTimeout(initializeGoogle, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      setLoading(true);
      setError('');
      
      const credential = response.credential;
      
      // Send to backend
      const authResponse = await googleLogin(credential);
      
      if (authResponse) {
        login(authResponse.access_token, authResponse.user);
        navigate('/home');
      } else {
        setError('Google login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google login');
      console.error('Google login error:', err);
    } finally {
      setLoading(false);
    }
  };

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

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Email/Password Form */}
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

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-slate-700/50"></div>
            <span className="px-3 text-slate-400 text-sm">or</span>
            <div className="flex-1 h-px bg-slate-700/50"></div>
          </div>

          {/* Google Login Button */}
          <div 
            id="google-signin-button" 
            className="w-full flex justify-center"
            style={{ minHeight: "48px" }}
          ></div>

          {/* Info Section */}
          <div className="text-center mt-8">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setEmail('');
                  setPassword('');
                  setError('');
                }}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
              >
                Try: test@example.com / test123
              </button>
            </p>
          </div>

          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <div className="text-center">
              <h3 className="text-white font-semibold mb-3">Test Accounts</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <p>Email: <span className="text-slate-300">test@example.com</span></p>
                <p>Password: <span className="text-slate-300">test123</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Your data is encrypted and secure. We never share your information.
        </p>
      </div>
    </div>
  );
}
