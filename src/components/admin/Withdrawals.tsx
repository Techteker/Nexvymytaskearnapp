import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
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
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export const Withdrawals: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WithdrawalStatus | 'all'>('all');

  useEffect(() => {
    loadWithdrawals();
  }, [filter]);

  const loadWithdrawals = async () => {
    if (!db) return;
    setLoading(true);
    const coll = collection(db, 'withdrawals');
    const q = filter === 'all' ? query(coll, orderBy('createdAt', 'desc')) : query(coll, where('status', '==', filter), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setWithdrawals(snap.docs.map(d => ({ ...d.data(), id: d.id } as Withdrawal)));
    setLoading(false);
  };

  const updateStatus = async (id: string, status: WithdrawalStatus) => {
    if (!db) return;
    const withdrawal = withdrawals.find(w => w.id === id);
    await updateDoc(doc(db, 'withdrawals', id), {
      status,
      processedAt: serverTimestamp()
    });
    
    // Log action
    await adminService.logAction(
      'SUPER_ADMIN', 
      'WITHDRAWAL_UPDATE', 
      `${status.toUpperCase()} withdrawal request ${id} for $${withdrawal?.amount.toFixed(2)}.`
    );

    loadWithdrawals();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Withdrawal Requests</h1>
          <p className="text-slate-400">Process user payout requests securely.</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-900/50 rounded-2xl border border-slate-800">
           {(['all', 'pending', 'processing', 'successful', 'rejected'] as const).map(s => (
             <button 
               key={s}
               onClick={() => setFilter(s)}
               className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${
                 filter === s ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800/50 bg-slate-800/20">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Method</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                Array(5).fill(0).map((_, i) => <tr key={i} className="h-16 animate-pulse bg-slate-800/10"></tr>)
              ) : withdrawals.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-500">No payout requests found.</td></tr>
              ) : withdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="px-6 py-4">
                     <span className="text-sm font-mono text-slate-400">{w.userId.substring(0, 8)}...</span>
                  </td>
                  <td className="px-6 py-4 uppercase text-xs font-bold text-slate-300">{w.method}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">{w.paymentDetails}</td>
                  <td className="px-6 py-4 font-mono font-bold text-emerald-400">${w.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                       w.status === 'successful' ? 'bg-emerald-500/10 text-emerald-400' :
                       w.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                       w.status === 'processing' ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {w.status === 'pending' || w.status === 'processing' ? (
                       <div className="flex gap-2 justify-end">
                         {w.status === 'pending' && (
                           <button 
                             onClick={() => updateStatus(w.id, WithdrawalStatus.PROCESSING)}
                             className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                             title="Mark as processing"
                           >
                             <Clock size={18} />
                           </button>
                         )}
                         <button 
                            onClick={() => updateStatus(w.id, WithdrawalStatus.SUCCESSFUL)}
                            className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                            title="Approve & Complete"
                         >
                           <CheckCircle2 size={18} />
                         </button>
                         <button 
                            onClick={() => updateStatus(w.id, WithdrawalStatus.REJECTED)}
                            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                            title="Reject Request"
                         >
                           <XCircle size={18} />
                         </button>
                       </div>
                    ) : (
                      <span className="text-slate-600 text-xs italic">
                        {w.processedAt ? new Date(w.processedAt.seconds * 1000).toLocaleDateString() : 'Processed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
