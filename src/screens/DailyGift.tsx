import React from 'react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { CoinIcon } from '../components/CoinIcon';
import { Gift, Lock, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

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
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState({
    streak: 0,
    isClaimable: false,
    lastClaim: null
  });

  React.useEffect(() => {
    fetch('/api/user/daily-gift/status', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(setStatus);
  }, []);

  const claim = async () => {
    if (!status.isClaimable) return alert('You already claimed today!');
    setLoading(true);
    try {
      const res = await fetch('/api/user/daily-gift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Claim failed');

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#ffffff']
      });
      alert(`Claimed ${data.reward} coins!`);
      await refreshUser();
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <TopBar />

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <h2 className="text-sm font-black uppercase tracking-widest text-white/60">Daily Check-in</h2>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div 
            key={item.day}
            className={`gaming-card p-2 flex flex-col items-center gap-2 relative transition-all min-h-[100px] justify-center ${
              item.status === 'claimed' ? 'bg-blue-900/40 opacity-60' : 
              item.status === 'next' ? 'bg-blue-600/40 border-white/40 border-2' :
              'bg-blue-800/20'
            }`}
          >
             <p className="text-[10px] font-black uppercase text-white/80 bg-blue-500/30 px-3 py-1 rounded-full">Day {item.day}</p>
            <div className="relative p-1">
              <CoinIcon size={24} />
              {item.status === 'claimed' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-green-500 rounded-full p-0.5 border-2 border-gaming-blue-900 shadow-lg">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
            <p className="font-display font-black text-white text-xs">+{item.reward}</p>
          </div>
        ))}
      </div>

      {/* Big Day 7 Reward */}
      <div className="gaming-card p-6 bg-blue-800/30 border-blue-400/20 flex items-center justify-between group cursor-pointer hover:bg-blue-700/40 transition-all">
        <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-white/50 mb-1">Final Prize</span>
            <h3 className="text-2xl font-display font-black text-white">Day 7</h3>
        </div>
        <div className="flex items-center gap-4">
             <div className="relative">
                <CoinIcon size={56} className="drop-shadow-2xl" />
                <div className="absolute -top-1 -right-1 bg-orange-500 text-[10px] px-2 py-0.5 rounded-full font-black animate-bounce">+1000</div>
             </div>
        </div>
      </div>

      <button
        onClick={claim}
        className="w-full py-5 rounded-3xl bg-gaming-accent hover:bg-blue-500 text-white font-display font-black text-xl glow-blue transition-all active:scale-95 uppercase tracking-widest"
      >
        Claim Today's Gift
      </button>

      <div className="text-center">
        <p className="text-xs text-white/40 font-bold uppercase">Next reset in <span className="text-gaming-accent">04:22:15</span></p>
      </div>
    </motion.div>
  );
};
