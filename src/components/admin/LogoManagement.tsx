import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { 
  Upload, 
  RefreshCw, 
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';

export const LogoManagement: React.FC = () => {
  const { showToast } = useToast();
  const [currentLogo, setCurrentLogo] = useState<string>('/input_file_0.png');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // Load current logo from localStorage
    const savedLogo = localStorage.getItem('app_logo');
    if (savedLogo) {
      setCurrentLogo(savedLogo);
    }
    loadDbSettings();
  }, []);

  const loadDbSettings = async () => {
    try {
      // 1. Try to load the logo configuration from the persistent Cloud Database settings first
      const data = await adminService.getSettings() as any;
      if (data && data.appLogo) {
        setSettings(data);
        setCurrentLogo(data.appLogo);
        localStorage.setItem('app_logo', data.appLogo);
        window.dispatchEvent(new Event('app_logo_changed'));
        return;
      }
    } catch (e) {
      console.warn('[LOGO] Appwrite Cloud settings fetch bypassed:', e);
    }

    // 2. Fallback to server files
    try {
      const res = await fetch('/api/get-logo');
      const data = await res.json();
      if (data && data.logoUrl) {
        setSettings(data);
        setCurrentLogo(data.logoUrl);
        localStorage.setItem('app_logo', data.logoUrl);
        window.dispatchEvent(new Event('app_logo_changed'));
      }
    } catch (e) {
      console.warn('[LOGO] Failed to load server-side settings fallback:', e);
    }
  };

  const updateLogoState = async (logoUrl: string) => {
    setCurrentLogo(logoUrl);
    localStorage.setItem('app_logo', logoUrl);
    
    // 1. Save to cloud-persistent settings document in the database
    try {
      const activeSettings = await adminService.getSettings() || {};
      await adminService.updateSettings({
        ...activeSettings,
        appLogo: logoUrl
      });
      console.log('[LOGO] Saved to cloud database.');
    } catch (err) {
      console.error('[LOGO] Failed to update settings in database:', err);
    }

    // 2. Save a reference to the local server config file as helper
    try {
      await fetch('/api/save-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ logoUrl })
      });
    } catch (err) {
      console.warn('[LOGO] Server settings persistence failed, saved locally. Error:', err);
    }

    // Dispatch custom event to notify all components in the active tab to update
    window.dispatchEvent(new Event('app_logo_changed'));
    showToast('Application Brand Logo updated successfully!', 'success');
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate if it is an image
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, SVG, WebP)', 'error');
      return;
    }

    // Limit to under 4MB
    if (file.size > 4 * 1024 * 1024) {
      showToast('Logo file size must be under 4MB', 'error');
      return;
    }

    setUploading(true);
    try {
      showToast('Uploading brand logo asset to persistent cloud storage...', 'info');
      
      // Upload the image file to Appwrite storage container to get a permanent static CDN download/preview URL
      const logoUrl = await adminService.uploadTaskImage(file);
      
      if (logoUrl) {
        await updateLogoState(logoUrl);
      } else {
        showToast('Failed to upload custom branding logo asset.', 'error');
      }
    } catch (error: any) {
      console.error('[LOGO] upload failed:', error);
      showToast('Logo file processing or cloud save failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const resetToDefault = async () => {
    if (window.confirm('Are you sure you want to reset the branding logo to default?')) {
      setCurrentLogo('/input_file_0.png');
      localStorage.setItem('app_logo', '/input_file_0.png');
      
      // 1. Reset in the Appwrite database settings document
      try {
        const activeSettings = (await adminService.getSettings() || {}) as any;
        const settingsCopy = { ...activeSettings };
        settingsCopy.appLogo = '/input_file_0.png';
        await adminService.updateSettings(settingsCopy);
      } catch (e) {
        console.warn('[LOGO] Failed to reset in Appwrite database settings:', e);
      }

      // 2. Reset persistent custom server-side config file
      try {
        await fetch('/api/save-logo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ logoUrl: '/input_file_0.png' })
        });
      } catch (e) {}

      window.dispatchEvent(new Event('app_logo_changed'));
      showToast('Logo reset to system default.', 'info');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">App Logo Management</h1>
        <p className="text-slate-400">Manage and change the global application brand logo asset.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Logo Customizer Control */}
        <div className="lg:col-span-7 bg-slate-900/40 backdrop-blur-md rounded-3.5xl border border-slate-800 p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="text-purple-400" size={20} />
            <h2 className="text-lg font-bold text-white">Upload Brand Logo</h2>
          </div>

          {/* Drag & Drop Input Zone */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3.5xl p-10 text-center transition-all relative flex flex-col items-center justify-center min-h-[260px] group ${
              dragActive 
              ? 'border-purple-500 bg-purple-500/10' 
              : 'border-slate-800 bg-slate-950/20 hover:border-slate-700 hover:bg-slate-950/40'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-4">
                <RefreshCw className="w-10 h-10 text-purple-500 animate-spin" />
                <p className="text-slate-300 font-bold text-sm">Processing security upload...</p>
                <p className="text-slate-500 text-xs">Uploading your chosen asset safely into Appwrite storage bucket</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Upload size={28} />
                </div>
                <div className="space-y-2">
                  <p className="text-slate-200 font-bold text-base">
                    Drag and drop your logo file here
                  </p>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                    or select from local directory
                  </p>
                </div>

                <input 
                  type="file" 
                  id="logo-file-input"
                  onChange={handleChange}
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />

                <p className="text-[10px] text-slate-500 font-black tracking-widest mt-6 uppercase">
                  PNG, JPG, WEBP, OR SVG • MAX 4MB
                </p>
              </>
            )}
          </div>

          <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex gap-3 text-xs text-slate-400/90 leading-relaxed">
            <AlertCircle className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
            <p>
              The uploaded image replaces the app-wide logo. It is instantly cached so administrators, guests, and team members can view the new branding.
            </p>
          </div>
        </div>

        {/* Live Rendering Previews */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-md rounded-3.5xl border border-slate-800 p-8 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle className="text-emerald-500" size={18} /> Direct Context Previews
            </h2>

            {/* Simulated Desktop Preview */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sidebar Layout Frame</p>
              <div className="p-4 bg-[#020617] border border-slate-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-white/20 shadow-lg relative">
                    <img src={currentLogo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black tracking-tighter text-white italic leading-none">NEXVY</span>
                    <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest mt-1">Admin Panel</span>
                  </div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
              </div>
            </div>

            {/* Simulated Login Preview */}
            <div className="space-y-4 pt-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authentication Core Circle</p>
              <div className="p-6 bg-slate-950/60 border border-slate-900 rounded-2xl flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-slate-850 overflow-hidden">
                  <img src={currentLogo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <span className="text-base font-black tracking-tighter text-[#7c3aed] italic mt-3">NEXVY</span>
              </div>
            </div>

            {/* Remove / Reset Actions */}
            {currentLogo !== '/input_file_0.png' && (
              <div className="pt-2">
                <button
                  onClick={resetToDefault}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 hover:text-rose-300 font-bold text-sm rounded-xl transition-all"
                >
                  <Trash2 size={16} /> Reset Logo to Default
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
