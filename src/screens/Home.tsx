import React from 'react';
import { motion } from 'motion/react';
import { CoinIcon } from '../components/CoinIcon';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Trophy, Gift, PlayCircle, Gamepad2, Sparkles } from 'lucide-react';
import { useRealtime } from '../context/RealtimeContext';
import { apiService } from '../services/api';
import { SEO } from '../components/SEO';
import { Skeleton } from '../components/Skeleton';
import { ShopEarnBanner } from '../components/ShopEarnBanner';

export const Home = () => {
  const navigate = useNavigate();
  const { lastUpdate } = useRealtime();
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiService.getTasks().then(res => {
      setTasks(res);
      setLoading(false);
    });
  }, [lastUpdate]);

  return (
    <>
      <SEO 
        title="Earn Money Online India: Real Rewards & Tasks" 
        description="Earn money online with Nexvy. Complete simple Google tasks, watch videos, answer surveys & play games for free UPI and Paytm Cash payouts."
        keywords="earn money online, check daily earning, best earning app india, paytm cash online, make money online, nexvy app online, work from home tasks, complete simple jobs, earn pocket money"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >

        {/* Banner */}
        <div className="p-6 bg-gradient-to-br from-brand-purple to-violet-900 rounded-[32px] relative overflow-hidden group shadow-2xl transition-all">
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Featured Game</span>
             </div>
            <h2 className="text-3xl font-display font-black text-white mb-1 italic tracking-tighter">COIN KING</h2>
            <p className="text-sm text-violet-100 mb-6 font-bold">SPIN AND WIN UP TO 50,000 COINS!</p>
            <button className="gaming-button-yellow px-8 py-3 text-sm" onClick={() => navigate('/spinner')}>
              PLAY NOW
            </button>
          </div>
          <div className="absolute right-[-30px] bottom-[-20px] opacity-30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <CoinIcon size={160} />
          </div>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => navigate('/daily-gift')}
            className="p-4 bg-gradient-to-b from-amber-500 to-orange-600 rounded-[24px] flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <div className="p-2 bg-white/20 rounded-xl">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white leading-none">Gift</p>
          </button>
          
          <button 
            onClick={() => navigate('/referral')}
            className="p-4 bg-gradient-to-b from-brand-purple to-violet-800 rounded-[24px] flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <div className="p-2 bg-white/20 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white leading-none">Invite</p>
          </button>
          
          <button 
            onClick={() => navigate('/leaderboard')}
            className="p-4 bg-gradient-to-b from-brand-purple to-indigo-600 rounded-[24px] flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            <div className="p-2 bg-white/20 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-white leading-none">Rank</p>
          </button>
        </div>

        {/* Games Showcase */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-display font-black text-lg uppercase italic text-[#F8D37A] tracking-tight">Game Center</h3>
            <Gamepad2 className="w-4 h-4 text-[#F8D37A] animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div 
               onClick={() => navigate('/survey')}
               className="p-5 relative overflow-hidden bg-gradient-to-br from-[#0c247d] to-[#040d2d] rounded-[24px] border border-[#D4AF37]/35 group cursor-pointer shadow-lg hover:shadow-[0_8px_20px_rgba(212,175,55,0.15)] transition-all"
             >
                <div className="relative z-10">
                   <h4 className="text-sm font-black text-[#F8D37A] italic uppercase tracking-tight">SURVEY & EARN</h4>
                   <p className="text-[8px] text-slate-300 font-bold uppercase tracking-wider">CPX Surveys - High Rewards</p>
                </div>
                <PlayCircle className="absolute -right-2 -bottom-2 w-12 h-12 text-[#D4AF37]/15 group-hover:scale-110 transition-transform" />
             </div>
             <div 
               onClick={() => navigate('/spinner')}
               className="p-5 relative overflow-hidden bg-gradient-to-br from-[#0c247d] to-[#040d2d] rounded-[24px] border border-[#D4AF37]/35 group cursor-pointer shadow-lg hover:shadow-[0_8px_20px_rgba(212,175,55,0.15)] transition-all"
             >
                <div className="relative z-10">
                   <h4 className="text-sm font-black text-[#F8D37A] italic uppercase tracking-tighter">LUCKY SPIN</h4>
                   <p className="text-[8px] text-slate-300 font-bold uppercase">Test your luck</p>
                </div>
                <PlayCircle className="absolute -right-2 -bottom-2 w-12 h-12 text-[#D4AF37]/15 group-hover:scale-110 transition-transform" />
             </div>
          </div>
        </div>

        {/* Shop & Earn Banner */}
        <ShopEarnBanner />

        {/* Trending Section */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-display font-black text-lg uppercase italic text-[#F8D37A] tracking-tight">Hot Tasks</h3>
            <button onClick={() => navigate('/tasks')} className="text-[10px] font-black text-[#F8D37A] uppercase hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="gaming-card p-4 flex flex-col items-center gap-3">
                  <Skeleton className="w-16 h-16 rounded-2xl" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              ))
            ) : tasks.length === 0 ? (
              <div className="col-span-2 text-center text-slate-400 font-bold py-10 uppercase text-xs tracking-widest">No tasks available</div>
            ) : (
              tasks.slice(0, 4).map((task) => (
                <div 
                  key={task.$id} 
                  onClick={() => navigate(`/task/${task.$id}`)}
                  className="gaming-card p-4 flex flex-col items-center text-center gap-3 group hover:border-[#D4AF37]/50 hover:bg-[#0c247d]/40 transition-all cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#06164A] flex items-center justify-center border-2 border-[#D4AF37]/20 shadow-inner group-hover:border-[#D4AF37]/50 overflow-hidden transition-colors">
                    {task.imageUrl ? (
                      <img 
                        src={task.imageUrl} 
                        alt={task.title} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white leading-tight mb-1 line-clamp-1">{task.title}</h4>
                    <p className="text-[9px] text-[#F8D37A] font-bold uppercase tracking-tight">{task.category}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#F8D37A]/10 py-1 px-3 rounded-full border border-[#D4AF37]/35">
                    <CoinIcon size={14} />
                    <span className="text-[10px] font-black text-[#F8D37A]">+{task.reward}</span>
                  </div>
                  <button 
                    className="w-full mt-2 py-2.5 bg-gradient-to-b from-[#F8D37A] to-[#D4AF37] hover:from-[#fff] hover:to-[#F8D37A] rounded-xl text-[10px] font-black text-slate-950 uppercase shadow-md transition-all active:scale-[97%]"
                  >
                    START
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </motion.div>
    </>
  );
};
