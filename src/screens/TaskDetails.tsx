import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { ArrowLeft, Clock, Shield, Upload, CheckCircle2, AlertCircle, User, Mail, Smartphone, ExternalLink, Link } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRealtime } from '../context/RealtimeContext';
import { SEO } from '../components/SEO';

export const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const { showToast } = useToast();
  const { lastUpdate } = useRealtime();
  const [task, setTask] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<'none' | 'processing' | 'pending' | 'approval'>('none');
  const [proofFile, setProofFile] = React.useState<File | null>(null);
  const [taskName, setTaskName] = React.useState('');
  const [submitUsername, setSubmitUsername] = React.useState('');
  const [submitEmail, setSubmitEmail] = React.useState('');
  const [linkProof, setLinkProof] = React.useState('');

  React.useEffect(() => {
    const fetchTask = async () => {
      try {
        const tasks = await apiService.getTasks();
        const foundTask = tasks.find((t: any) => t.$id === id);
        if (foundTask) {
          // Parse JSON if needed
          const requirements = typeof foundTask.requirements === 'string' ? JSON.parse(foundTask.requirements) : foundTask.requirements;
          setTask({ ...foundTask, requirements });
          
          const userProgress = await apiService.getUserTaskProgress();
          const taskProgress = userProgress.find((p: any) => p.taskId === id);
          if (taskProgress) {
            setSubmitted(taskProgress.status === 'submitted' || taskProgress.status === 'completed');
            if (taskProgress.status === 'submitted') setStatus('pending');
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
  }, [id, user, lastUpdate]);

  React.useEffect(() => {
    if (task) {
      setTaskName(task.title || '');
    }
  }, [task]);

  React.useEffect(() => {
    if (user) {
      setSubmitUsername(user.username || '');
      setSubmitEmail(user.email || '');
    }
  }, [user]);

  const handleStartTask = async () => {
    if (!task) return;
    try {
      await apiService.startTask(task.$id);
      window.open(task.requirements?.externalLink || task.link, '_blank');
    } catch (err) {
      console.error('Failed to start task');
      window.open(task.requirements?.externalLink || task.link, '_blank');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !task) return;
    
    if (task.requirements?.requireScreenshot && !proofFile) {
      showToast('Please upload a screenshot', 'error');
      return;
    }

    setSubmitting(true);
    setStatus('processing');
    setError(null);
    try {
      let screenshotUrl = '';
      if (proofFile) {
        screenshotUrl = await apiService.uploadFile(proofFile);
      }
      
      const proofs = {
        taskName: taskName || task.title || '',
        username: submitUsername || user?.username || '',
        email: submitEmail || user?.email || '',
        link: linkProof,
        screenshotUrl,
        text: comment,
        timestamp: new Date().toISOString()
      };

      const res = await apiService.submitTaskProof(id, proofs);
      if ((res as any).error) throw new Error((res as any).error);
      
      showToast('Task submitted for review!', 'success');
      setStatus('pending');
      setSubmitted(true);
      refreshUser();

    } catch (err: any) {
      showToast(err.message || 'Submission failed', 'error');
      setStatus('none');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-brand-purple font-black uppercase">Loading Task...</div>;

  if (error && !task) return (
    <div className="gaming-card p-10 flex flex-col items-center gap-4 text-center bg-white border border-slate-100 shadow-xl">
      <AlertCircle className="w-12 h-12 text-red-500" />
      <h3 className="text-xl font-display font-black text-slate-900">{error}</h3>
      <button onClick={() => navigate('/tasks')} className="mt-4 px-8 py-3 bg-brand-purple text-white rounded-xl text-[10px] font-black uppercase shadow-lg">BACK TO TASKS</button>
    </div>
  );

  return (
    <>
      <SEO 
        title={`${task?.title || 'Micro Earning Task'}: Earn ${task?.rewardCoins?.toLocaleString() || '0'} Coins`} 
        description={`Complete the ${task?.title || 'online job'} on Nexvy. Submit your verification proofs and receive instant direct UPI/Paytm wallet credits securely.`}
        keywords={`nexvy task hack, complete task, how to complete task nexvy, earn coins online, secure wallet, get paid doing micro tasks, daily tasks paytm cash`}
      />
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-6"
      >
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
          <ArrowLeft className="w-5 h-5 text-brand-purple" />
        </button>
        <h2 className="text-xl font-display font-black text-brand-purple italic uppercase tracking-tighter">{task?.category}</h2>
      </div>

      <div className="gaming-card p-6 bg-white border-brand-purple/10 overflow-hidden relative shadow-xl">
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-display font-black text-slate-900 leading-tight">{task?.title}</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase font-black">{task?.description}</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-brand-purple/5 flex items-center justify-center border border-brand-purple/10 shadow-inner overflow-hidden shrink-0">
               {task?.imageUrl ? (
                 <img 
                   src={task.imageUrl} 
                   alt={task.title} 
                   className="w-full h-full object-cover" 
                   referrerPolicy="no-referrer"
                 />
               ) : (
                 <div className="p-3 bg-brand-purple rounded-2xl shadow-lg shadow-brand-purple/20">
                   <Upload className="w-6 h-6 text-white" />
                 </div>
               )}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <h4 className="text-xs font-black uppercase text-brand-purple tracking-widest">Instructions:</h4>
            <div className="text-xs text-slate-500 space-y-2 font-medium">
              {task.requirements?.steps?.length > 0 ? (
                <div className="space-y-4">
                  {task.requirements.steps.map((step: string, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-brand-purple flex items-center justify-center text-white font-black shrink-0 text-[10px]">
                        {idx + 1}
                      </div>
                      <p className="pt-0.5 text-slate-600">{step}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-1">
                  <li>Complete the requirement correctly.</li>
                  <li>Take a clearly readable screenshot of completion.</li>
                  <li>Upload it below to receive your reward after manual verification.</li>
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <div className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] text-slate-600 font-bold uppercase">{task.requirements?.minTimeSeconds || 60}s min</span>
            </div>
            <div className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
              <Smartphone className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">{task.requirements?.deviceType || 'All Device'}</span>
            </div>
            {task.visibility?.premiumOnly && (
              <div className="px-3 py-2 bg-amber-50 rounded-xl flex items-center gap-2 border border-amber-100">
                <Shield className="w-3 h-3 text-amber-600" />
                <span className="text-[10px] text-amber-600 font-black uppercase tracking-tighter">Premium</span>
              </div>
            )}
          </div>

          <button 
            onClick={handleStartTask}
            className="w-full mt-2 py-4 bg-brand-purple text-white font-black uppercase rounded-2xl shadow-xl hover:bg-brand-purple/90 transition-all flex items-center justify-center gap-2"
          >
            {task.buttonText || task.requirements?.buttonText || 'Start Task'}
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            {error && <p className="text-xs text-red-500 font-black uppercase text-center">{error}</p>}
            
            <div className="flex flex-col gap-4">
              <label className="text-xs font-black uppercase text-brand-purple italic tracking-wider ml-1">Task Submission Form</label>
              
              <div className="flex flex-col gap-4 bg-slate-50/50 p-5 rounded-3xl border border-slate-100 shadow-sm">
                
                {/* Task Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Task Name</label>
                  <div className="relative">
                    <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-purple" />
                    <input 
                      type="text" 
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      placeholder="Enter task name..."
                      className="w-full bg-white border border-slate-200 focus:border-brand-purple rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-slate-800 focus:outline-none transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* User Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">User Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-purple" />
                    <input 
                      type="text" 
                      value={submitUsername}
                      onChange={(e) => setSubmitUsername(e.target.value)}
                      placeholder="Enter your username..."
                      className="w-full bg-white border border-slate-200 focus:border-brand-purple rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-slate-800 focus:outline-none transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* User Gmail/Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">User Gmail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-purple" />
                    <input 
                      type="email" 
                      value={submitEmail}
                      onChange={(e) => setSubmitEmail(e.target.value)}
                      placeholder="Enter your email address..."
                      className="w-full bg-white border border-slate-200 focus:border-brand-purple rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-slate-800 focus:outline-none transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                {/* Submission Link of the task done */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Completed Task Link / URL</label>
                  <div className="relative">
                    <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-purple" />
                    <input 
                      type="url" 
                      value={linkProof}
                      onChange={(e) => setLinkProof(e.target.value)}
                      placeholder="https://example.com/your-submission-proof"
                      className="w-full bg-white border border-slate-200 focus:border-brand-purple rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold text-slate-800 focus:outline-none transition-all shadow-inner placeholder:text-slate-300"
                    />
                  </div>
                </div>

              </div>
            </div>

            {task.requirements?.requireTextProof && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Submit Proof / Details</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={task.requirements?.textProofPlaceholder || "Enter any proof details..."} 
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-purple min-h-[100px] shadow-sm"
                  required
                />
              </div>
            )}

            {/* Always show response upload for user guidelines */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                Upload Screenshot Proof {task.requirements?.requireScreenshot ? '(Required)' : '(Optional)'}
              </label>
              <input 
                type="file" 
                id="proof-upload" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setProofFile(e.target.files[0]);
                  }
                }}
              />
              <label 
                htmlFor="proof-upload"
                className={`w-full aspect-video bg-white border-2 border-dashed ${proofFile ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200'} rounded-2xl flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-brand-purple/50 transition-all overflow-hidden shadow-sm`}
              >
                {proofFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase">{proofFile.name}</span>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-slate-50 rounded-full">
                      <Upload className="w-8 h-8 text-slate-300 group-hover:text-brand-purple transition-colors" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">Tap to upload screenshot</span>
                  </>
                )}
              </label>
            </div>

            {status === 'processing' && (
              <div className="flex items-center justify-center gap-2 py-2">
                <div className="w-2 h-2 rounded-full bg-brand-purple animate-ping" />
                <span className="text-[10px] font-black text-brand-purple uppercase">Processing Submission...</span>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="gaming-button-yellow w-full py-5 text-2xl font-black uppercase tracking-widest shadow-xl"
          >
            {submitting ? 'SENDING...' : 'SUBMIT PROOF'}
          </button>
        </form>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="gaming-card p-10 flex flex-col items-center gap-6 text-center bg-white border border-slate-100 shadow-xl"
        >
          <div className="flex gap-4">
            <div className="px-3 py-1 bg-amber-500 text-white rounded-full text-[8px] font-black uppercase shadow-md">Pending</div>
            <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[8px] font-black uppercase shadow-md">Success</div>
          </div>

          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-display font-black text-slate-900 uppercase italic">Submission Received</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">Your verification for <b>{task?.title}</b> has been received. Our automated system will review it shortly.</p>
          </div>
          <button 
            onClick={() => navigate('/tasks')}
            className="mt-4 px-8 py-3 bg-brand-purple text-white rounded-xl text-[10px] font-black uppercase shadow-lg"
          >
            Back to Home
          </button>
        </motion.div>
      )}

      <div className="flex items-center gap-3 bg-brand-purple/5 p-4 rounded-2xl border border-brand-purple/10">
         <Shield className="w-5 h-5 text-brand-purple shrink-0" />
         <p className="text-[10px] text-brand-purple/70 font-bold leading-tight uppercase tracking-tight">Warning: Fake screenshots or evidence will result in a permanent account ban.</p>
      </div>

    </motion.div>
    </>
  );
};
