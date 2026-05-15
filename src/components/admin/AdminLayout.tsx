import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  BrainCircuit, 
  ClipboardList, 
  Images, 
  RotateCw, 
  Settings, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  CreditCard,
  Target,
  Share2,
  Activity,
  FileSearch,
  Download,
  Gamepad2,
  ShoppingBag,
  History
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Control Center', path: '/admin' },
  { icon: Users, label: 'Operative Depot', path: '/admin/users' },
  { icon: Target, label: 'Mission Design', path: '/admin/tasks' },
  { icon: History, label: 'Review Hub', path: '/admin/submissions' },
  { icon: CreditCard, label: 'Vault Payouts', path: '/admin/withdrawals' },
  { icon: Bell, label: 'Signal Center', path: '/admin/notifications' },
  { icon: ShoppingBag, label: 'Affiliates', path: '/admin/affiliate' },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-purple-500/30">
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-0 left-0 right-0 h-16 lg:hidden bg-slate-900/50 backdrop-blur-md border-b border-white/5 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-white/20">
             <img src="/input_file_0.png" alt="Logo" className="w-full h-full object-contain" />
           </div>
           <span className="font-black tracking-tighter text-white italic">NEXVY</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <motion.aside 
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-[#020617] border-r border-white/5 flex flex-col"
          >
            <div className="h-24 px-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-xl shadow-purple-500/20 border border-white/20">
                  <img src="/input_file_0.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tighter text-white italic leading-none">NEXVY</span>
                  <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] mt-1">Admin Panel</span>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white/5 rounded-xl text-slate-400">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
                      isActive 
                        ? 'text-white' 
                        : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeMenu"
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent border-l-2 border-purple-500"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <item.icon size={20} className={`${isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors relative z-10`} />
                    <span className="font-bold tracking-tight relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-6 border-t border-white/5">
              <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-2xl mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white shadow-inner overflow-hidden uppercase">
                  {user?.username?.[0] || 'A'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-white truncate text-sm">{user?.username}</p>
                  <p className="text-slate-500 truncate text-[10px] font-medium tracking-tight">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={() => logout()}
                className="w-full flex items-center gap-4 px-5 py-3.5 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all font-bold tracking-tight"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen p-6 lg:p-10 pt-20 lg:pt-10 transition-all">
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
