import React, { useState } from 'react';
import { 
  RotateCw, 
  Plus, 
  Trash2, 
  Save, 
  Settings2, 
  TrendingUp,
  Percent,
  Coins,
  History,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';

interface SpinReward {
  id: string;
  type: 'coins' | 'cash' | 'jackpot';
  value: number;
  probability: number;
}

export const SpinManagement: React.FC = () => {
  const [rewards, setRewards] = useState<SpinReward[]>([
    { id: '1', type: 'coins', value: 10, probability: 40 },
    { id: '2', type: 'coins', value: 50, probability: 30 },
    { id: '3', type: 'coins', value: 100, probability: 20 },
    { id: '4', type: 'jackpot', value: 1000, probability: 10 },
  ]);

  const totalProbability = rewards.reduce((sum, r) => sum + r.probability, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Lucky Spin Management</h1>
        <p className="text-slate-400">Configure wheel rewards and win probabilities for users.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Probability Chart (Visual check) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 p-8 shadow-xl">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
               <Settings2 size={18} className="text-purple-400" /> Wheel Settings
             </h3>
             
             <div className="space-y-6">
               <div>
                 <label className="block text-sm font-medium text-slate-400 mb-2">Daily Free Spins</label>
                 <input type="number" defaultValue={2} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-400 mb-2">Ad Rewarded Spins (Limit)</label>
                 <input type="number" defaultValue={5} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white" />
               </div>
               
               <div className="pt-6 border-t border-slate-800">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Total Probability</span>
                    <span className={totalProbability === 100 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {totalProbability}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${totalProbability === 100 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                      style={{ width: `${Math.min(totalProbability, 100)}%` }}
                    />
                  </div>
                  {totalProbability !== 100 && (
                    <p className="text-[10px] text-rose-500 mt-2 italic">Probability must equal exactly 100%</p>
                  )}
               </div>

               <button className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-purple-500/20">
                 Save Configurations
               </button>
             </div>
          </div>
        </div>

        {/* Rewards List */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
             <div className="p-8 border-b border-slate-800 flex justify-between items-center">
               <h3 className="text-xl font-bold text-white">Wheel Segments</h3>
               <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                 <Plus size={16} /> Add Reward
               </button>
             </div>
             <div className="divide-y divide-slate-800">
                {rewards.map((reward) => (
                  <div key={reward.id} className="p-6 flex items-center gap-6 hover:bg-slate-800/10 transition-colors">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-lg ${
                       reward.type === 'jackpot' ? 'bg-amber-500 text-white shadow-amber-500/20' : 'bg-slate-800 text-slate-300'
                     }`}>
                       {reward.type === 'jackpot' ? '★' : 'C'}
                     </div>
                     <div className="flex-1">
                        <p className="font-bold text-white">{reward.value} {reward.type.toUpperCase()}</p>
                        <p className="text-xs text-slate-500">Fixed segment reward</p>
                     </div>
                     <div className="w-32">
                        <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">Probability</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            value={reward.probability} 
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs">%</span>
                        </div>
                     </div>
                     <button className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                       <Trash2 size={18} />
                     </button>
                  </div>
                ))}
             </div>
          </div>
          
          {/* Quick Analytics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800 flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><History size={20} /></div>
                <div>
                   <p className="text-xs text-slate-500 font-bold uppercase">Total Spins Today</p>
                   <p className="text-xl font-bold text-white">1,420</p>
                </div>
             </div>
             <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><TrendingUp size={20} /></div>
                <div>
                   <p className="text-xs text-slate-500 font-bold uppercase">Coins Distributed</p>
                   <p className="text-xl font-bold text-white">45,200</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
