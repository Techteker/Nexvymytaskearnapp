import React from 'react';
import { motion } from 'motion/react';

export const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDD835] overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* Bouncing Ball */}
        <motion.div
          animate={{ 
            y: [0, -80, 0],
            scaleX: [1, 0.9, 1.1, 1],
            scaleY: [1, 1.1, 0.8, 1],
          }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-20 h-20 bg-[#2D2D2D] rounded-full relative z-10 shadow-lg"
        >
          {/* Shine/Reflection */}
          <div className="absolute top-3 left-4 w-6 h-4 bg-white/30 rounded-full rotate-[-30deg]" />
        </motion.div>

        {/* Shadow/Hole */}
        <motion.div
          animate={{ 
            scale: [1, 0.6, 1],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-24 h-6 bg-black/20 rounded-[100%] mt-[-10px] blur-sm animate-pulse"
        />

        {/* Progress Bar Container */}
        <div className="mt-16 relative flex flex-col items-center gap-4">
          <div className="w-48 h-3 bg-transparent border-2 border-[#2D2D2D] rounded-full overflow-hidden p-[2px]">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="h-full bg-[#2D2D2D] rounded-full"
            />
          </div>
          
          <motion.p
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[#2D2D2D] font-display font-bold tracking-wide"
          >
            Loading...
          </motion.p>
        </div>
      </div>
    </div>
  );
};
