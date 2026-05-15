import React from 'react';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Eye, 
  ChevronRight,
  Filter,
  ArrowUpRight,
  Image as ImageIcon,
  DollarSign,
  User as UserIcon,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AffiliateClaim, ClaimStatus } from '../../types';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'motion/react';

export const AffiliateClaims = () => {
  const { showToast } = useToast();
  const [claims, setClaims] = React.useState<AffiliateClaim[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState<string>('pending');
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Detail Modal
  const [selectedClaim, setSelectedClaim] = React.useState<AffiliateClaim | null>(null);
  const [reviewing, setReviewing] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState('');

  const fetchClaims = async () => {
    setLoading(true);
    const data = await adminService.getAffiliateClaims(statusFilter);
    setClaims(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchClaims();
  }, [statusFilter]);

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!selectedClaim) return;
    if (status === 'rejected' && !rejectionReason) {
      showToast('Please provide a reason for rejection', 'error');
      return;
    }

    setReviewing(true);
    const res = await adminService.reviewAffiliateClaim(
      selectedClaim.id, 
      status, 
      selectedClaim.rewardAmount,
      'admin_id', // This should be real admin ID
      rejectionReason
    );
    setReviewing(false);

    if (!res.error) {
      showToast(`Claim ${status} successfully`, 'success');
      setSelectedClaim(null);
      setRejectionReason('');
      fetchClaims();
    } else {
      showToast(res.error, 'error');
    }
  };

  const filteredClaims = claims.filter(c => 
    c.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
      case 'credited': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'under_review': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-display font-black text-white italic tracking-tight uppercase">Affiliate Claims Review</h2>
           <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Verify purchases and reward users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-fit h-fit">
          {['pending', 'approved', 'rejected', 'all'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status === 'all' ? '' : status)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                (statusFilter === status || (status === 'all' && !statusFilter)) ? 'bg-emerald-500 text-white shadow-md' : 'text-white/40 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        <div className="flex-1 relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
           <input 
             type="text"
             placeholder="Search Transaction ID or User ID..."
             className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:border-emerald-500/50 transition-all font-bold"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* Claims List */}
      <div className="gaming-card overflow-hidden border-white/5 bg-white/[0.02]">
        <table className="w-full text-left border-collapse">
          <thead>
             <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Submitted</th>
                <th className="p-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Transaction ID</th>
                <th className="p-4 text-[10px] font-black text-white/40 uppercase tracking-widest">User ID</th>
                <th className="p-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Amount</th>
                <th className="p-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Reward</th>
                <th className="p-4 text-[10px] font-black text-white/40 uppercase tracking-widest">Status</th>
                <th className="p-4 text-right"></th>
             </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
             {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                     <td colSpan={7} className="p-4"><div className="h-4 bg-white/5 rounded w-full"></div></td>
                  </tr>
                ))
             ) : filteredClaims.length === 0 ? (
                <tr>
                   <td colSpan={7} className="p-12 text-center text-white/20 font-black uppercase text-xs tracking-widest">No claims found</td>
                </tr>
             ) : (
                filteredClaims.map(claim => (
                  <tr key={claim.id} className="hover:bg-white/5 transition-colors group">
                     <td className="p-4">
                        <p className="text-[10px] font-bold text-white uppercase">{new Date(claim.submittedAt).toLocaleDateString()}</p>
                        <p className="text-[9px] text-white/20">{new Date(claim.submittedAt).toLocaleTimeString()}</p>
                     </td>
                     <td className="p-4">
                        <span className="text-xs font-black text-white font-mono">{claim.transactionId}</span>
                     </td>
                     <td className="p-4">
                        <span className="text-[10px] font-bold text-white/40 font-mono truncate max-w-[100px] block">{claim.userId}</span>
                     </td>
                     <td className="p-4 font-black text-white text-xs">${claim.orderAmount.toFixed(2)}</td>
                     <td className="p-4">
                        <div className="flex items-center gap-1">
                           <span className="text-xs font-black text-emerald-400">+{claim.rewardAmount}</span>
                        </div>
                     </td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase border ${getStatusStyle(claim.status)}`}>
                           {claim.status}
                        </span>
                     </td>
                     <td className="p-4 text-right">
                        <button 
                          onClick={() => setSelectedClaim(claim)}
                          className="p-2 bg-white/5 rounded-xl text-white/40 group-hover:text-emerald-400 group-hover:bg-emerald-400/10 transition-all"
                        >
                           <Eye className="w-4 h-4" />
                        </button>
                     </td>
                  </tr>
                ))
             )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedClaim && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !reviewing && setSelectedClaim(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
               <div className="flex flex-col lg:flex-row max-h-[90vh]">
                  {/* Left: Proof Image */}
                  <div className="lg:w-1/2 p-8 bg-black/40 flex items-center justify-center border-r border-white/5">
                     {selectedClaim.screenshotUrl ? (
                        <div className="relative group">
                          <img 
                            src={selectedClaim.screenshotUrl} 
                            alt="Proof" 
                            className="max-w-full max-h-[70vh] rounded-2xl object-contain shadow-2xl cursor-zoom-in"
                            onClick={() => window.open(selectedClaim.screenshotUrl, '_blank')}
                          />
                          <p className="absolute bottom-4 left-4 right-4 text-center text-[10px] font-black text-white bg-black/60 backdrop-blur-md p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity uppercase">Click to view full image</p>
                        </div>
                     ) : (
                        <div className="flex flex-col items-center gap-4 text-white/10">
                           <ImageIcon size={64} />
                           <p className="font-black uppercase text-xs">No screenshot provided</p>
                        </div>
                     )}
                  </div>

                  {/* Right: Details & Action */}
                  <div className="lg:w-1/2 p-8 flex flex-col gap-8 overflow-y-auto">
                     <div className="flex items-center justify-between">
                        <h3 className="text-xl font-display font-black text-white italic uppercase tracking-tight">Review Claim</h3>
                        <button onClick={() => setSelectedClaim(null)} className="text-white/40 hover:text-white"><XCircle /></button>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                           <p className="text-[10px] font-black text-white/40 uppercase mb-1">Transaction ID</p>
                           <p className="text-sm font-black text-white font-mono break-all">{selectedClaim.transactionId}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                           <p className="text-[10px] font-black text-white/40 uppercase mb-1">Order Amount</p>
                           <p className="text-sm font-black text-white font-display italic tracking-tighter">${selectedClaim.orderAmount.toFixed(2)}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                           <p className="text-[10px] font-black text-white/40 uppercase mb-1">Potential Reward</p>
                           <p className="text-sm font-black text-emerald-400">{selectedClaim.rewardAmount.toLocaleString()} Coins</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                           <p className="text-[10px] font-black text-white/40 uppercase mb-1">Status</p>
                           <p className={`text-[10px] font-black uppercase ${getStatusStyle(selectedClaim.status).split(' ')[0]}`}>{selectedClaim.status}</p>
                        </div>
                     </div>

                     <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                           <UserIcon className="w-4 h-4 text-white/40" />
                           <p className="text-[10px] font-black text-white/40 uppercase">User Metadata</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-xs font-bold text-white/60">UID: <span className="text-white font-mono">{selectedClaim.userId}</span></p>
                           <p className="text-xs font-bold text-white/60">Submitted: <span className="text-white">{new Date(selectedClaim.submittedAt).toLocaleString()}</span></p>
                        </div>
                     </div>

                     {selectedClaim.status === 'pending' ? (
                        <div className="space-y-6 mt-auto">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-white/40 uppercase ml-2">Rejection Reason (If rejecting)</label>
                              <textarea 
                                placeholder="State why this claim was rejected..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-bold focus:outline-none focus:border-red-500/50 h-24"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                              />
                           </div>

                           <div className="flex gap-4">
                              <button 
                                onClick={() => handleReview('rejected')}
                                disabled={reviewing}
                                className="flex-1 py-4 border-2 border-red-500/30 text-red-400 rounded-2xl font-black text-xs uppercase hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                              >
                                {reviewing ? 'Processing...' : 'Reject Claim'}
                              </button>
                              <button 
                                onClick={() => handleReview('approved')}
                                disabled={reviewing}
                                className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                              >
                                {reviewing ? 'Processing...' : 'Approve & Credit'}
                              </button>
                           </div>
                        </div>
                     ) : (
                        <div className="mt-auto bg-white/5 p-6 rounded-3xl border border-dashed border-white/10 flex flex-col items-center gap-3">
                           <ShieldCheck size={32} className="text-white/20" />
                           <p className="text-center text-[10px] font-black text-white/20 uppercase tracking-widest leading-relaxed">
                              This claim has already been reviewed.<br/>No further actions required.
                           </p>
                        </div>
                     )}
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
