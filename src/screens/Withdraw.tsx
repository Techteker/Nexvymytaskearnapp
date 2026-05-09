import React from 'react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { Wallet, Smartphone, CreditCard, ChevronRight, History, CheckCircle2, Clock } from 'lucide-react';
import { CoinIcon } from '../components/CoinIcon';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

const methods = [
  { id: 'paytm', name: 'Paytm', icon: Smartphone, color: 'bg-blue-500' },
  { id: 'phonepe', name: 'PhonePe', icon: Smartphone, color: 'bg-purple-600' },
  { id: 'upi', name: 'UPI', icon: CreditCard, color: 'bg-indigo-500' },
  { id: 'paypal', name: 'PayPal', icon: CreditCard, color: 'bg-blue-600' },
];

export const Withdraw = () => {
  const { user, refreshUser } = useAuth();
  const [selected, setSelected] = React.useState('paytm');
  const [loading, setLoading] = React.useState(false);
  const [details, setDetails] = React.useState('');
  const [amount, setAmount] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseInt(amount);
    if (user && user.coins < withdrawAmount) {
      alert("Insufficient balance");
      return;
    }
    if (withdrawAmount < 5) { // Assuming coins value is higher, but demo check
       // Using small number for testing if needed, but keeping user limit
    }
    if (withdrawAmount < 50000) {
      alert("Minimum withdrawal is 50,000 coins");
      return;
    }

    setLoading(true);
    try {
      const data = await apiService.withdraw(withdrawAmount, selected, details);
      if (data.error) throw new Error(data.error);
      alert("Withdrawal submitted successfully!");
      setAmount('');
      setDetails('');
      await refreshUser();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-6"
    >
      <TopBar />

      <div className="gaming-card p-6 bg-gradient-to-br from-gaming-blue-800 to-gaming-blue-900 border-gaming-accent/30 relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-xs text-white/40 font-bold uppercase mb-1">Withdrawable Balance</p>
            <div className="flex items-center gap-2">
              <CoinIcon size={24} />
              <h2 className="text-3xl font-display font-black text-white">{user?.coins.toLocaleString() || '0'}</h2>
            </div>
            <p className="text-[10px] text-gaming-accent font-bold mt-1">≈ ${(user?.coins ? (user.coins / 10000).toFixed(2) : '0.00')} USD</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
             <Wallet className="w-8 h-8 text-white/20" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <h2 className="text-sm font-black uppercase tracking-widest text-white/60">Withdraw Options</h2>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {methods.filter(m => m.id !== 'upi').map((method) => (
          <button
            key={method.id}
            onClick={() => setSelected(method.id)}
            className={`gaming-card p-3 flex flex-col items-center gap-3 transition-all min-h-[100px] justify-center ${
              selected === method.id 
              ? 'bg-blue-600/40 border-white/60 border-2' 
              : 'bg-blue-800/20'
            }`}
          >
            <div className={`p-2 rounded-xl ${method.color} shadow-lg`}>
              <method.icon className="w-8 h-8 text-white" />
            </div>
            <span className="font-black text-[10px] tracking-tight uppercase">{method.name}</span>
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
                className="w-full bg-blue-800/40 border border-white/20 rounded-2xl py-5 px-6 font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
                required
            />
        </div>
        <div className="flex flex-col gap-2">
            <input 
                type="number" 
                placeholder="50,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-blue-800/40 border border-white/20 rounded-2xl py-5 px-6 font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
                required
            />
            <p className="text-[10px] text-white/50 text-center font-bold mt-2">
              *Minimum withdrawal is 50,000 coins ($5 USD)
            </p>
        </div>

        <button 
           type="submit"
           disabled={loading}
           className="gaming-button-yellow w-full py-5 text-2xl tracking-widest mt-4 uppercase"
        >
            {loading ? '...' : 'SUBMIT'}
        </button>
      </form>

      {/* History */}
      <div>
         <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Recent Payouts</h3>
            <History className="w-4 h-4 text-white/20" />
         </div>
         <div className="flex flex-col gap-3">
            {[
                { type: 'Paytm', date: 'Yesterday', amount: 5000, status: 'Success', icon: CheckCircle2, statusColor: 'text-green-500' },
                { type: 'PayPal', date: '3 days ago', amount: 10000, status: 'Pending', icon: Clock, statusColor: 'text-yellow-500' },
            ].map((item, i) => (
                <div key={i} className="gaming-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <Wallet className="w-5 h-5 text-white/40" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold">{item.type} Payout</h4>
                            <p className="text-[10px] text-white/40">{item.date}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                            <CoinIcon size={14} />
                            <span className="font-bold text-sm text-white">-{item.amount}</span>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${item.statusColor}`}>
                            <item.icon className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase">{item.status}</span>
                        </div>
                    </div>
                </div>
            ))}
         </div>
      </div>
    </motion.div>
  );
};
