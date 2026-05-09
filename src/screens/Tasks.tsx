import React from 'react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AppWindow, PlayCircle, FileText, CheckCircle2, HelpCircle } from 'lucide-react';
import { CoinIcon } from '../components/CoinIcon';

import { apiService } from '../services/api';

const categories = ['All', 'Surveys', 'App Install', 'Games', 'Quiz'];

const iconMap: Record<string, any> = {
  'Surveys': FileText,
  'App Install': AppWindow,
  'Ads': PlayCircle,
  'Quiz': HelpCircle,
  'All': CheckCircle2
};

export const Tasks = () => {
  const [activeTab, setActiveTab] = React.useState('All');
  const [tasks, setTasks] = React.useState<any[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    apiService.getTasks().then(setTasks);
  }, []);

  const handleStartTask = (task: any) => {
    if (task.category === 'Quiz') {
      navigate('/quizzes');
    } else if (['Surveys', 'App Install', 'Games', 'Quiz'].includes(task.category)) {
      navigate(`/task/${task.id}`);
    } else {
      // Direct action for ads or simple tasks
      alert('Task Started!');
    }
  };

  const filteredTasks = activeTab === 'All' 
    ? tasks 
    : tasks.filter(t => t.category === activeTab);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      <TopBar />

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-display font-black italic tracking-tighter text-white">EARN COINS</h2>
        
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold focus:outline-none focus:border-gaming-accent transition-colors"
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
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all whitespace-nowrap ${
                activeTab === cat 
                ? 'bg-gaming-accent glow-blue text-white' 
                : 'bg-white/5 text-white/40 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredTasks.length === 0 && <div className="col-span-2 text-center text-white/20 font-bold py-10 uppercase text-xs tracking-widest">No tasks found in this category</div>}
        {filteredTasks.map((task, i) => {
          const TaskIcon = iconMap[task.category] || iconMap['All'];
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="gaming-card p-4 flex flex-col items-center text-center gap-3 group hover:bg-blue-700/20 transition-all cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gaming-accent/20 to-blue-500/10 flex items-center justify-center border border-white/10 shadow-inner group-hover:border-gaming-accent/30 transition-all">
                <TaskIcon className="w-8 h-8 text-gaming-accent" />
              </div>
              
              <div className="flex flex-col gap-1 min-h-[40px] justify-center">
                <h4 className="font-black text-xs text-white leading-tight">{task.title}</h4>
                <p className="text-[9px] text-white/40 font-bold uppercase tracking-tighter">{task.category}</p>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 w-full justify-center">
                <CoinIcon size={14} />
                <span className="font-display font-bold text-sm text-white">{task.reward}</span>
              </div>
              
              <button 
                onClick={() => handleStartTask(task)}
                className="w-full py-2 bg-gaming-accent text-white text-[10px] font-black uppercase rounded-lg shadow-lg glow-blue hover:scale-105 transition-transform"
              >
                START
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
