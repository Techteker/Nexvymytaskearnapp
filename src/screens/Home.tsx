import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CoinIcon } from '../components/CoinIcon';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Trophy, Gift, Target, PlayCircle, Gamepad2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRealtime } from '../context/RealtimeContext';
import { apiService } from '../services/api';
import { SEO } from '../components/SEO';
import { Skeleton } from '../components/Skeleton';
import { EARNING_CONFIG } from '../constants';
import { ShopEarnBanner } from '../components/ShopEarnBanner';
import { AdBanner } from '../components/AdBanner';


const LIVE_ACTIVITIES = [
  { name: 'Saurabh_99', action: 'Google Search Task', reward: '+150 Coins' },
  { name: 'Rohan_Playz', action: 'won Lucky Spin Jackpot', reward: '+5,000 Coins' },
  { name: 'Anjali_Sharma', action: 'Game Install Quest', reward: '+1,200 Coins' },
  { name: 'Preeti_Gaming', action: 'Daily checkin streak', reward: '+50 Coins' },
  { name: 'Raju_Kumar', action: 'UPI reward withdrawal', reward: '$10.00' },
  { name: 'Vikram_Gamer', action: 'answered History Quiz', reward: '+250 Coins' },
  { name: 'Sneha_10', action: 'Survey feedback Task', reward: '+400 Coins' },
  { name: 'Kabir_Singh', action: 'referred friend Amit_9', reward: '+500 Coins' },
  { name: 'Tanvi_K', action: 'won big in Lucky Spin', reward: '+15,000 Coins' },
  { name: 'Sumit_Roy', action: 'Paytm reward payout', reward: '$5.00' },
];

const StatCard = ({ icon: Icon, label, value, color, secondaryValue }: any) => (
  <div className="bg-white/90 backdrop-blur-md border border-slate-100/80 shadow-[0_4px_24px_-4px_rgba(109,40,217,0.03),0_1px_2px_rgba(109,40,217,0.01)] hover:shadow-[0_12px_32px_rgba(109,40,217,0.08)] rounded-[24px] p-4 flex flex-col justify-between gap-2.5 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 relative group overflow-hidden">
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-brand-purple/5 to-transparent rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
    <div className="flex items-center justify-between">
      <div className={`p-2 rounded-xl w-fit ${color} text-white shadow-sm transform group-hover:-translate-y-0.5 transition-transform duration-300`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
    </div>
    <div className="mt-1">
      <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mb-1.5">{label}</p>
      <div className="flex flex-col gap-0.5">
        <p className="text-xl md:text-2xl font-display font-black text-slate-900 tracking-tight leading-none">{value}</p>
        {secondaryValue && (
          <p className="text-[10px] text-emerald-600 font-bold tracking-tight">{secondaryValue}</p>
        )}
      </div>
    </div>
  </div>
);

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lastUpdate } = useRealtime();
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activityIndex, setActivityIndex] = React.useState(0);

  React.useEffect(() => {
    apiService.getTasks().then(res => {
      setTasks(res);
      setLoading(false);
    });
  }, [lastUpdate]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % LIVE_ACTIVITIES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

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
        {/* Stats Dashboard */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard 
            icon={TrendingUp} 
            label="Balance" 
            value={(user?.coins || 0).toLocaleString()} 
            secondaryValue={`($${((user?.coins || 0) / EARNING_CONFIG.COINS_PER_USD).toFixed(2)})`}
            color="bg-green-500" 
          />
          <StatCard 
            icon={Trophy} 
            label="Level" 
            value={user?.level || 1} 
            color="bg-blue-500" 
          />
          <StatCard 
            icon={Target} 
            label="Tasks" 
            value={tasks.length} 
            color="bg-purple-500" 
          />
        </div>

        {/* Real-time Automated User Activity Live Feed */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-[0_2px_16px_rgba(109,40,217,0.02)] flex items-center justify-between gap-4 px-4 py-3 rounded-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 shrink-0 border-r border-slate-100 pr-3.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-extrabold tracking-widest text-emerald-600 uppercase">LIVE REPORT</span>
          </div>

          <div className="flex-1 h-6 overflow-hidden relative flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activityIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 right-0 flex items-center justify-between text-xs w-full"
              >
                <div className="flex items-center gap-1.5 truncate max-w-[75%]">
                  <span className="font-black text-slate-800 hover:text-brand-purple transition-colors cursor-pointer">{LIVE_ACTIVITIES[activityIndex].name}</span>
                  <span className="text-slate-400 text-[10.5px] font-medium leading-none">{LIVE_ACTIVITIES[activityIndex].action}</span>
                </div>
                <div className="bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-lg py-0.5 px-2.5 text-[9.5px] font-black tracking-tight whitespace-nowrap">
                  {LIVE_ACTIVITIES[activityIndex].reward}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Small 320x50 Adsterra Banner Ad */}
        <AdBanner type="small" />

        {/* Banner */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-indigo-950 via-brand-purple to-purple-900 rounded-[32px] relative overflow-hidden group shadow-2xl transition-all duration-300 border border-white/10 hover:shadow-[0_20px_50px_rgba(109,40,217,0.25)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
          <div className="relative z-10 max-w-[70%]">
             <div className="flex items-center gap-2 mb-2 bg-white/10 w-fit px-2.5 py-1 rounded-full border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
                <span className="text-[9px] font-black text-yellow-200 uppercase tracking-widest">Featured Jackpot</span>
             </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-2 italic tracking-tighter leading-none">COIN KING</h2>
            <p className="text-xs md:text-sm text-indigo-100 mb-6 font-bold leading-snug">SPIN THE WHEEL & WIN UP TO <span className="text-yellow-300 font-black underline">50,000 COINS</span> INSTANTLY!</p>
            <button className="gaming-button-yellow px-8 py-3.5 text-xs font-black uppercase tracking-wider" onClick={() => navigate('/spinner')}>
              PLAY LUCKY SPIN
            </button>
          </div>
          <div className="absolute right-[-15px] bottom-[-15px] md:right-0 md:bottom-0 opacity-40 md:opacity-80 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 pointer-events-none">
            <CoinIcon size={180} />
          </div>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-5">
          <button 
            onClick={() => navigate('/daily-gift')}
            className="p-5 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-[28px] flex flex-col items-center gap-2.5 hover:scale-[1.05] active:scale-95 transition-all shadow-[0_8px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_12px_24px_rgba(245,158,11,0.3)] border border-amber-300/20 group text-white"
          >
            <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform duration-300 shadow-sm border border-white/10">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-none">Daily Gift</span>
          </button>
          
          <button 
            onClick={() => navigate('/referral')}
            className="p-5 bg-gradient-to-br from-violet-600 via-brand-purple to-purple-800 rounded-[28px] flex flex-col items-center gap-2.5 hover:scale-[1.05] active:scale-95 transition-all shadow-[0_8px_20px_rgba(109,40,217,0.2)] hover:shadow-[0_12px_24px_rgba(109,40,217,0.3)] border border-violet-500/20 group text-white"
          >
            <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform duration-300 shadow-sm border border-white/10">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-none font-sans">Invite (+500)</span>
          </button>
          
          <button 
            onClick={() => navigate('/leaderboard')}
            className="p-5 bg-gradient-to-br from-indigo-500 via-purple-650 to-indigo-800 rounded-[28px] flex flex-col items-center gap-2.5 hover:scale-[1.05] active:scale-95 transition-all shadow-[0_8px_20px_rgba(99,102,241,0.2)] hover:shadow-[0_12px_24px_rgba(99,102,241,0.3)] border border-indigo-500/20 group text-white"
          >
            <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform duration-300 shadow-sm border border-white/10">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-none">Rankings</span>
          </button>
        </div>

        {/* Games Showcase */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <h3 className="font-display font-black text-xl uppercase italic text-indigo-950 tracking-tight leading-none">Earni-Games Center</h3>
              <p className="text-[9px] text-slate-400 font-extrabold uppercase mt-1 tracking-wider">Premium microtasks & polls</p>
            </div>
            <div className="p-2 bg-indigo-50 rounded-xl text-brand-purple">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
             <div 
               onClick={() => navigate('/survey')}
               className="p-5 relative overflow-hidden bg-gradient-to-br from-indigo-900 to-brand-purple rounded-[28px] group cursor-pointer shadow-xl border border-white/5 hover:translate-y-[-4px] transition-all"
             >
                <div className="relative z-10">
                   <span className="bg-emerald-500/20 text-emerald-300 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block border border-emerald-400/20">
                     Highest rewards
                   </span>
                   <h4 className="text-base font-black text-white italic uppercase tracking-tight">SURVEY & EARN</h4>
                   <p className="text-[9px] text-indigo-200 mt-1 font-bold uppercase tracking-wider">CPX survey panel router</p>
                </div>
                <PlayCircle className="absolute -right-3 -bottom-3 w-16 h-16 text-white/5 group-hover:scale-125 group-hover:rotate-12 group-hover:text-white/10 transition-all duration-300" />
             </div>
             
             <div 
               onClick={() => navigate('/spinner')}
               className="p-5 relative overflow-hidden bg-gradient-to-br from-indigo-950 to-slate-900 rounded-[28px] group cursor-pointer shadow-xl border border-white/5 hover:translate-y-[-4px] transition-all"
             >
                <div className="relative z-10">
                   <span className="bg-amber-500/20 text-yellow-300 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block border border-amber-400/20">
                     Jackpots
                   </span>
                   <h4 className="text-base font-black text-white italic uppercase tracking-tight">LUCKY SPIN WHEEL</h4>
                   <p className="text-[9px] text-indigo-200 mt-1 font-bold uppercase">Spin continuously</p>
                </div>
                <PlayCircle className="absolute -right-3 -bottom-3 w-16 h-16 text-white/5 group-hover:scale-125 group-hover:rotate-12 group-hover:text-white/10 transition-all duration-300" />
             </div>
          </div>
        </div>

        {/* Shop & Earn Banner */}
        <ShopEarnBanner />

        {/* Trending Section */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-display font-black text-lg uppercase italic text-brand-purple tracking-tight">Hot Tasks</h3>
            <button onClick={() => navigate('/tasks')} className="text-[10px] font-black text-brand-purple uppercase hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
              <div className="col-span-2 lg:col-span-4 text-center text-slate-300 font-bold py-10 uppercase text-xs tracking-widest">No tasks available</div>
            ) : (
              tasks.slice(0, 4).map((task) => (
                <div 
                  key={task.$id} 
                  onClick={() => navigate(`/task/${task.$id}`)}
                  className="bg-white/95 border border-slate-100 shadow-[0_4px_20px_rgba(109,40,217,0.01)] hover:shadow-[0_12px_36px_rgba(109,40,217,0.06)] rounded-[24px] p-4 flex flex-col items-center text-center gap-3 group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100/80 shadow-inner group-hover:border-brand-purple/20 overflow-hidden transition-all duration-350">
                    {task.imageUrl ? (
                      <img 
                        src={task.imageUrl} 
                        alt={task.title} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <TrendingUp className="w-6 h-6 text-brand-purple" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-[11.5px] font-black text-slate-800 leading-tight mb-1 line-clamp-1">{task.title}</h4>
                    <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">{task.category}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-brand-purple/5 py-1 px-3 rounded-full border border-brand-purple/10">
                    <CoinIcon size={12} />
                    <span className="text-[10.5px] font-black text-brand-purple">+{task.reward}</span>
                  </div>
                  <button 
                    className="w-full mt-1.5 py-2 bg-gradient-to-r from-brand-purple to-purple-600 rounded-xl text-[10px] font-black text-white uppercase tracking-wider shadow-[0_4px_12px_rgba(109,40,217,0.15)] group-hover:shadow-[0_6px_16px_rgba(109,40,217,0.25)] transition-all duration-300 transform group-hover:scale-[1.02]"
                  >
                    START
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Large 300x250 Adsterra Promotional Banner Ad */}
        <AdBanner type="large" />

      </motion.div>
    </>
  );
};
