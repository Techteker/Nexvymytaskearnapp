import React from 'react';
import { motion, useAnimation } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { CoinIcon } from '../components/CoinIcon';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { History, Volume2, Info, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const SECTIONS = [
  { value: '5x', color: '#3b82f6', prob: 0.01 },
  { value: '0x', color: '#ef4444', prob: 0.40 },
  { value: '1x', color: '#10b981', prob: 0.30 },
  { value: '2x', color: '#fbbf24', prob: 0.05 },
  { value: '3x', color: '#8b5cf6', prob: 0.02 },
  { value: '4x', color: '#ec4899', prob: 0.02 },
];

import { apiService } from '../services/api.ts';

const MULTIPLIER_TO_INDEX: { [key: number]: number } = {
  5: 0,
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  4: 5
};

export const Spinner = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const controls = useAnimation();
  const [spinning, setSpinning] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [selectedPack, setSelectedPack] = React.useState(0);

  const packs = [
    { coins: 20, color: 'bg-red-500' },
    { coins: 50, color: 'bg-orange-500' },
    { coins: 100, color: 'bg-blue-500' },
    { coins: 500, color: 'bg-pink-600' },
  ];

  const spin = async () => {
    if (spinning) return;
    
    setSpinning(true);
    setResult(null);

    try {
      const data = await apiService.spin(packs[selectedPack].coins);
      if (data.error) {
        alert(data.error);
        setSpinning(false);
        return;
      }

      const { multiplier, win } = data;
      const winningIndex = MULTIPLIER_TO_INDEX[multiplier];

      // Calculation to land on the slice
      const sliceAngle = 60;
      const targetRotation = 360 - (winningIndex * sliceAngle);
      const extraSpins = 5 + Math.random() * 5;
      const finalRotation = (extraSpins * 360) + targetRotation;

      await controls.start({
        rotate: finalRotation,
        transition: { duration: 4, ease: [0.45, 0.05, 0.55, 0.95] }
      });

      setSpinning(false);
      
      if (multiplier > 0) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#3b82f6', '#ffffff']
        });
        setResult(`${multiplier}x WIN! (+${win})`);
        
        await refreshUser(); // Added to refresh balance
      } else {
        setResult('BETTER LUCK NEXT TIME!');
        await refreshUser(); // Added to refresh balance
      }
    } catch (error) {
      console.error(error);
      setSpinning(false);
      setResult('NETWORK ERROR');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-6"
    >
      <TopBar />

      <div className="flex flex-col items-center gap-1 mb-2">
        <h1 className="text-4xl font-display font-black text-white text-center italic tracking-tighter drop-shadow-xl flex flex-col leading-none">
          <span className="text-orange-400 text-lg not-italic">COIN</span>
          <span>KING</span>
        </h1>
      </div>

      <div className="relative flex justify-center py-2">
        {/* Floating Controls */}
        <div className="absolute left-0 top-0 flex flex-col gap-3">
           <button className="flex flex-col items-center group">
              <div className="p-2.5 bg-blue-700/50 rounded-xl border-2 border-white/10 group-active:scale-90 transition-transform">
                <Volume2 className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-black uppercase mt-1">Sound</span>
           </button>
           <button className="flex flex-col items-center group">
              <div className="p-2.5 bg-blue-700/50 rounded-xl border-2 border-white/10 group-active:scale-90 transition-transform">
                <History className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-black uppercase mt-1">History</span>
           </button>
        </div>

        <div className="absolute right-0 top-0 flex flex-col gap-3 text-right">
           <button 
             onClick={() => navigate('/referral')}
             className="flex flex-col items-center group"
           >
              <div className="p-2.5 bg-blue-700/50 rounded-xl border-2 border-white/10 group-active:scale-90 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-black uppercase mt-1">Invite</span>
           </button>
           <button className="flex flex-col items-center group">
              <div className="p-2.5 bg-blue-700/50 rounded-xl border-2 border-white/10 group-active:scale-90 transition-transform">
                <Info className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-black uppercase mt-1">Info</span>
           </button>
        </div>

        {/* Wheel */}
        <div className="relative w-[260px] h-[260px] rounded-full border-[10px] border-orange-500 glow-blue z-10 shadow-2xl overflow-hidden ring-8 ring-gaming-blue-700/50">
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

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full z-20 flex items-center justify-center border-4 border-orange-600 shadow-xl">
             <div className="w-5 h-5 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-md rotate-45" />
          </div>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-400 z-30 pointer-events-none drop-shadow-xl" 
             style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
      </div>

      <div className="flex flex-col gap-4">
        {/* Entry Fee Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black uppercase text-white/40 tracking-wider">Select Entry Fee</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-gaming-accent">Win up to</span>
              <span className="text-[10px] font-black text-white bg-blue-600 px-2 py-0.5 rounded italic">5X</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
             {packs.map((pack, i) => (
               <button 
                  key={i} 
                  onClick={() => setSelectedPack(i)}
                  className={cn(
                    "gaming-card p-3 flex flex-col items-center gap-2 transition-all border-2 relative overflow-hidden",
                    selectedPack === i 
                      ? "bg-gaming-accent border-white shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-105" 
                      : "bg-blue-900/40 border-white/5 opacity-60 grayscale-[0.5]"
                  )}
               >
                  <div className={`w-10 h-10 rounded-xl ${pack.color} border-2 border-white/20 flex items-center justify-center shadow-lg`}>
                     <CoinIcon size={20} />
                  </div>
                  <span className="text-sm font-black text-white">₹{pack.coins}</span>
                  {selectedPack === i && (
                    <motion.div layoutId="selector" className="absolute inset-0 bg-white/10" />
                  )}
               </button>
             ))}
          </div>
        </div>

        <button
          onClick={spin}
          disabled={spinning}
          className="gaming-button-yellow w-full py-5 text-2xl tracking-tighter font-black shadow-[0_8px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[4px] transition-all"
        >
          {spinning ? 'SPINNING...' : `SPIN FOR ₹${packs[selectedPack].coins}`}
        </button>
      </div>

      <div className="min-h-[40px]">
        {result && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className={`text-center font-display font-black text-3xl italic tracking-tight drop-shadow-xl ${
              result.includes('TRY AGAIN') ? 'text-red-400' : 'text-coin-gold text-glow'
            }`}
          >
            {result}
          </motion.div>
        )}
      </div>

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
