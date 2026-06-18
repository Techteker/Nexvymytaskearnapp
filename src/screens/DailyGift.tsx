import React from 'react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { CoinIcon } from '../components/CoinIcon';
import { Gift, Lock, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/api';
import { SEO } from '../components/SEO';

const DAYS = [
  { day: 1, reward: 100, status: 'claimed' },
  { day: 2, reward: 200, status: 'claimed' },
  { day: 3, reward: 300, status: 'next' },
  { day: 4, reward: 400, status: 'locked' },
  { day: 5, reward: 500, status: 'locked' },
  { day: 6, reward: 600, status: 'locked' },
];

export const DailyGift = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState({
    streak: 0,
    isClaimable: false,
    lastClaim: null,
    nextClaimAt: Date.now()
  });
  const [timeLeft, setTimeLeft] = React.useState<string>('00:00:00');

  const fetchStatus = async () => {
    try {
      const data = await apiService.getDailyGiftStatus();
      setStatus(data as any);
    } catch (e) {}
  };

  React.useEffect(() => {
    fetchStatus();
  }, []);

  React.useEffect(() => {
    if (!status.isClaimable && status.nextClaimAt) {
      const interval = setInterval(() => {
        const now = Date.now();
        const diff = (status.nextClaimAt as any) - now;
        
        if (diff <= 0) {
          clearInterval(interval);
          setTimeLeft('00:00:00');
          setStatus(prev => ({ ...prev, isClaimable: true }));
          return;
        }

        const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
        setTimeLeft(`${h}:${m}:${s}`);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeLeft('00:00:00');
    }
  }, [status.nextClaimAt, status.isClaimable]);

  const claim = async () => {
    if (!status.isClaimable) return showToast(`Next claim in ${timeLeft}`, 'error');
    setLoading(true);
    try {
      const data = await apiService.claimDailyGift();
      if (data.error) throw new Error(data.error);

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#ffffff']
      });
      showToast(`Claimed ${data.reward} coins!`, 'success');
      await apiService.createNotification(
        'Daily Gift Claimed! 🎁',
        `Fantastic! You logged in and claimed your daily streak reward of ${data.reward} coins. Keep your current streak going!`,
        user?.uid || user?.$id
      );
      await refreshUser();
      await fetchStatus();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const REWARDS = [100, 200, 300, 400, 500, 600];
  const items = REWARDS.map((reward, i) => {
    const dayNum = i + 1;
    let itemStatus = 'locked';
    if (dayNum <= status.streak) itemStatus = 'claimed';
    else if (dayNum === status.streak + 1 && status.isClaimable) itemStatus = 'next';
    return { day: dayNum, reward, status: itemStatus };
  });

  return (
    <>
      <SEO 
        title="Daily Check-In & Free Reward Coins: Lucky Claim - Nexvy" 
        description="Claim your free daily gift and check-in rewards on Nexvy. Maintain your login streak to earn high value multipliers and withdraw instant cash."
        keywords="daily gift rewards, check in earn money, daily check in coins, free spin bonus, claims streak nexvy, lucky daily bonus app, make money india"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-brand-purple/10 to-transparent" />
        <h2 className="text-sm font-black uppercase tracking-widest text-brand-purple/40">Daily Check-in</h2>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-brand-purple/10 to-transparent" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div 
            key={item.day}
            className={`p-2 flex flex-col items-center gap-2 relative transition-all min-h-[100px] justify-center rounded-[24px] border ${
              item.status === 'claimed' ? 'bg-slate-50 border-slate-100 opacity-60' : 
              item.status === 'next' ? 'bg-brand-purple/10 border-brand-purple border-2 shadow-[0_0_20px_rgba(124,58,237,0.1)]' :
              'bg-white border-slate-100'
            }`}
          >
             <p className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
               item.status === 'claimed' ? 'text-slate-400 bg-slate-100' :
               item.status === 'next' ? 'text-brand-purple bg-brand-purple/10' :
               'text-slate-400 bg-slate-50'
             }`}>Day {item.day}</p>
            <div className="relative p-1">
              <CoinIcon size={24} />
              {item.status === 'claimed' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-green-500 rounded-full p-0.5 border-2 border-white shadow-lg">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
            <p className={`font-display font-black text-xs ${item.status === 'claimed' ? 'text-slate-400' : 'text-slate-900'}`}>+{item.reward}</p>
          </div>
        ))}
      </div>

      {/* Big Day 7 Reward */}
      <div className={`p-6 rounded-[32px] flex items-center justify-between group cursor-pointer shadow-xl transition-all hover:scale-[1.02] ${
        status.streak >= 7 ? 'bg-slate-100 grayscale opacity-60' : 'bg-gradient-to-r from-brand-purple to-violet-800'
      }`}>
        <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-white/50 mb-1">Final Prize</span>
            <h3 className="text-2xl font-display font-black text-white">Day 7</h3>
        </div>
        <div className="flex items-center gap-4">
             <div className="relative">
                <CoinIcon size={56} className="drop-shadow-2xl" />
                <div className="absolute -top-1 -right-1 bg-orange-500 text-[10px] px-2 py-0.5 rounded-full font-black animate-bounce text-white shadow-lg">+1000</div>
             </div>
        </div>
      </div>

      <button
        onClick={claim}
        disabled={!status.isClaimable || loading}
        className={`w-full py-5 rounded-3xl font-display font-black text-xl shadow-[0_10px_25px_rgba(124,58,237,0.3)] transition-all active:scale-95 uppercase tracking-widest ${
          status.isClaimable 
            ? 'bg-brand-purple hover:bg-brand-purple/90 text-white' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
        }`}
      >
        {status.isClaimable ? "Claim Today's Gift" : `Next in ${timeLeft}`}
      </button>

      <div className="text-center">
        {status.isClaimable ? (
          <p className="text-xs text-green-500 font-black uppercase flex items-center justify-center gap-2">
            <Gift className="w-3 h-3" /> Gift Available Now!
          </p>
        ) : (
          <p className="text-xs text-slate-400 font-bold uppercase">Next reset in <span className="text-brand-purple font-black">{timeLeft}</span></p>
        )}
      </div>
    </motion.div>
    </>
  );
};
