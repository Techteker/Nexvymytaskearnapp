import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  History, 
  Search, 
  Terminal, 
  User, 
  Calendar, 
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

export const Logs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    const data = await adminService.getLogs();
    setLogs(data);
    setLoading(false);
  };

  const getActionIcon = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('ban') || a.includes('delete')) return <AlertTriangle className="text-rose-500" size={16} />;
    if (a.includes('approve') || a.includes('create')) return <CheckCircle2 className="text-emerald-500" size={16} />;
    if (a.includes('settings') || a.includes('update')) return <Zap className="text-amber-500" size={16} />;
    return <Info className="text-blue-500" size={16} />;
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.adminId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Activity Audit</h1>
          <p className="text-slate-400">Track all administrative actions across the system.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-purple-500 outline-none w-full md:w-64 transition-all"
          />
        </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-md rounded-3.5xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <Terminal size={20} className="text-slate-400" />
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">System Logs</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/20 text-xs font-bold text-slate-500 uppercase">
                <th className="px-8 py-4">Action</th>
                <th className="px-8 py-4">Status & Details</th>
                <th className="px-8 py-4">Admin</th>
                <th className="px-8 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                Array(10).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-8 py-6">
                      <div className="h-4 bg-slate-800 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-500 italic">
                    No matching activity records found.
                  </td>
                </tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.$id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                        {getActionIcon(log.action)}
                      </div>
                      <span className="font-bold text-slate-200 uppercase text-xs tracking-wide">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-slate-400 max-w-lg">{log.details}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={14} className="text-purple-400" />
                       <span className="font-mono text-xs text-slate-500">{log.adminId.substring(0, 12)}...</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Calendar size={12} />
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
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
