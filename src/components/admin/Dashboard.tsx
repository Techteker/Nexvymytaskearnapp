import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  Users, 
  Target, 
  CreditCard, 
  Activity, 
  Zap, 
  ArrowUpRight, 
  ShieldCheck, 
  Cpu, 
  History,
  Bell,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const data = await adminService.getDashboardStats();
    setStats(data);
    setLoading(false);
  };

  const dashboardCards = [
    { 
      label: 'Network Force', 
      value: stats?.totalUsers || 0, 
      sub: 'Operatives Level Alpha', 
      icon: Users, 
      color: 'blue',
      path: '/admin/users'
    },
    { 
      label: 'Mission Deployments', 
      value: (stats?.totalEarnings / 100) || 0, 
      sub: 'Successful Executions', 
      icon: Target, 
      color: 'purple',
      path: '/admin/tasks'
    },
    { 
      label: 'Vault Liquidity', 
      value: stats?.totalWithdrawals || 0, 
      sub: 'Allocated Assets', 
      icon: CreditCard, 
      color: 'emerald',
      path: '/admin/withdrawals'
    },
    { 
      label: 'Protocol Pending', 
      value: stats?.pendingWithdrawals || 0, 
      sub: 'Awaiting Authorization', 
      icon: Activity, 
      color: 'rose',
      path: '/admin/submissions'
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black text-purple-500 uppercase tracking-widest">System Online</span>
              </div>
              <span className="text-slate-600 font-bold uppercase text-[9px] tracking-widest underline decoration-purple-500/50 underline-offset-4 font-mono">Nexvy_V4.0_Admin</span>
           </div>
           <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase font-sans leading-none">Command Center</h1>
        </div>
        
        <div className="flex gap-4">
           <Link to="/admin/notifications" className="p-4 bg-white/[0.02] border border-white/5 text-slate-500 hover:text-white rounded-2xl transition-all shadow-xl">
              <Bell size={24} />
           </Link>
           <button onClick={loadStats} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all border border-white/10 flex items-center gap-2">
              <Zap size={18} className="text-purple-500" /> Refresh Grid
           </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-44 bg-white/[0.02] rounded-[3rem] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-8 bg-white/[0.01] border border-white/5 rounded-[3rem] hover:bg-white/[0.03] hover:border-white/10 transition-all cursor-pointer"
            >
              <Link to={card.path} className="absolute inset-0" />
              <div className={`w-14 h-14 rounded-2.5xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <card.icon size={24} className={`text-slate-400 group-hover:text-white transition-colors`} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">{card.label}</p>
                <p className="text-4xl font-black text-white italic tracking-tighter tabular-nums">{card.value.toLocaleString()}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{card.sub}</p>
              </div>
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                 <ArrowUpRight size={20} className="text-white/20" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* System Status Visualizer */}
         <div className="lg:col-span-8 bg-white/[0.01] border border-white/5 rounded-[4rem] p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
               <Cpu size={240} />
            </div>
            
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Protocol Status</h3>
                  <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mt-1">Real-time operational distribution logs</p>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center">
                     <ShieldCheck className="text-emerald-500 animate-pulse" size={24} />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black uppercase italic tracking-widest">
                        <span className="text-slate-500">Asset Flow Velocity</span>
                        <span className="text-white">82% Capacity</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '82%' }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-[0_0_12px_rgba(147,51,234,0.5)]" 
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black uppercase italic tracking-widest">
                        <span className="text-slate-500">Operative Growth</span>
                        <span className="text-blue-500">+14.2% Increase</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '64%' }}
                          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                          className="h-full bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.5)]" 
                        />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-3xl p-6 border border-white/5 hover:bg-white/[0.08] transition-all group/stat">
                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Active Rank</p>
                     <p className="text-2xl font-black text-white italic tracking-tighter">Elite_IV</p>
                     <ArrowRight size={14} className="text-slate-700 mt-2 group-hover/stat:translate-x-1 transition-transform" />
                  </div>
                  <div className="bg-white/5 rounded-3xl p-6 border border-white/5 hover:bg-white/[0.08] transition-all group/stat">
                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Interference</p>
                     <p className="text-2xl font-black text-rose-500 italic tracking-tighter">0.02%</p>
                     <ArrowRight size={14} className="text-slate-700 mt-2 group-hover/stat:translate-x-1 transition-transform" />
                  </div>
               </div>
            </div>
         </div>

         {/* Quick Actions / Shortcuts */}
         <div className="lg:col-span-4 bg-white/[0.01] border border-white/5 rounded-[4rem] p-12 flex flex-col justify-between">
            <div>
               <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Protocol Access</h3>
               <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest italic font-mono">Immediate Command Entry</p>
            </div>

            <div className="space-y-4 my-8">
               {[
                 { label: 'New Mission', icon: Target, path: '/admin/tasks' },
                 { label: 'Verify Logs', icon: History, path: '/admin/submissions' },
                 { label: 'Signal Broadcast', icon: Bell, path: '/admin/notifications' }
               ].map((action) => (
                 <Link 
                   key={action.label}
                   to={action.path}
                   className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-2xl transition-all group"
                 >
                    <div className="flex items-center gap-4">
                       <div className="p-2 bg-slate-900 rounded-xl group-hover:scale-110 transition-transform">
                          <action.icon size={18} className="text-slate-400 group-hover:text-white" />
                       </div>
                       <span className="text-sm font-black uppercase text-slate-300 group-hover:text-white italic tracking-tight">{action.label}</span>
                    </div>
                    <ArrowRight size={16} className="text-slate-700 group-hover:translate-x-1 transition-transform" />
                 </Link>
               ))}
            </div>

            <div className="p-6 bg-purple-600/10 border border-purple-500/20 rounded-[2rem] flex items-center justify-between">
               <div className="flex flex-col">
                  <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest italic">System Utilization</p>
                  <p className="text-xl font-black text-white italic tracking-tighter">98.4% Optimal</p>
               </div>
               <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                  <Zap size={20} />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
