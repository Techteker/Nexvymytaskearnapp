import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Wallet, Settings, LogOut, ChevronRight, Award, Clock, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CoinIcon } from '../components/CoinIcon';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const sections = [
    { label: 'Earning History', icon: Clock, color: 'text-blue-400' },
    { label: 'Payment Methods', icon: Wallet, color: 'text-emerald-400' },
    { label: 'Security & Privacy', icon: Shield, color: 'text-purple-400' },
    { label: 'App Settings', icon: Settings, color: 'text-slate-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="gaming-card p-8 bg-gradient-to-br from-gaming-blue-900 to-black border-gaming-accent/20 relative overflow-hidden flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-gaming-accent glow-blue bg-gaming-blue-700">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Guest'}`} 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gaming-accent p-2 rounded-xl shadow-lg">
            <Award className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-display font-black text-white italic tracking-tighter mb-1 uppercase">{user?.name || 'Nexvy User'}</h2>
          <p className="text-sm text-white/40 font-bold mb-4">{user?.email}</p>
          <div className="flex items-center gap-3 justify-center">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
               <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1 leading-none">Coins</p>
               <div className="flex items-center gap-1.5 justify-center">
                   <CoinIcon size={14} />
                   <span className="font-bold text-sm text-coin-gold">{user?.coins.toLocaleString() || '0'}</span>
               </div>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
               <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1 leading-none">Level</p>
               <div className="flex items-center gap-1.5 justify-center">
                   <Star className="w-3.5 h-3.5 text-gaming-accent fill-current" />
                   <span className="font-bold text-sm text-white">{user?.level || 1}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {sections.map((item, i) => (
          <button key={i} className="gaming-card p-5 flex items-center justify-between group hover:border-white/30 transition-all text-left">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="font-bold text-white tracking-tight">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
        
        <button 
          onClick={handleLogout}
          className="gaming-card p-5 flex items-center justify-between group border-rose-500/20 hover:border-rose-500/40 bg-rose-500/5 transition-all text-left mt-4"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-rose-500/10 text-rose-400`}>
              <LogOut size={20} />
            </div>
            <span className="font-bold text-rose-400 tracking-tight">Logout from Nexvy</span>
          </div>
          <ChevronRight className="w-5 h-5 text-rose-500/20 group-hover:text-rose-500/40 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      <p className="text-center text-[10px] text-white/20 font-black uppercase tracking-widest mt-8">
        Nexvy v2.4.0 (Stable) • Distributed via Cloud Run
      </p>
    </motion.div>
  );
};
