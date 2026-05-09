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
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: CheckSquare, label: 'Tasks', path: '/admin/tasks' },
  { icon: ClipboardList, label: 'Submissions', path: '/admin/submissions' },
  { icon: BrainCircuit, label: 'AI Quiz Gen', path: '/admin/quiz-gen' },
  { icon: CreditCard, label: 'Withdrawals', path: '/admin/withdrawals' },
  { icon: Target, label: 'Ads', path: '/admin/ads' },
  { icon: RotateCw, label: 'Spin', path: '/admin/spin' },
  { icon: Share2, label: 'Referrals', path: '/admin/referrals' },
  { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
  { icon: Images, label: 'Branding', path: '/admin/branding' },
  { icon: Activity, label: 'Logs', path: '/admin/logs' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 bg-slate-800 rounded-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-purple-500/20">
                  N
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Nexvy Admin
                </span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-slate-800 rounded text-slate-400">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl mb-4 text-xs">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-400 capitalize">
                  {user?.username?.[0] || 'A'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-slate-200 truncate">{user?.username}</p>
                  <p className="text-slate-500 truncate text-[10px]">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout System</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen p-4 lg:p-8 pt-16 lg:pt-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
