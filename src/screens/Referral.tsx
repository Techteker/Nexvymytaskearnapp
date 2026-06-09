import React from 'react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { CoinIcon } from '../components/CoinIcon';
import { Users, Copy, Share2, TrendingUp, DollarSign, Clock, CheckCircle2, ShieldCheck, Mail, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/api';
import { SEO } from '../components/SEO';

export const Referral = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const [referralInput, setReferralInput] = React.useState('');
  const [referralStats, setReferralStats] = React.useState({
    invitedCount: 0,
    activeToday: 0,
    totalCommission: 0,
    withdrawable: 0
  });
  const [referralsList, setReferralsList] = React.useState<any[]>([]);

  const referralCode = user?.referralCode || "NEXVY-OFFLINE";

  React.useEffect(() => {
    const fetchData = async () => {
      const stats = await apiService.getReferralStats();
      const list = await apiService.getReferralList();
      setReferralStats(stats);
      setReferralsList(list);
    };
    fetchData();
  }, []);

  const robustCopyToClipboard = async (text: string): Promise<boolean> => {
    // Attempt window focus first to preempt 'Document is not focused' errors
    try {
      window.focus();
    } catch (e) {
      // Ignored
    }

    // Try standard Async Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn("Async clipboard failed, falling back to legacy transfer.", err);
      }
    }

    // Legacy execCommand fallback (highly reliable in iframe sandboxes during user gestures)
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // Position robustly offscreen to prevent layout shift or page scroll jump
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return !!successful;
    } catch (err) {
      console.error("Legacy copy fallback failed:", err);
      return false;
    }
  };

  const copyToClipboard = async () => {
    const success = await robustCopyToClipboard(referralCode);
    if (success) {
      setCopied(true);
      showToast("Referral Code Copied!", 'info');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast("Please copy code manually: " + referralCode, 'error');
    }
  };

  const handleShare = async () => {
    const originUrl = window.location.origin;
    const inviteLink = `${originUrl}/auth?ref=${referralCode}`;
    
    const shareText = `🚀 *Hey Buddy! Ek Gazab Ka Earning App Mila Hai — Nexvy!* 💰

Ghar baithe, daily simple surveys, tasks aur fun matches khel ke real money earn karo. Short apps install karne aur simple quizzes khelne ke dheron rewards mil rahe hain! 💸

🔥 *Special Feature:* Kisi bhi trusted online shopping partner site se shopping karo aur *cashback / commission* directly wallet me pao! Jise instant withdraw kar sakte ho apne *Paytm, PhonePe, ya PayPal* account me! 💳⚡

🎁 *Mera Referral Code use karo and extra signup bonus pao:*
👉 *${referralCode}*

🔥 *Abhi register karo aur apna daily pocket money banana start karo!* 👇
👉 ${inviteLink}

👤 *Founder Support (Instagram):* @xoxo_tweez  
⚡ *Late mat karo! Jaldi se register karke loot lo!* 🎉`;

    // 1. ALWAYS copy to clipboard first to guarantee success & show the message notification on both the website & AI Studio
    const copySuccess = await robustCopyToClipboard(shareText);
    if (copySuccess) {
      showToast("Invite message copied to clipboard! Share it on WhatsApp, Instagram, or Telegram.", 'success');
    }

    // 2. If native share is supported by the browser, also open the share dialer for extreme ease of use
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Nexvy - Play, Shop & Earn Cash',
          text: shareText,
          url: inviteLink
        });
      } catch (err) {
        console.debug('Native sharing completed or cancelled:', err);
      }
    }
  };

  const copyMessageToClipboard = async (text: string) => {
    const success = await robustCopyToClipboard(text);
    if (success) {
      showToast("Viral invite message copied to clipboard! Share it on WhatsApp, Telegram, or Instagram.", 'success');
    } else {
      showToast("Failed to copy message. Please copy the code manually.", 'error');
    }
  };

  const handleClaimReferral = async () => {
    if (!referralInput) return;
    try {
      const data = await apiService.claimReferral(referralInput);
      if (data.error) throw new Error(data.error);
      showToast(`Referral claimed! Reward: ${data.reward} coins`, 'success');
      await refreshUser();
      setReferralInput('');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const stats = [
    { label: 'Invited Users', value: referralStats.invitedCount.toString(), icon: Users, color: 'bg-blue-500' },
    { label: 'Active Today', value: referralStats.activeToday.toString(), icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Total Commission', value: referralStats.totalCommission.toLocaleString(), icon: DollarSign, color: 'bg-orange-500' },
    { label: 'Withdrawable', value: referralStats.withdrawable.toLocaleString(), icon: CheckCircle2, color: 'bg-purple-500' },
  ];

  return (
    <>
      <SEO 
        title="Refer and Earn Cash: Passive Referral Rewards - Nexvy" 
        description="Invite friends to Nexvy and earn a 10% lifetime commission from their completed tasks. Share your referral code to build automated, passive income."
        keywords="refer and earn, invite program, referral code nexvy, lifetime commission app, passive earning online, share and earn cash, refer friends win paytm"
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
      {/* Banner */}
      <div className="gaming-card p-6 bg-gradient-to-br from-brand-purple to-violet-800 border-none relative overflow-hidden group shadow-2xl">
        <div className="relative z-10 flex flex-col gap-2">
          <span className="text-[10px] font-black tracking-widest uppercase text-white/60">Invite Program</span>
          <h2 className="text-3xl font-display font-black text-white italic tracking-tighter leading-none">REFER & EARN <br/> <span className="text-yellow-400">10% LIFETIME</span></h2>
          <p className="text-xs text-white/80 font-bold mt-2 max-w-[200px]">Get massive commissions from every task your friends complete.</p>
        </div>
        <Users className="absolute -right-6 -bottom-6 w-40 h-40 text-black/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700" />
      </div>

      {/* Referral Code Section */}
      <div className="gaming-card p-6 flex flex-col items-center gap-6 border border-slate-100 bg-white shadow-xl">
        <div className="text-center w-full">
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest">Your Private Code</h3>
            <div className="flex items-center gap-4 mt-4 justify-center">
                <div className="bg-slate-50 border-2 border-dashed border-brand-purple p-4 rounded-2xl flex items-center justify-center min-w-[180px] shadow-inner relative group cursor-pointer" onClick={copyToClipboard}>
                    <span className="text-2xl font-display font-black tracking-[4px] text-brand-purple">{referralCode}</span>
                    <div className={ `absolute -top-3 right-0 px-2 py-1 rounded-full text-[8px] font-black uppercase shadow-lg transition-all ${copied ? 'bg-green-500 text-white scale-100' : 'bg-brand-purple text-white scale-0'}`}>
                        {copied ? 'Copied!' : 'Copy'}
                    </div>
                </div>
                <button 
                  onClick={handleShare}
                  className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 hover:bg-slate-100 transition-colors active:scale-95 shadow-md"
                  id="referral-share-button"
                >
                    <Share2 className="w-6 h-6 text-brand-purple" />
                </button>
            </div>
        </div>

        {/* Claim Referral Input */}
        <div className="w-full pt-6 border-t border-slate-100 flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest text-center">Enter Inviter Code</h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="ENTER CODE..."
              value={referralInput}
              onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-black text-slate-900 focus:border-brand-purple outline-none"
            />
            <button 
              onClick={handleClaimReferral}
              className="bg-brand-purple px-6 py-3 rounded-xl text-xs font-black uppercase text-white shadow-lg"
            >
              Claim
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-brand-purple/5 p-4 rounded-2xl border border-brand-purple/10 w-full">
            <ShieldCheck className="w-6 h-6 text-brand-purple shrink-0" />
            <p className="text-[10px] text-brand-purple/70 font-bold leading-tight">Anti-Fraud Protection Enabled. Commissions are calculated instantly after task verification.</p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="gaming-card p-4 flex flex-col gap-3 shadow-sm border border-slate-100">
             <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${stat.color} shadow-lg shadow-black/10`}>
                    <stat.icon className="w-4 h-4 text-white" />
                </div>
                <TrendingUp className="w-3 h-3 text-slate-200" />
             </div>
             <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight">{stat.label}</p>
                <div className="flex items-center gap-1 mt-1">
                    {stat.label.includes('Commission') && <CoinIcon size={16} />}
                    <span className="text-xl font-display font-black text-slate-900">{stat.value}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Referral List Dashboard */}
      <div className="flex flex-col gap-4">
         <div className="flex items-center justify-between px-2">
            <h3 className="font-display font-black text-lg uppercase italic tracking-tight text-brand-purple">Referral Network</h3>
            <Info className="w-4 h-4 text-slate-200" />
         </div>
         
         <div className="flex flex-col gap-3">
            {referralsList.map((user, i) => (
                <div key={i} className="gaming-card bg-white border border-slate-100 group hover:bg-slate-50 transition-all p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900">{user.username}</h4>
                                <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold">
                                    <Mail className="w-2.5 h-2.5" /> {user.email}
                                </div>
                            </div>
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            user.status === 'Active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                        }`}>
                            {user.status}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black uppercase text-slate-400">User Earnings</span>
                            <div className="flex items-center gap-1">
                                <CoinIcon size={12} />
                                <span className="text-xs font-black text-slate-800">{user.earnings.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <span className="text-[9px] font-black uppercase text-slate-400">Your 10% Share</span>
                            <div className="flex items-center gap-1 justify-end">
                                <CoinIcon size={12} />
                                <span className="text-xs font-black text-brand-purple">+{user.commission.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[8px] font-black uppercase text-slate-300">
                        <div className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> Joined: {user.date}
                        </div>
                        <div className="flex items-center gap-1">
                            Last Active: Just Now
                        </div>
                    </div>
                </div>
            ))}
         </div>
      </div>

      <div className="text-center py-4 bg-white border border-slate-100 rounded-3xl mb-8 shadow-sm">
         <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Only verified signup counts. duplicate accounts will be banned.</p>
      </div>

    </motion.div>
    </>
  );
};
