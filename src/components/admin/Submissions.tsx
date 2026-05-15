import React, { useState, useEffect, useMemo } from 'react';
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
  Images,
  User,
  Activity,
  History,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Terminal,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { useRealtime } from '../../context/RealtimeContext';
import { useToast } from '../../context/ToastContext';

export const Submissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SubmissionStatus | 'all'>('pending');
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [reason, setReason] = useState('');
  
  const { lastUpdate } = useRealtime();
  const { showToast } = useToast();
  const { user: admin } = useAuth();

  useEffect(() => {
    loadSubmissions();
  }, [lastUpdate]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await adminService.getSubmissions();
      setSubmissions(data);
    } catch (err) {
      showToast('Failed to load transmission queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = useMemo(() => {
    return filter === 'all' 
      ? submissions 
      : submissions.filter(s => s.status === filter);
  }, [submissions, filter]);

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    if (!admin) return;
    setLoading(true);
    try {
      await adminService.reviewSubmission(id, status, admin.uid);
      showToast(`Transmission #${id.substring(0,6)} ${status === 'approved' ? 'authorized' : 'intercepted'}`, status === 'approved' ? 'success' : 'warning');
      setSelectedSub(null);
      setReason('');
      loadSubmissions();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      pending: submissions.filter(s => s.status === 'pending').length,
      approved: submissions.filter(s => s.status === 'approved').length,
      rejected: submissions.filter(s => s.status === 'rejected').length,
    };
  }, [submissions]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase font-sans">Verification Hub</h1>
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Live Receiver</span>
            </div>
          </div>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Interception of operative proof signals</p>
        </div>
        
        <div className="flex bg-white/[0.01] border border-white/5 rounded-[1.5rem] p-1.5 backdrop-blur-md">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative overflow-hidden group ${
                filter === s 
                  ? 'bg-white text-black shadow-[0_10px_20px_-10px_rgba(255,255,255,0.3)]' 
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              {s}
              {filter !== s && (s === 'pending' && stats.pending > 0) && (
                <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 rotate-12">
            <Cpu size={140} />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2rem] mb-2 italic">Awaiting Clearance</p>
          <div className="flex items-center justify-between">
            <p className="text-4xl font-black text-white italic tracking-tighter">{stats.pending}</p>
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl border border-blue-500/20">
              <Zap size={20} className="animate-pulse" />
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 -rotate-12">
            <Layers size={140} />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2rem] mb-2 italic">Authorized Results</p>
          <div className="flex items-center justify-between">
            <p className="text-4xl font-black text-white italic tracking-tighter">{stats.approved}</p>
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
              <Check size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
            <Terminal size={140} />
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2rem] mb-2 italic">Signal Interruptions</p>
          <div className="flex items-center justify-between">
            <p className="text-4xl font-black text-white italic tracking-tighter">{stats.rejected}</p>
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20">
              <X size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading && !submissions.length ? (
           Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-white/[0.02] rounded-[2.5rem] border border-white/5 animate-pulse" />
          ))
        ) : filteredSubmissions.length === 0 ? (
          <div className="py-32 text-center bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center gap-6">
             <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-700 shadow-inner">
                <ShieldCheck size={40} />
             </div>
             <p className="text-slate-600 font-black uppercase tracking-[0.5em] text-sm tabular-nums italic">Zero pending frequencies detected</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredSubmissions.map((sub, i) => (
              <motion.div 
                key={sub.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-10 transition-all group shadow-2xl relative overflow-hidden"
              >
                  {sub.status === 'pending' && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 group-hover:w-2 transition-all transition-duration-500" />
                  )}

                 <div 
                   onClick={() => setSelectedSub(sub)}
                   className="w-full md:w-40 h-28 bg-[#020617] rounded-[2rem] overflow-hidden cursor-pointer relative group-hover:ring-4 ring-white/10 transition-all shrink-0 flex items-center justify-center border border-white/5 shadow-2xl"
                 >
                    {sub.proofs?.screenshotUrl ? (
                      <img src={sub.proofs.screenshotUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="text-center p-4">
                         <Terminal size={24} className="text-slate-700 mx-auto mb-2" />
                         <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">Text Payload Only</p>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-all backdrop-blur-sm">
                       <div className="p-3 bg-white text-black rounded-2xl scale-75 group-hover:scale-100 transition-all duration-500">
                          <Eye size={20} />
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-10 w-full">
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Operative Frequency</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                           <User size={16} className="text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-white uppercase italic tracking-tighter truncate max-w-[120px]">{sub.userId}</span>
                           <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active ID</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Deployed Objective</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-emerald-500">
                           <Activity size={16} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-white uppercase italic tracking-tighter truncate max-w-[120px]">{sub.taskId}</span>
                           <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Protocol Reference</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 italic">Intercept Time</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 text-slate-500">
                           <Clock size={16} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-white uppercase italic tracking-tighter tabular-nums">{sub.submittedAt ? new Date(sub.submittedAt).toLocaleTimeString() : 'UNCERTAIN'}</span>
                           <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Arrival Stamp</span>
                        </div>
                      </div>
                    </div>
                 </div>

                 <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                   {sub.status === 'pending' ? (
                     <button 
                       onClick={() => setSelectedSub(sub)}
                       className="flex-1 px-10 py-5 bg-white text-black hover:bg-blue-600 hover:text-white rounded-[2rem] transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] active:scale-95 group/btn"
                     >
                        Analyze <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                   ) : (
                     <div className={`px-8 py-5 rounded-[2rem] text-[9px] font-black uppercase tracking-[0.2em] text-center border shadow-2xl ${
                       sub.status === 'approved' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10' 
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/10'
                     }`}>
                       {sub.status === 'approved' ? 'CLEARED' : 'INTERRUPTED'}
                     </div>
                   )}
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Analysis Interface Modal */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => { setSelectedSub(null); setReason(''); }}
               className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-7xl bg-[#020617] border border-white/10 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh]"
            >
               {/* Left: Intelligence Visualization */}
               <div className="flex-1 bg-white/[0.01] flex flex-col p-12 overflow-y-auto border-r border-white/5 custom-scrollbar">
                  <div className="flex items-center justify-between mb-12">
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">Analysis Grid v2.1</span>
                     <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Enhanced Vision Active</span>
                     </div>
                  </div>
                  
                  <div className="space-y-12">
                    {subProofs(selectedSub).screenshotUrl && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                           <div className="flex items-center gap-3">
                              <Images size={16} className="text-purple-500" />
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Visual Intelligence Capture</p>
                           </div>
                           <a 
                             href={subProofs(selectedSub).screenshotUrl} 
                             target="_blank" 
                             rel="noreferrer"
                             className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl flex items-center justify-center gap-2 transition-all transition-transform active:scale-95"
                           >
                             <ExternalLink size={16} />
                           </a>
                        </div>
                        <div className="rounded-[3rem] border border-white/10 overflow-hidden bg-black p-1.5 shadow-2xl group relative">
                          <img 
                            src={subProofs(selectedSub).screenshotUrl} 
                            alt="Intelligence Capture" 
                            className="w-full h-auto object-contain max-h-[70vh] rounded-[2.8rem]"
                          />
                          <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <p className="text-[10px] font-black text-white italic uppercase tracking-[0.3em]">Scanned Document Pattern Alpha</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {subProofs(selectedSub).text && (
                      <div className="space-y-6">
                         <div className="flex items-center gap-3 px-2">
                            <Terminal size={16} className="text-blue-500" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Signal Transmission Log</p>
                         </div>
                        <div className="p-10 bg-[#020617] border border-white/5 rounded-[3rem] text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-inner relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                              <Terminal size={100} />
                           </div>
                           {subProofs(selectedSub).text}
                        </div>
                      </div>
                    )}

                    {!subProofs(selectedSub).screenshotUrl && !subProofs(selectedSub).text && (
                      <div className="py-40 text-center bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[3rem] group">
                        <AlertTriangle className="text-amber-500/20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500" size={80} />
                        <h4 className="text-white font-black uppercase text-xl italic tracking-tighter mb-2">Signal Void Detected</h4>
                        <p className="text-slate-600 font-bold uppercase tracking-widest text-[9px] max-w-[280px] mx-auto leading-relaxed italic">The operative failed to transmit required validation patterns. Manual verification protocols initiated.</p>
                      </div>
                    )}
                  </div>
               </div>

               {/* Right: Operational Controls */}
               <div className="w-full md:w-[28rem] p-12 flex flex-col bg-[#020617]">
                  <div className="mb-12">
                     <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] border border-blue-500/20 flex items-center justify-center mb-8 relative">
                        <ShieldCheck className="text-blue-500" size={40} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-ping" />
                     </div>
                     <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Final Clearance</h2>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-loose">MISSION_CODE: {selectedSub.taskId}</p>
                  </div>

                  <div className="space-y-6 mb-auto">
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center justify-between group">
                       <div className="flex flex-col gap-1">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Operative Hash</p>
                          <p className="text-sm font-black text-white font-mono">{selectedSub.userId.substring(0, 15)}...</p>
                       </div>
                       <div className="p-3 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight size={14} className="text-slate-400" />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-8 pt-12 border-t border-white/10">
                    {selectedSub.status === 'pending' && (
                      <>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2rem] ml-2 block italic">Signal Interruption Note</label>
                           <textarea 
                             rows={4}
                             value={reason}
                             onChange={(e) => setReason(e.target.value)}
                             className="w-full bg-[#020617] border border-white/10 rounded-[2.5rem] p-8 text-white text-sm outline-none focus:border-rose-500 transition-all font-medium placeholder:text-slate-800 italic"
                             placeholder="Provide reason for mission denial..."
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <button 
                            disabled={loading}
                            onClick={() => handleReview(selectedSub.id!, 'rejected')}
                            className="py-6 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-2xl shadow-rose-600/20 active:scale-95 disabled:opacity-50"
                          >
                            Deny Access
                          </button>
                          <button 
                            disabled={loading}
                            onClick={() => handleReview(selectedSub.id!, 'approved')}
                            className="py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-2xl shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
                          >
                            Authorize
                          </button>
                        </div>
                      </>
                    )}
                    <button 
                      onClick={() => { setSelectedSub(null); setReason(''); }}
                      className="w-full py-5 text-slate-600 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all italic tracking-[0.3em]"
                    >
                      Abort Analysis Protocol
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

const subProofs = (sub: Submission) => {
  if (!sub) return { screenshotUrl: '', text: '' };
  try {
     const proofs = typeof sub.proofs === 'string' ? JSON.parse(sub.proofs) : (sub.proofs || {});
     return {
        screenshotUrl: proofs.screenshotUrl || '',
        text: proofs.text || ''
     };
  } catch (e) {
     return { screenshotUrl: '', text: '' };
  }
};
