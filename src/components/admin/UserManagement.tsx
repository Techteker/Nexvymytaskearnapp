import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../services/adminService';
import { User } from '../../types';
import { useToast } from '../../context/ToastContext';
import { 
  Search, 
  Ban, 
  CheckCircle, 
  Trash2, 
  Edit3, 
  ShieldAlert,
  Wallet,
  Zap,
  Download,
  X,
  User as UserIcon,
  Calendar,
  Mail,
  ShieldCheck,
  UserX,
  Activity,
  Eye,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCoins, setEditCoins] = useState<number>(0);
  
  const { showToast } = useToast();
  const { user: admin } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.uid?.includes(searchTerm)
    );
  }, [users, searchTerm]);

  const toggleBan = async (user: User) => {
    if (!admin) return;
    const isBanning = !user.isBanned;
    const actionLabel = isBanning ? 'ban' : 'unban';
    
    if (window.confirm(`Are you sure you want to ${actionLabel} this user?`)) {
      try {
        if (isBanning) {
          await adminService.banUser(user.uid, 'Administrative suspension', admin.uid);
        } else {
          await adminService.unbanUser(user.uid, admin.uid);
        }
        showToast(`User ${actionLabel}ned successfully`, 'success');
        loadUsers();
        if (selectedUser?.uid === user.uid) setSelectedUser({ ...user, isBanned: isBanning });
      } catch (err: any) {
        showToast(err.message, 'error');
      }
    }
  };

  const deleteUser = async (uid: string) => {
    if (window.confirm('CRITICAL: Permanently delete this user? This cannot be undone.')) {
      try {
        const ok = await adminService.deleteUser(uid);
        if (ok) {
          showToast("User deleted permanently", 'success');
          loadUsers();
          setSelectedUser(null);
        }
      } catch (err: any) {
        showToast(err.message, 'error');
      }
    }
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      const diff = editCoins - (selectedUser.coins || 0);
      await adminService.adjustUserCoins(selectedUser.uid, diff, admin?.uid || 'system');
      showToast("User balance updated", 'success');
      setIsEditModalOpen(false);
      loadUsers();
      setSelectedUser(null);
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">User Registry</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">{users.length} Operatives Active</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative group flex-1 md:w-96">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-500 transition-colors" size={18} />
             <input 
               type="text" 
               placeholder="Search by ID, Name or Email..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.04] transition-all placeholder:text-slate-700 font-medium"
             />
           </div>
           <button 
             onClick={() => {
                const headers = ['UID', 'Username', 'Email', 'Coins', 'Status', 'Joined'];
                const rows = filteredUsers.map(u => [u.uid, u.username, u.email, u.coins, u.isBanned ? 'Banned' : 'Active', u.createdAt]);
                const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'nexvy_users.csv'; a.click();
             }}
             className="p-4 bg-white/5 text-slate-400 hover:text-white rounded-2xl border border-white/5 transition-all"
           >
             <Download size={18} />
           </button>
        </div>
      </div>

      <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Operative Info</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] text-center">Protocol Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] text-center">Asset Balance</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={4} className="px-8 py-10 bg-white/[0.01]"></td></tr>
                ))
              ) : filteredUsers.map((u) => (
                <tr key={u.uid} className="group hover:bg-white/[0.02] transition-all cursor-pointer" onClick={() => setSelectedUser(u)}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 p-1 group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-lg">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username || u.uid}`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-white text-base tracking-tight italic uppercase">{u.username || 'Unidentified'}</p>
                        <p className="text-slate-600 text-xs font-bold tracking-tight truncate max-w-[200px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                        u.isBanned 
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        {u.isBanned ? 'Restricted' : 'Operational'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col items-center gap-1">
                       <span className="text-xl font-black text-white italic tracking-tighter">{u.coins?.toLocaleString() || 0}</span>
                       <span className="text-[8px] font-black text-purple-500 uppercase tracking-[0.2em]">Nexvy Credits</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                       <button 
                        onClick={() => toggleBan(u)}
                        className={`p-3 rounded-2xl transition-all ${
                          u.isBanned 
                            ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' 
                            : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white'
                        }`}
                        title={u.isBanned ? 'Restore Access' : 'Restrict Access'}
                      >
                         {u.isBanned ? <CheckCircle size={18} /> : <UserX size={18} />}
                       </button>
                       <button 
                        onClick={() => { setSelectedUser(u); setEditCoins(u.coins || 0); setIsEditModalOpen(true); }}
                        className="p-3 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white rounded-2xl transition-all border border-white/5"
                       >
                         <Edit3 size={18} />
                       </button>
                       <button 
                        onClick={() => deleteUser(u.uid)}
                        className="p-3 bg-rose-500/5 text-rose-500/50 hover:bg-rose-500 hover:text-white rounded-2xl transition-all border border-rose-500/5"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredUsers.length === 0 && (
                <tr><td colSpan={4} className="px-8 py-32 text-center text-slate-700 font-black uppercase italic tracking-[0.5em] text-sm">No Operatives Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal (Profile Popup) */}
      <AnimatePresence>
        {selectedUser && !isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-xl bg-[#020617] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl"
            >
               <div className="h-40 bg-gradient-to-br from-purple-600 to-indigo-700 relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all"
                  >
                    <X size={20} />
                  </button>
               </div>

               <div className="px-10 pb-12 -mt-16 text-center relative z-10">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-[#020617] mx-auto p-1.5 border-4 border-[#020617] shadow-2xl relative overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username || selectedUser.uid}`} alt="" className="w-full h-full object-cover rounded-[2rem]" />
                  </div>
                  
                  <div className="mt-8 flex flex-col items-center">
                     <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">{selectedUser.username || 'Unknown Operative'}</h2>
                     <p className="text-slate-500 font-bold mb-6 flex items-center gap-2"><Mail size={14}/> {selectedUser.email}</p>
                     
                     <div className="flex flex-wrap justify-center gap-3">
                        <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${
                          selectedUser.isBanned 
                            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        }`}>
                           {selectedUser.isBanned ? 'Access Revoked' : 'Operational Status: Elite'}
                        </div>
                        <div className="px-5 py-2 rounded-2xl bg-white/5 text-slate-400 border border-white/5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                           <Calendar size={12}/> Joined {new Date(selectedUser.createdAt).toLocaleDateString()}
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-10 text-left">
                     <div className="bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                          <Wallet size={80} />
                        </div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Current Wealth</p>
                        <p className="text-3xl font-black text-white tracking-tighter italic">{selectedUser.coins?.toLocaleString() || 0}</p>
                        <p className="text-[9px] font-black text-purple-500 uppercase mt-1 tracking-widest">Available Credits</p>
                     </div>
                     <div className="bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                          <Zap size={80} />
                        </div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Activity Rank</p>
                        <p className="text-3xl font-black text-white tracking-tighter italic">Lvl {selectedUser.level || 1}</p>
                        <p className="text-[9px] font-black text-indigo-500 uppercase mt-1 tracking-widest">{selectedUser.experience || 0} Total XP</p>
                     </div>
                  </div>

                  <div className="mt-10 flex gap-4">
                     <button 
                       onClick={() => { setEditCoins(selectedUser.coins || 0); setIsEditModalOpen(true); }}
                       className="flex-1 py-5 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest rounded-2xl text-xs transition-all shadow-2xl shadow-purple-600/20 active:scale-95 flex items-center justify-center gap-2"
                     >
                       <Edit3 size={18} /> Modify Profile
                     </button>
                     <button 
                       onClick={() => toggleBan(selectedUser)}
                       className={`flex-1 py-5 font-black uppercase tracking-widest rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-2xl ${
                         selectedUser.isBanned 
                           ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20' 
                           : 'bg-amber-600/10 hover:bg-amber-600 border border-amber-500/20 text-amber-500 hover:text-white shadow-amber-600/20'
                       } active:scale-95`}
                     >
                       {selectedUser.isBanned ? <Activity size={18} /> : <UserX size={18} />}
                       {selectedUser.isBanned ? 'Restore Access' : 'Suspend Account'}
                     </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Balance Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsEditModalOpen(false)}
               className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl" 
             />
             <motion.div 
               initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.95 }}
               className="relative w-full max-w-md bg-[#020617] rounded-[3rem] p-10 border border-white/10 shadow-2xl"
             >
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center">
                      <Wallet size={24} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Adjust Wallet</h3>
                      <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Update credit allocation for operative</p>
                   </div>
                </div>
                
                <div className="space-y-8">
                   <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2rem] mb-3 block ml-2">Username Reference</label>
                      <input 
                        type="text" 
                        readOnly
                        value={selectedUser?.username || ''} 
                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-slate-400 font-bold outline-none cursor-not-allowed"
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2rem] mb-3 block ml-2">Total Credit Allocation</label>
                      <div className="relative">
                         <div className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-500 font-black text-2xl italic">C</div>
                         <input 
                            type="number" 
                            value={editCoins} 
                            onChange={(e) => setEditCoins(Number(e.target.value))}
                            className="w-full bg-white/[0.04] border border-white/10 rounded-[2rem] py-5 pl-12 pr-6 text-white font-black text-3xl italic tracking-tighter focus:border-purple-500 transition-all outline-none"
                         />
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                         {[100, 1000, 5000].map(amt => (
                           <button 
                             key={amt} 
                             onClick={() => setEditCoins(prev => prev + amt)}
                             className="py-3 bg-white/5 hover:bg-purple-600/10 text-slate-400 hover:text-purple-400 rounded-2xl text-[10px] font-black transition-all border border-white/5 hover:border-purple-500/20"
                           >
                             +{amt}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="mt-12 flex gap-4">
                   <button 
                     onClick={() => setIsEditModalOpen(false)}
                     className="flex-1 py-5 text-slate-600 font-black uppercase text-[10px] tracking-widest hover:text-white transition-all"
                   >
                     Abort Change
                   </button>
                   <button 
                     onClick={handleUpdate}
                     className="flex-[2] py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2rem] rounded-3xl hover:bg-purple-600 hover:text-white transition-all shadow-2xl shadow-white/10 active:scale-95"
                   >
                     Update Ledger
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
