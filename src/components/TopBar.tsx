import React, { useEffect, useState } from 'react';
import { CoinIcon } from './CoinIcon';
import { useAuth } from '../context/AuthContext';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gaming-accent glow-blue bg-gaming-blue-700">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Guest'}`} 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gaming-blue-900" />
        </div>
        <div>
          <h3 className="font-display font-bold text-white leading-tight">{user?.name || 'Loading...'}</h3>
          <p className="text-[10px] text-gaming-accent font-semibold uppercase tracking-wider">Level {user?.level || 1}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2.5 bg-white/5 border border-white/10 rounded-xl relative hover:bg-white/10 transition-colors"
          >
            <Bell className="w-5 h-5 text-white/80" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold text-white">
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
                className="absolute top-full right-0 mt-4 w-72 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">Notifications</h4>
                  <button onClick={() => setShowNotifs(false)}><X size={14} className="text-white/40" /></button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="p-8 text-center text-white/20 text-xs font-bold uppercase italic">No new notifications</div>
                  )}
                  {notifications.map((n, i) => (
                    <div key={i} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                      <p className="text-xs font-bold text-white mb-1">{n.title}</p>
                      <p className="text-[10px] text-white/40 leading-tight">{n.message}</p>
                      <p className="text-[8px] text-gaming-accent mt-2 uppercase font-black">{new Date(n.timestamp).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 gaming-card bg-white/10 glow-gold border-yellow-500/20">
          <CoinIcon size={20} />
          <span className="font-display font-bold text-coin-gold">{user?.coins.toLocaleString() || '0'}</span>
        </div>
      </div>
    </div>
  );
};
