import React from 'react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { CoinIcon } from '../components/CoinIcon';
import { Trophy, Crown, Search, TrendingUp, TrendingDown, Minus, CheckCircle2, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/SEO';
import { apiService } from '../services/api';
import { EARNING_CONFIG } from '../constants';
import { AdBanner } from '../components/AdBanner';


const TharChallengeCountdown = () => {
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Next month 1st date
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const difference = nextMonth.getTime() - now.getTime();

      let d = Math.floor(difference / (1000 * 60 * 60 * 24));
      let h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      let m = Math.floor((difference / 1000 / 60) % 60);
      let s = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0A1F6B]/95 rounded-[28px] border-2 border-[#D4AF37] p-5 shadow-[0_12px_28px_rgba(6,22,74,0.35)] relative overflow-hidden text-white flex flex-col gap-4 border-b-4">
      {/* Background radial gold glow */}
      <div className="absolute top-[-30%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#D4AF37] opacity-15 blur-[45px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#1239B3] opacity-40 blur-[30px] pointer-events-none" />

      {/* Header section with shiny gold medal */}
      <div className="flex items-center gap-2.5 z-10 border-b border-white/10 pb-3">
        <div className="p-1.5 rounded-xl bg-gradient-to-br from-[#F8D37A] to-[#B8860B] text-[#0A1F6B] shadow-md animate-pulse">
          <Trophy className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-[14px] font-display font-black uppercase tracking-tight text-[#F8D37A]">
            🚀 Nexvy Monthly Thar Challenge
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-white/60" />
            <span className="text-[9.5px] font-mono font-bold tracking-wide text-white/80 uppercase">
              📅 Next reset date: 1st of every month
            </span>
          </div>
        </div>
      </div>

      {/* Ultra Real-Time Styled Countdown */}
      <div className="flex flex-col gap-1 z-10">
        <span className="text-[9px] font-mono tracking-widest text-[#F8D37A]/80 font-black uppercase">
          ⏳ Time Left:
        </span>
        <div className="grid grid-cols-4 gap-2">
          {/* Days */}
          <div className="bg-[#06164A] rounded-xl py-2 flex flex-col items-center justify-center border border-white/5 shadow-inner">
            <span className="text-xl font-display font-black leading-none bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[7.5px] font-mono tracking-widest text-white/50 font-black uppercase mt-1">Days</span>
          </div>
          {/* Hours */}
          <div className="bg-[#06164A] rounded-xl py-2 flex flex-col items-center justify-center border border-white/5 shadow-inner">
            <span className="text-xl font-display font-black leading-none bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[7.5px] font-mono tracking-widest text-white/50 font-black uppercase mt-1">Hours</span>
          </div>
          {/* Minutes */}
          <div className="bg-[#06164A] rounded-xl py-2 flex flex-col items-center justify-center border border-white/5 shadow-inner">
            <span className="text-xl font-display font-black leading-none bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[7.5px] font-mono tracking-widest text-white/50 font-black uppercase mt-1">Mins</span>
          </div>
          {/* Seconds */}
          <div className="bg-[#06164A] rounded-xl py-2 flex flex-col items-center justify-center border border-white/5 shadow-inner">
            <span className="text-xl font-display font-black leading-none text-[#F8D37A]">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[7.5px] font-mono tracking-widest text-[#F8D37A]/70 font-black uppercase mt-1">Secs</span>
          </div>
        </div>
      </div>

      {/* Embedded High Definition YouTube Video Player with elegant border layout */}
      <div className="flex flex-col gap-1.5 z-10">
        <span className="text-[9px] font-mono tracking-widest text-[#F8D37A]/80 font-black uppercase">
          🎬 Watch promotional Thar reveal & guide:
        </span>
        <div className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#D4AF37]/55 shadow-lg bg-black relative">
          <iframe 
            src="https://www.youtube.com/embed/MiQ32J1KKuw?controls=1&modestbranding=1" 
            title="Nexvy Thar Challenge Promotional Video" 
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
        </div>
      </div>

      {/* Actionable Rules / Benefits Info lists */}
      <div className="flex flex-col gap-2 z-10 bg-black/20 p-3 rounded-xl border border-white/5">
        <div className="flex items-start gap-2">
          <span className="text-amber-400 font-bold shrink-0">🔥</span>
          <p className="text-[10.5px] text-white/95 leading-tight">
            <span className="font-bold text-white">Complete tasks daily</span> & climb the official leaderboard
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-amber-400 font-bold shrink-0">🏆</span>
          <p className="text-[10.5px] text-white/95 leading-tight">
            <span className="font-bold text-[#F8D37A]">Win exciting rewards</span> including brand new Mahindra THAR!
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-amber-400 font-bold shrink-0">⚡</span>
          <p className="text-[10.5px] text-[#F8D37A] leading-tight font-black uppercase tracking-wide">
            Stay active on Nexvy and don't miss the challenge start!
          </p>
        </div>
      </div>

    </div>
  );
};

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
    const fetchLeaderboard = async () => {
      try {
        const data = await apiService.getLeaderboard();
        setLeaderboardUsers(data as any);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
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
        title="Top Online Earners & Leaderboard - Nexvy" 
        description="See the top earners rank list on Nexvy. Compete against daily and weekly high scores to secure your spot, gain bonus multipliers, and win massive prizes."
        keywords="top earners app, online earning rankings, leaderboard earning, nexvy rank list, earn money india tracker, payout proof leader, highest earning users"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-6"
      >
        <div className="sticky top-0 z-20 pt-2 pb-4 bg-gradient-to-b from-[#f8fafc] via-[#f8fafc]/95 to-[#f8fafc]/90">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-black italic tracking-tighter text-brand-purple uppercase">LEADERBOARD</h2>
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                {['Daily', 'Weekly', 'All Time'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                      filter === f ? 'bg-brand-purple text-white shadow-md' : 'text-slate-400'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search user..."
                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:border-brand-purple transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Small 320x50 Adsterra Banner Ad */}
        <AdBanner type="small" />

        {/* Podium */}
        {top3.length > 0 && (
          <div className="flex items-end justify-center gap-2 px-2 mt-8 mb-4 h-48 relative">
            {/* Silver - Rank 2 */}
            {top3[1] && (
              <div className="flex flex-col items-center flex-1 max-w-[100px]">
                <div className="relative mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 p-0.5 border-2 border-slate-300 shadow-lg">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[1].username}`} alt="" className="w-full h-full rounded-xl object-cover" />
                  </div>
                  <div className="absolute -top-3 bg-slate-400 p-1 rounded-full border-2 border-slate-300 shadow-lg">
                    <span className="text-[8px] font-black text-white">2ND</span>
                  </div>
                </div>
                <div className="w-full h-24 bg-white rounded-t-2xl border-t border-x border-slate-100 flex flex-col items-center justify-center p-2 text-center shadow-md">
                   <span className="text-[10px] font-black truncate w-full text-slate-800">{top3[1].username}</span>
                   <div className="flex items-center gap-1 mt-1">
                      <CoinIcon size={12} />
                      <span className="text-[10px] font-black text-slate-900">{top3[1].coins.toLocaleString()}</span>
                   </div>
                   <span className="text-[8px] text-slate-400 font-bold mt-0.5 tracking-tighter uppercase whitespace-nowrap">(${((top3[1].coins || 0) / EARNING_CONFIG.COINS_PER_USD).toFixed(2)})</span>
                </div>
              </div>
            )}

            {/* Gold - Rank 1 */}
            <div className="flex flex-col items-center flex-1 max-w-[120px] -translate-y-4">
              <div className="relative mb-2">
                <div className="w-20 h-20 rounded-2xl bg-yellow-400 p-0.5 border-2 border-yellow-200 shadow-2xl">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[0].username}`} alt="" className="w-full h-full rounded-xl object-cover" />
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <Crown className="w-10 h-10 text-yellow-400 drop-shadow-lg animate-bounce" />
                </div>
              </div>
              <div className="w-full h-32 bg-white rounded-t-2xl border-t border-x border-brand-purple/20 flex flex-col items-center justify-center p-2 text-center shadow-xl">
                 <span className="text-xs font-black truncate w-full flex items-center justify-center gap-1 text-slate-800">
                   {top3[0].username} <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500/10" />
                 </span>
                 <div className="flex items-center gap-1 mt-2">
                    <CoinIcon size={14} />
                    <span className="text-sm font-black text-slate-900">{top3[0].coins.toLocaleString()}</span>
                 </div>
                 <span className="text-[9px] text-brand-purple font-black mt-0.5 tracking-tighter uppercase">(${( (top3[0].coins || 0) / EARNING_CONFIG.COINS_PER_USD).toFixed(2)})</span>
              </div>
            </div>

            {/* Bronze - Rank 3 */}
            {top3[2] && (
              <div className="flex flex-col items-center flex-1 max-w-[100px]">
                <div className="relative mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 p-0.5 border-2 border-orange-300 shadow-lg">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${top3[2].username}`} alt="" className="w-full h-full rounded-xl object-cover" />
                  </div>
                  <div className="absolute -top-3 bg-orange-700 p-1 rounded-full border-2 border-orange-500 shadow-lg">
                    <span className="text-[8px] font-black text-white">3RD</span>
                  </div>
                </div>
                <div className="w-full h-20 bg-white rounded-t-2xl border-t border-x border-slate-100 flex flex-col items-center justify-center p-2 text-center shadow-md">
                   <span className="text-[10px] font-black truncate w-full text-slate-800">{top3[2].username}</span>
                   <div className="flex items-center gap-1 mt-1">
                      <CoinIcon size={12} />
                      <span className="text-[10px] font-black text-slate-900">{top3[2].coins.toLocaleString()}</span>
                   </div>
                   <span className="text-[8px] text-slate-400 font-bold mt-0.5 tracking-tighter uppercase whitespace-nowrap">(${((top3[2].coins || 0) / EARNING_CONFIG.COINS_PER_USD).toFixed(2)})</span>
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
              className={`p-4 flex items-center justify-between border rounded-[24px] shadow-sm transition-all ${
                u.id === currentUser?.id 
                ? 'bg-brand-purple/5 border-brand-purple ring-1 ring-brand-purple/20' 
                : 'bg-white border-slate-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 flex flex-col items-center gap-1">
                  <span className={`text-[12px] font-black text-slate-300`}>#{i + 4}</span>
                  <RankIndicator change="none" />
                </div>
                
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                    u.id === currentUser?.id ? 'border-brand-purple shadow-md' : 'border-slate-100'
                  }`}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    u.status === 'online' ? 'bg-green-500' : 'bg-slate-300'
                  }`} />
                </div>

                <div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1">
                    {u.username}
                    {u.id === currentUser?.id && <span className="text-[7px] font-black bg-brand-purple text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">You</span>}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-purple" style={{ width: '60%' }} />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Lv.{u.level || 1}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                  <CoinIcon size={12} />
                  <span className="text-xs font-black text-slate-900">{u.coins.toLocaleString()}</span>
                </div>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter whitespace-nowrap">≈ ${((u.coins || 0) / EARNING_CONFIG.COINS_PER_USD).toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Nexvy Monthly Thar Challenge Countdown */}
        <div className="mt-4">
          <TharChallengeCountdown />
        </div>

        {/* Large 300x250 Adsterra Promotional Banner Ad */}
        <div className="mt-2">
          <AdBanner type="large" />
        </div>
        
        <div className="text-center py-4">
          <p className="text-[10px] text-slate-300 font-black uppercase tracking-tighter">Showing Top 100 Global Producers</p>
        </div>

      </motion.div>
    </>
  );
};
