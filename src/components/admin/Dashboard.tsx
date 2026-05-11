import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Gamepad2, 
  Wallet, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'motion/react';

const chartData = [
  { name: 'Mon', users: 400, tasks: 240 },
  { name: 'Tue', users: 300, tasks: 139 },
  { name: 'Wed', users: 900, tasks: 980 },
  { name: 'Thu', users: 700, tasks: 390 },
  { name: 'Fri', users: 1200, tasks: 480 },
  { name: 'Sat', users: 1500, tasks: 800 },
  { name: 'Sun', users: 1300, tasks: 700 },
];

const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 8000 },
];

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [statsData, logsData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getLogs(10)
      ]);
      setStats(statsData);
      setLogs(logsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-500', trend: '+12.5%' },
    { label: 'Total Tasks', value: stats?.totalTasks || 0, icon: CheckCircle, color: 'bg-emerald-500', trend: '+5.2%' },
    { label: 'Pending Submissions', value: stats?.pendingTasks || 0, icon: Clock, color: 'bg-amber-500', trend: '-2.1%' },
    { label: 'Total Revenue', value: `$${stats?.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, color: 'bg-purple-500', trend: '+18.7%' },
    { label: 'Pending Withdrawals', value: stats?.pendingWithdrawals || 0, icon: Wallet, color: 'bg-rose-500', trend: '0.0%' },
    { label: 'Daily Traffic', value: stats?.dailyTraffic || 0, icon: Activity, color: 'bg-indigo-500', trend: '+7.4%' },
  ];

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-32 bg-slate-800/50 rounded-3xl border border-slate-700"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Platform Overview</h1>
        <p className="text-slate-400">Track your performance and manage Nexvy users in real-time.</p>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group p-6 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 hover:border-slate-700 transition-all shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${card.color} p-3 rounded-2xl shadow-lg ring-4 ring-white/5`}>
                <card.icon className="text-white" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                card.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 
                card.trend === '0.0%' ? 'bg-slate-500/10 text-slate-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {card.trend.startsWith('+') ? <ArrowUpRight size={14} /> : card.trend.startsWith('-') ? <ArrowDownRight size={14} /> : null}
                {card.trend}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{card.label}</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="text-lg font-bold text-white">Platform Activity</h3>
               <p className="text-sm text-slate-500">Users vs Task completions trend</p>
             </div>
             <div className="flex items-center gap-4 text-xs font-medium">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></div>
                 <span className="text-slate-400">Users</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                 <span className="text-slate-400">Tasks</span>
               </div>
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="tasks" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 shadow-xl">
           <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="text-lg font-bold text-white">Revenue Analytics</h3>
               <p className="text-sm text-slate-500">Monthly revenue growth (USD)</p>
             </div>
             <TrendingUp className="text-slate-500" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#1e293b', opacity: 0.5 }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table (Live Logs) */}
      <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Admin Activity Logs</h3>
          <Link to="/admin/logs" className="text-purple-400 font-semibold text-sm hover:underline">View Full Audit Trail</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800/50 bg-slate-800/20">
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {logs.slice(0, 5).map((log, i) => (
                <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Activity size={14} />
                      </div>
                      <span className="font-semibold text-slate-200">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-400 text-sm">{log.details}</td>
                  <td className="px-8 py-5 text-slate-500 text-xs text-right italic">
                     {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Recently'}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                   <td colSpan={3} className="px-8 py-10 text-center text-slate-500">No recent activity detected.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
