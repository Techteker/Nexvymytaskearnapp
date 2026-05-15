import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/api';
import { SEO } from '../components/SEO';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const { loading, user, refreshUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log('[AUTH] State check:', { hasUser: !!user, loading, role: user?.role, isAdmin });
    if (user && !loading) {
      console.log('[AUTH] Redirecting user...', user.email);
      
      if (isAdmin) {
        console.log('[AUTH] Navigating to /admin');
        navigate('/admin', { replace: true });
      } else {
        console.log('[AUTH] Navigating to /');
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[AUTH] Submitting...', { isLogin, email });
    setError('');
    setAuthLoading(true);

    try {
      if (isLogin) {
        const res = await apiService.login({ email, password });
        if (res.error) throw new Error(res.error);
        console.log('[AUTH] Login successful, refreshing user...');
        await refreshUser();
      } else {
        const res: any = await apiService.signup({ email, password, username });
        if (res.error) throw new Error(res.error);
        console.log('[AUTH] Signup successful, refreshing user...');
        await refreshUser();
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message;
      
      if (err.message?.includes('already registered') || err.message?.includes('already exists')) {
        msg = "Email registered. Login instead.";
        setIsLogin(true);
      } else if (err.message?.includes('password') || err.message?.includes('Invalid credentials')) {
        msg = "Invalid password. Try again.";
      } else if (err.message?.includes('user_not_found') || err.message?.includes('Account not found')) {
        msg = "Account not found. Create one?";
        setIsLogin(false);
      }

      setError(msg || "Auth Protocol Error. Try later.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title={isLogin ? "Login" : "Sign Up"} 
        description="Join the Nexvy community. Securely login or create an account to start earning rewards today."
      />
      <div className="min-h-screen flex flex-col items-center justify-center p-6 mesh-gradient">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md gaming-card p-8 bg-white border border-slate-100 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col items-center gap-2 mb-8">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-md border-2 border-slate-50 overflow-hidden">
                  <img src="/input_file_0.png" alt="Nexvy Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-3xl font-display font-black text-brand-purple italic tracking-tighter mt-4 leading-none">NEXVY</h1>
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest leading-none mt-1">SECURE ACCESS</p>
          </div>

          {!isLogin && (
            <p className="text-center text-[10px] font-black text-emerald-500 mb-6 uppercase tracking-tighter animate-pulse">
              1M+ ACTIVE USERS JOINED
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:border-brand-purple outline-none transition-all placeholder:text-slate-300 font-bold"
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:border-brand-purple outline-none transition-all placeholder:text-slate-300 font-bold"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:border-brand-purple outline-none transition-all placeholder:text-slate-300 font-bold"
                required
              />
            </div>

            {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}

            <button
              type="submit"
              disabled={authLoading}
              className="gaming-button-yellow w-full py-4 text-lg font-black tracking-tighter mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
            >
              {authLoading ? 'PROCESSING...' : (isLogin ? 'LOG IN' : 'SIGN UP')}
              {!authLoading && <ArrowRight className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-4 my-2">
              <div className="h-[1px] flex-1 bg-slate-100" />
              <span className="text-[10px] font-black text-slate-300 uppercase">OR</span>
              <div className="h-[1px] flex-1 bg-slate-100" />
            </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  const { OAuthProvider } = await import('appwrite');
                  const { account: appwriteAccount } = await import('../lib/appwrite');
                  try {
                    await appwriteAccount.deleteSession('current');
                  } catch (e) {}
                  appwriteAccount.createOAuth2Session(
                    OAuthProvider.Google,
                    window.location.origin,
                    window.location.origin + '/login'
                  );
                } catch (e) {
                  console.error(e);
                }
              }}
              disabled={authLoading}
              className="w-full py-4 bg-white text-slate-900 font-black flex items-center justify-center gap-3 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm uppercase text-sm tracking-tight disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google Login
            </button>
          </form>

          <div className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
            {isLogin ? "Don't have an account?" : "Already a member?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-purple ml-2 hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};
