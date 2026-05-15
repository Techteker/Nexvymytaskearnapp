import React from 'react';
import { motion } from 'motion/react';
import { CoinIcon } from '../components/CoinIcon';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Trophy, Gift, Target, PlayCircle, Gamepad2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { SEO } from '../components/SEO';
import { Skeleton } from '../components/Skeleton';
import { EARNING_CONFIG } from '../constants';
import { ShopEarnBanner } from '../components/ShopEarnBanner';

const StatCard = ({ icon: Icon, label, value, color, secondaryValue }: any) => (
  <div className="gaming-card p-4 flex flex-col gap-2 shadow-sm border border-slate-100">
    <div className={`p-2 rounded-xl w-fit ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-[10px] text-slate-400 font-semibold uppercase">{label}</p>
      <div className="flex flex-col">
        <p className="text-lg font-display font-bold text-slate-900 leading-tight">{value}</p>
        {secondaryValue && (
          <p className="text-[10px] text-slate-500 font-black">{secondaryValue}</p>
        )}
      </div>
    </div>
  </div>
);

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiService.getTasks().then(res => {
      setTasks(res);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SEO 
        title="Dashboard" 
        description="Check your earnings, rank, and complete hot tasks on Nexvy. Start earning coins today!"
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
            <h3 className="font-display font-black text-lg uppercase italic text-brand-purple tracking-tight">Game Center</h3>
            <Gamepad2 className="w-4 h-4 text-slate-200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div 
               onClick={() => navigate('/quizzes')}
               className="p-4 relative overflow-hidden bg-gradient-to-br from-brand-purple to-violet-900 rounded-[24px] group cursor-pointer shadow-lg"
             >
                <div className="relative z-10">
                   <h4 className="text-sm font-black text-white italic uppercase">BRAIN QUIZ</h4>
                   <p className="text-[8px] text-white/60 font-bold uppercase">Earn by knowledge</p>
                </div>
                <PlayCircle className="absolute -right-2 -bottom-2 w-12 h-12 text-white/10 group-hover:scale-110 transition-transform" />
             </div>
             <div 
               onClick={() => navigate('/spinner')}
               className="p-4 relative overflow-hidden bg-gradient-to-br from-brand-purple to-indigo-800 rounded-[24px] group cursor-pointer shadow-lg"
             >
                <div className="relative z-10">
                   <h4 className="text-sm font-black text-white italic uppercase tracking-tighter">LUCKY SPIN</h4>
                   <p className="text-[8px] text-white/60 font-bold uppercase">Test your luck</p>
                </div>
                <PlayCircle className="absolute -right-2 -bottom-2 w-12 h-12 text-white/10 group-hover:scale-110 transition-transform" />
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
              <div className="col-span-2 text-center text-slate-300 font-bold py-10 uppercase text-xs tracking-widest">No tasks available</div>
            ) : (
              tasks.slice(0, 4).map((task) => (
                <div 
                  key={task.$id} 
                  onClick={() => navigate(`/task/${task.$id}`)}
                  className="gaming-card p-4 flex flex-col items-center text-center gap-3 group hover:bg-slate-50 transition-all cursor-pointer border border-slate-100"
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-purple/5 flex items-center justify-center border-2 border-brand-purple/10 shadow-inner group-hover:border-brand-purple/30 transition-colors">
                    <TrendingUp className="w-8 h-8 text-brand-purple" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight mb-1 line-clamp-1">{task.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{task.category}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-brand-purple/5 py-1 px-3 rounded-full border border-brand-purple/10">
                    <CoinIcon size={14} />
                    <span className="text-[10px] font-black text-brand-purple">+{task.reward}</span>
                  </div>
                  <button 
                    className="w-full mt-2 py-2 bg-brand-purple/10 border border-brand-purple/30 rounded-xl text-[10px] font-black text-brand-purple uppercase hover:bg-brand-purple hover:text-white transition-all shadow-lg"
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
