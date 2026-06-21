import React, { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { TopBar } from './TopBar';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic } from '../lib/haptics';

interface LayoutProps {
  children: React.ReactNode;
  wide?: boolean;
}

export const Layout = ({ children, wide = false }: LayoutProps) => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setShowBackOnline(true);
      triggerHaptic('success');
      // Hide back online toast after 3 seconds
      const timer = setTimeout(() => {
        setShowBackOnline(false);
      }, 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      triggerHaptic('error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#061340] via-[#091b5c] to-[#040d2d] text-slate-100 relative selection:bg-amber-500/30">
      {/* Abstract Background Ambient Light Spotlights */}
      <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[30%] rounded-full bg-[#1239B3] opacity-20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[40%] rounded-full bg-[#1e1b4b] opacity-35 blur-[150px] pointer-events-none" />
      
      <main className={`${wide ? 'max-w-3xl md:max-w-4xl' : 'max-w-md md:max-w-2xl lg:max-w-3xl'} mx-auto pb-32 pt-6 px-4 relative min-h-screen transition-all duration-300`}>
        {/* Dynamic Android Native Connection Alerts */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-3 bg-red-600/90 border border-red-500/40 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_8px_20px_rgba(220,38,38,0.25)] backdrop-blur-md"
            >
              <WifiOff className="w-4 h-4 animate-bounce" />
              <span>Offline: Check Device Connection Settings</span>
            </motion.div>
          )}

          {showBackOnline && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-3 bg-emerald-600/95 border border-emerald-500/40 rounded-2xl flex items-center justify-center gap-2.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)] backdrop-blur-md"
            >
              <Wifi className="w-4 h-4" />
              <span>Connected back online!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <TopBar />
        {children}
      </main>
      <Navigation wide={wide} />
    </div>
  );
};
