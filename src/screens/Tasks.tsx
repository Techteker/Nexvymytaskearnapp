import React from 'react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AppWindow, PlayCircle, FileText, CheckCircle2, HelpCircle } from 'lucide-react';
import { CoinIcon } from '../components/CoinIcon';

import { apiService } from '../services/api';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';
import { useRealtime } from '../context/RealtimeContext';
import { Skeleton } from '../components/Skeleton';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';


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
  const [search, setSearch] = React.useState('');
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [dynamicCategories, setDynamicCategories] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { lastUpdate } = useRealtime();

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [res, cats] = await Promise.all([
          apiService.getTasks(),
          adminService.getCategories()
        ]);
        setTasks(res);
        if (cats.length > 0) {
          setDynamicCategories(['All', ...cats.map((c: any) => c.name)]);
        }
      } catch (e) {
        console.error('Failed to load tasks data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [lastUpdate]);

  const handleStartTask = (task: any) => {
    if (task.type === 'quiz') {
      navigate('/survey');
    } else {
      navigate(`/task/${task.$id}`);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesTab = activeTab === 'All' || t.category === activeTab;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const displayCategories = dynamicCategories.length > 0 ? dynamicCategories : categories;

  // Dynamic SEO based on active category tab to capture targeted organic Google search traffic
  let seoTitle = "Earn Daily Money Online: Easy Tasks & Offers - Nexvy";
  let seoDesc = "Join Nexvy to earn real money online with high-paying daily tasks and offers. Complete simple microtasks from home, get daily payouts & cash out instantly!";
  let seoKeywords = "earn money online, daily earning app, work from home, nexvy app, make money online india, online micro tasks, cash reward app, high paying tasks, easy money apps, get paid daily";

  if (activeTab === 'Games') {
    seoTitle = "Play & Earn Free Cash: Fun Online Web Games - Nexvy";
    seoDesc = "Play premium online games for free on Nexvy and earn real cash. Track your daily gaming activity, level up your scores & withdraw payments instantly to UPI.";
    seoKeywords = "play and earn, money earning games, play games win cash, run and earn, nexvy games, online games to earn money, free paytm cash games, gaming rewards app, upi earning games";
  } else if (activeTab === 'Surveys') {
    seoTitle = "Paid Online Surveys: Extra Daily Earning - Nexvy";
    seoDesc = "Take high-paying online surveys on Nexvy & earn premium rewards daily. Share your opinion honestly on brand questions and receive direct cash rewards.";
    seoKeywords = "paid surveys online, take online surveys, earn money surveys, surveys for cash india, nexvy surveys, high reward surveys, earn gold coins, cpx surveys, best survey app";
  } else if (activeTab === 'Quiz') {
    seoTitle = "Trivia Quiz Earning: Answer Quizzes for Cash - Nexvy";
    seoDesc = "Play daily fun quizzes and earn money on Nexvy app. Challenge your general knowledge in diverse topics, answer correctly, and earn instant coin payouts.";
    seoKeywords = "quiz earn money, trivia quizzes, quizzes for cash, learn and earn india, nexvy quiz, gk quiz question, win coins online, real money quiz app, brain game rewards";
  }

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
      />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-6"
      >
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-display font-black italic tracking-tighter text-brand-purple">EARN COINS</h2>
        
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..." 
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {displayCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all whitespace-nowrap shadow-sm ${
                activeTab === cat 
                ? 'bg-brand-purple text-white' 
                : 'bg-white text-slate-400 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Small 320x50 Adsterra Banner Ad */}
      <AdBanner type="small" />

      {/* Task Grid */}
      <div className="grid grid-cols-2 gap-4">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="gaming-card p-4 flex flex-col items-center gap-3">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-full mt-2" />
            </div>
          ))
        ) : filteredTasks.length === 0 ? (
          <div className="col-span-2 text-center text-slate-300 font-bold py-10 uppercase text-xs tracking-widest">No tasks found</div>
        ) : (
          filteredTasks.map((task, i) => {
            const TaskIcon = iconMap[task.category] || iconMap['All'];
            return (
              <motion.div
                key={task.$id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="gaming-card p-4 flex flex-col items-center text-center gap-3 group hover:bg-slate-50 transition-all cursor-pointer border border-slate-100 shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-purple/5 flex items-center justify-center border border-brand-purple/10 shadow-inner group-hover:border-brand-purple/30 overflow-hidden transition-all">
                  {task.imageUrl ? (
                    <img 
                      src={task.imageUrl} 
                      alt={task.title} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <TaskIcon className="w-8 h-8 text-brand-purple" />
                  )}
                </div>
                
                <div className="flex flex-col gap-1 min-h-[40px] justify-center">
                  <h4 className="font-black text-xs text-slate-900 leading-tight">{task.title}</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{task.category}</p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-purple/5 border border-brand-purple/10 w-full justify-center">
                  <CoinIcon size={14} />
                  <span className="font-display font-bold text-sm text-brand-purple">{task.reward}</span>
                </div>
                
                <button 
                  onClick={() => handleStartTask(task)}
                  className="w-full py-2 bg-brand-purple text-white text-[10px] font-black uppercase rounded-lg shadow-lg hover:bg-brand-purple/90 transition-all"
                >
                  START
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Large 300x250 Adsterra Promotional Banner Ad */}
      <div className="mt-2">
        <AdBanner type="large" />
      </div>

    </motion.div>
    </>
  );
};
