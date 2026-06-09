import React from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Share2, 
  BarChart3,
  Search,
  Filter,
  ArrowUpRight,
  UserPlus
} from 'lucide-react';

export const ReferralManagement: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Referral Management</h1>
          <p className="text-slate-400">Track user growth and affiliate commissions.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-8 flex flex-col items-center justify-center min-w-[200px]">
            <span className="text-xs font-bold text-slate-500 uppercase mb-1">Referral Boost</span>
            <span className="text-2xl font-black text-blue-400">+15%</span>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: 'Total Referrals', value: '12,450', icon: Share2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
           { label: 'Active Affiliates', value: '840', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
           { label: 'Total Commissions', value: '45.2k', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
           { label: 'Growth Rate', value: '+12.5%', icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400/10' }
         ].map((stat, i) => (
           <div key={i} className="p-6 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 shadow-xl">
             <div className="flex items-center justify-between mb-4">
               <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}>
                 <stat.icon size={22} />
               </div>
               <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                 <ArrowUpRight size={12} /> LAST 30D
               </span>
             </div>
             <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
             <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tier Config */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 p-8 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-400" /> Commission Rules
              </h3>

              <div className="space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-400 mb-2">Direct Referral Bonus (Coins)</label>
                   <input type="number" defaultValue={100} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white" />
                   <p className="text-[10px] text-slate-600 mt-1">Awarded to inviter instantly</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-400 mb-2">Earnings Commission (%)</label>
                   <input type="number" defaultValue={10} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white" />
                   <p className="text-[10px] text-slate-600 mt-1">Lifetime % from referred user's tasks</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-400 mb-2">Signup Bonus (Invite Only)</label>
                   <input type="number" defaultValue={50} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white" />
                   <p className="text-[10px] text-slate-600 mt-1">Awarded to new user</p>
                 </div>
                 
                 <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all">
                   Update referral policy
                 </button>
              </div>
           </div>
        </div>

        {/* Top Affiliates List */}
        <div className="lg:col-span-2">
           <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
             <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Top Influencers</h3>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search ID..." 
                      className="bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-xs text-white"
                    />
                  </div>
                  <button className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white"><Filter size={16}/></button>
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-900/40 text-[10px] uppercase font-black text-slate-500 tracking-widest">
                    <tr>
                      <th className="px-8 py-4">User</th>
                      <th className="px-8 py-4">Total Invites</th>
                      <th className="px-8 py-4">Total Earned</th>
                      <th className="px-8 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <tr key={item} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-8 py-4">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">
                               U{item}
                             </div>
                             <div>
                               <p className="text-sm font-bold text-white">Influencer_{item}</p>
                               <p className="text-[10px] text-slate-600">Joined June 2023</p>
                             </div>
                           </div>
                        </td>
                        <td className="px-8 py-4 text-sm font-medium text-slate-300">
                          {Math.floor(Math.random() * 500) + 100}
                        </td>
                        <td className="px-8 py-4 text-emerald-400 font-bold text-sm">
                          ${(Math.random() * 1000).toFixed(2)}
                        </td>
                        <td className="px-8 py-4">
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
