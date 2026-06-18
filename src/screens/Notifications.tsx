import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  Trash2, 
  CheckCheck, 
  Sparkles, 
  Clock, 
  Gift, 
  ShieldAlert, 
  Coins, 
  Award, 
  ArrowLeft,
  X,
  Info,
  CheckCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CoinIcon } from '../components/CoinIcon';

// Unread tracking in LocalStorage helper
const getReadNotifIds = (): string[] => {
  try {
    const saved = localStorage.getItem('user_read_notifications');
    return saved ? JSON.parse(saved) : [];
  } catch (_) {
    return [];
  }
};

const saveReadNotifIds = (ids: string[]) => {
  try {
    localStorage.setItem('user_read_notifications', JSON.stringify(ids));
  } catch (_) {}
};

export const Notifications = () => {
  const navigate = useNavigate();
  const { user, isSimulationMode } = useAuth();
  const { showToast } = useToast();
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'reward' | 'system' | 'alerts'>('all');

  // Load notifications from merged service endpoints
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await apiService.getNotifications();
      // Only keep relevant user notifications or system updates
      setNotifications(data || []);
      setReadIds(getReadNotifIds());
    } catch (err: any) {
      console.error('[NOTIFICATIONS] Load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Custom real-time events triggered locally or by live database subscription push integrations
    const handleRealtimeUpdate = () => {
      console.log('[REALTIME-SCREEN] Notification received, updating feed.');
      loadNotifications();
    };

    window.addEventListener('nexvy_realtime_update', handleRealtimeUpdate);
    const interval = setInterval(loadNotifications, 10000); // Polling safeguard

    return () => {
      window.removeEventListener('nexvy_realtime_update', handleRealtimeUpdate);
      clearInterval(interval);
    };
  }, []);

  // Handle Mark All as Read
  const handleMarkAllRead = () => {
    if (notifications.length === 0) return;
    const allIds = notifications.map(n => n.$id || n.id);
    setReadIds(allIds);
    saveReadNotifIds(allIds);
    showToast('All messages marked as read.', 'success');
  };

  // Toggle Read Status of a single item
  const handleToggleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (readIds.includes(id)) {
      updated = readIds.filter(item => item !== id);
    } else {
      updated = [...readIds, id];
    }
    setReadIds(updated);
    saveReadNotifIds(updated);
  };

  // Delete notification (locally filtered or cleared)
  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Track deleted notifications locally to prevent re-fetching the same remote items
    try {
      const deleted = localStorage.getItem('user_deleted_notifications');
      const deletedList = deleted ? JSON.parse(deleted) : [];
      deletedList.push(id);
      localStorage.setItem('user_deleted_notifications', JSON.stringify(deletedList));
    } catch (_) {}

    // Update screen state
    setNotifications(prev => prev.filter(n => (n.$id || n.id) !== id));
    showToast('Notification cleared.', 'info');
  };

  // Absolute Clear All
  const handleClearAll = () => {
    if (notifications.length === 0) return;
    try {
      const ids = notifications.map(n => n.$id || n.id);
      const deleted = localStorage.getItem('user_deleted_notifications');
      const deletedList = deleted ? JSON.parse(deleted) : [];
      const updated = [...deletedList, ...ids];
      localStorage.setItem('user_deleted_notifications', JSON.stringify(updated));
    } catch (_) {}

    setNotifications([]);
    showToast('Cleared inbox history.', 'success');
  };

  // Filter dynamic notifications based on tags/content types
  const getBadgeType = (msg: any) => {
    const title = (msg.title || '').toLowerCase();
    const txt = (msg.message || '').toLowerCase();
    
    if (title.includes('approved') || title.includes('success') || title.includes('withdrawn') || title.includes('payout')) {
      return { 
        label: 'Payout', 
        classes: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        icon: CheckCircle
      };
    }
    if (title.includes('win') || title.includes('lucky') || title.includes('spin') || title.includes('bonus') || title.includes('coin') || title.includes('earning')) {
      return { 
        label: 'Reward', 
        classes: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: Gift 
      };
    }
    if (title.includes('system') || title.includes('unpaused') || title.includes('maintenance')) {
      return { 
        label: 'System', 
        classes: 'bg-violet-50 text-brand-purple border-violet-100',
        icon: Info
      };
    }
    return { 
      label: 'Alert', 
      classes: 'bg-sky-50 text-sky-700 border-sky-100',
      icon: Bell
    };
  };

  const filteredNotifs = notifications.filter(n => {
    const isDeleted = (() => {
      try {
        const d = localStorage.getItem('user_deleted_notifications');
        const list = d ? JSON.parse(d) : [];
        return list.includes(n.$id || n.id);
      } catch (_) { return false; }
    })();

    if (isDeleted) return false;

    const b = getBadgeType(n);
    if (activeFilter === 'all') return true;
    if (activeFilter === 'reward' && b.label === 'Reward') return true;
    if (activeFilter === 'system' && b.label === 'System') return true;
    if (activeFilter === 'alerts' && (b.label === 'Alert' || b.label === 'Payout')) return true;
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-colors shrink-0 text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-black text-2xl tracking-tight text-indigo-950 uppercase italic leading-none">
              Inbound Signals
            </h1>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-1 tracking-wider">
              Real-time updates, rewards & system dispatches
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 bg-white border border-slate-150 hover:bg-slate-50 active:bg-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-600 transition-all flex items-center gap-1 shadow-sm"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Mark Read</span>
            </button>
          )}

          <button
            onClick={loadNotifications}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-150 text-slate-50s hover:bg-slate-50 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="gaming-card p-4 flex items-center justify-between shadow-sm bg-gradient-to-br from-indigo-900 to-indigo-950 text-white relative overflow-hidden/50 group">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <span className="text-[9px] font-extrabold uppercase text-indigo-200 tracking-wider">Status Alert</span>
            <div className="mt-3">
              <span className="text-2xl font-display font-black leading-none block">
                {notifications.length}
              </span>
              <span className="text-[9px] text-indigo-200 font-extrabold uppercase tracking-wide mt-1 block">Total Incoming dispatches</span>
            </div>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl text-yellow-300">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="gaming-card p-4 flex items-center justify-between shadow-sm bg-white border border-slate-100 group">
          <div className="flex flex-col justify-between h-full">
            <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">Unread Mail</span>
            <div className="mt-3">
              <span className="text-2xl font-display font-black text-slate-900 leading-none block">
                {notifications.filter(n => !readIds.includes(n.$id || n.id)).length}
              </span>
              <span className="text-[9px] text-brand-purple font-extrabold uppercase tracking-wide mt-1 block">Awaiting reading</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-2xl text-brand-purple">
            <Bell className="w-6 h-6" />
          </div>
        </div>

        <div className="gaming-card p-4 hidden md:flex items-center justify-between shadow-sm bg-white border border-slate-100 group col-span-1">
          <div className="flex flex-col justify-between h-full">
            <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">Reliability Mode</span>
            <div className="mt-3">
              <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 to-teal-500 uppercase tracking-tight block">
                {isSimulationMode ? 'Simulated Local DB' : 'Appwrite Cloud Live'}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-1 block">Live websocket connection</span>
            </div>
          </div>
          <div className={`p-3 rounded-2xl ${isSimulationMode ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Cleanup Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none justify-start select-none">
          {[
            { id: 'all', label: 'All Signals' },
            { id: 'reward', label: 'Rewards' },
            { id: 'system', label: 'Announcements' },
            { id: 'alerts', label: 'Alerts & Payouts' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-[10px] uppercase font-black tracking-wide shrink-0 transition-all ${
                activeFilter === f.id
                  ? 'bg-brand-purple text-white shadow-sm glow-purple'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredNotifs.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-[10px] font-black uppercase text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200/50 flex items-center gap-1 transition-all shrink-0 w-full sm:w-auto justify-center"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Inbox</span>
          </button>
        )}
      </div>

      {/* Real-time Notifications list container */}
      <div className="relative">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="p-12 text-center bg-white border border-slate-100 rounded-[28px] shadow-sm flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-6 h-6 text-brand-purple animate-spin" />
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Scanning network signals...</p>
            </div>
          ) : filteredNotifs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-12 text-center bg-white border border-slate-100 rounded-[28px] shadow-sm flex flex-col items-center justify-center gap-4 border-dashed"
            >
              <div className="p-4 bg-brand-purple/5 rounded-full text-indigo-400 border border-indigo-100/50">
                <Bell className="w-8 h-8 animate-bounce" />
              </div>
              <div className="max-w-xs mx-auto">
                <p className="text-sm font-black text-indigo-950 uppercase italic tracking-tight">System inbox clear</p>
                <p className="text-xs text-slate-400 leading-normal font-semibold mt-1">
                  You do not have any new signals in this category. We'll automatically stream updates here in real-time as tasks approve!
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredNotifs.map((item, index) => {
                const id = item.$id || item.id;
                const isRead = readIds.includes(id);
                const badge = getBadgeType(item);
                const BIcon = badge.icon;
                const dateVal = item.date || item.$createdAt || new Date().toISOString();

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: Math.min(6, index) * 0.04 }}
                    onClick={(e) => handleToggleRead(id, e)}
                    className={`gaming-card p-5 border cursor-pointer hover:translate-y-[-2px] transition-all duration-300 relative group overflow-hidden ${
                      isRead 
                        ? 'bg-white/80 border-slate-100 opacity-75' 
                        : 'bg-white border-l-4 border-l-brand-purple border-slate-100 shadow-[0_5px_15px_-4px_rgba(109,40,217,0.06)]'
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      {/* Left Badge Icon Indicator */}
                      <div className={`p-3 rounded-2xl shrink-0 border ${badge.classes} shadow-sm group-hover:rotate-3 transition-transform`}>
                        <BIcon className="w-5 h-5" />
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[8px] font-black uppercase border px-2 py-0.5 rounded-full tracking-wider ${badge.classes}`}>
                            {badge.label}
                          </span>
                          
                          {!isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-ping" />
                          )}

                          <span className="text-[10px] text-slate-400 font-extrabold ml-auto flex items-center gap-1">
                            <Clock className="w-3 h-3 shrink-0" />
                            {new Date(dateVal).toLocaleDateString(undefined, { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <h3 className={`font-display text-sm leading-tight transition-colors ${
                          isRead ? 'text-slate-600 font-bold' : 'text-indigo-950 font-black'
                        }`}>
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-500 leading-relaxed break-words font-semibold">
                          {item.message}
                        </p>

                        {/* Optional Attached Picture / Promo Banner */}
                        {item.imageUrl && (
                          <div className="mt-3.5 rounded-2xl overflow-hidden border border-slate-100 max-h-40 bg-slate-50 max-w-sm">
                            <img 
                              src={item.imageUrl} 
                              alt="Attached visual detail"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex flex-col gap-1 opacity-40 group-hover:opacity-100 transition-opacity self-stretch justify-between items-end">
                        <button
                          onClick={(e) => handleDeleteNotification(id, e)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete message"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        <div className="text-[8px] text-slate-300 font-black tracking-widest uppercase group-hover:text-brand-purple select-none mb-1">
                          {isRead ? 'READ' : 'UNREAD'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Real-time System Deployment Activity Playground Card */}
      <div className="gaming-card p-6 bg-gradient-to-tr from-slate-900 to-indigo-950 border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <h4 className="font-display font-black text-sm uppercase italic tracking-tight text-white/90">
              Interactive Signal Dispatch Simulator
            </h4>
          </div>

          <p className="text-[11px] text-indigo-200/90 leading-relaxed font-semibold">
            Use the trigger system below to fire instant real-time websocket announcements within your current Nexvy profile session. This tests the real-time websocket routing pipeline directly.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => {
                // Dispatch event locally via dispatchEvent
                const simulatedNotice = {
                  $id: `sim_gift_${Date.now()}`,
                  id: `sim_gift_${Date.now()}`,
                  title: 'Daily Grand Prize Approved!',
                  message: 'Successfully claimed your free streak gift checkin of 75 coins!',
                  date: new Date().toISOString(),
                  type: 'targeted',
                  userId: user?.uid
                };
                const current = localStorage.getItem('local_notifications');
                const list = current ? JSON.parse(current) : [];
                list.unshift(simulatedNotice);
                localStorage.setItem('local_notifications', JSON.stringify(list));
                
                window.dispatchEvent(new Event('nexvy_realtime_update'));
                showToast('Broadcasted claim signal!', 'success');
              }}
              className="py-2.5 px-3 bg-white/10 hover:bg-white/15 rounded-xl border border-white/5 hover:border-white/20 transition-all font-black text-[9px] uppercase text-left flex flex-col justify-between gap-1 group text-yellow-300"
            >
              <span>Daily Claim Test</span>
              <span className="text-[8px] text-indigo-300 font-bold font-sans lowercase group-hover:text-white mt-0.5">+75 coins message</span>
            </button>

            <button
              onClick={() => {
                const simulatedNotice = {
                  $id: `sim_refer_${Date.now()}`,
                  id: `sim_refer_${Date.now()}`,
                  title: 'Referral Link Activated!',
                  message: 'Partner verified! Your referral commission voucher has added 500 bonus coins!',
                  date: new Date().toISOString(),
                  type: 'targeted',
                  userId: user?.uid
                };
                const current = localStorage.getItem('local_notifications');
                const list = current ? JSON.parse(current) : [];
                list.unshift(simulatedNotice);
                localStorage.setItem('local_notifications', JSON.stringify(list));
                
                window.dispatchEvent(new Event('nexvy_realtime_update'));
                showToast('Broadcasted referral signal!', 'success');
              }}
              className="py-2.5 px-3 bg-white/10 hover:bg-white/15 rounded-xl border border-white/5 hover:border-white/20 transition-all font-black text-[9px] uppercase text-left flex flex-col justify-between gap-1 group text-purple-300"
            >
              <span>Referral Sign Test</span>
              <span className="text-[8px] text-indigo-300 font-bold font-sans lowercase group-hover:text-white mt-0.5">+500 coins message</span>
            </button>

            <button
              onClick={() => {
                const simulatedNotice = {
                  $id: `sim_spin_${Date.now()}`,
                  id: `sim_spin_${Date.now()}`,
                  title: 'Spin Win notification!',
                  message: 'Jackpot hit! Spin Wheel resolved successfully and payout resolved directly.',
                  date: new Date().toISOString(),
                  type: 'targeted',
                  userId: user?.uid
                };
                const current = localStorage.getItem('local_notifications');
                const list = current ? JSON.parse(current) : [];
                list.unshift(simulatedNotice);
                localStorage.setItem('local_notifications', JSON.stringify(list));
                
                window.dispatchEvent(new Event('nexvy_realtime_update'));
                showToast('Broadcasted spin signal!', 'success');
              }}
              className="py-2.5 px-3 bg-white/10 hover:bg-white/15 rounded-xl border border-white/5 hover:border-white/20 transition-all font-black text-[9px] uppercase text-left flex flex-col justify-between gap-1 group text-emerald-300"
            >
              <span>Spin Wheel Test</span>
              <span className="text-[8px] text-indigo-300 font-bold font-sans lowercase group-hover:text-white mt-0.5">+50 spin win msg</span>
            </button>

            <button
              onClick={() => {
                const simulatedNotice = {
                  $id: `sim_payout_${Date.now()}`,
                  id: `sim_payout_${Date.now()}`,
                  title: 'Payout Request Released!',
                  message: 'Direct UPI/Paytm payout transferred. Transaction approved by administrator.',
                  date: new Date().toISOString(),
                  type: 'targeted',
                  userId: user?.uid
                };
                const current = localStorage.getItem('local_notifications');
                const list = current ? JSON.parse(current) : [];
                list.unshift(simulatedNotice);
                localStorage.setItem('local_notifications', JSON.stringify(list));
                
                window.dispatchEvent(new Event('nexvy_realtime_update'));
                showToast('Broadcasted payout signal!', 'success');
              }}
              className="py-2.5 px-3 bg-white/10 hover:bg-white/15 rounded-xl border border-white/5 hover:border-white/20 transition-all font-black text-[9px] uppercase text-left flex flex-col justify-between gap-1 group text-rose-300"
            >
              <span>Payout Approved Test</span>
              <span className="text-[8px] text-indigo-300 font-bold font-sans lowercase group-hover:text-white mt-0.5">Approved success msg</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
