import React from 'react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { Wallet, Smartphone, CreditCard, ChevronRight, History, CheckCircle2, Clock } from 'lucide-react';
import { CoinIcon } from '../components/CoinIcon';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { EARNING_CONFIG } from '../constants';
import { cn } from '../lib/utils';
import { SEO } from '../components/SEO';
import { triggerHaptic } from '../lib/haptics';

const methods = [
  { id: 'paytm', name: 'Paytm', icon: Smartphone, color: 'bg-blue-500' },
  { id: 'phonepe', name: 'PhonePe', icon: Smartphone, color: 'bg-purple-600' },
  { id: 'upi', name: 'UPI', icon: CreditCard, color: 'bg-indigo-500' },
  { id: 'paypal', name: 'PayPal', icon: CreditCard, color: 'bg-blue-600' },
];

export const Withdraw = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = React.useState<any>(null);
  const [withdrawals, setWithdrawals] = React.useState<any[]>([]);
  const [selected, setSelected] = React.useState('paytm');
  const [loading, setLoading] = React.useState(false);
  const [details, setDetails] = React.useState('');
  const [amount, setAmount] = React.useState('');

  const loadData = async () => {
    const [wData, sData] = await Promise.all([
      apiService.getWithdrawals(),
      apiService.getAppSettings()
    ]);
    setWithdrawals(wData);
    setSettings(sData);
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const minWithdrawalValue = EARNING_CONFIG.MIN_WITHDRAWAL_COINS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseInt(amount);
    if (user && user.coins < withdrawAmount) {
      triggerHaptic('error');
      showToast("Insufficient balance", 'error');
      return;
    }
    if (withdrawAmount < minWithdrawalValue) {
      triggerHaptic('warning');
      showToast(`Min withdrawal: ${minWithdrawalValue.toLocaleString()} coins`, 'error');
      return;
    }

    triggerHaptic('medium');
    setLoading(true);
    try {
      const data = await apiService.withdraw(withdrawAmount, selected, details);
      if (data.error) throw new Error(data.error);
      triggerHaptic('success');
      showToast("Withdrawal submitted successfully!", 'success');
      setAmount('');
      setDetails('');
      await refreshUser();
      loadData();
    } catch (err: any) {
      triggerHaptic('error');
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Withdraw Real Cash: Direct UPI, Paytm & PayPal - Nexvy" 
        description="Withdraw your earned Nexvy coins instantly as real money. Redeem direct Paytm CASH, PhonePe transfers, UPI payments, and international PayPal payouts."
        keywords="withdraw cash app, redeem paytm cash, instant upi transfer earning, nexvy payment proof, paytm earning app, redeem online cash, cash out india, trusted payout app"
      />
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col gap-6"
      >
      <div className="gaming-card p-6 bg-gradient-to-br from-[#0c247d] via-[#1239b3] to-[#06164a] border border-[#D4AF37]/45 relative overflow-hidden shadow-2xl">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[80%] rounded-full bg-[#D4AF37] opacity-10 blur-[50px] pointer-events-none" />
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-xs text-slate-200 font-extrabold uppercase tracking-widest mb-1">Withdrawable Balance</p>
            <div className="flex items-center gap-2">
              <CoinIcon size={24} />
              <h2 className="text-3xl font-display font-black text-white">{user?.coins.toLocaleString() || '0'}</h2>
            </div>
            <p className="text-[10px] text-[#F8D37A] font-extrabold tracking-wider mt-1 uppercase">≈ ${user?.coins ? (user.coins / EARNING_CONFIG.COINS_PER_USD).toFixed(2) : '0.00'} USD</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#040d2d]/50 flex items-center justify-center border border-[#D4AF37]/35 shadow-inner">
             <Wallet className="w-8 h-8 text-[#F8D37A]" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#F8D37A]/60">Withdraw Options</h2>
        <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {methods.filter(m => m.id !== 'upi').map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setSelected(method.id);
            }}
            className={`flex flex-col items-center gap-3 transition-all min-h-[105px] justify-center rounded-[24px] border cursor-pointer ${
              selected === method.id 
              ? 'bg-[#D4AF37]/15 border-[#D4AF37] border-2 shadow-[0_4px_15px_rgba(212,175,55,0.2)] scale-105' 
              : 'bg-[#0a1f6b]/50 border-[#D4AF37]/15 hover:border-[#D4AF37]/40'
            }`}
          >
            <div className={`p-2 rounded-xl bg-[#040d2d]/60 border border-[#D4AF37]/25 shadow-lg`}>
              <method.icon className="w-6 h-6 text-[#F8D37A]" />
            </div>
            <span className={cn("font-black text-[10px] tracking-tight uppercase", selected === method.id ? "text-[#F8D37A]" : "text-slate-400")}>{method.name}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-2">
            <input 
                type="text" 
                placeholder={`Enter ${selected === 'paytm' ? 'Paytm' : selected === 'phonepe' ? 'PhonePe' : 'PayPal'} ID / Number...`}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full bg-[#0a1f6b]/80 border border-[#D4AF37]/35 rounded-2xl py-5 px-6 font-bold text-white placeholder:text-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/25 transition-all shadow-inner"
                required
            />
        </div>
        <div className="flex flex-col gap-2">
            <input 
                type="number" 
                placeholder={`Min ${EARNING_CONFIG.MIN_WITHDRAWAL_COINS.toLocaleString()} Coins`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#0a1f6b]/80 border border-[#D4AF37]/35 rounded-2xl py-5 px-6 font-bold text-white placeholder:text-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/25 transition-all shadow-inner"
                required
            />
            <p className="text-[9px] text-[#F8D37A]/80 text-center font-black mt-2 uppercase tracking-wider leading-none">
              *Minimum withdrawal is {EARNING_CONFIG.MIN_WITHDRAWAL_COINS.toLocaleString()} coins (${EARNING_CONFIG.MIN_WITHDRAWAL_USD} USD)
            </p>
        </div>

        <button 
           type="submit"
           disabled={loading}
           className="gaming-button-yellow w-full py-5 text-xl tracking-widest mt-4 uppercase shadow-xl cursor-pointer"
         >
            {loading ? 'PROCESSING...' : 'SUBMIT REQUEST'}
        </button>
      </form>

      {/* History */}
      <div className="mt-4">
         <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-display font-black text-lg text-[#F8D37A] uppercase italic">Recent Payouts</h3>
            <History className="w-4 h-4 text-[#F8D37A]" />
         </div>
         <div className="flex flex-col gap-3">
            {withdrawals.slice(0, 10).map((item, i) => (
                <div key={i} className="gaming-card p-4 flex items-center justify-between border border-[#D4AF37]/15">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#040d2d]/60 flex items-center justify-center border border-[#D4AF37]/15">
                            <Wallet className="w-5 h-5 text-[#F8D37A]" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white capitalize leading-none mb-1">{item.method} Payout</h4>
                            <p className="text-[10px] text-slate-350 font-bold uppercase">{new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="text-right leading-tight">
                        <div className="flex items-center gap-1 justify-end">
                            <CoinIcon size={14} />
                            <span className="font-black text-sm text-white">-{item.amount}</span>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 justify-end ${
                          item.status === 'successful' ? 'text-emerald-400' :
                          item.status === 'pending' ? 'text-amber-400' :
                          item.status === 'processing' ? 'text-violet-400' : 'text-rose-450'
                        }`}>
                            <span className="text-[10px] font-black uppercase tracking-tighter">{item.status}</span>
                        </div>
                    </div>
                </div>
            ))}
            {withdrawals.length === 0 && (
              <div className="text-center py-10 text-slate-400 font-extrabold uppercase text-xs tracking-widest bg-[#0a1f6b]/20 rounded-[24px] border border-[#D4AF37]/10">
                No withdrawal history found
              </div>
            )}
         </div>
      </div>
    </motion.div>
    </>
  );
};
