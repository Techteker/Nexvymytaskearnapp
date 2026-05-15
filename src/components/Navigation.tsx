import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutGrid, RotateCcw, User, Wallet, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/', icon: LayoutGrid, label: 'GAMES' },
  { path: '/tasks', icon: Trophy, label: 'TASKS' },
  { path: '/spinner', icon: RotateCcw, label: 'SPINNER' },
  { path: '/withdraw', icon: Wallet, label: 'WALLET' },
  { path: '/profile', icon: User, label: 'PROFILE' },
];

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 pb-6 bg-gradient-to-t from-gaming-blue-900 to-transparent pointer-events-none">
      <nav className="max-w-md mx-auto bg-white/90 backdrop-blur-xl border-t border-slate-200 pointer-events-auto flex items-end justify-between px-2 py-2 relative rounded-t-3xl shadow-[0_-10px_30px_rgba(124,58,237,0.1)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 flex-1 transition-all"
            >
              <div className={cn(
                "p-3 rounded-2xl transition-all duration-300 relative",
                isActive ? "bg-brand-purple glow-purple -translate-y-4 scale-110 shadow-xl border-2 border-white/20" : "hover:bg-brand-purple/5"
              )}>
                <item.icon className={cn(
                  "w-6 h-6 transition-colors",
                  isActive ? "text-white" : "text-slate-400"
                )} />
              </div>
              <span className={cn(
                "text-[9px] font-black tracking-tighter uppercase transition-colors",
                isActive ? "text-brand-purple translate-y-[-12px]" : "text-slate-400"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
