import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CoinIcon } from '../components/CoinIcon';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ClipboardList, ExternalLink, RefreshCw, Shield } from 'lucide-react';
import { EARNING_CONFIG } from '../constants';
import { SEO } from '../components/SEO';

export const QuizList = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [iframeRefreshing, setIframeRefreshing] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // App ID and target URL for CPX Research
  const APP_ID = "33284";
  const user_id = user?.uid || "guest";
  const user_email = user?.email || "";
  const user_username = user?.username || "";

  // Standard CPX Research Web Integration URL
  const cpxOfferwallUrl = `https://offers.cpx-research.com/index.php?app_id=${APP_ID}&ext_user_id=${user_id}&email=${encodeURIComponent(user_email)}&username=${encodeURIComponent(user_username)}`;

  const handleRefresh = async () => {
    setIframeRefreshing(true);
    setIframeLoaded(false);
    try {
      await refreshUser();
      showToast("Surveys refreshed successfully!", "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to refresh user credentials", "error");
    } finally {
      setTimeout(() => {
        setIframeRefreshing(false);
      }, 800);
    }
  };

  const handleOpenExternal = () => {
    window.open(cpxOfferwallUrl, '_blank', 'noopener,noreferrer');
    showToast("Opening CPX surveys in new tab", "success");
  };

  return (
    <>
      <SEO 
        title="Paid Online Surveys: Extra Daily Earning - Nexvy" 
        description="Take high-paying online surveys on Nexvy & earn premium rewards daily. Share your opinion honestly on brand questions and receive direct cash rewards."
        keywords="paid surveys online, take online surveys, earn money surveys, surveys for cash india, nexvy surveys, high reward surveys, earn gold coins, cpx surveys, best survey app"
      />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-5"
      >
      {/* Header section */}
      <div className="flex flex-col gap-1.5 mb-2">
        <h2 className="text-3xl font-display font-black italic tracking-tighter text-slate-900 uppercase">
          Survey & Earn
        </h2>
        <p className="text-xs text-brand-purple font-black uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" /> CPX Research Official Partner
        </p>
      </div>

      {/* User Balance & Conversion Info Summary */}
      <div className="gaming-card p-4 bg-gradient-to-br from-brand-purple to-violet-900 text-white flex items-center justify-between shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] text-violet-200 font-black uppercase tracking-widest leading-none mb-1">Your Total Balance</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-2xl font-display font-black">{(user?.coins || 0).toLocaleString()}</h3>
            <span className="text-xs font-bold text-violet-200 uppercase">Coins</span>
          </div>
          <p className="text-[10px] text-violet-300 font-extrabold mt-1">
            Estimated Value: ${(user?.coins ? user.coins / EARNING_CONFIG.COINS_PER_USD : 0).toFixed(2)} USD
          </p>
        </div>
        <div className="relative z-10 flex flex-col gap-2 items-end">
          <button 
            onClick={handleRefresh}
            disabled={iframeRefreshing}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl py-2 px-3 text-[10px] font-black uppercase tracking-wider border border-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${iframeRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
          <ClipboardList size={110} />
        </div>
      </div>

      {/* Embedded Secure Offerwall Container */}
      <div className="gaming-card bg-white border border-slate-200 shadow-xl rounded-[28px] overflow-hidden flex flex-col min-h-[750px] md:min-h-[850px] relative">
        <div className="flex-1 w-full bg-slate-50 relative flex flex-col">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white z-20">
              <div className="w-10 h-10 border-4 border-slate-100 border-t-brand-purple rounded-full animate-spin mb-4" />
              <p className="text-xs text-slate-500 font-black uppercase tracking-wider animate-pulse text-center">
                Establishing Secure CPX Gateway...
              </p>
              <button
                onClick={handleOpenExternal} 
                className="mt-6 text-[10px] font-black text-brand-purple hover:underline uppercase cursor-pointer"
              >
                Having trouble? Direct Launch
              </button>
            </div>
          )}
          
          <iframe
            src={cpxOfferwallUrl}
            title="CPX Research Surveys"
            onLoad={() => setIframeLoaded(true)}
            className="w-full flex-1 border-none min-h-[700px] md:min-h-[800px]"
            allow="geolocation"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Footer support notice */}
      <div className="text-center py-2 flex flex-col items-center gap-1 bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mb-1">
          S2S Postback Integration Verified
        </p>
        <p className="text-[9px] text-slate-400 max-w-xs font-semibold leading-relaxed">
          Completed surveys will credit your balance instantly. If you experience delays, please hold your session or hit refresh above.
        </p>
      </div>

    </motion.div>
    </>
  );
};
