import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { CoinIcon } from '../components/CoinIcon';
import { Timer, CheckCircle2, XCircle, ChevronRight, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

const sampleQuizData = {
  1: {
    title: 'General Knowledge',
    questions: [
      {
        id: 1,
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correct: 1
      },
      {
        id: 2,
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correct: 2
      },
      {
        id: 3,
        question: 'Which is the largest ocean on Earth?',
        options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'],
        correct: 2
      }
    ]
  }
};

export const QuizGame = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);
  const [showResult, setShowResult] = React.useState(false);
  const [isAnswering, setIsAnswering] = React.useState(false);

  // Use sample data or fallback
  const quiz = sampleQuizData[id as unknown as keyof typeof sampleQuizData] || sampleQuizData[1];
  const totalQuestions = quiz.questions.length;
  const question = quiz.questions[currentQuestion];

  const handleOptionSelect = (index: number) => {
    if (isAnswering) return;
    setSelectedOption(index);
    setIsAnswering(true);

    const isCorrect = index === question.correct;
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(q => q + 1);
        setSelectedOption(null);
        setIsAnswering(false);
      } else {
        setShowResult(true);
        if (score + (isCorrect ? 1 : 0) === totalQuestions) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#ffffff', '#3b82f6']
          });
        }
      }
    }, 1500);
  };

  const collectReward = async () => {
    try {
      const res = await fetch('/api/user/quiz/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ score, total: totalQuestions }),
      });
      if (!res.ok) throw new Error('Claim failed');
      navigate('/quizzes');
      window.location.reload();
    } catch (err) {
      alert('Error claiming reward');
      navigate('/quizzes');
    }
  };

  if (showResult) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 text-center pt-10">
        <div className="relative flex justify-center">
            <div className="w-32 h-32 rounded-full bg-gaming-accent/20 flex items-center justify-center animate-pulse">
                <Trophy className="w-16 h-16 text-gaming-accent" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="w-40 h-40 border-2 border-dashed border-gaming-accent/20 rounded-full" />
            </div>
        </div>

        <div>
            <h2 className="text-4xl font-display font-black text-white italic tracking-tighter">QUIZ COMPLETED!</h2>
            <p className="text-white/40 mt-2 font-bold uppercase">You have mastered this challenge</p>
        </div>

        <div className="gaming-card p-8 flex flex-col gap-6 border-white/20">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-1 border-r border-white/10">
                    <span className="text-[10px] font-black uppercase text-white/40">Your Score</span>
                    <span className="text-3xl font-display font-black text-white">{score}/{totalQuestions}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black uppercase text-white/40">Coins Earned</span>
                    <div className="flex items-center gap-1">
                        <CoinIcon size={24} />
                        <span className="text-3xl font-display font-black text-coin-gold">{(score / totalQuestions * 200).toFixed(0)}</span>
                    </div>
                </div>
            </div>
            
            <button 
                onClick={collectReward}
                className="gaming-button-yellow w-full py-4 text-xl tracking-tight"
            >
                COLLECT REWARD
            </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <TopBar />

      <div className="flex items-center justify-between gap-4">
        <button onClick={() => navigate('/quizzes')} className="text-white/40 font-bold uppercase text-xs">Quit</button>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-950/60 rounded-xl border border-white/10">
            <Timer className="w-4 h-4 text-gaming-accent" />
            <span className="text-sm font-black text-white">04:52</span>
        </div>
        <div className="text-xs font-black text-white">
            <span className="text-gaming-accent">{currentQuestion + 1}</span>
            <span className="text-white/20"> / {totalQuestions}</span>
        </div>
      </div>

      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            className="h-full bg-gaming-accent glow-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
        />
      </div>

      <div className="gaming-card p-8 min-h-[160px] flex items-center justify-center text-center bg-blue-900/40 relative overflow-hidden">
        <h3 className="text-xl font-display font-black text-white leading-tight z-10">{question.question}</h3>
        <HelpCircle className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5" />
      </div>

      <div className="flex flex-col gap-3">
        {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = isAnswering && index === question.correct;
            const isWrong = isAnswering && isSelected && index !== question.correct;

            return (
                <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={isAnswering}
                    className={`gaming-card p-5 flex items-center justify-between transition-all duration-300 transform active:scale-[0.98] ${
                        isCorrect ? 'bg-green-500/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' :
                        isWrong ? 'bg-red-500/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' :
                        isSelected ? 'bg-blue-600/40 border-white shadow-xl' :
                        'bg-blue-800/20 border-white/10 hover:bg-blue-700/30'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border ${
                            isCorrect ? 'bg-green-500 border-green-400 text-white' :
                            isWrong ? 'bg-red-500 border-red-400 text-white' :
                            isSelected ? 'bg-white border-white text-blue-900' :
                            'bg-white/5 border-white/10 text-white/40'
                        }`}>
                            {String.fromCharCode(65 + index)}
                        </div>
                        <span className={`text-base font-bold ${isSelected ? 'text-white' : 'text-white/80'}`}>{option}</span>
                    </div>
                    
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in" />}
                    {isWrong && <XCircle className="w-5 h-5 text-red-500 animate-in zoom-in" />}
                </button>
            );
        })}
      </div>

    </motion.div>
  );
};

// Internal icon for the card
const HelpCircle = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
);
