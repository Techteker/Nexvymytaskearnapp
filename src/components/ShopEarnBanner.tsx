import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ShopEarnBanner = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/shop-earn')}
      className="p-5 bg-gradient-to-r from-emerald-500 to-teal-700 rounded-[32px] relative overflow-hidden group cursor-pointer shadow-xl"
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-100/60 uppercase tracking-widest">Rewards Shop</span>
          </div>
          <h3 className="text-xl font-display font-black text-white italic tracking-tighter leading-tight">SHOP & EARN</h3>
          <p className="text-[11px] text-emerald-100/80 font-bold mt-1">Get massive cashback & coins on every purchase!</p>
          
          <div className="flex items-center gap-2 mt-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-black text-white uppercase border border-white/20">
              100+ Brands
            </span>
            <div className="flex items-center gap-1 text-[10px] font-black text-white uppercase group-hover:translate-x-1 transition-transform">
              Explore <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-400/20 backdrop-blur-sm rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-black text-emerald-900 shadow-lg animate-bounce">
            %
          </div>
        </div>
      </div>
      
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
    </motion.div>
  );
};
