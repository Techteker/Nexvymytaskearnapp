import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { ArrowLeft, Clock, Shield, Upload, CheckCircle2, AlertCircle, User, Mail } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const { showToast } = useToast();
  const [task, setTask] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<'none' | 'processing' | 'pending' | 'approval'>('none');

  React.useEffect(() => {
    const fetchTask = async () => {
      try {
        const tasks = await apiService.getTasks();
        const foundTask = tasks.find((t: any) => t.id === id);
        if (foundTask) {
          setTask(foundTask);
          if (user?.completedTasks?.includes(id)) {
            setSubmitted(true);
          }
        } else {
          setError('Task not found');
        }
      } catch (err) {
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    setStatus('processing');
    setError(null);
    try {
      const res = await apiService.submitTask(id, comment);
      if (res.error) throw new Error(res.error);
      
      // Artificial delay to show "Processing" state as requested
      setTimeout(() => {
        setStatus('pending');
        setSubmitted(true);
        refreshUser();
      }, 1500);

    } catch (err: any) {
      setError(err.message);
      setStatus('none');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-white font-black uppercase">Loading Task...</div>;

  if (error && !task) return (
    <div className="gaming-card p-10 flex flex-col items-center gap-4 text-center">
      <AlertCircle className="w-12 h-12 text-red-500" />
      <h3 className="text-xl font-display font-black text-white">{error}</h3>
      <button onClick={() => navigate('/tasks')} className="mt-4 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white">BACK TO TASKS</button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl border border-white/10">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h2 className="text-xl font-display font-black text-white italic">{task?.category}</h2>
      </div>

      <div className="gaming-card p-6 bg-blue-900/40 border-gaming-accent/30 overflow-hidden relative">
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-display font-black text-white">{task?.title}</h3>
              <p className="text-xs text-white/40 mt-1 uppercase font-black">{task?.description}</p>
            </div>
            <div className="p-3 bg-gaming-accent rounded-xl shadow-lg glow-blue">
               <Upload className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <h4 className="text-xs font-black uppercase text-white/60 tracking-wider">Instructions:</h4>
            <ul className="text-xs text-white/50 space-y-2 list-disc list-inside">
              <li>Open the task using the "Start Task" button below.</li>
              <li>Complete the requirement correctly.</li>
              <li>Take a clearly readable screenshot of completion.</li>
              <li>Upload it below to receive your {task?.reward} coins instantly.</li>
            </ul>
          </div>

          <button 
            onClick={() => window.open(task?.link, '_blank')}
            className="w-full mt-2 py-4 bg-white text-black font-black uppercase rounded-2xl shadow-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
          >
            Start Task
          </button>
        </div>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {error && <p className="text-xs text-red-500 font-black uppercase text-center">{error}</p>}
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-white/40 ml-2">Task Details</label>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    value={task?.title || ''} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white/60 focus:outline-none"
                    readOnly
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    value={user?.username || ''} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white/60 focus:outline-none"
                    readOnly
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    value={user?.email || ''} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white/60 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-white/40 ml-2">Submit Proof / Details</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter any proof details (e.g. your username in that app)..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold focus:outline-none focus:border-gaming-accent min-h-[100px]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-white/40 ml-2">Upload Screenshot</label>
              <div className="w-full aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-gaming-accent/50 transition-colors">
                <div className="p-4 bg-white/5 rounded-full">
                  <Upload className="w-8 h-8 text-white/20 group-hover:text-gaming-accent transition-colors" />
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest text-center px-4">Click to select screenshot</span>
              </div>
            </div>

            {status === 'processing' && (
              <div className="flex items-center justify-center gap-2 py-2">
                <div className="w-2 h-2 rounded-full bg-gaming-accent animate-ping" />
                <span className="text-[10px] font-black text-gaming-accent uppercase">Processing Submission...</span>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="gaming-button-yellow w-full py-5 text-2xl font-black uppercase tracking-tighter"
          >
            {submitting ? 'PROCESSING...' : 'SUBMIT TASK'}
          </button>
        </form>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="gaming-card p-10 flex flex-col items-center gap-6 text-center bg-green-500/10 border-green-500/20"
        >
          <div className="flex gap-4">
            <div className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-[8px] font-black uppercase border border-yellow-500/30">Pending</div>
            <div className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-[8px] font-black uppercase border border-green-500/30">Processing</div>
            <div className="px-3 py-1 bg-blue-500 bg-blue-500 text-white rounded-full text-[8px] font-black uppercase shadow-lg glow-blue">Approval</div>
          </div>

          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-display font-black text-white uppercase italic">Task Pending Approval</h3>
            <p className="text-xs text-white/40 mt-2">Your submission for <b>{task?.title}</b> has been received. Our team will verify it soon. Status: <span className="text-gaming-accent">Approval Phase</span></p>
          </div>
          <button 
            onClick={() => navigate('/tasks')}
            className="mt-4 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase text-white"
          >
            Back to Tasks
          </button>
        </motion.div>
      )}

      <div className="flex items-center gap-3 bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
         <Shield className="w-5 h-5 text-gaming-accent shrink-0" />
         <p className="text-[10px] text-blue-200 font-bold leading-tight">Fake screenshots or invalid data will result in a permanent ban and balance reset.</p>
      </div>

    </motion.div>
  );
};
