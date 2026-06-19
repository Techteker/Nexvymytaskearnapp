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
    <div className="fixed bottom-0 left-0 right-0 p-2 pb-6 bg-gradient-to-t from-[#040d2d] to-transparent pointer-events-none">
      <nav className="max-w-md mx-auto bg-gradient-to-br from-[#0a1f6b]/95 via-[#0c247d]/95 to-[#051347]/95 border-t border-[#D4AF37]/30 pointer-events-auto flex items-end justify-between px-2 py-2 relative rounded-3xl shadow-[0_-12px_40px_rgba(212,175,55,0.15)] backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 flex-1 transition-all cursor-pointer group"
            >
              <div className={cn(
                "p-3 rounded-2xl transition-all duration-300 relative",
                isActive 
                  ? "bg-gradient-to-b from-[#F8D37A] via-[#D4AF37] to-[#B8860B] -translate-y-4 scale-110 shadow-[0_8px_20px_rgba(212,175,55,0.4)] border-2 border-white/20" 
                  : "hover:bg-[#D4AF37]/10"
              )}>
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-[#06164A] stroke-[2.5]" : "text-slate-400 group-hover:text-[#F8D37A]"
                )} />
              </div>
              <span className={cn(
                "text-[9px] font-black tracking-tighter uppercase transition-colors",
                isActive ? "text-[#D4AF37] translate-y-[-12px]" : "text-slate-400 group-hover:text-slate-200"
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
