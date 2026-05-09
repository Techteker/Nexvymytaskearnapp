import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Submission, SubmissionStatus } from '../../types';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  Search,
  Check,
  X,
  ExternalLink,
  Loader2,
  Calendar,
  User,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Submissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SubmissionStatus | 'all'>('all');
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadSubmissions();
  }, [filter]);

  const loadSubmissions = async () => {
    setLoading(true);
    const data = await adminService.getSubmissions(filter === 'all' ? undefined : filter);
    setSubmissions(data);
    setLoading(false);
  };

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      await adminService.reviewSubmission(id, status, status === 'rejected' ? reason : undefined);
      setSelectedSub(null);
      setReason('');
      loadSubmissions();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Submissions Queue</h1>
          <p className="text-slate-400">Review user task proofs and distribute rewards.</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-900/50 border border-slate-800 rounded-2xl">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                filter === s 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading && !submissions.length ? (
           Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-slate-800/20 rounded-3xl animate-pulse"></div>
          ))
        ) : !submissions.length ? (
          <div className="py-20 text-center text-slate-500 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
             No submissions found in this category.
          </div>
        ) : (
          submissions.map((sub) => (
            <motion.div 
              key={sub.id}
              layoutId={sub.id}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 hover:border-slate-700 transition-colors group"
            >
               <div 
                 onClick={() => setSelectedSub(sub)}
                 className="w-full md:w-32 h-20 bg-slate-800 rounded-2xl overflow-hidden cursor-pointer relative group-hover:ring-2 ring-purple-500/50 transition-all shrink-0"
               >
                 <img src={sub.screenshotUrl} alt="Proof" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                    <Eye className="text-white" size={20} />
                 </div>
               </div>

               <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">User ID</p>
                    <div className="flex items-center gap-2 text-slate-200">
                      <User size={14} className="text-slate-500" />
                      <span className="font-mono text-sm">{sub.userId.substring(0, 10)}...</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Task ID</p>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Activity size={14} className="text-slate-500" />
                      <span className="font-mono text-sm">{sub.taskId.substring(0, 10)}...</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Timestamp</p>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Clock size={14} className="text-slate-500" />
                      <span className="text-sm">{sub.submittedAt ? new Date(sub.submittedAt.seconds * 1000).toLocaleString() : 'N/A'}</span>
                    </div>
                  </div>
               </div>

               <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                 {sub.status === 'pending' ? (
                   <>
                     <button 
                       onClick={() => setSelectedSub(sub)}
                       className="flex-1 px-6 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2"
                     >
                       <Check size={14} /> Review
                     </button>
                   </>
                 ) : (
                   <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center border ${
                     sub.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                   }`}>
                     {sub.status}
                   </span>
                 )}
               </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => { setSelectedSub(null); setReason(''); }}
               className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3.5xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[85vh]"
            >
               {/* Left: Image Preview */}
               <div className="flex-1 bg-black flex items-center justify-center overflow-hidden border-r border-slate-800">
                  <img src={selectedSub.screenshotUrl} alt="Final Proof" className="max-w-full max-h-full object-contain" />
               </div>

               {/* Right: Actions */}
               <div className="w-full md:w-80 p-8 flex flex-col bg-slate-900 border-t md:border-t-0 border-slate-800">
                  <div className="mb-8">
                     <h2 className="text-xl font-bold text-white mb-2">Review Proof</h2>
                     <p className="text-sm text-slate-500 lowercase">UID: {selectedSub.userId}</p>
                  </div>

                  <div className="space-y-4 mb-auto">
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                       <p className="text-xs text-slate-500 mb-1">Submitted On</p>
                       <p className="text-sm font-medium text-slate-200">
                         {selectedSub.submittedAt ? new Date(selectedSub.submittedAt.seconds * 1000).toLocaleString() : 'N/A'}
                       </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-8">
                    {selectedSub.status === 'pending' && (
                      <>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Rejection Reason (Optional)</label>
                           <textarea 
                             rows={3}
                             value={reason}
                             onChange={(e) => setReason(e.target.value)}
                             className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white text-sm outline-none focus:ring-2 focus:ring-rose-500/50"
                             placeholder="Fake screenshot, incorrect data..."
                           />
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleReview(selectedSub.id!, 'rejected')}
                            className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
                          >
                            <X size={18} /> Reject
                          </button>
                          <button 
                            onClick={() => handleReview(selectedSub.id!, 'approved')}
                            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                          >
                            <Check size={18} /> Approve
                          </button>
                        </div>
                      </>
                    )}
                    <button 
                      onClick={() => { setSelectedSub(null); setReason(''); }}
                      className="w-full py-4 text-slate-400 font-bold hover:bg-slate-800 rounded-2xl transition-all"
                    >
                      Close Preview
                    </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
