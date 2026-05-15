import React from 'react';
import { motion } from 'motion/react';

export const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        {/* Logo Container */}
        <div className="relative">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-1 shadow-[0_0_50px_rgba(34,211,238,0.3)] overflow-hidden"
          >
            <div className="w-full h-full bg-[#020617] rounded-full flex items-center justify-center overflow-hidden">
              <img src="/input_file_0.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
          </motion.div>
          
          {/* Decorative Rings */}
          <div className="absolute inset-[-20px] border border-cyan-500/20 rounded-full animate-[ping_3s_linear_infinite]" />
          <div className="absolute inset-[-40px] border border-blue-500/10 rounded-full animate-[ping_3s_linear_infinite_1.5s]" />
        </div>

        {/* Text Brand */}
        <div className="flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl font-display font-black text-white italic tracking-tighter"
          >
            NEXVY
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
            className="h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-2 overflow-hidden"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mt-4"
          >
            Leveling Up Your Earnings
          </motion.p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-white/5 rounded-full mt-8 overflow-hidden relative">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
          />
        </div>
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Powered by Appwrite Realtime</span>
        <div className="flex gap-1">
          {[1,2,3].map(i => (
            <motion.div 
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-1 h-1 rounded-full bg-cyan-500"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
