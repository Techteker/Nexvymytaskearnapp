import React from 'react';
import { motion, useAnimation } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { CoinIcon } from '../components/CoinIcon';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { History, Volume2, Info, Users } from 'lucide-react';

const SECTIONS = [
  { value: '5x', color: '#3b82f6' },
  { value: '0x', color: '#ef4444' },
  { value: '1x', color: '#10b981' },
  { value: '2x', color: '#fbbf24' },
  { value: '3x', color: '#8b5cf6' },
  { value: '4x', color: '#ec4899' },
];

export const Spinner = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [spinning, setSpinning] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  const spin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const extraSpins = 5 + Math.random() * 5;
    const finalRotation = extraSpins * 360 + Math.random() * 360;

    await controls.start({
      rotate: finalRotation,
      transition: { duration: 4, ease: [0.45, 0.05, 0.55, 0.95] }
    });

    setSpinning(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#3b82f6', '#ffffff']
    });
    setResult('2x WIN!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-6"
    >
      <TopBar />

      <div className="flex flex-col items-center gap-1 mb-4">
        <h1 className="text-4xl font-display font-black text-white text-center italic tracking-tighter drop-shadow-xl flex flex-col leading-none">
          <span className="text-orange-400 text-lg not-italic">COIN</span>
          <span>KING</span>
        </h1>
      </div>

      <div className="relative flex justify-center py-4">
        {/* Floating Controls */}
        <div className="absolute left-0 top-0 flex flex-col gap-4">
           <button className="flex flex-col items-center group">
              <div className="p-3 bg-blue-700/50 rounded-2xl border-2 border-white/20 group-active:scale-90 transition-transform">
                <Volume2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase mt-1">Music</span>
           </button>
           <button className="flex flex-col items-center group">
              <div className="p-3 bg-blue-700/50 rounded-2xl border-2 border-white/20 group-active:scale-90 transition-transform">
                <History className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase mt-1">Rate Us</span>
           </button>
        </div>

        <div className="absolute right-0 top-0 flex flex-col gap-4 text-right">
           <button 
             onClick={() => navigate('/referral')}
             className="flex flex-col items-center group"
           >
              <div className="p-3 bg-blue-700/50 rounded-2xl border-2 border-white/20 group-active:scale-90 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase mt-1">Invite</span>
           </button>
           <button className="flex flex-col items-center group">
              <div className="p-3 bg-blue-700/50 rounded-2xl border-2 border-white/20 group-active:scale-90 transition-transform">
                <Info className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase mt-1">Privacy</span>
           </button>
        </div>

        {/* Wheel */}
        <div className="relative w-[280px] h-[280px] rounded-full border-[10px] border-orange-500 glow-blue z-10 shadow-2xl overflow-hidden ring-8 ring-gaming-blue-700/50">
          <motion.div
            animate={controls}
            className="w-full h-full relative"
            style={{ originX: 0.5, originY: 0.5 }}
          >
            {SECTIONS.map((section, i) => (
              <div
                key={i}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                style={{ 
                  transform: `rotate(${i * 60}deg)`,
                  clipPath: 'polygon(50% 50%, 0 0, 100% 0)'
                }}
              >
                <div 
                  className="w-full h-full flex flex-col items-center pt-6"
                  style={{ backgroundColor: section.color, opacity: 0.9 }}
                >
                  <span className="font-display font-black text-white text-xl translate-y-2">{section.value}</span>
                  <div className="mt-4">
                    <CoinIcon size={24} />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full z-20 flex items-center justify-center border-4 border-orange-600 shadow-xl">
             <div className="w-6 h-6 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-md rotate-45" />
          </div>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-orange-400 z-30 pointer-events-none drop-shadow-xl" 
             style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
      </div>

      <div className="flex flex-col gap-4">
        {/* Spin Packs */}
        <div className="grid grid-cols-4 gap-2">
           {[
             { spins: 5, coins: 20, color: 'bg-red-500' },
             { spins: 5, coins: 50, color: 'bg-orange-500' },
             { spins: 5, coins: 100, color: 'bg-blue-500' },
             { spins: 5, coins: 500, color: 'bg-pink-600' },
           ].map((pack, i) => (
             <div key={i} className="gaming-card p-1.5 flex flex-col items-center gap-1 border-white/10 bg-white/5">
                <span className="text-[8px] font-black text-white/60">Spins: {pack.spins}</span>
                <div className={`w-8 h-8 rounded-full ${pack.color} border-2 border-dashed border-white/40 flex items-center justify-center`}>
                   <div className="w-4 h-4 bg-white/20 rounded-full" />
                </div>
                <span className="text-[10px] font-black">₹{pack.coins}</span>
             </div>
           ))}
        </div>

        <button
          onClick={spin}
          disabled={spinning}
          className="gaming-button-yellow w-full py-5 text-2xl tracking-tight"
        >
          {spinning ? 'SPINNING...' : 'SPIN NOW'}
        </button>
      </div>

        {result && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center font-display font-black text-4xl text-coin-gold text-glow"
          >
            {result}
          </motion.div>
        )}

      {/* Info Card */}
      <div className="gaming-card p-4 flex gap-3 items-center bg-blue-500/10 border-blue-500/20">
        <Info className="w-5 h-5 text-gaming-accent shrink-0" />
        <p className="text-[10px] text-blue-200">
          Pro Tip: Login after 8 PM to get 2x multipliers on every 10th spin!
        </p>
      </div>
    </motion.div>
  );
};
