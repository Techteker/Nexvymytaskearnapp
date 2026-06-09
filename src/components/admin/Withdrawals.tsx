import React, { useState, useEffect, useMemo } from 'react';
import { Withdrawal, WithdrawalStatus } from '../../types';
import { adminService } from '../../services/adminService';
import { 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ArrowRight,
  Filter,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Banknote,
  Navigation,
  ExternalLink,
  Wallet,
  Calendar,
  X,
  User,
  ArrowUpRight,
  Loader2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Withdrawals: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WithdrawalStatus | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<Withdrawal | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const { showToast } = useToast();
  const { user: admin } = useAuth();

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    setLoading(true);
    try {
      const data = await adminService.getWithdrawals();
      setWithdrawals(data);
    } catch (err) {
      showToast('Failed to load vault data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter(w => {
      const matchFilter = filter === 'all' ? true : w.status === filter;
      const matchSearch = searchTerm === '' ? true : (
        w.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchFilter && matchSearch;
    });
  }, [withdrawals, filter, searchTerm]);

  const updateStatus = async (id: string, status: WithdrawalStatus) => {
    if (!admin) return;
    setLoading(true);
    try {
      const ok = await adminService.updateWithdrawalStatus(id, status, admin.uid, adminNotes);
      if (ok) {
        showToast(`Transaction ${status} successfully`, 'success');
        loadWithdrawals();
        setSelectedRequest(null);
        setAdminNotes('');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase font-sans">Payout Ledger</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] font-mono">Verification of asset distribution</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search operative..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-700"
            />
          </div>
          <div className="flex bg-white/[0.01] border border-white/5 rounded-2xl p-1.5 backdrop-blur-md">
            {(['pending', 'processing', 'approved', 'rejected'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s as any)}
                className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  filter === s 
                    ? 'bg-amber-600 text-white shadow-lg' 
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-10 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Beneficiary</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Payment Method</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Allocation</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Condition</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest italic text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {loading && !withdrawals.length ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse"><td colSpan={5} className="px-10 py-10"></td></tr>
                ))
              ) : filteredWithdrawals.length === 0 ? (
                <tr><td colSpan={5} className="px-10 py-32 text-center text-slate-700 font-black uppercase italic tracking-[0.5em] text-sm tabular-nums">Empty Ledger</td></tr>
              ) : filteredWithdrawals.map((w) => (
                <tr key={w.id} className="group hover:bg-white/[0.02] transition-all cursor-pointer" onClick={() => setSelectedRequest(w)}>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500">
                          <User size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-white uppercase italic tracking-tight">{w.email || 'Unidentified'}</p>
                          <p className="text-[10px] font-mono text-slate-600">ID: {w.userId.substring(0, 10)}...</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                          <CreditCard size={14} />
                       </div>
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{w.method}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                       <p className="text-xl font-black text-white italic tracking-tighter tabular-nums">{w.amount?.toLocaleString() || 0}</p>
                       <span className="text-[8px] font-black uppercase text-amber-500 tracking-widest italic">Nexvy Credits</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border italic ${
                       w.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                       w.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' :
                       w.status === 'processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      {(w.status === 'pending' || w.status === 'processing') && (
                        <>
                           {w.status === 'pending' && (
                             <button 
                               onClick={() => updateStatus(w.id!, WithdrawalStatus.PROCESSING)}
                               className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-2xl transition-all border border-white/5"
                             >
                               <Clock size={16} />
                             </button>
                           )}
                           <button 
                             onClick={() => updateStatus(w.id!, WithdrawalStatus.APPROVED)}
                             className="p-3 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all border border-emerald-500/10"
                           >
                             <Check size={16} />
                           </button>
                        </>
                      )}
                      <button 
                        onClick={() => setSelectedRequest(w)}
                        className="p-3 bg-white/5 text-slate-400 hover:bg-white text-black rounded-2xl transition-all border border-white/5"
                      >
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setSelectedRequest(null)}
               className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl" 
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
               className="relative w-full max-w-2xl bg-[#020617] rounded-[4rem] border border-white/10 shadow-2xl overflow-hidden p-12 flex flex-col gap-10"
             >
                <div className="flex justify-between items-start">
                   <div className="w-20 h-20 bg-amber-600/10 rounded-[2.5rem] border border-amber-500/20 flex items-center justify-center text-amber-500">
                      <Wallet size={40} />
                   </div>
                   <button onClick={() => setSelectedRequest(null)} className="p-3 bg-white/5 hover:bg-white/10 text-slate-500 rounded-full transition-colors">
                      <X size={24} />
                   </button>
                </div>

                <div>
                   <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Vault Distribution</h2>
                   <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] italic">Verification of operative payout credentials</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-4">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Beneficiary Identifier</p>
                      <div className="flex flex-col">
                         <p className="text-lg font-black text-white italic uppercase tracking-tight truncate">{selectedRequest.email}</p>
                         <p className="text-[10px] font-mono text-slate-500 mt-1">UID: {selectedRequest.userId}</p>
                      </div>
                   </div>
                   <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-4">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Asset Allocation</p>
                      <div className="flex flex-col">
                         <p className="text-3xl font-black text-white italic tabular-nums tracking-tighter">{selectedRequest.amount?.toLocaleString()} <span className="text-sm text-amber-500 not-italic">Credits</span></p>
                         <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Confirmed Balance Drawdown</p>
                      </div>
                   </div>
                   <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Payout Destination Detail</p>
                         <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[8px] font-black text-blue-500 uppercase tracking-[0.2em]">{selectedRequest.method} Protocol</div>
                      </div>
                      <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5">
                         <p className="text-white font-mono text-sm break-all leading-relaxed tracking-wider">{selectedRequest.details}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic ml-2">Internal Administration Notes</label>
                   <textarea 
                     className="w-full bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 text-white text-sm outline-none focus:border-amber-500 transition-all font-medium placeholder:text-slate-800 italic"
                     placeholder="Mission status description for the ledger..."
                     value={adminNotes}
                     onChange={(e) => setAdminNotes(e.target.value)}
                   />
                </div>

                <div className="flex gap-4">
                  {(selectedRequest.status === 'pending' || selectedRequest.status === 'processing') ? (
                    <>
                       <button 
                         disabled={loading}
                         onClick={() => updateStatus(selectedRequest.id!, WithdrawalStatus.REJECTED)}
                         className="flex-1 py-6 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-2xl shadow-rose-600/20 active:scale-95 flex items-center justify-center gap-2"
                       >
                         <XCircle size={20} /> Deny Request
                       </button>
                       <button 
                         disabled={loading}
                         onClick={() => updateStatus(selectedRequest.id!, WithdrawalStatus.APPROVED)}
                         className="flex-1 py-6 bg-white text-black hover:bg-emerald-600 hover:text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-2xl shadow-white/5 active:scale-95 flex items-center justify-center gap-2"
                       >
                         <ShieldCheck size={20} /> Finalize Payout
                       </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setSelectedRequest(null)}
                      className="w-full py-6 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-white/5"
                    >
                      Close Analysis
                    </button>
                  )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
