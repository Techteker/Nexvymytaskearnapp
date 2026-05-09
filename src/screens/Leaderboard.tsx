import React from 'react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { CoinIcon } from '../components/CoinIcon';
import { Trophy, Crown, Search, TrendingUp, TrendingDown, Minus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/SEO';

const RankIndicator = ({ change }: { change: string }) => {
  if (change === 'up') return <TrendingUp className="w-3 h-3 text-green-500" />;
  if (change === 'down') return <TrendingDown className="w-3 h-3 text-red-500" />;
  return <Minus className="w-3 h-3 text-white/20" />;
};

export const Leaderboard = () => {
  const [filter, setFilter] = React.useState('Weekly');
  const [leaderboardUsers, setLeaderboardUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { user: currentUser } = useAuth();

  React.useEffect(() => {
    const fetchLeaderboard = () => {
      fetch('/api/leaderboard')
        .then(res => res.json())
        .then(data => {
          setLeaderboardUsers(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const top3 = leaderboardUsers.slice(0, 3);
  const others = leaderboardUsers.slice(3);

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-10 h-10 border-4 border-gaming-accent border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <>
      <SEO 
        title="Leaderboard" 
        description="See who the top earners on Nexvy are. Climb the ranks to win exclusive prizes and bonuses!"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-6"
      >
        <TopBar />

        <div className="sticky top-0 z-20 pt-2 pb-4 mesh-gradient">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-black italic tracking-tighter">LEADERBOARD</h2>
              <div className="flex items-center gap-2 bg-blue-900/60 p-1 rounded-xl border border-white/10">
                {['Daily', 'Weekly', 'All Time'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                      filter === f ? 'bg-gaming-accent text-white shadow-lg' : 'text-white/40'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search user..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold placeholder:text-white/20 focus:outline-none focus:border-gaming-accent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Podium */}
        {top3.length > 0 && (
          <div className="flex items-end justify-center gap-2 px-2 mt-8 mb-4 h-48 relative">
            {/* Silver - Rank 2 */}
            {top3[1] && (
              <div className="flex flex-col items-center flex-1 max-w-[100px]">
                <div className="relative mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-slate-400 p-0.5 border-2 border-slate-300">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[1].name}`} alt="" className="w-full h-full rounded-xl object-cover" />
                  </div>
                  <div className="absolute -top-3 bg-slate-400 p-1 rounded-full border-2 border-slate-300 shadow-lg">
                    <span className="text-[8px] font-black">2ND</span>
                  </div>
                </div>
                <div className="w-full h-24 bg-gradient-to-t from-slate-600/40 to-slate-400/20 rounded-t-2xl border-t border-x border-white/10 flex flex-col items-center justify-center p-2 text-center">
                   <span className="text-[10px] font-bold truncate w-full">{top3[1].name}</span>
                   <div className="flex items-center gap-1 mt-1">
                      <CoinIcon size={12} />
                      <span className="text-[10px] font-black">{top3[1].coins.toLocaleString()}</span>
                   </div>
                </div>
              </div>
            )}

            {/* Gold - Rank 1 */}
            <div className="flex flex-col items-center flex-1 max-w-[120px] -translate-y-4">
              <div className="relative mb-2">
                <div className="w-20 h-20 rounded-2xl bg-yellow-400 p-0.5 border-2 border-yellow-200 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[0].name}`} alt="" className="w-full h-full rounded-xl object-cover" />
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <Crown className="w-10 h-10 text-yellow-400 drop-shadow-lg animate-bounce" />
                </div>
              </div>
              <div className="w-full h-32 bg-gradient-to-t from-yellow-600/40 to-yellow-400/20 rounded-t-2xl border-t border-x border-yellow-400/30 flex flex-col items-center justify-center p-2 text-center shadow-[0_0_30px_rgba(251,191,36,0.1)]">
                 <span className="text-xs font-black truncate w-full flex items-center justify-center gap-1">
                   {top3[0].name} <CheckCircle2 className="w-3 h-3 text-blue-400 fill-blue-400/20" />
                 </span>
                 <div className="flex items-center gap-1 mt-2">
                    <CoinIcon size={14} />
                    <span className="text-sm font-black text-white">{top3[0].coins.toLocaleString()}</span>
                 </div>
              </div>
            </div>

            {/* Bronze - Rank 3 */}
            {top3[2] && (
              <div className="flex flex-col items-center flex-1 max-w-[100px]">
                <div className="relative mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-orange-700 p-0.5 border-2 border-orange-500">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[2].name}`} alt="" className="w-full h-full rounded-xl object-cover" />
                  </div>
                  <div className="absolute -top-3 bg-orange-700 p-1 rounded-full border-2 border-orange-500 shadow-lg">
                    <span className="text-[8px] font-black">3RD</span>
                  </div>
                </div>
                <div className="w-full h-20 bg-gradient-to-t from-orange-800/40 to-orange-700/20 rounded-t-2xl border-t border-x border-white/10 flex flex-col items-center justify-center p-2 text-center">
                   <span className="text-[10px] font-bold truncate w-full">{top3[2].name}</span>
                   <div className="flex items-center gap-1 mt-1">
                      <CoinIcon size={12} />
                      <span className="text-[10px] font-black">{top3[2].coins.toLocaleString()}</span>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* List */}
        <div className="flex flex-col gap-3">
          {others.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`gaming-card p-4 flex items-center justify-between border-white/10 ${
                u.id === currentUser?.id ? 'bg-gaming-accent/20 border-gaming-accent/40 ring-1 ring-gaming-accent/20 shadow-xl' : 'bg-blue-900/40'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 flex flex-col items-center gap-1">
                  <span className={`text-[12px] font-black text-white/40`}>#{i + 4}</span>
                  <RankIndicator change="none" />
                </div>
                
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 ${
                    u.id === currentUser?.id ? 'border-gaming-accent' : 'border-white/10'
                  }`}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-blue-950 ${
                    u.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                </div>

                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1">
                    {u.name}
                    {u.id === currentUser?.id && <span className="text-[8px] bg-gaming-accent px-1.5 py-0.5 rounded uppercase">You</span>}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gaming-accent" style={{ width: '60%' }} />
                    </div>
                    <span className="text-[9px] font-bold text-white/40 uppercase">Lv.{u.level}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                  <CoinIcon size={12} />
                  <span className="text-xs font-black text-white">{u.coins.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center py-4">
          <p className="text-[10px] text-white/20 font-black uppercase tracking-tighter">Showing Top 100 Global Producers</p>
        </div>

      </motion.div>
    </>
  );
};
