import React from 'react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { CoinIcon } from '../components/CoinIcon';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Trophy, ChevronRight } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="gaming-card p-4 flex flex-col gap-2">
    <div className={`p-2 rounded-xl w-fit ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-[10px] text-white/40 font-semibold uppercase">{label}</p>
      <p className="text-xl font-display font-bold text-white">{value}</p>
    </div>
  </div>
);

export const Home = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <TopBar />

      {/* Banner */}
      <div className="gaming-card p-6 bg-gradient-to-br from-blue-600 to-indigo-900 border-white/20 relative overflow-hidden group shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-display font-black text-white mb-2 italic tracking-tighter">MEGA WIN!</h2>
          <p className="text-sm text-blue-100 mb-6 font-bold">Collect 50,000 coins today!</p>
          <button className="gaming-button-yellow px-8 py-3 text-sm" onClick={() => navigate('/spinner')}>
            PLAY NOW
          </button>
        </div>
        <div className="absolute right-[-30px] bottom-[-20px] opacity-30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
          <CoinIcon size={160} />
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => navigate('/referral')}
          className="gaming-card p-6 bg-gradient-to-b from-purple-500 to-purple-800 border-white/20 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          <div className="p-3 bg-white/20 rounded-2xl shadow-inner">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest">Invite</p>
            <p className="text-[10px] text-white/60 font-bold">+500 Coins</p>
          </div>
        </button>
        <button 
          onClick={() => navigate('/leaderboard')}
          className="gaming-card p-6 bg-gradient-to-b from-orange-500 to-red-700 border-white/20 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          <div className="p-3 bg-white/20 rounded-2xl shadow-inner">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest">Rank</p>
            <p className="text-[10px] text-white/60 font-bold">Top Prizes</p>
          </div>
        </button>
      </div>

      {/* Trending Section */}
      <div>
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="font-display font-black text-lg uppercase italic text-white/80 tracking-tight">Hot Tasks</h3>
          <ChevronRight className="w-5 h-5 text-white/40" />
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="gaming-card p-4 flex items-center justify-between group hover:bg-blue-700/30 transition-all cursor-pointer border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-900/60 flex items-center justify-center border-2 border-white/10 shadow-inner">
                  <TrendingUp className="w-7 h-7 text-gaming-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Mystery Box</h4>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-tight">Open for surprises</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white/5 py-1 px-3 rounded-full border border-white/10">
                  <CoinIcon size={16} />
                  <span className="text-xs font-black text-white">+250</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
};
