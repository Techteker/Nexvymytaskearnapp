import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  X, 
  Gamepad2, 
  Target, 
  Images, 
  Loader2,
  Clock,
  ClipboardList,
  ExternalLink,
  ArrowUpRight,
  Filter,
  Activity,
  FileSearch,
  BrainCircuit,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRealtime } from '../../context/RealtimeContext';

export const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const { showToast } = useToast();
  const { lastUpdate } = useRealtime();

  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    type: 'survey',
    category: '',
    rewardCoins: 100,
    status: 'active',
    imageUrl: '',
    instructions: '',
    link: '',
    buttonText: 'Start Now',
    requirements: {
      needScreenshot: true,
      needText: false,
    }
  });

  useEffect(() => {
    loadData();
  }, [lastUpdate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksData, catsData] = await Promise.all([
        adminService.getTasks(),
        adminService.getCategories()
      ]);
      setTasks(tasksData);
      setCategories(catsData);
    } catch (err) {
      showToast('Data load failed', 'error');
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
      setFormData((prev: any) => ({ ...prev, imageUrl: url }));
      showToast('Logo uploaded', 'success');
    } catch (err) {
      showToast('Error uploading file', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingTask) {
        await adminService.updateTask(editingTask.$id, formData);
        showToast('Task updated', 'success');
      } else {
        await adminService.createTask(formData);
        showToast('Task created', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (task: any) => {
    const newStatus = task.status === 'active' ? 'inactive' : 'active';
    try {
      await adminService.updateTask(task.$id, { status: newStatus });
      showToast(`Task turned ${newStatus}`, 'success');
      loadData();
    } catch (err) {
      showToast('Update failed', 'error');
    }
  };

  const taskTypeIcons: Record<string, any> = {
    survey: FileSearch,
    quiz: BrainCircuit,
    game: Gamepad2,
    install: Target
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase font-sans">Campaign Control</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">{tasks.length} Total Campaigns Deployed</p>
        </div>
        
        <button 
          onClick={() => {
            setEditingTask(null);
            setFormData({
              title: '',
              description: '',
              type: 'survey',
              category: categories[0]?.$id || '',
              rewardCoins: 100,
              status: 'active',
              imageUrl: '',
              instructions: '',
              link: '',
              buttonText: 'Start Now',
              requirements: { needScreenshot: true, needText: false }
            });
            setModalOpen(true);
          }}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase text-xs tracking-widest rounded-3xl transition-all shadow-xl shadow-purple-600/20 active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && !tasks.length ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-white/[0.02] rounded-[2.5rem] border border-white/5 animate-pulse" />
          ))
        ) : tasks.map((task) => {
          const Icon = taskTypeIcons[task.type] || Target;
          return (
            <motion.div 
              key={task.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onMouseLeave={() => {
                const tId = task.$id || task.id;
                if (deletingTaskId === tId) {
                  setDeletingTaskId(null);
                }
              }}
              className="group relative p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] hover:border-white/10 transition-all overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#020617] border border-white/10 overflow-hidden shadow-2xl p-0.5 relative group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={task.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${task.$id}`} 
                    alt="" 
                    className="w-full h-full object-cover rounded-[0.8rem]" 
                  />
                  <div className="absolute inset-x-0 bottom-0 py-1 bg-black/60 backdrop-blur-md flex justify-center">
                    <Icon size={10} className="text-purple-400" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                   <button 
                    onClick={() => { 
                      let reqs = { needScreenshot: true, needText: false };
                      if (task.requirements) {
                        try {
                          reqs = typeof task.requirements === 'string' 
                            ? JSON.parse(task.requirements) 
                            : { ...task.requirements };
                        } catch (err) {
                          reqs = { needScreenshot: true, needText: false };
                        }
                      }
                      setEditingTask(task); 
                      setFormData({ 
                        ...task, 
                        rewardCoins: task.reward || task.rewardCoins || 100,
                        requirements: reqs
                      }); 
                      setModalOpen(true); 
                    }}
                    className="p-2 bg-white/5 hover:bg-purple-600/20 hover:text-purple-400 rounded-xl text-slate-400 transition-all border border-white/5"
                    title="Edit Campaign"
                   >
                     <Edit3 size={12} />
                   </button>
                   <button 
                     onClick={async (e) => {
                       e.stopPropagation();
                       const tId = task.$id || task.id;
                       if (deletingTaskId === tId) {
                         await adminService.deleteTask(tId);
                         showToast('Campaign terminated', 'success');
                         setDeletingTaskId(null);
                         loadData();
                       } else {
                         setDeletingTaskId(tId);
                       }
                     }}
                     className={`p-2 transition-all border rounded-xl flex items-center gap-1 shrink-0 ${
                       (deletingTaskId === (task.$id || task.id))
                         ? 'bg-rose-600 border-rose-500 text-white animate-pulse text-[9px] font-black uppercase px-2.5' 
                         : 'bg-white/5 border-white/5 hover:bg-rose-600/20 hover:text-rose-400 text-slate-400'
                     }`}
                     title={(deletingTaskId === (task.$id || task.id)) ? "Click again to confirm" : "Terminate Campaign"}
                    >
                      <Trash2 size={12} />
                      {(deletingTaskId === (task.$id || task.id)) && <span>Confirm</span>}
                    </button>
                    <button 
                     onClick={() => toggleStatus(task)}
                     className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-tighter transition-all italic border ${
                       task.status === 'active' 
                         ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                         : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                     }`}
                    >
                       {task.status === 'active' ? 'Active_Live' : 'Paused_Offline'}
                    </button>
                 </div>
              </div>

              <div className="space-y-2 mb-8">
                 <h3 className="text-xl font-black text-white italic truncate uppercase tracking-tight">{task.title}</h3>
                 <p className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed">{task.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/[0.04]">
                 <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Reward Value</p>
                    <p className="text-xl font-black text-white italic tracking-tighter">{task.rewardCoins || task.reward || 0} <span className="text-[10px] text-purple-500 uppercase not-italic">Credits</span></p>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Engagement</p>
                    <p className="text-xl font-black text-white italic tracking-tighter">{task.usersJoined || 0}</p>
                 </div>
              </div>

              <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0">
                 <button 
                  onClick={() => { 
                    let reqs = { needScreenshot: true, needText: false };
                    if (task.requirements) {
                      try {
                        reqs = typeof task.requirements === 'string' 
                          ? JSON.parse(task.requirements) 
                          : { ...task.requirements };
                      } catch (err) {
                        reqs = { needScreenshot: true, needText: false };
                      }
                    }
                    setEditingTask(task); 
                    setFormData({ 
                      ...task, 
                      rewardCoins: task.reward || task.rewardCoins || 100,
                      requirements: reqs
                    }); 
                    setModalOpen(true); 
                  }}
                  className="p-3 bg-white text-black hover:bg-purple-600 hover:text-white rounded-2xl transition-all shadow-2xl"
                 >
                   <Edit3 size={18} />
                 </button>
                 <button 
                  onClick={async (e) => {
                    e.stopPropagation();
                    const tId = task.$id || task.id;
                    if (deletingTaskId === tId) {
                      await adminService.deleteTask(tId);
                      showToast('Campaign terminated', 'success');
                      setDeletingTaskId(null);
                      loadData();
                    } else {
                      setDeletingTaskId(tId);
                    }
                  }}
                  className={`p-3 transition-all shadow-2xl rounded-2xl flex items-center gap-1.5 shrink-0 ${
                    (deletingTaskId === (task.$id || task.id))
                      ? 'bg-rose-500 border-2 border-rose-400 text-white animate-pulse text-[11px] font-black uppercase px-5' 
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                  title={(deletingTaskId === (task.$id || task.id)) ? "Click again to confirm" : "Terminate"}
                 >
                   <Trash2 size={18} />
                   {(deletingTaskId === (task.$id || task.id)) && <span>Confirm</span>}
                 </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-4xl bg-[#020617] border border-white/10 rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-600/10 text-purple-500 rounded-2xl flex items-center justify-center">
                         <Target size={24} />
                      </div>
                      <div>
                         <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{editingTask ? 'Recalibrate' : 'Initialize'} Campaign</h2>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Mission Protocol Definition</p>
                      </div>
                   </div>
                   <button type="button" onClick={() => setModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
                      <X size={24} />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-8">
                         <div className="flex items-center gap-10">
                            <div className="w-32 h-32 bg-white/5 border border-white/10 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center relative group overflow-hidden shrink-0 shadow-inner">
                               {formData.imageUrl ? (
                                  <img src={formData.imageUrl} className="w-full h-full object-cover" />
                               ) : (
                                  <>
                                    {uploading ? <Loader2 className="animate-spin text-purple-500" /> : <Images className="text-slate-700" size={32} />}
                                    <span className="text-[8px] font-black text-slate-600 uppercase mt-2">Gallery / File</span>
                                  </>
                               )}
                               <input 
                                 type="file" 
                                 accept="image/*" 
                                 onChange={handleImageUpload}
                                 className="absolute inset-0 opacity-0 cursor-pointer" 
                               />
                               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-[10px] font-black text-white uppercase italic">Open Gallery</span>
                               </div>
                            </div>
                            <div className="flex-1 space-y-4">
                               <div>
                                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2 mb-2 block italic">Campaign Objective</label>
                                  <input 
                                    required
                                    placeholder="e.g. Follow Nexvy on X"
                                    className="w-full bg-white/[0.04] border border-white/5 rounded-2xl py-4 px-6 text-white font-black italic tracking-tight focus:border-purple-500 outline-none transition-all"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                  />
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                  <div>
                                     <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2 mb-2 block italic">Credit Reward</label>
                                     <input 
                                       type="number"
                                       className="w-full bg-white/[0.04] border border-white/5 rounded-2xl py-4 px-6 text-white font-black italic tracking-tight focus:border-purple-500 outline-none transition-all"
                                       value={formData.rewardCoins}
                                       onChange={e => setFormData({...formData, rewardCoins: Number(e.target.value)})}
                                     />
                                  </div>
                                  <div>
                                     <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2 mb-2 block italic">Deployment Status</label>
                                     <select 
                                       className="w-full bg-white/[0.04] border border-white/5 rounded-2xl py-4 px-6 text-white font-black italic tracking-tight focus:border-purple-500 outline-none transition-all"
                                       value={formData.status}
                                       onChange={e => setFormData({...formData, status: e.target.value})}
                                     >
                                        <option value="active" className="bg-slate-900 text-white">Active (Operational)</option>
                                        <option value="inactive" className="bg-slate-900 text-white">Inactive (Paused)</option>
                                     </select>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div>
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2 mb-2 block italic">Mission Summary</label>
                            <textarea 
                              rows={3}
                              placeholder="Brief overview of the mission objective..."
                              className="w-full bg-white/[0.04] border border-white/5 rounded-3xl py-4 px-6 text-white font-medium text-sm focus:border-purple-500 outline-none transition-all resize-none"
                              value={formData.description}
                              onChange={e => setFormData({...formData, description: e.target.value})}
                            />
                         </div>

                         <div>
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2 mb-2 block italic">Tactical Briefing (Instructions)</label>
                            <textarea 
                              rows={4}
                              placeholder="1. Open internal link\n2. Perform required action\n3. Capture evidence..."
                              className="w-full bg-white/[0.04] font-mono border border-white/5 rounded-3xl py-4 px-6 text-slate-300 text-xs focus:border-purple-500 outline-none transition-all resize-none leading-relaxed"
                              value={formData.instructions}
                              onChange={e => setFormData({...formData, instructions: e.target.value})}
                            />
                         </div>
                      </div>

                      <div className="space-y-8">
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2 mb-2 block italic">Intelligence URL (Link)</label>
                               <input 
                                 placeholder="https://..."
                                 className="w-full bg-white/[0.04] border border-white/5 rounded-2xl py-4 px-6 text-white font-medium text-xs focus:border-purple-500 outline-none transition-all"
                                 value={formData.link}
                                 onChange={e => setFormData({...formData, link: e.target.value})}
                               />
                            </div>
                            <div>
                               <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2 mb-2 block italic">Trigger Protocol (Button)</label>
                               <input 
                                 placeholder="e.g. EXECUTE NOW"
                                 className="w-full bg-white/[0.04] border border-white/5 rounded-2xl py-4 px-6 text-white font-black italic tracking-tighter text-xs focus:border-purple-500 outline-none transition-all uppercase"
                                 value={formData.buttonText}
                                 onChange={e => setFormData({...formData, buttonText: e.target.value})}
                               />
                            </div>
                         </div>

                         <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2rem] mb-6 italic">Verification Protocol</h4>
                            <div className="space-y-4">
                               <label className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.08] transition-all group">
                                  <div className="flex items-center gap-3">
                                     <Images className="text-purple-500 group-hover:scale-110 transition-transform" size={18} />
                                     <span className="text-xs font-bold text-white uppercase italic tracking-tighter">Require Visual Intelligence (Screenshot)</span>
                                  </div>
                                  <input 
                                    type="checkbox" 
                                    checked={formData.requirements.needScreenshot}
                                    onChange={e => setFormData({...formData, requirements: {...formData.requirements, needScreenshot: e.target.checked}})}
                                    className="accent-purple-500 w-6 h-6 rounded-lg" 
                                  />
                               </label>
                               <label className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.08] transition-all group">
                                  <div className="flex items-center gap-3">
                                     <ClipboardList className="text-blue-500 group-hover:scale-110 transition-transform" size={18} />
                                     <span className="text-xs font-bold text-white uppercase italic tracking-tighter">Require Encrypted Textual Proof</span>
                                  </div>
                                  <input 
                                    type="checkbox" 
                                    checked={formData.requirements.needText}
                                    onChange={e => setFormData({...formData, requirements: {...formData.requirements, needText: e.target.checked}})}
                                    className="accent-blue-500 w-6 h-6 rounded-lg" 
                                  />
                               </label>
                            </div>
                         </div>

                         <div>
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2 mb-2 block italic">Mission Classification (Type)</label>
                            <div className="grid grid-cols-2 gap-3">
                               {['survey', 'game', 'install', 'quiz'].map(t => (
                                 <button 
                                   key={t}
                                   type="button"
                                   onClick={() => setFormData({...formData, type: t})}
                                   className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic ${
                                     formData.type === t 
                                       ? 'bg-white text-black shadow-2xl scale-105' 
                                       : 'bg-white/5 text-slate-500 border border-white/5 hover:text-white'
                                   }`}
                                 >
                                   {t}
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-10 border-t border-white/5 bg-white/[0.01] flex justify-end gap-4">
                   <button 
                     type="button"
                     onClick={() => setModalOpen(false)}
                     className="px-8 py-4 text-slate-600 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all italic"
                   >
                     Abort Deployment
                   </button>
                   <button 
                     type="submit"
                     disabled={loading}
                     className="px-12 py-5 bg-white text-black hover:bg-purple-600 hover:text-white font-black uppercase tracking-widest text-xs rounded-[2rem] transition-all shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] active:scale-95 disabled:opacity-50"
                   >
                      {loading ? 'Initializing...' : (editingTask ? 'Recalibrate Campaign' : 'Deploy Protocol')}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
