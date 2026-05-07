import React from 'react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { Search, Filter, AppWindow, PlayCircle, FileText, CheckCircle2 } from 'lucide-react';
import { CoinIcon } from '../components/CoinIcon';

const categories = ['All', 'Surveys', 'App Install', 'Games', 'Quiz'];

export const Tasks = () => {
  const [activeTab, setActiveTab] = React.useState('All');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      <TopBar />

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-display font-extrabold">Available Tasks</h2>
        
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-gaming-accent transition-colors"
            />
          </div>
          <button className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <Filter className="w-5 h-5 text-white/40" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === cat 
                ? 'bg-gaming-accent glow-blue' 
                : 'bg-white/5 text-white/40 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-4">
        {[
          { icon: FileText, title: 'Finance Survey', reward: 150, time: '3m', diff: 'Easy' },
          { icon: AppWindow, title: 'Install Nexo App', reward: 1200, time: '5m', diff: 'Med' },
          { icon: PlayCircle, title: 'Watch 5 Video Ads', reward: 50, time: '2m', diff: 'Instant' },
          { icon: CheckCircle2, title: 'Daily Check-in', reward: 20, time: '1m', diff: 'Easy' },
        ].map((task, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="gaming-card p-5 group hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gaming-accent/20 to-blue-500/10 flex items-center justify-center border border-white/10">
                  <task.icon className="w-7 h-7 text-gaming-accent" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-white">{task.title}</h4>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter bg-white/5 px-2 py-0.5 rounded">
                      {task.diff}
                    </span>
                    <span className="text-[10px] text-white/40 font-bold">{task.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <CoinIcon size={14} />
                <span className="font-display font-bold text-coin-gold">{task.reward}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex-1 max-w-[120px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-gaming-accent glow-blue" />
              </div>
              <button className="bg-gaming-accent/10 text-gaming-accent hover:bg-gaming-accent hover:text-white px-6 py-2 rounded-xl text-xs font-extrabold transition-all">
                START
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
