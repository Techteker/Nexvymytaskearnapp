import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home, Compass, ShieldAlert } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';

export const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleReturn = () => {
    navigate(user ? '/' : '/welcome');
  };

  return (
    <>
      <SEO 
        title="404 - Page Not Found"
        description="The requested page could not be located. Double-check your URL parameter or click standard return to find active reward challenges on Nexvy."
        keywords="404 nexvy, page not found, invalid rewrites"
      />
      
      <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
        
        {/* Abstract background decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/15 blur-[150px] pointer-events-none" />
        
        <div className="max-w-md w-full text-center relative z-10 flex flex-col items-center">
          
          {/* Animated pulsing red warning shape */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 rounded-3xl bg-slate-800/80 border border-red-500/30 flex items-center justify-center mb-8 relative shadow-2xl backdrop-blur-md"
          >
            <ShieldAlert size={48} className="text-red-500 animate-pulse" />
            
            {/* Tiny orbiting decor dots */}
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" />
            <div className="absolute -bottom-1.5 left-6 w-1.5 h-1.5 bg-yellow-400 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h1 className="text-6xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              404
            </h1>
            <h2 className="text-lg font-black uppercase tracking-widest text-indigo-400 mt-2 font-mono">
              Page Not Found
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-sm mx-auto mt-4 px-4">
              The requested address doesn't exist on this network or the Vercel routing parameters had an issue. Click below to safely locate our stable reward servers.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-3.5 w-full mt-8 px-4"
          >
            <button
              onClick={handleReturn}
              className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-display font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2 border-0"
            >
              <Home size={14} />
              <span>Go to {user ? 'Dashboard' : 'Welcome'}</span>
            </button>

            <button
              onClick={() => navigate('/about-us')}
              className="w-full py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-display font-black text-xs uppercase tracking-widest transition-all cursor-pointer border border-slate-700 active:scale-95 flex items-center justify-center gap-2"
            >
              <Compass size={14} />
              <span>Explore Help</span>
            </button>
          </motion.div>

          {/* Branding signature */}
          <div className="mt-14 flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <span>NEXVY PLATFORM v2.0</span>
          </div>

        </div>
      </div>
    </>
  );
};

export default NotFound;
