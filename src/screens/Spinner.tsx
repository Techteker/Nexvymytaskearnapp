import React from 'react';
import { motion, useAnimation } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { CoinIcon } from '../components/CoinIcon';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { History, Volume2, VolumeX, Info, Users, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AnimatePresence } from 'motion/react';
import { SEO } from '../components/SEO';

const SECTIONS = [
  { value: '5x', color: '#3b82f6', prob: 0.01 },
  { value: '0x', color: '#ef4444', prob: 0.40 },
  { value: '1x', color: '#10b981', prob: 0.30 },
  { value: '2x', color: '#fbbf24', prob: 0.05 },
  { value: '3x', color: '#8b5cf6', prob: 0.02 },
  { value: '4x', color: '#ec4899', prob: 0.02 },
];

import { apiService } from '../services/api';

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
  const { showToast } = useToast();
  const controls = useAnimation();
  const [spinning, setSpinning] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [selectedPack, setSelectedPack] = React.useState(0);
  const [muted, setMuted] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [history, setHistory] = React.useState<any[]>([]);
  const [showResultModal, setShowResultModal] = React.useState(false);
  const [spinOutcome, setSpinOutcome] = React.useState<{ multiplier: number; win: number } | null>(null);

  const packs = [
    { coins: 200, color: 'bg-red-500' },
    { coins: 500, color: 'bg-orange-500' },
    { coins: 1000, color: 'bg-blue-500' },
    { coins: 5000, color: 'bg-pink-600' },
  ];

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await apiService.getSpinHistory();
      setHistory(data || []);
    } catch (e) {}
  };

  const playSpinSound = () => {
    if (muted) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 3);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 4);
    } catch (e) {}
  };

  const playWinSound = () => {
    if (muted) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  };

  const spin = async () => {
    if (spinning) return;
    
    setSpinning(true);
    setResult(null);
    setSpinOutcome(null);
    setShowResultModal(false);
    playSpinSound();

    try {
      const data = await apiService.spin(packs[selectedPack].coins);
      if (data.error) {
        showToast(data.error, 'error');
        setSpinning(false);
        return;
      }

      const { multiplier, win } = data;
      const winningIndex = MULTIPLIER_TO_INDEX[multiplier];

      // Calculation to land on the slice
      const sliceAngle = 60;
      const targetRotation = 360 - (winningIndex * sliceAngle);
      const extraSpins = 6 + Math.random() * 4; // Generous spins for live action feel
      const finalRotation = (extraSpins * 360) + targetRotation;

      await controls.start({
        rotate: finalRotation,
        transition: { duration: 4.5, ease: [0.25, 0.1, 0.25, 1] } // Custom easing for premium spin experience
      });

      setSpinning(false);
      setSpinOutcome({ multiplier, win });
      setShowResultModal(true);
    } catch (error) {
      console.error(error);
      setSpinning(false);
      showToast('Connection issue during spin. Please try again!', 'error');
    }
  };

  const claimResult = async () => {
    if (!spinOutcome) return;
    try {
      if (spinOutcome.multiplier > 0) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#3b82f6', '#ffffff']
        });
        playWinSound();
        showToast(`Successfully claimed +${spinOutcome.win} Coins!`, 'success');
      }
      setShowResultModal(false);
      setSpinOutcome(null);
      await refreshUser();
      fetchHistory();
    } catch (e) {
      setShowResultModal(false);
      setSpinOutcome(null);
    }
  };

  return (
    <>
      <SEO 
        title="Spin and Win Free Cash: Daily Lucky Spin Wheel - Nexvy" 
        description="Test your luck with Nexvy Lucky Spin Wheel. Spin daily to win bonus rewards, earn massive coin multipliers, and redeem them directly to UPI on our top app."
        keywords="spin and win, lucky spin wheel, spin earn money, cash wheel game, nexvy spin, free spin paytm cash, daily lucky draw, win rewards online, spin reward apk, earn coin app"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col gap-6"
      >
      <div className="flex flex-col items-center gap-1 mb-2 select-none">
        <h1 className="text-4xl font-display font-black text-white text-center italic tracking-tighter flex flex-col leading-none">
          <span className="text-white text-xs not-italic bg-[#0a1f6b]/80 border border-[#D4AF37]/35 py-1 px-3 rounded-full tracking-[0.2em] w-fit mx-auto shadow-md mb-2">LUCKY WHEEL</span>
          <span className="bg-gradient-to-r from-[#F8D37A] via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent italic drop-shadow">COIN KING</span>
        </h1>
      </div>

      <div className="relative flex justify-center py-2">
        {/* Floating Controls */}
        <div className="absolute left-0 top-0 flex flex-col gap-3">
           <button 
             onClick={() => setMuted(!muted)}
             className="flex flex-col items-center group cursor-pointer border-0 bg-transparent"
            >
              <div className="p-2.5 bg-[#0a1f6b]/75 rounded-2xl border border-[#D4AF37]/30 group-active:scale-95 transition-transform shadow-md">
                {muted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-[#F8D37A]" />}
              </div>
              <span className="text-[8px] font-black uppercase mt-1.5 text-slate-300 group-hover:text-white">{muted ? 'Muted' : 'Sound'}</span>
           </button>
           <button 
             onClick={() => setShowHistory(true)}
             className="flex flex-col items-center group cursor-pointer border-0 bg-transparent"
            >
              <div className="p-2.5 bg-[#0a1f6b]/75 rounded-2xl border border-[#D4AF37]/30 group-active:scale-95 transition-transform shadow-md">
                <History className="w-5 h-5 text-[#F8D37A]" />
              </div>
              <span className="text-[8px] font-black uppercase mt-1.5 text-slate-300 group-hover:text-white">History</span>
           </button>
        </div>

        <div className="absolute right-0 top-0 flex flex-col gap-3 text-right">
           <button 
             onClick={() => navigate('/referral')}
             className="flex flex-col items-center group cursor-pointer border-0 bg-transparent"
            >
              <div className="p-2.5 bg-[#0a1f6b]/75 rounded-2xl border border-[#D4AF37]/30 group-active:scale-95 transition-transform shadow-md">
                <Users className="w-5 h-5 text-[#F8D37A]" />
              </div>
              <span className="text-[8px] font-black uppercase mt-1.5 text-slate-300 group-hover:text-white">Invite</span>
           </button>
           <button 
             onClick={() => navigate('/about-us')}
             className="flex flex-col items-center group cursor-pointer border-0 bg-transparent"
           >
              <div className="p-2.5 bg-[#0a1f6b]/75 rounded-2xl border border-[#D4AF37]/30 group-active:scale-95 transition-transform shadow-md">
                <Info className="w-5 h-5 text-[#F8D37A]" />
              </div>
              <span className="text-[8px] font-black uppercase mt-1.5 text-slate-300 group-hover:text-white">Info</span>
           </button>
        </div>

        {/* Wheel */}
        <div className="relative w-[260px] h-[260px] rounded-full border-[8px] border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.4)] z-10 overflow-hidden ring-8 ring-[#D4AF37]/15">
          <motion.div
            animate={controls}
            className="w-full h-full relative"
            style={{ originX: 0.5, originY: 0.5 }}
          >
            {SECTIONS.map((section, i) => (
              <div
                key={i}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center pt-2"
                style={{ 
                  transform: `rotate(${i * 60}deg)`,
                  clipPath: 'polygon(50% 50%, 0 0, 100% 0)',
                  WebkitClipPath: 'polygon(50% 50%, 0 0, 100% 0)'
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

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full z-20 flex items-center justify-center border-4 border-[#D4AF37] shadow-2xl">
             <div className="w-5 h-5 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-md rotate-45 animate-pulse" />
          </div>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-amber-400 z-30 pointer-events-none drop-shadow-2xl" 
             style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
      </div>

      <div className="flex flex-col gap-4 bg-transparent">
        {/* Entry Fee Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black uppercase text-slate-350 tracking-widest font-mono">Select Entry Fee</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold text-[#F8D37A] font-mono leading-none">Win up to</span>
              <span className="text-[10px] font-mono font-black text-slate-950 bg-gradient-to-r from-[#F8D37A] to-[#D4AF37] px-2 py-0.5 rounded italic leading-none">5X</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
             {packs.map((pack, i) => (
                <button 
                  key={i} 
                  onClick={() => !spinning && setSelectedPack(i)}
                  disabled={spinning}
                  className={cn(
                    "p-3 flex flex-col items-center gap-2 transition-all border relative overflow-hidden rounded-[24px] cursor-pointer",
                    selectedPack === i 
                      ? "bg-gradient-to-b from-[#F8D37A] to-[#D4AF37] border-[#D4AF37] shadow-2xl scale-105" 
                      : "bg-[#0a1f6b]/50 border-[#D4AF37]/20 opacity-80 hover:opacity-100 text-white"
                  )}
                >
                  <div className={`w-10 h-10 rounded-xl bg-[#040d2d]/60 border border-[#D4AF37]/20 flex items-center justify-center shadow-md relative z-10`}>
                     <CoinIcon size={20} className={selectedPack === i ? 'animate-pulse' : ''} />
                  </div>
                  <span className={cn("text-xs font-black relative z-10 font-display", selectedPack === i ? "text-[#040d2d]" : "text-white")}>{pack.coins}</span>
                  {selectedPack === i && (
                    <motion.div layoutId="selector" className="absolute inset-0 bg-white/15" />
                  )}
                </button>
             ))}
          </div>
        </div>

        <button
          onClick={spin}
          disabled={spinning}
          className="gaming-button-yellow w-full py-5 text-2xl tracking-tighter font-black shadow-[0_8px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer disabled:opacity-50"
        >
          {spinning ? 'SPINNING...' : `SPIN FOR ${packs[selectedPack].coins}`}
        </button>
      </div>

       {/* Info Card */}
      <div className="gaming-card p-4 flex gap-3 items-center bg-[#0a1f6b]/50 border border-[#D4AF37]/20 rounded-2xl">
        <Info className="w-5 h-5 text-[#F8D37A] shrink-0" />
        <p className="text-[10px] text-slate-300 leading-normal">
          Pro Tip: Entry Packs with higher values yield massive <span className="font-extrabold text-[#F8D37A]">5X multipliers</span> for ultimate cash redemptions!
        </p>
      </div>

      <AnimatePresence>
        {/* Draw Claim Result Pop-up Modal */}
        {showResultModal && spinOutcome && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-[#040d2d] border border-[#D4AF37] rounded-[36px] w-full max-w-sm overflow-hidden flex flex-col p-8 text-center text-white shadow-2xl relative"
            >
              {spinOutcome.multiplier > 0 ? (
                <>
                  <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border-2 border-[#D4AF37]/40 mb-4 animate-bounce">
                    <CoinIcon size={44} />
                  </div>
                  <h3 className="text-3xl font-display font-black text-[#F8D37A] italic tracking-tighter mb-2 uppercase">
                    BIG WIN!
                  </h3>
                  <p className="text-slate-300 text-sm font-semibold mb-5">
                    Congratulations! You won with a <span className="text-emerald-400 font-extrabold">{spinOutcome.multiplier}x Multiplier</span>!
                  </p>
                  
                  <div className="bg-[#0a1f6b]/50 border border-[#D4AF37]/20 rounded-2xl py-4 px-6 mb-6">
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-1 tracking-widest">TOTAL WINNINGS</span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-display font-black italic tracking-tighter text-[#F8D37A]">
                        {spinOutcome.win} Coins
                      </span>
                      <CoinIcon size={24} />
                    </div>
                  </div>

                  <button
                    onClick={claimResult}
                    className="w-full gaming-button-yellow font-display font-black text-xl py-4 rounded-2xl active:translate-y-[4px] transition-all uppercase tracking-wider cursor-pointer"
                  >
                    CLAIM COINS
                  </button>
                </>
              ) : (
                <>
                  <div className="mx-auto w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center border-2 border-rose-500/20 mb-4">
                    <X className="w-8 h-8 text-rose-500" />
                  </div>
                  <h3 className="text-2xl font-display font-black text-rose-500 italic tracking-tighter mb-2 uppercase">
                    TRY AGAIN!
                  </h3>
                  <p className="text-slate-350 text-xs mb-6">
                    Better luck next time! Hit the spin button again for another chance to win 5X payouts.
                  </p>

                  <button
                    onClick={claimResult}
                    className="w-full bg-[#0a1f6b] hover:bg-[#1239b3] border border-[#D4AF37]/25 hover:border-[#D4AF37]/50 text-white font-display font-black text-lg py-4 rounded-2xl transition-all uppercase tracking-wider cursor-pointer"
                  >
                    CLOSE & RETRY
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}

        {showHistory && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#040d2d] border border-[#D4AF37]/35 rounded-3xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh] shadow-2xl"
              >
                <div className="p-6 bg-gradient-to-r from-[#0c247d] to-[#0a1f6b] border-b border-[#D4AF37]/25 flex items-center justify-between">
                  <h3 className="text-xl font-black text-white italic tracking-tighter font-display">SPIN HISTORY</h3>
                  <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer border-0 bg-transparent">
                    <X className="w-6 h-6 text-[#F8D37A]" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {history.length === 0 && (
                    <div className="py-20 text-center text-slate-400 font-extrabold italic uppercase">No spin attempts yet</div>
                  )}
                  {history.map((item) => (
                    <div key={item.$id} className="bg-[#0a1f6b]/40 border border-[#D4AF37]/15 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-[#F8D37A] uppercase tracking-wider font-mono">BET AMOUNT:</span>
                          <span className="text-xs font-black text-white">{item.bet}</span>
                        </div>
                        <p className="text-[9px] text-[#F8D37A]/60 font-extrabold">{new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-lg font-black italic tracking-tighter text-[#F8D37A]">{item.win > 0 ? `+${item.win}` : '0'}</span>
                          <CoinIcon size={16} />
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${item.multiplier > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                          {item.multiplier > 0 ? `${item.multiplier}x Multiplier` : 'No Win'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  );
};
