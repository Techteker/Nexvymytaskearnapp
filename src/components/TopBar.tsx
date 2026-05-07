import React from 'react';
import { CoinIcon } from './CoinIcon';

export const TopBar = () => {
  return (
    <div className="flex items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gaming-accent glow-blue bg-gaming-blue-700">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=ProGamer" 
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gaming-blue-900" />
        </div>
        <div>
          <h3 className="font-display font-bold text-white leading-tight">Pro Gamer</h3>
          <p className="text-[10px] text-gaming-accent font-semibold uppercase tracking-wider">Level 12</p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 gaming-card bg-white/10 glow-gold border-yellow-500/20">
        <CoinIcon size={20} />
        <span className="font-display font-bold text-coin-gold">4,027</span>
      </div>
    </div>
  );
};
