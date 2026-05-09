import React from 'react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { CoinIcon } from '../components/CoinIcon';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, ChevronRight, HelpCircle, Star } from 'lucide-react';

const availableQuizzes = [
  { 
    id: 1, 
    title: 'General Knowledge', 
    reward: 200, 
    questions: 10, 
    time: '5m', 
    difficulty: 'Easy',
    icon: Brain,
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    id: 2, 
    title: 'Gaming Trivia', 
    reward: 500, 
    questions: 15, 
    time: '8m', 
    difficulty: 'Medium',
    icon: Star,
    color: 'from-purple-500 to-pink-600'
  },
  { 
    id: 3, 
    title: 'Science Explorer', 
    reward: 350, 
    questions: 12, 
    time: '6m', 
    difficulty: 'Medium',
    icon: HelpCircle,
    color: 'from-emerald-500 to-teal-600'
  },
];

export const QuizList = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      <TopBar />

      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-3xl font-display font-black italic tracking-tighter text-white">QUIZ & EARN</h2>
        <p className="text-sm text-white/40 font-bold uppercase tracking-wider">Test your brain cells</p>
      </div>

      <div className="flex flex-col gap-4">
        {availableQuizzes.map((quiz, i) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="gaming-card p-5 group flex flex-col gap-4 border-white/10 bg-blue-900/20 hover:bg-blue-800/40 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${quiz.color} flex items-center justify-center shadow-lg`}>
                  <quiz.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-lg font-black text-white">{quiz.title}</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-white/40" />
                      <span className="text-[10px] font-bold text-white/40">{quiz.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-white/40" />
                      <span className="text-[10px] font-bold text-white/40">{quiz.questions} Ques</span>
                    </div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                      {quiz.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <CoinIcon size={16} />
                <span className="font-display font-black text-white">{quiz.reward}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gaming-accent glow-blue w-[15%]" />
              </div>
              <button 
                onClick={() => navigate(`/quiz/${quiz.id}`)}
                className="gaming-button-yellow px-6 py-2.5 text-xs uppercase tracking-tighter"
              >
                START QUIZ
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="gaming-card p-6 border-dashed border-2 border-white/10 bg-white/5 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
          <HelpCircle className="w-6 h-6 text-gaming-accent" />
        </div>
        <div>
          <h5 className="font-black text-white">Create Your Own Quiz?</h5>
          <p className="text-[10px] text-white/40 font-bold mt-1 uppercase">Submit questions & earn 1,000 bonus coins!</p>
        </div>
      </div>
      
    </motion.div>
  );
};
