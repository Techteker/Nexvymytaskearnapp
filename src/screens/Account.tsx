import React from 'react';
import { motion } from 'motion/react';
import { User, Shield, Wallet, LogOut, ChevronRight, Award, Clock, Star, Trophy, ListChecks, Target, Camera, Edit3, Save, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CoinIcon } from '../components/CoinIcon';
import { EARNING_CONFIG } from '../constants';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SEO } from '../components/SEO';

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
  const { user, logout, loading: authLoading, refreshUser, isSimulationMode, setIsSimulationMode } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleToggleSimulation = () => {
    const nextSim = !isSimulationMode;
    if (nextSim) {
      localStorage.setItem('simulation_mode_active', 'true');
      setIsSimulationMode(true);
      showToast('Activated Offline Simulation Mode!', 'success');
    } else {
      localStorage.removeItem('simulation_mode_active');
      localStorage.removeItem('simulated_coins');
      setIsSimulationMode(false);
      showToast('Deactivated Simulation. Trying Cloud DB...', 'info');
    }
    refreshUser();
  };

  const [isEditing, setIsEditing] = React.useState(false);
  const [editUsername, setEditUsername] = React.useState('');
  const [editPhotoURL, setEditPhotoURL] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (user) {
      setEditUsername(user.username || '');
      setEditPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await apiService.uploadFile(file);
      setEditPhotoURL(imageUrl);
      showToast('Profile image uploaded successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error uploading file', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editUsername.trim()) {
      showToast('Username cannot be empty', 'error');
      return;
    }
    setSaving(true);
    try {
      const res = await apiService.updateProfile({
        username: editUsername.trim(),
        photoURL: editPhotoURL
      });
      if ('error' in res) {
        showToast(res.error, 'error');
      } else {
        showToast('Profile updated successfully!', 'success');
        await refreshUser();
        setIsEditing(false);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sections = [
    { label: 'Earning History', icon: Clock, color: 'text-blue-400', path: '/withdraw' },
    { label: 'Payment Methods', icon: Wallet, color: 'text-emerald-400', path: '/withdraw' },
    { label: 'Security & Privacy', icon: Shield, color: 'text-purple-400', path: '/privacy-policy' },
    { label: 'Invite Friends', icon: Trophy, color: 'text-yellow-400', path: '/referral' },
  ];

  if (authLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-purple"></div>
    </div>
  );

  return (
    <>
      <SEO 
        title="My Nexvy Account: Profile & Earnings Overview" 
        description="View your Nexvy profile, track total earned coins, update security details of your account, and manage your online reward balances securely."
        keywords="my nexvy profile, update account earning, check credit balance, coins to real cash converter, secure mobile wallet nexvy"
      />
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
        
        {isEditing ? (
          <div className="w-full flex flex-col items-center gap-4 relative z-10 animate-fade-in">
            <div className="relative mb-2 select-none group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-brand-purple shadow-2xl relative bg-slate-100 flex items-center justify-center">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
                ) : (
                  <img 
                    src={editPhotoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${editUsername || 'Guest'}`} 
                    alt="Avatar Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="absolute -bottom-1 -right-1 bg-brand-purple p-1.5 rounded-lg shadow-lg border border-white text-white">
                <Camera size={12} />
              </div>
            </div>
            
            <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest italic -mt-1 active:scale-95 transition-transform">
              Click Avatar to Upload File
            </p>

            <div className="w-full text-left">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Gamer Tag / Name</label>
              <input 
                type="text" 
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Enter unique tag..." 
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-purple transition-all"
              />
            </div>

            <div className="w-full text-left">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Gamer Photo URL (optional)</label>
              <input 
                type="text" 
                value={editPhotoURL}
                onChange={(e) => setEditPhotoURL(e.target.value)}
                placeholder="Or paste direct image URL..." 
                className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-[10px] font-mono text-slate-600 focus:outline-none focus:border-brand-purple transition-all"
              />
            </div>

            <div className="flex gap-2 w-full mt-2">
              <button 
                onClick={handleSaveProfile}
                disabled={saving || uploading}
                className="flex-1 py-2.5 rounded-xl bg-brand-purple text-white text-[10px] font-black uppercase hover:bg-brand-purple/90 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20 disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <Save size={12} />
                )}
                Save Tags
              </button>
              <button 
                onClick={() => {
                  setEditUsername(user?.username || '');
                  setEditPhotoURL(user?.photoURL || '');
                  setIsEditing(false);
                }}
                disabled={saving}
                className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-95 transition-all text-[10px] font-black uppercase flex items-center justify-center cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-2xl transform hover:rotate-6 transition-transform relative bg-slate-100">
                <img 
                  src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'Guest'}`} 
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
              <div className="flex items-center justify-center gap-2 mb-4 font-bold">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{user?.email}</p>
              </div>

              {/* Edit button */}
              <button 
                onClick={() => setIsEditing(true)}
                className="mb-6 px-4 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-brand-purple hover:border-brand-purple/30 text-[9px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              >
                <Edit3 size={11} /> Edit Profile
              </button>

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
          </>
        )}
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

        {/* Simulation Toggle */}
        <button 
          onClick={handleToggleSimulation}
          className={`p-5 flex items-center justify-between group rounded-[28px] transition-all text-left mt-2 shadow-md ${
            isSimulationMode 
              ? 'bg-amber-50 border border-amber-200 hover:border-amber-400' 
              : 'bg-indigo-50 border border-indigo-100 hover:border-indigo-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-white shadow-sm ${isSimulationMode ? 'text-amber-500' : 'text-indigo-500'}`}>
              <Shield size={20} />
            </div>
            <div>
               <span className={`font-display font-black tracking-tight block leading-none uppercase italic ${isSimulationMode ? 'text-amber-750 font-bold' : 'text-indigo-750 font-bold'}`}>
                 {isSimulationMode ? 'Disable Simulation' : 'Enable Simulation'}
               </span>
               <span className={`text-[9px] font-black uppercase mt-1 block ${isSimulationMode ? 'text-amber-605' : 'text-indigo-605'}`}>
                 {isSimulationMode ? 'Running in Offline Simulator' : 'Test offline features locally'}
               </span>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 group-hover:translate-x-1 transition-all ${isSimulationMode ? 'text-amber-404 group-hover:text-amber-606' : 'text-indigo-404 group-hover:text-indigo-606'}`} />
        </button>

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
         
         <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-5 max-w-xs text-center border-t border-slate-100 pt-4">
           <button onClick={() => navigate('/about-us')} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors border-0 bg-transparent cursor-pointer">About</button>
           <button onClick={() => navigate('/privacy-policy')} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors border-0 bg-transparent cursor-pointer">Privacy</button>
           <button onClick={() => navigate('/terms-and-conditions')} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors border-0 bg-transparent cursor-pointer">Terms</button>
           <button onClick={() => navigate('/refund-policy')} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors border-0 bg-transparent cursor-pointer">Refunds</button>
           <button onClick={() => navigate('/contact-us')} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-colors border-0 bg-transparent cursor-pointer">Support</button>
         </div>
      </div>
    </motion.div>
    </>
  );
};

export default Profile;

