import React, { useEffect, useState } from 'react';
import { CoinIcon } from './CoinIcon';
import { useAuth } from '../context/AuthContext';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EARNING_CONFIG } from '../constants';
import { apiService } from '../services/api';

export const TopBar = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const data = await apiService.getNotifications();
        setNotifications(data || []);
      } catch (e) {}
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Pool every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between gap-4 mb-8 relative z-50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-brand-purple shadow-[0_0_20px_rgba(124,58,237,0.2)] bg-gaming-blue-700">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`} 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#f5f3ff]" />
        </div>
        <div>
          <h3 className="font-display font-bold text-slate-900 leading-tight">{user?.username || 'Loading...'}</h3>
          <p className="text-[10px] text-brand-purple font-semibold uppercase tracking-wider">Level {user?.level || 1}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl relative hover:bg-slate-200 transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-purple rounded-full text-[10px] flex items-center justify-center font-bold text-white shadow-lg">
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
                className="absolute top-full right-0 mt-4 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-brand-purple">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">Notifications</h4>
                  <button onClick={() => setShowNotifs(false)}><X size={14} className="text-white/40" /></button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="p-8 text-center text-slate-300 text-xs font-bold uppercase italic">No new notifications</div>
                  )}
                  {notifications.map((n, i) => (
                    <div key={i} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <p className="text-xs font-bold text-slate-800 mb-1">{n.title}</p>
                      <p className="text-[10px] text-slate-400 leading-tight">{n.message}</p>
                      <p className="text-[8px] text-brand-purple mt-2 uppercase font-black">{new Date(n.timestamp).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
          <CoinIcon size={20} />
          <div className="flex flex-col items-end leading-none">
            <span className="font-display font-bold text-coin-gold">{user?.coins.toLocaleString() || '0'}</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">
              ${user?.coins ? (user.coins / EARNING_CONFIG.COINS_PER_USD).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
