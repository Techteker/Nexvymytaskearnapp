import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  Users, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  Globe,
  Trash2,
  Mail,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'targeted' | 'history'>('broadcast');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Notification Center</h1>
        <p className="text-slate-400">Manage global announcements and user-specific alerts.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-white/5 pb-4">
        {[
          { id: 'broadcast', label: 'Global Broadcast', icon: Globe },
          { id: 'targeted', label: 'Targeted Messages', icon: User },
          { id: 'history', label: 'History & Logs', icon: History }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all font-bold text-sm ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'broadcast' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 p-8 shadow-xl">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <Send size={20} className="text-blue-400" /> New Broadcast
               </h3>
               
               <div className="space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-400 mb-2">Notification Title</label>
                   <input 
                     type="text" 
                     placeholder="e.g., Weekly Reward Bonus!" 
                     className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-colors outline-none"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-400 mb-2">Message Body</label>
                   <textarea 
                     rows={4}
                     placeholder="Enter your message detail here..."
                     className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 transition-colors outline-none resize-none"
                   />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                       <p className="text-xs font-bold text-slate-500 mb-2">Target Interface</p>
                       <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                             <input type="checkbox" defaultChecked className="accent-blue-500" />
                             <span className="text-sm text-slate-300">In-App</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                             <input type="checkbox" className="accent-blue-500" />
                             <span className="text-sm text-slate-300">Push</span>
                          </label>
                       </div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                       <p className="text-xs font-bold text-slate-500 mb-2">Urgency</p>
                       <select className="bg-transparent text-sm text-slate-300 w-full outline-none">
                          <option>Normal</option>
                          <option>High Alert</option>
                          <option>Critical</option>
                       </select>
                    </div>
                 </div>

                 <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20">
                   <Send size={18} /> Send Broadcast to 4.2k Users
                 </button>
               </div>
            </div>

            {/* Preview Card */}
            <div className="space-y-6">
               <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sticky top-8">
                  <h4 className="text-xs font-black text-slate-600 uppercase tracking-widest mb-6">Mobile Preview</h4>
                  <div className="w-[280px] h-[550px] bg-black rounded-[40px] border-[6px] border-slate-800 mx-auto relative overflow-hidden shadow-2xl">
                     <div className="w-20 h-6 bg-slate-800 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl z-20" />
                     <div className="p-4 mt-12">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-3 shadow-xl animate-pulse">
                           <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                                 <Bell size={12} className="text-white" />
                              </div>
                              <span className="text-[10px] font-bold text-slate-400">NEXVY APP • NOW</span>
                           </div>
                           <h5 className="text-xs font-bold text-white mb-1">Weekly Reward Bonus!</h5>
                           <p className="text-[10px] text-slate-500 line-clamp-2">The message body will appear here for all users to see on their mobile devices...</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 shadow-xl overflow-hidden"
           >
              <div className="p-8 border-b border-slate-800">
                <h3 className="text-xl font-bold text-white">Broadcast History</h3>
              </div>
              <div className="divide-y divide-white/5">
                 {[1, 2, 3, 4].map((i) => (
                   <div key={i} className="p-6 flex items-center gap-6 hover:bg-white/5 transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                        <CheckCircle2 size={24} className="text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-white mb-1">New Task Update: Social Media Sharing</h5>
                        <p className="text-sm text-slate-500 max-w-lg">We've added 10 new high-reward tasks. Start earning now!</p>
                        <div className="flex items-center gap-4 mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                           <span className="flex items-center gap-1"><Users size={12}/> REACH: 4,120</span>
                           <span className="flex items-center gap-1"><Smartphone size={12}/> TYPE: PUSH+APP</span>
                           <span className="flex items-center gap-1"><Clock size={12}/> SENT: 2D AGO</span>
                        </div>
                      </div>
                      <button className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">
                        <Trash2 size={20} />
                      </button>
                   </div>
                 ))}
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
