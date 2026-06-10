import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { SEO } from '../components/SEO';
import { 
  ShieldCheck, 
  Sparkles, 
  Coins, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ChevronRight, 
  Award, 
  HeartHandshake, 
  Car, 
  Gift, 
  LockKeyhole,
  CheckCircle2,
  Home as HomeIcon,
  Gamepad2,
  Wallet,
  User,
  ShieldAlert,
  Headphones
} from 'lucide-react';

export const Welcome = () => {
  const navigate = useNavigate();
  const { user, loading, refreshUser, isAdmin } = useAuth();
  const [logo, setLogo] = useState(() => localStorage.getItem('app_logo') || '/input_file_0.png');
  
  // Auth Modal/Drawer state
  const [showAuthDrawer, setShowAuthDrawer] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Sync brand logo on mount
  useEffect(() => {
    const handleLogoChange = () => {
      setLogo(localStorage.getItem('app_logo') || '/input_file_0.png');
    };
    window.addEventListener('app_logo_changed', handleLogoChange);
    return () => window.removeEventListener('app_logo_changed', handleLogoChange);
  }, []);

  // Redirect if already logged in and not opening auth explicitly
  useEffect(() => {
    if (user && !loading && !showAuthDrawer) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate, isAdmin, showAuthDrawer]);

  const handleStartEarning = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setShowAuthDrawer(true);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthLoading(true);

    try {
      if (isLogin) {
        const res = await apiService.login({ email, password });
        if (res.error) throw new Error(res.error);
        await refreshUser();
        setShowAuthDrawer(false);
        navigate('/');
      } else {
        const res: any = await apiService.signup({ email, password, username });
        if (res.error) throw new Error(res.error);
        await refreshUser();

        // Safe auto claim from query parameter cache in local storage
        const savedRef = localStorage.getItem('referredBy');
        if (savedRef) {
          try {
            await apiService.claimReferral(savedRef);
            localStorage.removeItem('referredBy');
            console.log('[REFERRAL] Auto-claimed referral bonus successfully for new user!');
          } catch (refErr) {
            console.warn('[REFERRAL] Auto-claim referral code failed:', refErr);
          }
        }

        setShowAuthDrawer(false);
        navigate('/');
      }
    } catch (err: any) {
      let msg = err.message;
      if (err.message?.includes('missing scopes') || err.message?.toLowerCase().includes('guests') || err.message?.includes('ACCOUNT') || err.message?.includes('role: guests')) {
        msg = "Appwrite Config Error: Please add your app domain to Appwrite Console -> select Project -> scroll to Platforms -> Add Web Platform!";
      } else if (err.message?.includes('already registered') || err.message?.includes('already exists')) {
        msg = "Email registered. Login instead.";
        setIsLogin(true);
      } else if (err.message?.includes('password') || err.message?.includes('Invalid credentials')) {
        msg = "Invalid credentials. Try again.";
      } else if (err.message?.includes('user_not_found') || err.message?.includes('Account not found')) {
        msg = "Account not found. Create one!";
        setIsLogin(false);
      }
      setError(msg || "Authentication failed. Try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAmazonOAuth = async () => {
    try {
      setAuthLoading(true);
      const { OAuthProvider } = await import('appwrite');
      const { account: appwriteAccount } = await import('../lib/appwrite');
      
      try {
        await appwriteAccount.deleteSession('current');
      } catch (e) {
        // No active session
      }

      const origin = window.location.origin;
      appwriteAccount.createOAuth2Session(
        OAuthProvider.Amazon,
        origin,
        `${origin}/login`
      );
    } catch (e: any) {
      setError('Amazon auth failed to initialize. Please try again.');
      setAuthLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Nexvy - Earn Money Online, Surveys, Cashback & Reward App India" 
        description="Nexvy is an all-in-one earning platform where users can complete surveys, do tasks, refer friends, and get cashback rewards. Start earning real money online with instant payouts and simple activities designed for everyone."
        keywords="Nexvy, earn money online, surveys app, cashback India, reward app, refer friends, complete tasks, instant payouts"
      />

      {/* Semantic SEO rich tags structure for Googlebot and other indexers */}
      <div className="sr-only" aria-hidden="true">
        <h1>India's Smart Rewards & Cashback Platform</h1>
        <h2>Earn Rewards Through Tasks, Surveys, Games, Referrals & Shopping Cashback</h2>
        <p>
          Nexvy helps users earn rewards through tasks, surveys, gaming offers, referrals, and shopping cashback. Discover daily earning opportunities, save more while shopping, and unlock exciting rewards from top brands—all in one platform.
        </p>
      </div>
      
      {/* Background Wrapper */}
      <div className="min-h-screen bg-[#06164A] flex items-center justify-center py-4 px-2 sm:px-6 relative overflow-hidden select-none">
        
        {/* Absolute Background Ambient Light Gradients */}
        <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[50%] rounded-full bg-[#1239B3] opacity-30 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[50%] rounded-full bg-[#0A1F6B] opacity-45 blur-[150px] pointer-events-none" />
        <div className="absolute top-[40%] right-[-20%] w-[40%] h-[40%] rounded-full bg-[#D4AF37] opacity-5 blur-[120px] pointer-events-none" />

        {/* Outer Grid lines for tech-luxury feel */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,134,11,.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* 9:16 Responsive Mobile Container with premium chassis frame effect */}
        <div className="w-full max-w-[420px] min-h-[820px] md:h-[860px] bg-[#0A1F6B] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_10px_#111111,0_0_0_12px_#D4AF37] relative flex flex-col overflow-hidden border border-white/5">
          
          {/* Internal Status Bar (Mobile Look) */}
          <div className="w-full h-11 px-6 pt-3 flex justify-between items-center text-white/95 text-xs font-semibold z-30 select-none bg-black/10">
            <span>12:00 PM</span>
            {/* Dynamic Island Notch */}
            <div className="w-24 h-5 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-2 shadow-inner border border-white/5 flex items-center justify-end pr-2">
              <div className="w-1.5 h-1.5 bg-[#0a1f6b] rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5 grayscale opacity-75">
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.17 19.58 10.53 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
              </svg>
              <div className="w-4 h-2 bg-white rounded-xs relative">
                <span className="absolute -right-[2px] top-[2px] w-[2px] h-1 bg-white rounded-r-xs" />
              </div>
            </div>
          </div>

          {/* Scollable Content Section */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-8 relative flex flex-col">
            
            {/* Top Logo & Branding Section */}
            <div className="flex flex-col items-center mt-6 px-6 z-20">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex items-center gap-1 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
              >
                <h1 className="text-4xl font-display font-black tracking-tight leading-none uppercase">
                  <span className="bg-gradient-to-r from-[#F8D37A] via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">Nex</span>
                  <span className="text-white">vy</span>
                </h1>
              </motion.div>
              <p className="text-[#F8D37A] text-[9px] font-mono tracking-[0.25em] uppercase font-bold mt-1 text-center bg-[#1239B3]/50 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/20">
                ULTRA PREMIUM REWARDS
              </p>
            </div>

            {/* Wallet & Coins 3D Illustration Container */}
            <div className="w-full flex justify-center mt-5 relative px-6 z-20">
              <div className="relative w-[180px] h-[120px] flex items-center justify-center">
                
                {/* Ambient glow behind wallet */}
                <div className="absolute w-[120px] h-[120px] bg-[#1239B3] rounded-full filter blur-[25px] opacity-75 animate-pulse" />
                
                {/* Coin Fallbacks / Highlights back-right */}
                <motion.div 
                  animate={{ y: [0, -4, 0], rotate: [5, 2, 5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1 left-[15%] z-10 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
                >
                  <svg width="42" height="42" viewBox="0 0 100 100" className="transform -rotate-12">
                    <circle cx="50" cy="50" r="45" fill="url(#goldGradient)" stroke="#B8860B" strokeWidth="4" />
                    <circle cx="50" cy="50" r="37" fill="none" stroke="#F8D37A" strokeWidth="2" strokeDasharray="6,4" />
                    <text x="50" y="65" fontFamily="sans-serif" fontSize="42" fontWeight="bold" fill="#0A1F6B" textAnchor="middle">₹</text>
                  </svg>
                </motion.div>

                {/* Coin front-right */}
                <motion.div 
                  animate={{ y: [0, -6, 0], rotate: [-10, -15, -10] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -top-3 right-[22%] z-10 filter drop-shadow-[0_5px_8px_rgba(0,0,0,0.5)]"
                >
                  <svg width="52" height="52" viewBox="0 0 100 100" className="transform rotate-12">
                    <circle cx="50" cy="50" r="45" fill="url(#goldGradient)" stroke="#D4AF37" strokeWidth="5" />
                    <circle cx="50" cy="50" r="36" fill="none" stroke="#F8D37A" strokeWidth="2" />
                    <text x="50" y="65" fontFamily="sans-serif" fontSize="46" fontWeight="bold" fill="#0A1F6B" textAnchor="middle">₹</text>
                  </svg>
                </motion.div>

                {/* Leather Wallet Vector */}
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="absolute top-4 w-[165px] h-[95px] bg-gradient-to-br from-[#242424] via-[#121212] to-[#080808] rounded-2xl border-2 border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.65),inset_0_1px_3px_rgba(255,255,255,0.15)] overflow-hidden z-20 flex flex-col justify-between p-3.5"
                >
                  {/* Detailed stitches */}
                  <div className="absolute inset-1.5 rounded-xl border border-dashed border-white/5 pointer-events-none" />
                  
                  {/* Silver button clasp */}
                  <div className="absolute right-0 top-[35%] w-6 h-8 bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-l-md border-y border-l border-white/10 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 border border-black/30 shadow-inner" />
                  </div>

                  {/* Embossed N and E Brand labels */}
                  <div className="flex gap-2.5 items-center mt-1 z-10">
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-white to-slate-200 border border-white flex items-center justify-center shadow-lg font-display font-black text-2xl text-[#121212] select-none">
                      N
                    </div>
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-md from-[#1239B3] to-[#0A1F6B] border border-[#1239B3] flex items-center justify-center shadow-lg font-display font-black text-2xl text-white select-none">
                      R
                    </div>
                  </div>

                  {/* Subtle wallet premium pattern */}
                  <div className="text-[7px] text-white/20 uppercase tracking-[0.2em] font-mono leading-none flex justify-between">
                    <span>NEXVY SMART WALLET</span>
                    <span>ZIP 2026</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* WELCOME BANNER (Large Curved ribbon with golden layout) */}
            <div className="w-full relative px-2.5 mt-2 z-20 flex justify-center">
              
              {/* Curved Ribbon Wrapper */}
              <div className="relative w-full max-w-[370px]">
                {/* Left Tail fold */}
                <div className="absolute -left-1.5 top-2 w-4 h-11 bg-gradient-to-b from-[#B8860B] to-transparent transform -skew-y-12 rounded-l-sm -z-10" />
                {/* Right Tail fold */}
                <div className="absolute -right-1.5 top-2 w-4 h-11 bg-gradient-to-b from-[#B8860B] to-transparent transform skew-y-12 rounded-r-sm -z-10" />

                {/* Main Ribbon curved-effect body */}
                <motion.div 
                  initial={{ scaleX: 0.9, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="w-full py-2.5 bg-gradient-to-r from-[#F8D37A] via-[#D4AF37] to-[#B8860B] rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] flex justify-center items-center relative overflow-hidden group border border-[#D4AF37]/50"
                  style={{
                    borderRadius: "14px",
                    transform: "perspective(300px) rotateX(4deg)",
                  }}
                >
                  {/* Subtle animated highlights inside ribbon */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[300%] -translate-x-[100%] animate-[shimmer_3s_infinite]" />
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/40" />

                  <span className="font-serif text-lg tracking-[0.1em] text-white font-extrabold text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] select-none uppercase">
                    WELCOME TO NEXVY!
                  </span>
                </motion.div>
              </div>
            </div>

            {/* HEADLINE */}
            <div className="text-center px-4 mt-5 z-20 leading-snug">
              <h2 className="font-display font-bold text-[19px] text-white tracking-wide uppercase drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.5)]">
                YOU WIN <span className="text-[#F8D37A] font-extrabold underline decoration-[#F8D37A]/30">1 MONTHLY THAR</span> <br />
                & EXCITING <span className="text-[#F8D37A] font-extrabold">CASH REWARDS</span>
              </h2>
            </div>

            {/* PRIZE SECTION (Black Thar / SUV + Golden Podium + Cash Giftbox) */}
            <div className="w-full flex flex-col items-center mt-3 relative px-4 z-20">
              
              {/* Podium & Vehicle Area */}
              <div className="w-full max-w-[340px] h-[190px] relative mt-1 flex items-center justify-center">
                
                {/* Studio ambient glow around SUV */}
                <div className="absolute w-[210px] h-[60px] bg-[#1239B3]/40 rounded-full filter blur-[15px] bottom-14 left-1/2 -translate-x-1/2 -z-10 h-[-40px]" />

                {/* 1. Golden Circular Podium Stage (Layers for 3D depth) */}
                <div className="absolute bottom-1 w-[250px] flex flex-col items-center z-10">
                  {/* Podium top ellipse */}
                  <div className="w-full h-8 rounded-full bg-gradient-to-r from-[#F8D37A] via-[#D4AF37] to-[#B8860B] border-t border-white/40 shadow-md flex items-center justify-center relative shadow-[inset_0_1px_3px_rgba(255,255,255,0.4)]">
                    {/* Inner gold circular shine ring */}
                    <div className="w-[94%] h-[80%] rounded-full border border-[#F8D37A]/40" />
                  </div>
                  {/* Podium lateral thickness wall */}
                  <div className="w-full h-3.5 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#8B6508] -mt-4 rounded-b-full shadow-[0_6px_12px_rgba(0,0,0,0.6)] border-b border-[#5C4000]" />
                </div>

                {/* 2. Realistic Black SUV (Wrangler/Thar Studio Render) */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.85, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="absolute bottom-6 w-[230px] z-20 pointer-events-none filter drop-shadow-[0_12px_15px_rgba(0,0,0,0.85)] flex flex-col items-center"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&w=800&q=80" 
                    alt="Mahindra Thar SUV" 
                    className="w-full h-[125px] object-cover rounded-2xl border-b-4 border-black/40"
                    referrerPolicy="no-referrer"
                  />
                  {/* Digital Thar Badge Emblem */}
                  <div className="bg-black/90 px-3 py-0.5 rounded-full border border-yellow-500/30 text-[9px] font-mono tracking-widest text-[#F8D37A] font-bold mt-1 shadow-sm leading-none uppercase">
                    THAR 4X4 LIMITED
                  </div>
                </motion.div>

                {/* Headlights golden flare glows */}
                <div className="absolute bottom-14 left-[20%] w-3.5 h-3.5 bg-yellow-300 rounded-full filter blur-[4px] animate-pulse z-30 opacity-60" />
                <div className="absolute bottom-14 right-[20%] w-3.5 h-3.5 bg-yellow-300 rounded-full filter blur-[4px] animate-pulse z-30 opacity-60" />

                {/* 3. Gift Box (White with blue text and a luxury gold ribbon) */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute bottom-1 right-2 z-30 w-24 bg-white rounded-lg p-2.5 pb-2 shadow-[0_8px_16px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.7)] border border-[#D4AF37]/40 flex flex-col items-center"
                >
                  {/* Decorative ribbon visual anchor */}
                  <div className="absolute -top-1.5 w-6 h-1.5 bg-[#D4AF37] rounded-full shadow-sm" />
                  <div className="absolute top-0 bottom-0 w-1.5 bg-gradient-to-r from-[#F8D37A] to-[#B8860B] rounded-sm mix-blend-multiply" />
                  <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-b from-[#F8D37A] to-[#B8860B] top-[40%] rounded-sm mix-blend-multiply" />

                  {/* Cash prize text content */}
                  <span className="text-[12px] font-black font-display text-[#1239B3] leading-none mb-0.5 z-10">CASH</span>
                  <span className="text-[11px] font-black font-display text-[#1239B3] leading-none tracking-wider z-10">PRIZE</span>
                  
                  {/* Tiny Ribbon details */}
                  <Gift className="w-3.5 h-3.5 text-[#D4AF37] mt-1.5 z-10" />
                </motion.div>

              </div>
            </div>

            {/* FEATURE CARDS - 2x2 Grid with high performance styles */}
            <div className="px-5 mt-6 z-20">
              <div className="grid grid-cols-2 gap-3">
                
                {/* Card 1 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-[18px] border-2 border-[#D4AF37] p-3 flex flex-col gap-1.5 shadow-[0_6px_12px_rgba(0,0,0,0.15)] relative overflow-hidden group min-h-[96px]"
                >
                  <div className="p-1 rounded-lg bg-[#0A1F6B]/10 w-fit">
                    <Car className="w-5 h-5 text-[#1239B3]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111] leading-tight font-display select-none">
                      Monthly 1 Thar Challenge
                    </h4>
                    <p className="text-[9.5px] text-[#555555] leading-snug mt-0.5 selection:bg-yellow-105 select-none">
                      Earn monthly 1 Thar Challenge
                    </p>
                  </div>
                </motion.div>

                {/* Card 2 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-[18px] border-2 border-[#D4AF37] p-3 flex flex-col gap-1.5 shadow-[0_6px_12px_rgba(0,0,0,0.15)] relative overflow-hidden group min-h-[96px]"
                >
                  <div className="p-1 rounded-lg bg-[#0A1F6B]/10 w-fit">
                    <Coins className="w-5 h-5 text-[#1239B3]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111] leading-tight font-display select-none">
                      Cash Prizes up to ₹1 Lakh
                    </h4>
                    <p className="text-[9.5px] text-[#555555] leading-snug mt-0.5 select-none">
                      Cash Prizes up to to ₹1 Lakh
                    </p>
                  </div>
                </motion.div>

                {/* Card 3 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-[18px] border-2 border-[#D4AF37] p-3 flex flex-col gap-1.5 shadow-[0_6px_12px_rgba(0,0,0,0.15)] relative overflow-hidden group min-h-[96px]"
                >
                  <div className="p-1 rounded-lg bg-[#0A1F6B]/10 w-fit">
                    <Sparkles className="w-5 h-5 text-[#1239B3]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111] leading-tight font-display select-none">
                      Daily Rewards
                    </h4>
                    <p className="text-[9.5px] text-[#555555] leading-snug mt-0.5 select-none">
                      Earn every daily on rewards
                    </p>
                  </div>
                </motion.div>

                {/* Card 4 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-[18px] border-2 border-[#D4AF37] p-3 flex flex-col gap-1.5 shadow-[0_6px_12px_rgba(0,0,0,0.15)] relative overflow-hidden group min-h-[96px]"
                >
                  <div className="p-1 rounded-lg bg-[#0A1F6B]/10 w-fit">
                    <ShieldCheck className="w-5 h-5 text-[#1239B3]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111] leading-tight font-display select-none">
                      Secure & Trustworthy
                    </h4>
                    <p className="text-[9.5px] text-[#555555] leading-snug mt-0.5 select-none">
                      Secure security & Trustworthy
                    </p>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* CTA BUTTON */}
            <div className="px-5 mt-6 z-20 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartEarning}
                className="w-full py-4 bg-gradient-to-b from-[#F8D37A] via-[#D4AF37] to-[#B8860B] rounded-2xl shadow-[0_6px_25px_rgba(212,175,55,0.4),0_2px_4px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.5)] border border-[#F8D37A] flex items-center justify-center relative overflow-hidden group cursor-pointer transition-all duration-300"
              >
                {/* Shimmer overlay effect */}
                <span className="absolute inset-x-0 top-0 h-[1.5px] bg-white/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-[300%] -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                
                <span className="text-[#111111] font-display font-black text-[15px] tracking-[0.12em] uppercase select-none drop-shadow-[0_0.5px_0.5px_rgba(255,255,255,0.5)]">
                  START EARNING
                </span>
                <ChevronRight className="w-5 h-5 text-[#111111] ml-1 stroke-[2.5]" />
              </motion.button>
            </div>

            {/* BOTTOM TRUST SECTION */}
            <div className="px-6 mt-6 py-2.5 bg-black/15 border-y border-white/5 z-20 flex items-center justify-around">
              
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#F8D37A]" />
                <span className="text-[10px] text-white font-medium select-none">100% Secure</span>
              </div>
              <div className="h-4 w-[1px] bg-white/20" />
              
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-[#F8D37A]" />
                <span className="text-[10px] text-white font-medium select-none">Best Offers</span>
              </div>
              <div className="h-4 w-[1px] bg-white/20" />
              
              <div className="flex items-center gap-1">
                <Headphones className="w-4 h-4 text-[#F8D37A]" />
                <span className="text-[10px] text-white font-medium select-none">24x7 Support</span>
              </div>

            </div>

          </div>



          {/* SECURITY SLIDE-UP AUTH DRAWER (Fully functional signup/login modal inside the luxury chassis) */}
          <AnimatePresence>
            {showAuthDrawer && (
              <>
                {/* Drawer Overlay */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowAuthDrawer(false)}
                  className="absolute inset-0 bg-black/75 backdrop-blur-[2px] z-40 transition-all"
                />
                
                {/* Form Drawer Element */}
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  className="absolute bottom-0 left-0 right-0 max-h-[82%] bg-[#0A1F6B] border-t-2 border-[#D4AF37]/80 rounded-t-[32px] p-6 pb-8 z-50 overflow-y-auto"
                >
                  {/* Pull Indicator Slider Line */}
                  <div className="w-12 h-1 bg-[#D4AF37]/30 rounded-full mx-auto mb-4" />

                  {/* Header */}
                  <div className="flex flex-col items-center text-center gap-1.5 mb-6">
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">
                      {isLogin ? 'Welcome Back!' : 'Create Luxury Account'}
                    </h3>
                    <p className="text-white/60 text-xs">
                      {isLogin ? 'Access your Nexvy dashboard to start earning' : 'Begin your elite financial adventure free'}
                    </p>
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                    
                    {!isLogin && (
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#F8D37A]" />
                        <input
                          type="text"
                          placeholder="Your Premium Nickname"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-[#06164A] text-white placeholder-white/35 rounded-xl py-3 pl-11 pr-4 border border-[#D4AF37]/35 outline-none focus:border-[#D4AF37] transition-all text-xs font-semibold"
                          required
                        />
                      </div>
                    )}

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#F8D37A]" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#06164A] text-white placeholder-white/35 rounded-xl py-3 pl-11 pr-4 border border-[#D4AF37]/35 outline-none focus:border-[#D4AF37] transition-all text-xs font-semibold"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#F8D37A]" />
                      <input
                        type="password"
                        placeholder="Security Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#06164A] text-white placeholder-white/35 rounded-xl py-3 pl-11 pr-4 border border-[#D4AF37]/35 outline-none focus:border-[#D4AF37] transition-all text-xs font-semibold"
                        required
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-950/40 rounded-xl border border-red-500/30 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="text-[10.5px] text-red-200 font-bold uppercase">{error}</span>
                      </div>
                    )}

                    {/* Submit Onboarding CTA */}
                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#F8D37A] via-[#D4AF37] to-[#B8860B] rounded-xl text-[#111111] text-xs font-bold tracking-widest uppercase shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {authLoading ? 'Verifying Credentials...' : (isLogin ? 'Log In Securingly' : 'Submit Premium Signup')}
                      {!authLoading && <ArrowRight className="w-4 h-4 text-[#111111]" />}
                    </button>

                  </form>

                  {/* Switch Authentication modes */}
                  <div className="mt-6 text-center text-xs text-white/50 font-medium">
                    {isLogin ? "New to Nexvy's inner rewarded circle?" : "Have an accredited Nexvy slot already?"}
                    <button
                      onClick={() => { setError(''); setIsLogin(!isLogin); }}
                      className="text-[#F8D37A] font-bold ml-1.5 hover:underline decoration-dashed"
                    >
                      {isLogin ? 'Sign up free' : 'Log in here'}
                    </button>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-1 text-[10px] text-white/35 font-mono uppercase bg-[#06164A]/50 py-2 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    SECURE 256-BIT ENCRYPTED CREDENTIAL PANEL
                  </div>

                </motion.div>
              </>
            )}
          </AnimatePresence>

        </div>

        {/* Global CSS Gradients declaration (injected so the SVG colors work flawlessly) */}
        <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8D37A" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
        </svg>

      </div>
    </>
  );
};
