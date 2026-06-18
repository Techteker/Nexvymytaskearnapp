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
      showToast("Insufficient balance", 'error');
      return;
    }
    if (withdrawAmount < minWithdrawalValue) {
      showToast(`Min withdrawal: ${minWithdrawalValue.toLocaleString()} coins`, 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await apiService.withdraw(withdrawAmount, selected, details);
      if (data.error) throw new Error(data.error);
      showToast("Withdrawal submitted successfully!", 'success');
      await apiService.createNotification(
        'Payout Request Received! 💸',
        `Successfully logged withdrawal of $${(withdrawAmount / 1000).toFixed(2)} (${withdrawAmount} coins) via ${selected.toUpperCase()} to ${details}. Status: Pending review.`,
        user?.uid || user?.$id
      );
      setAmount('');
      setDetails('');
      await refreshUser();
      loadData();
    } catch (err: any) {
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
      <div className="gaming-card p-6 bg-gradient-to-br from-brand-purple to-violet-800 border-none relative overflow-hidden shadow-xl">
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-xs text-white/60 font-bold uppercase mb-1">Withdrawable Balance</p>
            <div className="flex items-center gap-2">
              <CoinIcon size={24} />
              <h2 className="text-3xl font-display font-black text-white">{user?.coins.toLocaleString() || '0'}</h2>
            </div>
            <p className="text-[10px] text-yellow-300 font-bold mt-1">≈ ${user?.coins ? (user.coins / EARNING_CONFIG.COINS_PER_USD).toFixed(2) : '0.00'} USD</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
             <Wallet className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-brand-purple/10 to-transparent" />
        <h2 className="text-sm font-black uppercase tracking-widest text-brand-purple/40">Withdraw Options</h2>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-brand-purple/10 to-transparent" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {methods.filter(m => m.id !== 'upi').map((method) => (
          <button
            key={method.id}
            onClick={() => setSelected(method.id)}
            className={`flex flex-col items-center gap-3 transition-all min-h-[100px] justify-center rounded-[24px] border border-slate-100 ${
              selected === method.id 
              ? 'bg-brand-purple/10 border-brand-purple border-2 shadow-lg scale-105' 
              : 'bg-white'
            }`}
          >
            <div className={`p-2 rounded-xl ${method.color} shadow-lg shadow-black/10`}>
              <method.icon className="w-8 h-8 text-white" />
            </div>
            <span className={cn("font-black text-[10px] tracking-tight uppercase", selected === method.id ? "text-brand-purple" : "text-slate-400")}>{method.name}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-2">
            <input 
                type="text" 
                placeholder={`Enter ${selected === 'paytm' ? 'Paytm' : selected === 'phonepe' ? 'PhonePe' : 'PayPal'} Number...`}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-5 px-6 font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all shadow-sm"
                required
            />
        </div>
        <div className="flex flex-col gap-2">
            <input 
                type="number" 
                placeholder={EARNING_CONFIG.MIN_WITHDRAWAL_COINS.toLocaleString()}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-5 px-6 font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all shadow-sm"
                required
            />
            <p className="text-[10px] text-slate-400 text-center font-bold mt-2 uppercase tracking-widest">
              *Minimum withdrawal is {EARNING_CONFIG.MIN_WITHDRAWAL_COINS.toLocaleString()} coins (${EARNING_CONFIG.MIN_WITHDRAWAL_USD})
            </p>
        </div>

        <button 
           type="submit"
           disabled={loading}
           className="gaming-button-yellow w-full py-5 text-2xl tracking-widest mt-4 uppercase shadow-xl"
        >
            {loading ? '...' : 'SUBMIT REQUEST'}
        </button>
      </form>

      {/* History */}
      <div>
         <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-display font-black text-lg text-brand-purple uppercase italic">Recent Payouts</h3>
            <History className="w-4 h-4 text-slate-200" />
         </div>
         <div className="flex flex-col gap-3">
            {withdrawals.slice(0, 10).map((item, i) => (
                <div key={i} className="gaming-card p-4 flex items-center justify-between shadow-sm border border-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                            <Wallet className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-800 capitalize">{item.method} Payout</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                            <CoinIcon size={14} />
                            <span className="font-black text-sm text-slate-900">-{item.amount}</span>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${
                          item.status === 'successful' ? 'text-green-600' :
                          item.status === 'pending' ? 'text-orange-500' :
                          item.status === 'processing' ? 'text-brand-purple' : 'text-red-600'
                        }`}>
                            <span className="text-[10px] font-black uppercase tracking-tighter">{item.status}</span>
                        </div>
                    </div>
                </div>
            ))}
            {withdrawals.length === 0 && (
              <div className="text-center py-8 text-slate-300 font-black uppercase text-[10px] tracking-widest">
                No withdrawal history
              </div>
            )}
         </div>
      </div>
    </motion.div>
    </>
  );
};
