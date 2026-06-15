import React from 'react';
import { Home, ClipboardList, Wallet, Users, Settings, Bell, CircleCheck, ShieldAlert } from 'lucide-react';

export default function WebDashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = React.useState('dashboard');

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard Overview', icon: Home },
    { id: 'tasks', name: 'Task & Survey Wall', icon: ClipboardList },
    { id: 'wallet', name: 'Payout Wallet', icon: Wallet },
    { id: 'referrals', name: 'Affiliation Trees', icon: Users },
    { id: 'settings', name: 'Account Preference', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans overflow-hidden">
      {/* 1. Left Sidebar Navigation Panel */}
      <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-4 mb-8">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              ⚡
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-white italic">Nexvy Web</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-sm font-bold uppercase transition-all tracking-wider ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/15'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Verification Status Banner */}
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
          <CircleCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">KYC VERIFIED</h4>
            <div className="text-[10px] text-slate-400 font-medium">Auto-payout fully enabled.</div>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Board */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header toolbar */}
        <header className="h-20 border-b border-slate-900 flex items-center justify-between px-10 bg-slate-950">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold tracking-tight text-white uppercase">
              {activeTab.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Quick Balance indicator */}
            <div className="px-5 py-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-none">Coins:</span>
              <span className="font-mono font-black text-yellow-400 text-sm">85,200</span>
              <span className="text-slate-400 font-bold">≈ ₹852.00</span>
            </div>

            {/* Notification alert */}
            <button className="relative p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
              <Bell className="w-5 h-5 animate-pulse" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900" />
            </button>
          </div>
        </header>

        {/* Dynamic page context area */}
        <main className="flex-1 overflow-y-auto p-12 bg-slate-950/50">
          {children || (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Stat card 1 */}
              <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Earned Coins</span>
                  <div className="text-4xl font-mono font-black text-white mt-4">124,500</div>
                </div>
                <div className="text-indigo-400 font-bold text-xs uppercase tracking-wider mt-6">View Earn History &rarr;</div>
              </div>

              {/* Stat card 2 */}
              <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Completed Offers</span>
                  <div className="text-4xl font-mono font-black text-white mt-4">42 Quests</div>
                </div>
                <div className="text-indigo-400 font-bold text-xs uppercase tracking-wider mt-6">Browse Available Tasks &rarr;</div>
              </div>

              {/* Stat card 3 */}
              <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Affiliated Invites</span>
                  <div className="text-4xl font-mono font-black text-white mt-4">12 Users</div>
                </div>
                <div className="text-indigo-400 font-bold text-xs uppercase tracking-wider mt-6">View Referral Tree &rarr;</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
