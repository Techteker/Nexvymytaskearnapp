import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Check, X, ShieldAlert } from 'lucide-react';
import { apiService } from '../services/api';
import { SEO } from '../components/SEO';
import { triggerHaptic } from '../lib/haptics';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const { loading, user, refreshUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [logo, setLogo] = useState(() => localStorage.getItem('app_logo') || '/input_file_0.png');

  React.useEffect(() => {
    const handleLogoChange = () => {
      setLogo(localStorage.getItem('app_logo') || '/input_file_0.png');
    };
    window.addEventListener('app_logo_changed', handleLogoChange);
    return () => window.removeEventListener('app_logo_changed', handleLogoChange);
  }, []);

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

  // Input Sanitizer to block potential XSS scripts or database injection payloads
  const sanitizeValue = (val: string): string => {
    if (!val) return '';
    return val
      .replace(/<[^>]*>/g, '') // Strip standard HTML tags
      .replace(/javascript:/gi, '') // Block dangerous schema scripts
      .replace(/['"`;]/g, '') // Strip potentially escaping database quotes for strict client sanitization
      .trim();
  };

  const hasMinLength = password.length >= 8;
  const hasUpperLowerDigitSpecial = /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
  const uniqueCharCount = new Set(password).size;
  const hasMinUniqueChars = uniqueCharCount >= 5;
  const isPasswordValid = hasMinLength && hasUpperLowerDigitSpecial && hasMinUniqueChars;

  // Anti-Bruteforce / Rate Limit hacker protection
  const checkRateLimit = (): boolean => {
    const LIMIT_ATTEMPTS = 5;
    const COOLDOWN_MS = 45 * 1000; // 45 seconds lockdown
    const now = Date.now();
    
    const lockTimeStr = localStorage.getItem('auth_locked_until');
    if (lockTimeStr) {
      const lockedUntil = parseInt(lockTimeStr, 10);
      if (now < lockedUntil) {
        const remaining = Math.ceil((lockedUntil - now) / 1000);
        triggerHaptic('error');
        setError(`SECURITY LOCK: Multiple failures. Access locked for ${remaining}s.`);
        return false;
      } else {
        localStorage.removeItem('auth_locked_until');
        localStorage.setItem('auth_attempts', '0');
      }
    }
    
    const attemptsStr = localStorage.getItem('auth_attempts');
    let attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;
    attempts += 1;
    localStorage.setItem('auth_attempts', attempts.toString());
    
    if (attempts >= LIMIT_ATTEMPTS) {
      const lockTime = now + COOLDOWN_MS;
      localStorage.setItem('auth_locked_until', lockTime.toString());
      triggerHaptic('heavy');
      setError(`SECURITY LOCK: Unusually high activity. Suspended for 45 seconds.`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Anti-Hacker Throttler
    if (!checkRateLimit()) {
      return;
    }

    // Apply rigorous input sanitization on all input fields
    const cleanEmail = sanitizeValue(email);
    const cleanPassword = password; // Preserve password symbols but check strength
    const cleanUsername = sanitizeValue(username);

    // Strict validation check for signup passwords
    if (!isLogin && !isPasswordValid) {
      triggerHaptic('error');
      setError("Password fails security checks. It must be 8+ characters, contain uppercase, lowercase, numbers, special symbols, and have at least 5 distinct unique characters.");
      setAuthLoading(false);
      return;
    }

    console.log('[AUTH] Submitting sanitized payload...', { isLogin, cleanEmail });
    setAuthLoading(true);

    try {
      if (isLogin) {
        const res = await apiService.login({ email: cleanEmail, password: cleanPassword });
        if (res.error) throw new Error(res.error);
        console.log('[AUTH] Login successful, resetting rate limits...');
        localStorage.setItem('auth_attempts', '0');
        triggerHaptic('success');
        await refreshUser();
      } else {
        const res: any = await apiService.signup({ email: cleanEmail, password: cleanPassword, username: cleanUsername });
        if (res.error) throw new Error(res.error);
        console.log('[AUTH] Signup successful, resetting rate limits...');
        localStorage.setItem('auth_attempts', '0');
        triggerHaptic('success');
        await refreshUser();

        // Safe auto claim from query parameter cache in local storage
        const savedRef = localStorage.getItem('referredBy');
        if (savedRef) {
          try {
            await apiService.claimReferral(savedRef);
            localStorage.removeItem('referredBy');
            console.log('[REFERRAL] Auto-claimed referral bonus successfully during onboarding!');
          } catch (refErr) {
            console.warn('[REFERRAL] Auto-claim referral code failed:', refErr);
          }
        }
      }
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('failed to fetch') || err.message?.toLowerCase().includes('network error') || String(err).toLowerCase().includes('failed to fetch')) {
        console.warn('[AUTH] Connection issue during authentication (likely offline or API unreachable):', err.message || err);
      } else {
        console.error(err);
      }
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

      triggerHaptic('error');
      setError(msg || "Auth Protocol Error. Try later.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title={isLogin ? "Login to Your Nexvy Account: Start Earning Now" : "Register Free on Nexvy: Claim Signup Coin Bonus"} 
        description={isLogin ? "Log in to your Nexvy account securely to complete daily tasks, earn coins and withdraw cash directly into your UPI or Paytm wallet." : "Sign up for a free Nexvy account today. Play trivia quizzes, complete high-paying tasks, spin the lucky wheel and earn real online cash rewards."}
        keywords={isLogin ? "nexvy login, access nexvy account, login earn money app, log into wallet" : "register nexvy account, sign up earning app, signup bonus free, create earning account, free paytm cash sign up"}
      />
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md gaming-card p-8 bg-white border border-slate-100 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-purple/5 rounded-full pointer-events-none" />
          
          <div className="flex flex-col items-center gap-2 mb-8">
               <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-md border-2 border-slate-50 overflow-hidden">
                  <img src={logo} alt="Nexvy Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
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

            {!isLogin && password && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col gap-1.5 text-xs">
                <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-brand-purple" />
                  PASSWORD SECURITY CHECK
                </p>
                <div className="grid grid-cols-1 gap-1 mt-1 font-bold">
                  <div className="flex items-center gap-2 text-[10px] uppercase">
                    {hasMinLength ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-rose-500" />
                    )}
                    <span className={hasMinLength ? 'text-emerald-500' : 'text-slate-400'}>At least 8 characters</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] uppercase">
                    {hasMinUniqueChars ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-rose-500" />
                    )}
                    <span className={hasMinUniqueChars ? 'text-emerald-500' : 'text-slate-400'}>
                      Contains unique/distinct chars ({uniqueCharCount}/5)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] uppercase">
                    {hasUpperLowerDigitSpecial ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-rose-500" />
                    )}
                    <span className={hasUpperLowerDigitSpecial ? 'text-emerald-500' : 'text-slate-400'}>
                      Mix of A-Z, a-z, 0-9 & Special symbols
                    </span>
                  </div>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}

            <button
              type="submit"
              disabled={authLoading}
              className="gaming-button-yellow w-full py-4 text-lg font-black tracking-tighter mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
            >
              {authLoading ? 'PROCESSING...' : (isLogin ? 'LOG IN' : 'SIGN UP')}
              {!authLoading && <ArrowRight className="w-5 h-5" />}
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
