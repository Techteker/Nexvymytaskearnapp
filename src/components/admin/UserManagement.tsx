import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { User } from '../../types';
import { useToast } from '../../context/ToastContext';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Ban, 
  CheckCircle, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  Wallet,
  Zap,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await adminService.getUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = searchTerm ? await adminService.searchUsers(searchTerm) : await adminService.getUsers();
    setUsers(data);
    setLoading(false);
  };

  const toggleBan = async (user: User) => {
    const action = user.isBanned ? 'unban' : 'ban';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await adminService.updateUser(user.uid, { isBanned: !user.isBanned });
        await adminService.logAction('SUPER_ADMIN', `USER_${action.toUpperCase()}`, `User ${user.email} was ${action}ned.`);
        showToast(`User ${action}ned successfully`, 'success');
        loadUsers();
      } catch (err: any) {
        showToast(err.message, 'error');
      }
    }
  };

  const deleteUser = async (uid: string) => {
    const userToDelete = users.find(u => u.uid === uid);
    if (window.confirm('CRITICAL: Are you sure you want to PERMANENTLY delete this user? This cannot be undone.')) {
      try {
        const ok = await adminService.deleteUser(uid);
        if (!ok) throw new Error("Delete failed");
        await adminService.logAction('SUPER_ADMIN', 'USER_DELETE', `User ${userToDelete?.email || uid} was permanently deleted.`);
        showToast("User deleted permanently", 'success');
        loadUsers();
      } catch (err: any) {
        showToast(err.message, 'error');
      }
    }
  };

  const handleExportUsers = () => {
    const headers = ['UID', 'Username', 'Email', 'Coins', 'Level', 'Status'];
    const csvData = users.map(u => 
      [u.uid, u.username, u.email, u.coins, u.level, u.isBanned ? 'Banned' : 'Active'].join(',')
    );
    const blob = new Blob([[headers.join(','), ...csvData].join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexvy_users_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-slate-400">View and manage all Nexvy participants.</p>
          </div>
          <button 
            onClick={handleExportUsers}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/5"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-purple-500 outline-none w-full md:w-64"
            />
          </div>
          <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20">
            Search
          </button>
        </form>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/20">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center"><Zap size={14} className="inline mr-1" /> Level</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center"><Wallet size={14} className="inline mr-1" /> Coins</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8">
                      <div className="h-4 bg-slate-800 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.uid} className="hover:bg-slate-800/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-lg group-hover:scale-110 transition-transform">
                        {user.username?.[0] || user.displayname?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{user.username || 'Anonymous User'}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.isBanned ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-bold uppercase ring-1 ring-red-500/20">
                        <ShieldAlert size={12} /> Banned
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase ring-1 ring-emerald-500/20">
                        <CheckCircle size={12} /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      Lvl {user.level || 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono text-amber-400 font-bold">
                      {user.coins?.toLocaleString() || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        title="Edit User"
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => toggleBan(user)}
                        title={user.isBanned ? "Unban User" : "Ban User"}
                        className={`p-2 rounded-xl transition-all ${
                          user.isBanned 
                            ? 'text-emerald-400 hover:bg-emerald-500/10' 
                            : 'text-amber-400 hover:bg-amber-500/10'
                        }`}
                      >
                        <Ban size={18} />
                      </button>
                      <button 
                         onClick={() => deleteUser(user.uid)}
                         title="Delete User"
                         className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">Showing {users.length} users per page</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:text-white disabled:opacity-50" disabled>
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
               <button className="w-8 h-8 rounded-lg bg-purple-600 text-white font-bold text-sm">1</button>
               <button className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 font-bold text-sm">2</button>
               <button className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 font-bold text-sm">3</button>
            </div>
            <button className="p-2 text-slate-500 hover:text-white disabled:opacity-50" disabled>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
