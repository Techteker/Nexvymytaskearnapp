import React, { useEffect, useState } from 'react';
import { CoinIcon } from './CoinIcon';
import { useAuth } from '../context/AuthContext';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EARNING_CONFIG } from '../constants';
import { apiService } from '../services/api';
import { APPWRITE_CONFIG } from '../lib/appwrite';
import { useRealtime } from '../context/RealtimeContext';

export const TopBar = () => {
  const { user } = useAuth();
  const realtime = useRealtime();
  const lastUpdate = realtime ? realtime.lastUpdate : 0;
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchNotifs = async () => {
      try {
        const data = await apiService.getNotifications();
        if (active) {
          setNotifications(data || []);
        }
      } catch (e) {}
    };

    fetchNotifs();

    // Local custom event listener for immediate same-user same-browser tab action matching
    const handleLocalRealtimeUpdate = () => {
      if (import.meta.env.DEV) {
        console.log('[LOCAL-REALTIME] Updating notifications dropdown from event.');
      }
      fetchNotifs();
    };
    window.addEventListener('nexvy_realtime_update', handleLocalRealtimeUpdate);

    return () => {
      active = false;
      window.removeEventListener('nexvy_realtime_update', handleLocalRealtimeUpdate);
    };
  }, [lastUpdate]);

  return (
    <div className="flex items-center justify-between gap-4 mb-8 relative z-50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)] bg-[#0c247d]">
            <img 
              src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`} 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#061340]" />
        </div>
        <div>
          <h3 className="font-display font-black text-white leading-tight uppercase tracking-tight">{user?.username || 'Loading...'}</h3>
          <p className="text-[10px] text-[#F8D37A] font-black uppercase tracking-widest leading-none mt-0.5">Level {user?.level || 1}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2.5 bg-[#0a1f6b]/80 border border-[#D4AF37]/30 rounded-xl relative hover:bg-[#1239b3]/50 text-white transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5 text-slate-200" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-600 rounded-full text-[10px] flex items-center justify-center font-bold text-white shadow-lg">
                {notifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-4 w-72 bg-[#0a1f6b] border border-[#D4AF37]/45 rounded-2xl shadow-2xl overflow-hidden z-50 text-white"
              >
                <div className="p-4 border-b border-[#D4AF37]/25 flex items-center justify-between bg-gradient-to-r from-[#0a1f6b] to-[#1239b3]">
                  <h4 className="text-xs font-black text-[#F8D37A] uppercase tracking-widest font-display">Notifications</h4>
                  <button onClick={() => setShowNotifs(false)} className="cursor-pointer border-0 bg-transparent"><X size={14} className="text-white/40 hover:text-white" /></button>
                </div>
                <div className="max-h-64 overflow-y-auto no-scrollbar">
                  {notifications.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase italic">No new notifications</div>
                  )}
                  {notifications.map((n, i) => (
                    <div key={i} className="p-4 border-b border-[#051347]/50 hover:bg-[#1239b3]/20 transition-colors">
                      <p className="text-xs font-bold text-white mb-1">{n.title}</p>
                      <p className="text-[10px] text-slate-300 leading-tight">{n.message}</p>
                      <p className="text-[8px] text-[#F8D37A] mt-2 uppercase font-black">{new Date(n.timestamp).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 bg-[#0a1f6b]/80 rounded-2xl shadow-lg border border-[#D4AF37]/40">
          <CoinIcon size={20} />
          <div className="flex flex-col items-end leading-none">
            <span className="font-display font-black text-[#F8D37A] text-[15px]">{user?.coins.toLocaleString() || '0'}</span>
            <span className="text-[8.5px] text-slate-350 font-black uppercase tracking-tighter mt-0.5">
              ${user?.coins ? (user.coins / EARNING_CONFIG.COINS_PER_USD).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
