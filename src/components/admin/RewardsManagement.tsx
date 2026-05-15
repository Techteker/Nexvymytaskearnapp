import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  Coins, 
  Gift, 
  Users, 
  RefreshCcw, 
  Save, 
  AlertCircle,
  TrendingUp,
  Percent,
  Calendar
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { motion } from 'motion/react';

export const RewardsManagement: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    dailyRewardBase: 100,
    streakBonus: 10,
    referralRewardReferrer: 500,
    referralRewardReferred: 200,
    minWithdrawalCoins: 5000,
    minWithdrawalUsd: 5,
    maxSpinsPerDay: 10,
    cooldownBetweenSpins: 30
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await adminService.getSettings();
    if (data && Object.keys(data).length > 0) {
      setSettings((prev: any) => ({ ...prev, ...data }));
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.updateSettings(settings);
      showToast('Global rewards updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold uppercase animate-pulse">Initializing Reward System...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Rewards & Coins</h1>
        <p className="text-slate-400 font-medium">Configure global earning parameters and withdrawal limits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Rewards */}
          <section className="bg-slate-900/40 border border-slate-800 rounded-3.5xl p-8 space-y-6">
            <div className="flex items-center gap-4 text-purple-400">
              <Calendar size={24} />
              <h2 className="text-xl font-bold text-white">Daily Rewards & Streaks</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Base Daily Reward</label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="number"
                    value={settings.dailyRewardBase}
                    onChange={(e) => setSettings({ ...settings, dailyRewardBase: parseInt(e.target.value) })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white font-mono focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 uppercase">Coins</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Streak Bonus (Daily)</label>
                <div className="relative">
                  <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="number"
                    value={settings.streakBonus}
                    onChange={(e) => setSettings({ ...settings, streakBonus: parseInt(e.target.value) })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white font-mono focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 uppercase">Per Day</span>
                </div>
              </div>
            </div>
          </section>

          {/* Referral Rewards */}
          <section className="bg-slate-900/40 border border-slate-800 rounded-3.5xl p-8 space-y-6">
            <div className="flex items-center gap-4 text-emerald-400">
              <Users size={24} />
              <h2 className="text-xl font-bold text-white">Referral Program</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Referrer Reward</label>
                <div className="relative">
                  <Gift className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="number"
                    value={settings.referralRewardReferrer}
                    onChange={(e) => setSettings({ ...settings, referralRewardReferrer: parseInt(e.target.value) })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white font-mono focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 uppercase">Coins</span>
                </div>
                <p className="text-[10px] text-slate-500 pl-1 italic">Reward given to the inviter.</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">New User (Referred) Reward</label>
                <div className="relative">
                  <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    type="number"
                    value={settings.referralRewardReferred}
                    onChange={(e) => setSettings({ ...settings, referralRewardReferred: parseInt(e.target.value) })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white font-mono focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 uppercase">Coins</span>
                </div>
                <p className="text-[10px] text-slate-500 pl-1 italic">Reward given to the user who used a code.</p>
              </div>
            </div>
          </section>

          {/* Gamification Settings */}
          <section className="bg-slate-900/40 border border-slate-800 rounded-3.5xl p-8 space-y-6">
            <div className="flex items-center gap-4 text-amber-400">
              <RefreshCcw size={24} />
              <h2 className="text-xl font-bold text-white">Gamification (Lucky Spin)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Max Spins Per Day</label>
                <input 
                  type="number"
                  value={settings.maxSpinsPerDay}
                  onChange={(e) => setSettings({ ...settings, maxSpinsPerDay: parseInt(e.target.value) })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-6 text-white font-mono focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Cooldown (Seconds)</label>
                <input 
                  type="number"
                  value={settings.cooldownBetweenSpins}
                  onChange={(e) => setSettings({ ...settings, cooldownBetweenSpins: parseInt(e.target.value) })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-6 text-white font-mono focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Withdrawal Limits */}
          <section className="bg-slate-900/40 border border-slate-800 rounded-3.5xl p-8 space-y-6 sticky top-8">
            <div className="flex items-center gap-4 text-blue-400">
              <Percent size={24} />
              <h2 className="text-xl font-bold text-white">Withdrawal Controls</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Min. Withdrawal Coins</label>
                <input 
                  type="number"
                  value={settings.minWithdrawalCoins}
                  onChange={(e) => setSettings({ ...settings, minWithdrawalCoins: parseInt(e.target.value) })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-6 text-white font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Equivalent Min. USD</label>
                <input 
                  type="number"
                  value={settings.minWithdrawalUsd}
                  onChange={(e) => setSettings({ ...settings, minWithdrawalUsd: parseInt(e.target.value) })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 px-6 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
               <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <RefreshCcw className="animate-spin" size={18} />
                    Synchronizing...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Deploy System Config
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-3">
              <AlertCircle className="text-amber-500 shrink-0" size={18} />
              <p className="text-[10px] text-amber-500/80 leading-relaxed font-medium">
                Changes are applied instantly to all active users. Ensure you have calculated economy sustainability before updating.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const CheckCircle2 = (props: any) => <Gift {...props} />;
