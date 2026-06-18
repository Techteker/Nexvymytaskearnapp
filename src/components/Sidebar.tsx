import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutGrid, 
  RotateCcw, 
  User, 
  Wallet, 
  Trophy, 
  Users, 
  Gift, 
  ShoppingBag, 
  Activity, 
  ShieldAlert, 
  CircleHelp,
  ArrowRight,
  Sparkles,
  RefreshCw,
  LogOut,
  Settings,
  Bell
} from 'lucide-react';
import { CoinIcon } from './CoinIcon';
import { EARNING_CONFIG } from '../constants';
import { apiService } from '../services/api';

const sidebarItems = [
  { path: '/', icon: LayoutGrid, label: 'Game Hub', desc: 'Spin & surveys' },
  { path: '/tasks', icon: Trophy, label: 'Earn Tasks', desc: 'Direct coin quests' },
  { path: '/spinner', icon: RotateCcw, label: 'Lucky Spin', desc: 'Mega rewards' },
  { path: '/survey', icon: Activity, label: 'Surveys', desc: 'CPX research polls' },
  { path: '/shop-earn', icon: ShoppingBag, label: 'Shop & Earn', desc: 'Shop discounts' },
  { path: '/withdraw', icon: Wallet, label: 'Withdrawal', desc: 'Paytm, UPI payouts' },
  { path: '/leaderboard', icon: Trophy, label: 'Rankings', desc: 'Top earner ranks' },
  { path: '/referral', icon: Users, label: 'Refer & Earn', desc: 'Invite friends (+500)' },
  { path: '/notifications', icon: Bell, label: 'Signals Inbox', desc: 'Real-time update stream' },
  { path: '/profile', icon: User, label: 'My Account', desc: 'Settings & history' },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isSimulationMode, setIsSimulationMode, refreshUser, logout } = useAuth();
  const [connecting, setConnecting] = useState(false);

  const handleTryConnecting = async () => {
    setConnecting(true);
    try {
      localStorage.removeItem('simulation_mode_active');
      setIsSimulationMode(false);
      await new Promise(resolve => setTimeout(resolve, 800));
      await refreshUser();
      
      const isActiveAgain = localStorage.getItem('simulation_mode_active') === 'true';
      if (isActiveAgain) {
        alert("Appwrite Cloud is still asleep/inactive. Back to offline simulator.");
      } else {
        alert("Connected to Appwrite Live database successfully!");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <aside className="w-80 shrink-0 sticky top-6 bg-white border border-slate-100 shadow-[0_10px_35px_rgba(124,58,237,0.06)] rounded-[32px] p-6 flex flex-col justify-between max-h-[calc(100vh-48px)] overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
          <div className="p-2.5 bg-brand-purple rounded-2xl glow-purple text-white relative shadow-md">
            <Sparkles className="w-6 h-6 animate-pulse text-yellow-300" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl tracking-tighter text-indigo-950 uppercase italic leading-none">
              NEXVY<span className="text-brand-purple">.</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-extrabold tracking-widest uppercase mt-0.5">Dual web platform</p>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 bg-gradient-to-br from-indigo-900 to-brand-purple rounded-[24px] text-white shadow-lg relative overflow-hidden group">
          <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-125 transition-transform duration-500">
            <CoinIcon size={120} />
          </div>
          <div className="relative z-10 flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 bg-white/10 shrink-0">
              <img 
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`} 
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="truncate">
              <h4 className="font-display font-bold text-sm leading-snug truncate">{user?.username || "Loading..."}</h4>
              <p className="text-[9px] text-indigo-200 font-bold uppercase tracking-wider">Level {user?.level || 1}</p>
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-xl flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-1.5">
              <CoinIcon size={16} />
              <span className="font-display font-black text-sm text-yellow-300 tracking-tight">
                {(user?.coins || 0).toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-indigo-100 font-bold">
              ${user?.coins ? (user.coins / EARNING_CONFIG.COINS_PER_USD).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>

        {/* Sidebar Nav items */}
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl group transition-all text-left ${
                  isActive 
                    ? 'bg-brand-purple text-white shadow-md glow-purple translate-x-1' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-950 hover:translate-x-0.5'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${
                  isActive ? 'bg-white/15 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-brand-purple/5 group-hover:text-brand-purple'
                }`}>
                  <item.icon className="w-4 h-4 shrink-0" />
                </div>
                <div className="truncate flex-1">
                  <span className="text-xs font-black tracking-tight block uppercase leading-tight">
                    {item.label}
                  </span>
                  <span className={`text-[8px] font-medium leading-none block truncate ${
                    isActive ? 'text-indigo-200' : 'text-slate-400'
                  }`}>
                    {item.desc}
                  </span>
                </div>
                {!isActive && (
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-50 space-y-4">
        {/* Simulation / Live Status */}
        {isSimulationMode ? (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-[20px] space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
              <div className="text-[9px] font-black uppercase text-amber-800 tracking-wider">
                Simulation Active
              </div>
            </div>
            <p className="text-[9px] text-amber-700 leading-normal">
              Appwrite Cloud project matches a sleeping or paused container.
            </p>
            <button
              onClick={handleTryConnecting}
              disabled={connecting}
              className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-[9px] font-extrabold uppercase transition-all flex items-center justify-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${connecting ? 'animate-spin' : ''}`} />
              <span>{connecting ? 'Connecting...' : 'Reconnect Cloud'}</span>
            </button>
          </div>
        ) : (
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-[20px] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <div className="text-[9px] font-black uppercase text-emerald-800 tracking-wider">
              Appwrite Connected
            </div>
          </div>
        )}

        {/* Footer Info & Admin */}
        <div className="flex flex-col gap-1 text-[9px] text-slate-400 font-semibold px-2">
          <div className="flex items-center justify-between">
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/about')}>About Us</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/terms')}>Terms</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => navigate('/privacy-policy')}>Privacy</span>
          </div>
          <button 
            onClick={() => navigate('/admin')}
            className="w-full mt-2.5 py-1.5 border border-slate-100 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-700 text-[9px] font-black uppercase flex items-center justify-center gap-1.5 transition-colors"
          >
            <Settings className="w-3 h-3" />
            <span>Admin Dashboard</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
