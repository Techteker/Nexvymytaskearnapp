import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { 
  Settings as SettingsIcon, 
  Target, 
  Bell, 
  Palette, 
  ShieldCheck, 
  Save, 
  RefreshCw,
  Smartphone,
  Globe,
  Coins
} from 'lucide-react';
import { motion } from 'motion/react';

export const SettingsPanel: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'app' | 'appwrite' | 'ads' | 'notify' | 'security'>('app');
  const [settings, setSettings] = useState<any>({
    appName: 'Nexvy',
    minWithdrawal: 50000,
    referralBonus: 200,
    signupBonus: 100,
    commissionRate: 10,
    maintenanceMode: false,
    adMobId: '',
    rewardedAdId: '',
    interstitialAdId: '',
    bannerAdId: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState({ title: '', message: '' });

  const [appwriteConfig, setAppwriteConfig] = useState({
    endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || localStorage.getItem('VITE_APPWRITE_ENDPOINT') || 'https://fra.cloud.appwrite.io/v1',
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || localStorage.getItem('VITE_APPWRITE_PROJECT_ID') || '6a016eac001c0af48909',
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || localStorage.getItem('VITE_APPWRITE_DATABASE_ID') || '67d163d8000b08051772',
    bucketId: import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || localStorage.getItem('VITE_APPWRITE_STORAGE_BUCKET_ID') || '67d16b1c000c19b02a9e'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await adminService.getSettings();
    if (data) setSettings(data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await adminService.updateSettings(settings);
    setSaving(false);
    showToast('Settings saved successfully!', 'success');
  };

  const handleBroadcast = async () => {
    if (!notif.title || !notif.message) return showToast('Please enter title and message', 'error');
    setSaving(true);
    await adminService.sendBroadcast(notif.title, notif.message);
    setSaving(false);
    setNotif({ title: '', message: '' });
    showToast('Broadcast sent successfully!', 'success');
  };

  const handleSaveAppwrite = () => {
    localStorage.setItem('VITE_APPWRITE_ENDPOINT', appwriteConfig.endpoint.trim());
    localStorage.setItem('VITE_APPWRITE_PROJECT_ID', appwriteConfig.projectId.trim());
    localStorage.setItem('VITE_APPWRITE_DATABASE_ID', appwriteConfig.databaseId.trim());
    localStorage.setItem('VITE_APPWRITE_STORAGE_BUCKET_ID', appwriteConfig.bucketId.trim());
    showToast('Appwrite config saved! Reloading application...', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const handleResetAppwrite = () => {
    localStorage.removeItem('VITE_APPWRITE_ENDPOINT');
    localStorage.removeItem('VITE_APPWRITE_PROJECT_ID');
    localStorage.removeItem('VITE_APPWRITE_DATABASE_ID');
    localStorage.removeItem('VITE_APPWRITE_STORAGE_BUCKET_ID');
    showToast('Appwrite config reset to default! Reloading...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const tabs = [
    { id: 'app', label: 'App Settings', icon: Smartphone },
    { id: 'appwrite', label: 'Appwrite Config', icon: Globe },
    { id: 'ads', label: 'Ads Management', icon: Target },
    { id: 'notify', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-purple-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-slate-400">Configure global platform parameters and branding.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0 space-y-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
                 activeTab === tab.id 
                 ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                 : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
               }`}
             >
               <tab.icon size={20} />
               {tab.label}
             </button>
           ))}
        </div>

        <div className="flex-1 bg-slate-900/40 backdrop-blur-md rounded-3.5xl border border-slate-800 p-8 shadow-xl">
           {activeTab === 'app' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                         <Palette size={18} className="text-purple-400" /> Branding
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">App Name</label>
                        <input 
                          type="text" 
                          value={settings.appName} 
                          onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Accent Color</label>
                        <div className="flex gap-2">
                           <input type="color" defaultValue="#a855f7" className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer" />
                           <input type="text" defaultValue="#a855f7" className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white uppercase text-sm font-mono" />
                        </div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                         <Globe size={18} className="text-blue-400" /> Maintenance
                      </h3>
                      <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700 flex items-center justify-between">
                         <div>
                            <p className="font-bold text-white">Maintenance Mode</p>
                            <p className="text-xs text-slate-500">Block user access while updating</p>
                         </div>
                         <div 
                           onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                           className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${settings.maintenanceMode ? 'bg-purple-600' : 'bg-slate-700'}`}
                         >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'right-1' : 'left-1'}`}></div>
                         </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                          <Coins size={14} /> Min Withdrawal (Coins)
                        </label>
                        <input 
                          type="number" 
                          value={settings.minWithdrawal} 
                          onChange={(e) => setSettings({ ...settings, minWithdrawal: parseInt(e.target.value) })}
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500" 
                        />
                      </div>
                   </div>
                </div>
                <div className="pt-8 border-t border-slate-800 flex justify-end">
                   <button 
                     onClick={handleSave}
                     disabled={saving}
                     className="flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-xl transition-all disabled:opacity-50"
                   >
                      <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
                   </button>
                </div>
             </motion.div>
           )}

           {activeTab === 'appwrite' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div>
                   <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Globe size={22} className="text-purple-400" /> Appwrite SDK Core API Keys
                   </h3>
                   <p className="text-sm text-slate-400">Configure your custom Appwrite connection endpoints, database ID, and storage structures dynamically.</p>
                </div>

                <div className="space-y-6">
                   <div>
                     <label className="block text-sm font-medium text-slate-400 mb-2">Appwrite API Endpoint</label>
                     <input 
                       type="text" 
                       value={appwriteConfig.endpoint} 
                       onChange={(e) => setAppwriteConfig({ ...appwriteConfig, endpoint: e.target.value })}
                       placeholder="https://cloud.appwrite.io/v1"
                       className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm" 
                     />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-semibold">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Project ID</label>
                        <input 
                          type="text" 
                          value={appwriteConfig.projectId} 
                          onChange={(e) => setAppwriteConfig({ ...appwriteConfig, projectId: e.target.value })}
                          placeholder="6a016eac001c0af48909"
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Database ID</label>
                        <input 
                          type="text" 
                          value={appwriteConfig.databaseId} 
                          onChange={(e) => setAppwriteConfig({ ...appwriteConfig, databaseId: e.target.value })}
                          placeholder="67d163d8000b08051772"
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Storage Upload Bucket ID</label>
                        <input 
                          type="text" 
                          value={appwriteConfig.bucketId} 
                          onChange={(e) => setAppwriteConfig({ ...appwriteConfig, bucketId: e.target.value })}
                          placeholder="67d16b1c000c19b02a9e"
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm" 
                        />
                      </div>
                   </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex justify-between items-center gap-4">
                   <button 
                     onClick={handleResetAppwrite}
                     className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-2xl hover:text-white transition-all text-sm"
                   >
                     Reset to System Default
                   </button>
                   <button 
                     onClick={handleSaveAppwrite}
                     className="flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-xl transition-all font-semibold"
                   >
                      <Save size={18} /> Update API credentials
                   </button>
                </div>
             </motion.div>
           )}

           {activeTab === 'ads' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <h3 className="text-lg font-bold text-white">Google AdMob Configuration</h3>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">App ID</label>
                        <input 
                          type="text" 
                          value={settings.adMobId || ''} 
                          onChange={(e) => setSettings({ ...settings, adMobId: e.target.value })}
                          placeholder="ca-app-pub-xxxxxxxxxxxxxxxx" 
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none text-sm font-mono" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Rewarded Ad ID</label>
                        <input 
                          type="text" 
                          value={settings.rewardedAdId || ''} 
                          onChange={(e) => setSettings({ ...settings, rewardedAdId: e.target.value })}
                          placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx" 
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none text-sm font-mono" 
                        />
                      </div>
                   </div>
                   <div className="space-y-6 pt-12">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Interstitial Ad ID</label>
                        <input 
                          type="text" 
                          value={settings.interstitialAdId || ''} 
                          onChange={(e) => setSettings({ ...settings, interstitialAdId: e.target.value })}
                          placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx" 
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none text-sm font-mono" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Banner Ad ID</label>
                        <input 
                          type="text" 
                          value={settings.bannerAdId || ''} 
                          onChange={(e) => setSettings({ ...settings, bannerAdId: e.target.value })}
                          placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx" 
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none text-sm font-mono" 
                        />
                      </div>
                   </div>
                 </div>
                 <div className="pt-8 border-t border-slate-800 flex items-center justify-between">
                    <p className="text-xs text-slate-500 italic">Ads are currently enabled in production mode.</p>
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl transition-all disabled:opacity-50"
                    >
                      <Save size={20} /> {saving ? 'Saving...' : 'Update Ad IDs'}
                   </button>
                 </div>
             </motion.div>
           )}

            {activeTab === 'notify' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="max-w-xl space-y-6">
                   <h3 className="text-lg font-bold text-white">Broadcast Notification</h3>
                   <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Message Title</label>
                      <input 
                        type="text" 
                        value={notif.title}
                        onChange={(e) => setNotif({ ...notif, title: e.target.value })}
                        placeholder="New Offer Alert!" 
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none" 
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Message Body</label>
                      <textarea 
                        rows={4} 
                        value={notif.message}
                        onChange={(e) => setNotif({ ...notif, message: e.target.value })}
                        placeholder="Complete the new survey and win 500 coins..." 
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none" 
                      />
                   </div>
                   <button 
                     onClick={handleBroadcast}
                     disabled={saving}
                     className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-xl transition-all w-full justify-center disabled:opacity-50"
                   >
                      <Save size={20} /> {saving ? 'Sending...' : 'Send Broadcast to All Users'}
                   </button>
                </div>
             </motion.div>
           )}

           {activeTab === 'security' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 text-center pt-12 pb-12">
                 <ShieldCheck className="mx-auto text-emerald-500 mb-6" size={80} />
                 <h2 className="text-2xl font-bold text-white">Advanced Security Guard</h2>
                 <p className="text-slate-400 max-w-md mx-auto">
                   Multi-layer protection including Anti-Cheat, VPN Detection, and Device Tracking is currently active.
                 </p>
                 <div className="flex justify-center gap-4 py-8">
                    <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                       <p className="text-xs font-bold text-slate-500 uppercase mb-1">VPN Detection</p>
                       <p className="text-xl font-bold text-emerald-400">ENABLED</p>
                    </div>
                    <div className="px-6 py-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                       <p className="text-xs font-bold text-slate-500 uppercase mb-1">Rate Limiting</p>
                       <p className="text-xl font-bold text-indigo-400">ACTIVE</p>
                    </div>
                 </div>
                 <button className="text-rose-400 font-bold hover:underline">View Security Logs</button>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
};
