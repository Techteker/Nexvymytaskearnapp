import React from 'react';
import { motion } from 'motion/react';
import { User, Shield, Wallet, LogOut, ChevronRight, Award, Clock, Star, Trophy, ListChecks, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CoinIcon } from '../components/CoinIcon';
import { EARNING_CONFIG } from '../constants';

const ProfileStat = ({ label, value, icon: Icon, isCoin, color, secondaryValue }: any) => (
  <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl flex-1 flex flex-col items-center gap-1 group hover:border-brand-purple/20 shadow-sm transition-all">
    {isCoin ? (
      <CoinIcon size={16} className="mb-1" />
    ) : (
      <Icon className={`w-4 h-4 ${color} mb-1`} />
    )}
    <div className="flex flex-col items-center leading-none">
      <span className="text-lg font-black text-slate-900">{value}</span>
      {secondaryValue && (
        <span className="text-[7px] text-slate-400 font-black mt-0.5">{secondaryValue}</span>
      )}
    </div>
    <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">{label}</p>
  </div>
);

const Profile = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sections = [
    { label: 'Earning History', icon: Clock, color: 'text-blue-400', path: '/withdraw' },
    { label: 'Payment Methods', icon: Wallet, color: 'text-emerald-400', path: '/withdraw' },
    { label: 'Security & Privacy', icon: Shield, color: 'text-purple-400', path: '#' },
    { label: 'Invite Friends', icon: Trophy, color: 'text-yellow-400', path: '/referral' },
  ];

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-purple"></div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-6"
    >
      {/* Header Card */}
      <div className="gaming-card p-8 bg-white border-slate-100 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-slate-900">
            <User size={120} />
        </div>
        
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-2xl transform hover:rotate-6 transition-transform">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`} 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-brand-purple p-2 rounded-xl shadow-lg border-2 border-white">
            <Award className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="relative z-10 w-full">
          <h2 className="text-3xl font-display font-black text-brand-purple italic tracking-tighter mb-1 uppercase leading-none">
            {user?.username || 'GUEST USER'}
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6 font-bold">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{user?.email}</p>
          </div>

          <div className="flex gap-3 w-full">
            <ProfileStat 
              label="Earnings" 
              value={user?.coins.toLocaleString() || '0'} 
              secondaryValue={`$${((user?.coins || 0) / EARNING_CONFIG.COINS_PER_USD).toFixed(2)}`}
              isCoin={true}
              color="text-brand-purple" 
            />
            <ProfileStat 
              label="Level" 
              value={user?.level || 1} 
              icon={Target} 
              color="text-brand-purple" 
            />
            <ProfileStat 
              label="Streak" 
              value={user?.streak || 0} 
              icon={ListChecks} 
              color="text-brand-purple" 
            />
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="flex flex-col gap-3">
        {sections.map((item, i) => (
          <button 
            key={i} 
            onClick={() => item.path !== '#' && navigate(item.path)}
            className="p-5 flex items-center justify-between group bg-white border border-slate-50 rounded-[28px] hover:border-brand-purple/20 active:scale-95 transition-all text-left shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-slate-50 ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div>
                <span className="font-display font-black text-slate-900 tracking-tight block leading-none text-base uppercase italic">{item.label}</span>
                <span className="text-[9px] text-slate-400 font-black uppercase mt-1 block">Account Settings</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
          </button>
        ))}
        
        {/* Admin Link if applicable */}
        {(user?.role === 'admin' || user?.role === 'super_admin') && (
           <button 
             onClick={() => navigate('/admin')}
             className="p-5 flex items-center justify-between group bg-amber-50 border border-amber-100 rounded-[28px] hover:border-amber-300 transition-all text-left mt-2 shadow-md shadow-amber-500/5"
           >
             <div className="flex items-center gap-4">
               <div className={`p-3 rounded-2xl bg-white text-amber-500 shadow-sm`}>
                 <Shield size={20} />
               </div>
               <div>
                  <span className="font-display font-black text-amber-600 tracking-tight block leading-none uppercase italic">Admin Dashboard</span>
                  <span className="text-[9px] text-amber-600/60 font-black uppercase mt-1 block">Management Panel</span>
               </div>
             </div>
             <ChevronRight className="w-5 h-5 text-amber-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
           </button>
        )}

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="p-5 flex items-center justify-between group bg-rose-50 border border-rose-100 rounded-[28px] hover:border-rose-300 transition-all text-left mt-4 shadow-xl shadow-rose-500/5"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-white text-rose-500 shadow-sm`}>
              <LogOut size={20} />
            </div>
            <div>
               <span className="font-display font-black text-rose-600 tracking-tight block leading-none uppercase italic">Logout</span>
               <span className="text-[9px] text-rose-600/60 font-black uppercase mt-1 block">Exit Session</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-rose-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-8 mb-12 flex flex-col items-center">
         <div className="flex items-center gap-2 mb-2">
            <div className="h-[1px] w-8 bg-slate-100" />
            <div className="p-1.5 bg-brand-purple/10 rounded-lg">
                <Star size={12} className="text-brand-purple fill-brand-purple" />
            </div>
            <div className="h-[1px] w-8 bg-slate-100" />
         </div>
         <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em] text-center">
           Nexvy Platform • v2.4.0 High-End
         </p>
         <p className="text-[8px] text-slate-200 font-bold uppercase mt-2 tracking-widest leading-none">
           PROUDLY BUILT ON NEXGEN ARCHITECTURE
         </p>
      </div>
    </motion.div>
  );
};

export default Profile;

