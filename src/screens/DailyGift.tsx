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
import { triggerHaptic } from '../lib/haptics';

const DAYS = [
  { day: 1, reward: 100, status: 'claimed' },
  { day: 2, reward: 200, status: 'claimed' },
  { day: 3, reward: 300, status: 'next' },
  { day: 4, reward: 400, status: 'locked' },
  { day: 5, reward: 500, status: 'locked' },
  { day: 6, reward: 600, status: 'locked' },
];

export const DailyGift = () => {
  const { refreshUser } = useAuth();
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
    if (!status.isClaimable) {
      triggerHaptic('warning');
      return showToast(`Next claim in ${timeLeft}`, 'error');
    }
    triggerHaptic('heavy');
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
      triggerHaptic('success');
      showToast(`Claimed ${data.reward} coins!`, 'success');
      await refreshUser();
      await fetchStatus();
    } catch (err: any) {
      triggerHaptic('error');
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
        <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent" />
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#F8D37A]/60">Daily Check-in</h2>
        <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div 
            key={item.day}
            className={`p-2 flex flex-col items-center gap-2 relative transition-all min-h-[110px] justify-center rounded-[24px] border ${
              item.status === 'claimed' ? 'bg-[#040d2d]/50 border-[#D4AF37]/10 opacity-70' : 
              item.status === 'next' ? 'bg-[#D4AF37]/15 border-[#D4AF37] border-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] scale-105' :
              'bg-[#0a1f6b]/50 border-[#D4AF37]/15'
            }`}
          >
             <p className={`text-[9px] font-black uppercase px-3 py-1 rounded-full leading-none ${
               item.status === 'claimed' ? 'text-slate-400 bg-[#040d2d]/70' :
               item.status === 'next' ? 'text-slate-950 bg-gradient-to-r from-[#F8D37A] to-[#D4AF37]' :
               'text-[#F8D37A]/75 bg-[#040d2d]/60 border border-[#D4AF37]/10'
             }`}>Day {item.day}</p>
            <div className="relative p-1">
              <CoinIcon size={24} className={item.status !== 'claimed' ? 'animate-pulse' : ''} />
              {item.status === 'claimed' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-emerald-500 rounded-full p-0.5 border-2 border-white shadow-lg">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
            <p className={`font-display font-black text-xs ${item.status === 'claimed' ? 'text-slate-500' : 'text-white'}`}>+{item.reward}</p>
          </div>
        ))}
      </div>

      {/* Big Day 7 Reward */}
      <div className={`p-6 rounded-[32px] flex items-center justify-between group cursor-pointer shadow-xl transition-all hover:scale-[1.02] border ${
        status.streak >= 7 ? 'bg-[#0a1f6b]/30 border-[#D4AF37]/10 grayscale opacity-60' : 'bg-gradient-to-r from-[#0c247d] via-[#1239b3] to-[#040d2d] border-[#D4AF37]/45'
      }`}>
        <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-slate-300 mb-1">Final Grand Prize</span>
            <h3 className="text-2xl font-display font-black text-[#F8D37A]">Day 7 Bonus</h3>
        </div>
        <div className="flex items-center gap-4">
             <div className="relative">
                <CoinIcon size={56} className="drop-shadow-2xl animate-bounce" />
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-[9px] px-2.5 py-0.5 rounded-full font-black text-white shadow-lg">+1000</div>
             </div>
        </div>
      </div>

      <button
        onClick={claim}
        disabled={!status.isClaimable || loading}
        className={`w-full py-5 rounded-3xl font-display font-black text-xl transition-all leading-none uppercase tracking-widest cursor-pointer ${
          status.isClaimable 
            ? 'gaming-button-yellow shadow-xl' 
            : 'bg-[#0a1f6b]/40 text-slate-400 cursor-not-allowed border border-[#D4AF37]/20 shadow-none'
        }`}
      >
        {status.isClaimable ? "Claim Today's Gift" : `Next in ${timeLeft}`}
      </button>

      <div className="text-center">
        {status.isClaimable ? (
          <p className="text-xs text-green-400 font-extrabold uppercase flex items-center justify-center gap-2">
            <Gift className="w-3 h-3 text-[#D4AF37] animate-pulse" /> Gift Ready to Claim!
          </p>
        ) : (
          <p className="text-xs text-slate-300 font-extrabold uppercase leading-none">Next Reset in <span className="text-[#F8D37A] font-black">{timeLeft}</span></p>
        )}
      </div>
    </motion.div>
    </>
  );
};
