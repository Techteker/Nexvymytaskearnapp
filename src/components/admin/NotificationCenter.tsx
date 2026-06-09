import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../services/adminService';
import { User } from '../../types';
import { 
  Bell, 
  Send, 
  Users, 
  User as UserIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  Globe,
  Trash2,
  Mail,
  History,
  Zap,
  Search,
  Check,
  X,
  Target,
  Loader2,
  Images,
  Smartphone as PhoneIcon,
  Monitor,
  Eye,
  ShieldAlert,
  Terminal,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../context/ToastContext';

export const NotificationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'targeted' | 'history'>('broadcast');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const { showToast } = useToast();

  useEffect(() => {
    if (activeTab === 'targeted') {
      loadUsers();
    } else if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      showToast('Operative registry unavailable', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch actual notification history
      setHistory([]);
    } catch (err) {
      showToast('Log retrieval failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await adminService.uploadTaskImage(file);
      setImageUrl(url);
      showToast('Intelligence visual attached', 'success');
    } catch (err) {
      showToast('Transmission error', 'error');
    } finally {
      setUploading(false);
    }
  };

  const toggleUser = (uid: string) => {
    setSelectedUserIds(prev => 
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  const handleSend = async () => {
    if (!title || !message) {
      showToast("Intelligence parameters incomplete", 'error');
      return;
    }

    if (activeTab === 'targeted' && selectedUserIds.length === 0) {
      showToast("No target operatives selected", 'error');
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'targeted') {
        await adminService.sendTargetedNotification(selectedUserIds, title, message, imageUrl);
      } else {
        await adminService.sendBroadcast(title, message, imageUrl);
      }
      
      showToast(`Signal ${activeTab === 'broadcast' ? 'broadcasted globally' : `targeted to ${selectedUserIds.length} operatives`}`, 'success');
      
      setTitle('');
      setMessage('');
      setImageUrl('');
      setSelectedUserIds([]);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase font-sans">Signal Center</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] font-mono italic">Strategic communication deployment hub</p>
        </div>
        
        <div className="flex bg-white/[0.01] border border-white/5 rounded-2xl p-1.5 backdrop-blur-xl">
          {[
            { id: 'broadcast', label: 'Broadcast', icon: Globe },
            { id: 'targeted', label: 'Targeted', icon: Target },
            { id: 'history', label: 'History', icon: History }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {(activeTab === 'broadcast' || activeTab === 'targeted') && (
           <motion.div
             key="compose"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="grid grid-cols-1 xl:grid-cols-12 gap-10"
           >
              {/* Construction Zone */}
              <div className="xl:col-span-7 space-y-8">
                 <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                       <Cpu size={200} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-10 flex items-center gap-3">
                       <Terminal className="text-blue-500" size={24} />
                       Mission Briefing Generation
                    </h3>

                    <div className="space-y-10">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2 italic">Signal Heading</label>
                             <input 
                               type="text" 
                               value={title}
                               onChange={(e) => setTitle(e.target.value)}
                               placeholder="e.g., HIGH ATTENTION: NEW MISSION"
                               className="w-full bg-white/[0.04] border border-white/5 rounded-2xl px-6 py-4 text-white font-black italic tracking-tight focus:border-blue-500 outline-none transition-all placeholder:text-slate-800 uppercase"
                             />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2 italic">Signal Visual (Optional)</label>
                             <div className="relative group/upload h-14">
                                <div className={`w-full h-full bg-white/[0.04] border border-white/5 rounded-2xl flex items-center px-6 gap-3 transition-all ${imageUrl ? 'border-blue-500/50' : 'hover:border-white/20'}`}>
                                   {uploading ? (
                                     <Loader2 className="animate-spin text-blue-500" size={16} />
                                   ) : (
                                     <Images className={imageUrl ? 'text-blue-500' : 'text-slate-700'} size={18} />
                                   )}
                                   <span className={`text-[10px] font-black uppercase italic ${imageUrl ? 'text-white' : 'text-slate-600'}`}>
                                      {imageUrl ? 'Visual Intelligence Attached' : 'Choose Photo From Gallery / Files'}
                                   </span>
                                   {imageUrl && (
                                     <button onClick={() => setImageUrl('')} className="ml-auto text-rose-500 hover:text-rose-400">
                                       <X size={14} />
                                     </button>
                                   )}
                                </div>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-2 italic">Transmission Intelligence</label>
                          <textarea 
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Detail the mission protocols for the network operatives..."
                            className="w-full bg-white/[0.04] border border-white/5 rounded-[2.5rem] p-8 text-white font-medium text-sm focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-800 leading-relaxed"
                          />
                       </div>

                       {activeTab === 'targeted' && (
                          <div className="space-y-6 pt-10 border-t border-white/[0.04]">
                             <div className="flex justify-between items-center px-2">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Operative Target Lock ({selectedUserIds.length})</p>
                                <button 
                                  onClick={() => setSelectedUserIds(users.map(u => u.uid))}
                                  className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] hover:text-white transition-colors"
                                >
                                  Lock All Registered
                                </button>
                             </div>
                             <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input 
                                  type="text"
                                  placeholder="Search target profile..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-xs font-bold outline-none focus:border-blue-500/50"
                                />
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                                {users.filter(u => u.email?.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
                                  <div 
                                    key={u.uid}
                                    onClick={() => toggleUser(u.uid)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                                      selectedUserIds.includes(u.uid)
                                        ? 'bg-blue-600/10 border-blue-500/50'
                                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                                    }`}
                                  >
                                     <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black uppercase italic ${
                                          selectedUserIds.includes(u.uid) ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-600'
                                        }`}>
                                           {u.username?.substring(0, 1) || 'U'}
                                        </div>
                                        <div className="flex flex-col">
                                           <span className={`text-[11px] font-black uppercase italic truncate max-w-[120px] ${selectedUserIds.includes(u.uid) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{u.username || 'Ghost'}</span>
                                           <span className="text-[9px] font-bold text-slate-600 truncate max-w-[120px]">{u.email}</span>
                                        </div>
                                     </div>
                                     {selectedUserIds.includes(u.uid) && <div className="w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                                  </div>
                                ))}
                             </div>
                          </div>
                       )}

                       <div className="pt-6">
                          <button 
                            disabled={loading}
                            onClick={handleSend}
                            className="w-full py-6 bg-white text-black hover:bg-blue-600 hover:text-white font-black uppercase tracking-[0.3em] italic rounded-[2.5rem] transition-all shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] active:scale-[0.98] flex items-center justify-center gap-3 group/btn"
                          >
                             {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                             ) : (
                                <>
                                   DEPLOY SIGNAL DATA <ArrowUpRight className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </>
                             )}
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Preview Visualization */}
              <div className="xl:col-span-5 relative hidden xl:block">
                 <div className="sticky top-10 flex flex-col items-center">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-12 italic">Output Frequency Monitor</p>
                    
                    <div className="relative">
                       {/* Phone Frame */}
                       <div className="w-[340px] h-[680px] bg-[#020617] rounded-[60px] border-[12px] border-white/5 shadow-2xl relative p-8 group">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/5 rounded-b-[2rem] z-20 flex items-center justify-center">
                             <div className="w-10 h-1.5 bg-white/10 rounded-full" />
                          </div>
                          
                          <div className="mt-20 space-y-6">
                             {/* Notification Banner */}
                             <motion.div 
                               initial={{ opacity: 0, y: -20, scale: 0.9 }}
                               animate={{ opacity: 1, y: 0, scale: 1 }}
                               key={`${title}-${message}-${imageUrl}`}
                               className="bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden relative"
                             >
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                   <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                      <div className="p-1.5 bg-white/20 rounded-lg">
                                         <Bell size={16} className="text-white" />
                                      </div>
                                   </div>
                                   <div>
                                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] leading-none">NEXVY_PROTOCOL</p>
                                      <p className="text-[8px] text-slate-500 font-bold mt-1">EMERGENCY TRANSMISSION • NOW</p>
                                   </div>
                                </div>
                                <div className="space-y-3 relative z-10 text-left">
                                   <h4 className="text-sm font-black text-white italic tracking-tight uppercase line-clamp-1">{title || 'Transmission Objective'}</h4>
                                   <p className="text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-3">{message || 'Signal intelligence body will be transmitted to all network operatives in real-time...'}</p>
                                   
                                   {imageUrl && (
                                     <div className="mt-4 w-full h-32 rounded-2xl overflow-hidden border border-white/5">
                                        <img src={imageUrl} className="w-full h-full object-cover" alt="" />
                                     </div>
                                   )}
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                             </motion.div>
                          </div>

                          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/10 rounded-full" />
                       </div>

                       <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-[100px]" />
                       <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-[100px]" />
                    </div>
                 </div>
              </div>
           </motion.div>
        )}

        {activeTab === 'history' && (
           <motion.div
             key="history"
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white/[0.01] border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl"
           >
              <div className="p-12 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                 <div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Mission Signal Logs</h3>
                    <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.3em] mt-1 tabular-nums italic">Timeline of archival transmissions</p>
                 </div>
                 <div className="p-4 bg-white/5 text-slate-700 rounded-3xl border border-white/5">
                    <History size={32} />
                 </div>
              </div>
              <div className="divide-y divide-white/[0.04]">
                 {history.length > 0 ? history.map((log, i) => (
                    <div key={log.id} className="p-10 flex items-center gap-10 hover:bg-white/[0.02] transition-all group">
                       <div className="w-20 h-20 bg-[#020617] border border-white/10 rounded-[2.5rem] flex items-center justify-center text-emerald-500 shadow-xl group-hover:scale-105 transition-transform duration-500">
                          <ShieldCheck size={32} />
                       </div>
                    </div>
                 )) : (
                    <div className="py-48 flex flex-col items-center gap-8">
                       <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center text-slate-800 shadow-inner">
                          <Activity size={40} />
                       </div>
                       <p className="text-slate-600 font-black uppercase text-sm tracking-[0.5em] italic">No archived signals found in this sector</p>
                    </div>
                 )}
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
