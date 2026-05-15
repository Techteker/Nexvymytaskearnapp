import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const CoinIcon = ({ className, size = 24 }: { className?: string; size?: number }) => {
  return (
    <motion.div
      animate={{ 
        rotateY: [0, 360],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full bg-coin-gold glow-gold blur-[2px]" />
      <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-300 border border-yellow-200 flex items-center justify-center">
        <span className="text-[10px] font-bold text-yellow-900 leading-none">$</span>
      </div>
    </motion.div>
  );
};
