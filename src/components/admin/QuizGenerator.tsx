import React, { useState } from 'react';
import { geminiService } from '../../services/geminiService';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  BrainCircuit, 
  Sparkles, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle,
  Timer,
  Coins,
  Settings2,
  Globe,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuizGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [reward, setReward] = useState(100);
  const [timer, setTimer] = useState(30);
  
  const [loading, setLoading] = useState(false);
  const [quizList, setQuizList] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const generateQuiz = async () => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    setQuizList(null);
    setSaved(false);
    
    try {
      const questions = await geminiService.generateQuiz(topic, count, difficulty, language);
      setQuizList(questions);
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz. Check API key.');
    } finally {
      setLoading(false);
    }
  };

  const saveToDatabase = async () => {
    if (!db || !quizList) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'quiz'), {
        topic,
        difficulty,
        language,
        questions: quizList,
        rewardCoins: reward,
        timer: timer,
        createdAt: serverTimestamp()
      });
      setSaved(true);
    } catch (err: any) {
      setError(err.message || 'Failed to save quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
               <BrainCircuit className="text-purple-400" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white">AI Quiz Generator</h1>
          </div>
          <p className="text-slate-400">Generate professional quizzes in seconds using Gemini AI.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Config Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 p-8 shadow-xl">
             <div className="flex items-center gap-2 mb-6 text-slate-200 font-bold">
               <Settings2 size={18} />
               Configuration
             </div>

             <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Quiz Topic</label>
                  <input 
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Indian History, Crypto..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Questions</label>
                    <select 
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                    >
                      {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Difficulty</label>
                    <select 
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-400 mb-2">Language</label>
                   <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
                      <button 
                         onClick={() => setLanguage('en')}
                         className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all ${
                           language === 'en' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                         }`}
                      >
                        <Globe size={14} /> English
                      </button>
                      <button 
                         onClick={() => setLanguage('hi')}
                         className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all ${
                           language === 'hi' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                         }`}
                      >
                         <Globe size={14} /> Hindi
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                   <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                      <Coins size={14} /> Reward
                    </label>
                    <input 
                      type="number"
                      value={reward}
                      onChange={(e) => setReward(Number(e.target.value))}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                      <Timer size={14} /> Timer (s)
                    </label>
                    <input 
                      type="number"
                      value={timer}
                      onChange={(e) => setTimer(Number(e.target.value))}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <button 
                  onClick={generateQuiz}
                  disabled={loading || !topic}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                  Generate AI Quiz
                </button>
             </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
           <AnimatePresence mode="wait">
             {loading ? (
               <motion.div 
                 key="loading"
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/20 rounded-3xl border border-slate-800 border-dashed"
               >
                 <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                 <p className="text-slate-400 font-medium">Artificial intelligence is thinking...</p>
               </motion.div>
             ) : error ? (
               <motion.div 
                 key="error"
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center"
               >
                 <AlertCircle className="mx-auto text-rose-500 mb-4" size={48} />
                 <h3 className="text-xl font-bold text-white mb-2">Generation Failed</h3>
                 <p className="text-rose-400">{error}</p>
                 <button onClick={generateQuiz} className="mt-6 text-white bg-slate-800 px-6 py-2 rounded-xl">Try Again</button>
               </motion.div>
             ) : quizList ? (
               <motion.div 
                 key="results"
                 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                 className="space-y-6"
               >
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                       <CheckCircle2 className="text-emerald-500" />
                       Content Ready
                    </h2>
                    <div className="flex gap-3">
                       <button 
                         onClick={generateQuiz}
                         className="flex items-center gap-2 px-4 py-2 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800 transition-all text-sm font-bold"
                       >
                         <RefreshCw size={16} /> Re-generate
                       </button>
                       <button 
                         onClick={saveToDatabase}
                         disabled={saved}
                         className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all text-sm font-bold ${
                           saved 
                           ? 'bg-emerald-500 text-white' 
                           : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/20'
                         }`}
                       >
                         {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
                         {saved ? 'Saved to App' : 'Publish Quiz'}
                       </button>
                    </div>
                 </div>

                 <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                   {quizList.map((q, idx) => (
                     <div key={idx} className="p-6 bg-slate-900/40 border border-slate-800 rounded-2.5xl space-y-4">
                        <div className="flex items-start gap-4">
                           <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 font-bold shrink-0">
                             {idx + 1}
                           </div>
                           <p className="text-lg font-semibold text-slate-200 pt-1">{q.question}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pl-12">
                           {q.options.map((opt: string, oIdx: number) => (
                             <div 
                               key={oIdx}
                               className={`px-4 py-3 rounded-xl border text-sm font-medium ${
                                 oIdx === q.correctAnswer 
                                 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                 : 'bg-slate-800/50 border-slate-700 text-slate-400'
                               }`}
                             >
                               {String.fromCharCode(65 + oIdx)}. {opt}
                             </div>
                           ))}
                        </div>
                     </div>
                   ))}
                 </div>
               </motion.div>
             ) : (
               <motion.div 
                 key="idle"
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/20 rounded-3xl border border-slate-800 border-dashed"
               >
                 <HelpCircle className="text-slate-700 mb-4" size={64} />
                 <h3 className="text-xl font-bold text-slate-300">Generate your first quiz</h3>
                 <p className="text-slate-500">Enter a topic on the left to start generating content.</p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
