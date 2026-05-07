import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutGrid, RotateCcw, Gift, Wallet, Trophy } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navItems = [
  { path: '/', icon: LayoutGrid, label: 'PUZZLE' },
  { path: '/tasks', icon: Trophy, label: 'FIND PAIR' },
  { path: '/spinner', icon: RotateCcw, label: 'SPINNER' },
  { path: '/daily-gift', icon: Gift, label: 'DAILY GIFT' },
  { path: '/withdraw', icon: Wallet, label: 'WITHDRAW' },
];

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 pb-6 bg-gradient-to-t from-gaming-blue-900 to-transparent pointer-events-none">
      <nav className="max-w-md mx-auto bg-blue-900/80 backdrop-blur-xl border-t border-white/10 pointer-events-auto flex items-end justify-between px-2 py-2 relative rounded-t-3xl shadow-2xl">
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
                isActive ? "bg-gaming-accent glow-blue -translate-y-4 scale-110 shadow-xl border-2 border-white/20" : "hover:bg-white/5"
              )}>
                <item.icon className={cn(
                  "w-6 h-6 transition-colors",
                  isActive ? "text-white" : "text-white/40"
                )} />
              </div>
              <span className={cn(
                "text-[9px] font-black tracking-tighter uppercase transition-colors",
                isActive ? "text-white translate-y-[-12px]" : "text-white/40"
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
