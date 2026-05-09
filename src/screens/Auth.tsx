import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { apiService } from '../services/api';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const { loading, firebaseUser, auth: firebaseAuth, db: firestoreDb, authReady } = useAuth();
  const [initTimeout, setInitTimeout] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!authReady) {
        setInitTimeout(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [authReady]);

  React.useEffect(() => {
    if (firebaseUser && !loading) {
      navigate('/');
    }
  }, [firebaseUser, loading, navigate]);

  const handleGoogleLogin = async () => {
    if (!firebaseAuth || !authReady) {
      setError('Google Login requires Firebase. Please configure it in AI Studio settings.');
      return;
    }
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      
      if (firestoreDb) {
        // Ensure user doc exists
        await setDoc(doc(firestoreDb, 'users', user.uid), {
          email: user.email,
          username: user.displayName || user.email?.split('@')[0],
          coins: 0,
          level: 1,
          createdAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to login with Google');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthLoading(true);

    try {
      if (authReady && firebaseAuth) {
        // Firebase Auth Path
        if (isLogin) {
          await signInWithEmailAndPassword(firebaseAuth, email, password);
        } else {
          const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
          const user = userCredential.user;
          await updateProfile(user, { displayName: username });
          if (firestoreDb) {
            await setDoc(doc(firestoreDb, 'users', user.uid), {
              email: user.email,
              username: username,
              coins: 0,
              level: 1,
              createdAt: serverTimestamp()
            });
          }
        }
      } else {
        // Local Auth Fallback Path
        if (isLogin) {
          const res = await apiService.login({ email, password });
          if (res.error) throw new Error(res.error);
          localStorage.setItem('token', res.token);
          window.location.reload(); // To trigger re-init in AuthProvider
        } else {
          const res = await apiService.signup({ email, password, username });
          if (res.error) throw new Error(res.error);
          localStorage.setItem('token', res.token);
          window.location.reload();
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gaming-blue-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md gaming-card p-8 bg-blue-900/40 border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gaming-accent/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col items-center gap-2 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gaming-accent flex items-center justify-center shadow-lg transform rotate-12">
                <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-display font-black text-white italic tracking-tighter mt-4">NEXVY</h1>
            <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest leading-none">JOIN THE ELITE HUB</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gaming-accent outline-none transition-all placeholder:text-white/20 font-bold"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gaming-accent outline-none transition-all placeholder:text-white/20 font-bold"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gaming-accent outline-none transition-all placeholder:text-white/20 font-bold"
              required
            />
          </div>

          {error && <p className="text-red-400 text-[10px] font-black uppercase text-center">{error}</p>}
          {initTimeout && !authReady && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl">
              <p className="text-yellow-400 text-[10px] font-black uppercase text-center leading-relaxed">
                Cloud Sync is delayed. <br/>
                Email login is active and ready to use.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="gaming-button-yellow w-full py-4 text-lg font-black tracking-tighter mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {authLoading ? 'PROCESSING...' : (isLogin ? 'ENTER HUD' : 'CREATE ACCOUNT')}
            {!authLoading && <ArrowRight className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-4 my-2">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-[10px] font-black text-white/20 uppercase">OR</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={authLoading || !authReady}
            className="w-full py-4 bg-white text-black font-black flex items-center justify-center gap-3 rounded-2xl hover:bg-white/90 transition-colors uppercase text-sm tracking-tight disabled:opacity-50"
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
            Google Account
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-white/40">
          {isLogin ? "New user?" : "Existing operative?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gaming-accent ml-2 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
