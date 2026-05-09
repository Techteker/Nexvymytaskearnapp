import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Search, 
  Calendar, 
  User, 
  Shield, 
  Activity,
  ArrowDownCircle,
  Filter,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { motion } from 'motion/react';

export const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await adminService.getLogs();
    setLogs(data);
    setLoading(false);
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Activity Logs</h1>
          <p className="text-slate-400">Audit trail of all administrative actions on the Nexvy platform.</p>
        </div>
        <button 
          onClick={fetchLogs}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm transition-all"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text"
            placeholder="Search by action or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
          />
        </div>
        <button className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-slate-400 hover:text-white transition-all">
          <Filter size={20} />
        </button>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-800">
                <th className="px-6 py-4">Action Type</th>
                <th className="px-6 py-4">Admin ID</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-8"><div className="h-4 bg-slate-800 rounded w-24"></div></td>
                    <td className="px-6 py-8"><div className="h-4 bg-slate-800 rounded w-32"></div></td>
                    <td className="px-6 py-8"><div className="h-4 bg-slate-800 rounded w-48"></div></td>
                    <td className="px-6 py-8"><div className="h-4 bg-slate-800 rounded w-20"></div></td>
                    <td className="px-6 py-8"><div className="h-4 bg-slate-800 rounded w-12 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={log.id} 
                    className="hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-white">
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-purple-400" />
                        {log.action}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Shield size={14} />
                        {log.adminId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300 line-clamp-2 max-w-md">{log.details}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                        <Calendar size={12} />
                        {log.timestamp?.toDate().toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-bold uppercase ring-1 ring-blue-500/20">
                        Logged
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-slate-950/30 border-t border-slate-800 flex justify-center">
           <button className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-2 transition-all">
             <ArrowDownCircle size={14} /> Load Older Events
           </button>
        </div>
      </div>
    </div>
  );
};
