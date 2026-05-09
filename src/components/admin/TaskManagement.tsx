import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Task, TaskCategory } from '../../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  X,
  Image as ImageIcon,
  Calendar,
  Layers,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    category: TaskCategory.QUIZ,
    rewardCoins: 100,
    link: '',
    instructions: '',
    difficulty: 'easy',
    status: 'active',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const data = await adminService.getTasks();
    setTasks(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      await adminService.updateTask(editingTask.id, formData);
    } else {
      await adminService.createTask(formData as any);
    }
    setModalOpen(false);
    setEditingTask(null);
    loadTasks();
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData(task);
    setModalOpen(true);
  };

  const toggleTaskStatus = async (task: Task) => {
    await adminService.updateTask(task.id, { 
      status: task.status === 'active' ? 'inactive' : 'active' 
    });
    loadTasks();
  };

  const deleteTask = async (id: string) => {
    if (confirm('Delete this task? Users already progress will not be rewarded.')) {
      await adminService.deleteTask(id);
      loadTasks();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Campaign Management</h1>
          <p className="text-slate-400">Create and monitor earning tasks for your users.</p>
        </div>
        
        <button 
          onClick={() => {
            setEditingTask(null);
            setFormData({
              title: '',
              description: '',
              category: TaskCategory.QUIZ,
              rewardCoins: 100,
              link: '',
              instructions: '',
              difficulty: 'easy',
              status: 'active',
            });
            setModalOpen(true);
          }}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
        >
          <Plus size={20} />
          Create New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-slate-800/50 rounded-3xl animate-pulse"></div>
          ))
        ) : tasks.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-500 bg-slate-900/40 rounded-3xl border border-dashed border-slate-700">
            No tasks found. Start by creating a new one.
          </div>
        ) : tasks.map((task) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`group bg-slate-900/40 backdrop-blur-md rounded-3.5xl border border-slate-800 hover:border-purple-500/30 transition-all p-1 overflow-hidden h-full flex flex-col ${
              task.status === 'inactive' ? 'opacity-60' : ''
            }`}
          >
            {/* Banner Placeholder */}
            <div className="h-40 bg-slate-800 rounded-3xl relative overflow-hidden m-1">
              {task.imageUrl ? (
                <img src={task.imageUrl} alt={task.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-blue-900/40">
                  <Layers className="text-slate-700" size={48} />
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide">
                  {task.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide ${
                  task.difficulty === 'easy' ? 'bg-emerald-500/80 text-white' : 
                  task.difficulty === 'medium' ? 'bg-amber-500/80 text-white' : 'bg-rose-500/80 text-white'
                }`}>
                  {task.difficulty}
                </span>
              </div>
              <div className="absolute top-4 right-4 h-8 px-3 bg-amber-500 rounded-xl flex items-center gap-1.5 shadow-lg">
                <Coins size={14} className="text-white" />
                <span className="text-white font-bold text-sm">{task.rewardCoins}</span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{task.title}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">{task.description}</p>
              
              <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(task)}
                    className="p-2.5 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => toggleTaskStatus(task)}
                    className={`p-2.5 rounded-xl transition-all ${
                      task.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                        : 'bg-slate-800/50 text-slate-500 hover:text-white'
                    }`}
                  >
                    {task.status === 'active' ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button 
                     onClick={() => deleteTask(task.id)}
                     className="p-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <a 
                  href={task.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2.5 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-xl transition-all"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3.5xl shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {editingTask ? 'Configure Campaign' : 'Launch New Campaign'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Campaign Title</label>
                      <input 
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g. Finance Survey 2026"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Instructions (Step by step)</label>
                      <textarea 
                        rows={4}
                        value={formData.instructions}
                        onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="1. Open link\n2. Register..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Reward Amount (Coins)</label>
                      <div className="relative">
                        <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
                        <input 
                          type="number"
                          value={formData.rewardCoins}
                          onChange={(e) => setFormData({...formData, rewardCoins: Number(e.target.value)})}
                          required
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Target Link</label>
                      <input 
                        type="url"
                        value={formData.link}
                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                        required
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://app.example.com"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value as TaskCategory})}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                        >
                          {Object.values(TaskCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Difficulty</label>
                        <select 
                          value={formData.difficulty}
                          onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex justify-end gap-4">
                   <button 
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-6 py-3 border border-slate-700 text-slate-400 rounded-2xl hover:bg-slate-800 transition-all font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-purple-500/20 transition-all"
                  >
                    {editingTask ? 'Save Changes' : 'Launch Campaign'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
