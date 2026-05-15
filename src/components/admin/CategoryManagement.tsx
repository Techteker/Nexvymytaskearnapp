import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { TaskCategory } from '../../types';
import { Plus, Edit2, Trash2, Check, X, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../context/ToastContext';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMode, setNewMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', icon: '' });
  const { showToast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await adminService.getCategories();
    setCategories(data as any);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      showToast('Name and Slug are required', 'error');
      return;
    }

    if (editingId) {
      const res = await adminService.updateCategory(editingId, formData);
      if (!(res as any).error) {
        showToast('Category updated', 'success');
        setEditingId(null);
        fetchCategories();
      }
    } else {
      const res = await adminService.createCategory(formData);
      if (!(res as any).error) {
        showToast('Category created', 'success');
        setNewMode(false);
        setFormData({ name: '', slug: '', description: '', icon: '' });
        fetchCategories();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const success = await adminService.deleteCategory(id);
      if (success) {
        showToast('Category deleted', 'success');
        fetchCategories();
      }
    }
  };

  const startEdit = (cat: TaskCategory) => {
    setEditingId(cat.id || (cat as any).$id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      icon: cat.icon || ''
    });
    setNewMode(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Task Categories</h1>
          <p className="text-slate-400 text-sm">Manage categories for proper task organization</p>
        </div>
        <button
          onClick={() => {
            setNewMode(true);
            setEditingId(null);
            setFormData({ name: '', slug: '', description: '', icon: '' });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <AnimatePresence>
        {(newMode || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Gaming"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Slug (Unique)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="e.g., gaming"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Icon (Lucide name or Emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., Gamepad2"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description of this category..."
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setNewMode(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all font-semibold"
              >
                <Check size={18} />
                Save Category
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-slate-800/50 animate-pulse rounded-2xl" />
          ))
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id || (cat as any).$id}
              className="p-5 bg-slate-800/30 border border-slate-700/50 rounded-2xl hover:border-purple-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center text-purple-400">
                  <Tag size={20} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id || (cat as any).$id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{cat.name}</h3>
              <p className="text-xs text-slate-500 font-mono mb-2">/{cat.slug}</p>
              <p className="text-sm text-slate-400 line-clamp-2">{cat.description || 'No description provided.'}</p>
              <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
                 <span className={`${cat.isActive ? 'text-green-400' : 'text-slate-500'}`}>
                    {cat.isActive ? '● Active' : '○ Inactive'}
                 </span>
                 <span className="text-slate-600">ID: {(cat as any).$id?.substring(0,8)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
