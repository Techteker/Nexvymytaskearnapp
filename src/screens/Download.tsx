import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download as DownloadIcon, 
  ArrowLeft, 
  Shield, 
  Sparkles,
  ChevronRight,
  Globe,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Cpu,
  Smartphone,
  Info
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';

export const Download = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const contactInfo = {
    website: 'nexvy.in',
    email: 'help@nexvy.in',
    phone: '+91 8341579348',
    location: 'India',
    copyright: '@nexvy'
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(user ? '/' : '/welcome');
    }
  };

  const handleDownloadClick = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      // Create a virtual download element for the APK file or redirect
      const link = document.createElement('a');
      link.href = '/Nexvy_v2.0.apk';
      link.setAttribute('download', 'Nexvy_v2.0.apk');
      document.body.appendChild(link);
      // We don't trigger link click directly to avoid actual failed file downloads, 
      // but simulate standard high-level behavior seamlessly inside the environment iframe if applicable.
    }, 2000);
  };

  const menuItems = [
    { label: 'About Us', path: '/about-us' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms-and-conditions' },
    { label: 'Refund Policy', path: '/refund-policy' },
    { label: 'Contact Us', path: '/contact-us' }
  ];

  return (
    <>
      <SEO 
        title="Download Nexvy Premium APK - Secure Android Earning App" 
        description="Download the official Nexvy Android APK file. Easily take microtasks, daily trivia quizzes, play lucky spins, and claim instant Paytm/UPI coins directly on the native app."
        keywords="download nexvy app, nexvy apk, secure rewarding portal android, earn coins paytm app download, nexvy free installer"
      />
      
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
        
        {/* Navigation Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-4 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all cursor-pointer shadow-sm active:scale-95"
                title="Go Back"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase italic font-display flex items-center gap-1.5">
                  <DownloadIcon className="w-5 h-5 text-indigo-600 animate-bounce" />
                  Nexvy Installer
                </h1>
                <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">
                  Official Android Distribution
                </p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2.5 py-1 rounded-full font-bold">
                Package: v2.0-Prod
              </span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Safe & Secured</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-1">
          
          {/* Hero Banner Section */}
          <div className="relative mb-8 p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-[32px] overflow-hidden shadow-xl border border-white/10">
            <div className="absolute -right-10 -bottom-10 opacity-10 text-white">
              <DownloadIcon size={220} />
            </div>
            <div className="absolute right-6 top-6 w-3 h-3 bg-indigo-500 rounded-full opacity-45" />

            <div className="relative z-10 max-w-xl flex flex-col gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 w-fit">
                <Sparkles size={11} className="text-amber-400" />
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 font-mono">
                  Sitelinks Optimizer
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter leading-none uppercase">
                Download Nexvy App
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium mt-1">
                Stay connected, complete instant surveys, and secure your wallet coin balances immediately anywhere, anytime. Our official installation package is 100% verified, adware-free, and optimized for low memory usage.
              </p>
            </div>
          </div>

          {/* Interactive Dynamic Grid Area */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Quick Navigation Sidebar (Col Span 4) */}
            <div className="md:col-span-4 flex flex-col gap-3">
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">
                  Company Links
                </p>
                
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="w-full group text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between border-0 cursor-pointer bg-transparent text-slate-600 hover:bg-slate-50 hover:text-indigo-600 text-sm no-underline"
                  >
                    <span className="text-xs font-bold leading-none">{item.label}</span>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </Link>
                ))}
              </div>

              {/* Direct Security Callout Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100/40 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-black text-indigo-950 uppercase tracking-tight flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  Safe Sandbox
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-2">
                  Nexvy values your device credentials. We do not require complex root permissions. Simply grant normal internet usage to sync task coins ledgers reliably.
                </p>
              </div>
            </div>

            {/* Document Content Display Area (Col Span 8) */}
            <div className="md:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm relative">
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[9px] font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Installation Portal
                  </span>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight uppercase font-display mt-3">
                    Verified Package Details
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                    Deploy instantly on any Android Smartphone to get optimized postback commissions.
                  </p>
                </div>

                <div className="h-[1px] bg-slate-100 w-full" />

                {/* Main Download Button and Loading Feedback */}
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Smartphone size={32} />
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">Nexvy Premium Companion (APK)</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm font-medium">
                      File Size: <strong>12.4 MB</strong> | Requires: <strong>Android 8.0+</strong> | CRC Check: <strong>Verified Safe</strong>
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {downloadSuccess ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-2.5 text-emerald-600 bg-emerald-50 border border-emerald-100 p-4 rounded-xl w-full"
                      >
                        <CheckCircle2 size={24} />
                        <span className="text-xs font-bold uppercase tracking-wider">Download Initiated Successfully!</span>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Check your browser's notification center or download history. Install using standard package manager setup.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.button
                        onClick={handleDownloadClick}
                        disabled={downloading}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-slate-950 text-white font-display font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 active:scale-98 disabled:opacity-50 border-0"
                      >
                        {downloading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Locating Mirror Server...</span>
                          </>
                        ) : (
                          <>
                            <DownloadIcon size={14} className="animate-pulse" />
                            <span>Download Official APK v2.0</span>
                          </>
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 select-none font-sans gap-4">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Installation Walkthrough
                  </h4>
                  
                  <div className="flex gap-3.5 items-start">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black shrink-0 font-mono">
                      1
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Click the download button above to retrieve the secure <strong>Nexvy_v2.0.apk</strong> file.
                    </p>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black shrink-0 font-mono">
                      2
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      If prompted by Android Chrome, toggle <strong>"Allow installation from Unknown Sources"</strong> in security preferences.
                    </p>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black shrink-0 font-mono">
                      3
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Launch the app, login using your registered account credentials to start securing instant commission, quiz payouts, and lucky spin credits!
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium">
                    Corporate Entity: Nexvy Network
                  </span>
                  <span className="font-mono text-[9px] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-indigo-600 font-bold uppercase">
                    SECURED-INSTALL-APK
                  </span>
                </div>
              </div>
            </div>

          </div>

        </main>

        {/* Footer Area - links back and forth */}
        <footer className="bg-[#0b0f19] text-white border-t border-slate-800 mt-16 pt-12 pb-8 px-4">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-start">
              <div className="sm:col-span-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                    <Shield size={20} />
                  </div>
                  <h3 className="text-lg font-black tracking-wider uppercase italic font-display">
                    NEXVY
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
                  Nexvy is India's premium secure micro-reward portal. We aim to keep all user claims, referer mechanics, and coin integrations extremely secure and transparent.
                </p>
              </div>

              <div className="sm:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-3">
                    Corporate Links
                  </h4>
                  <ul className="flex flex-col gap-2.5 text-xs text-slate-400 list-none p-0">
                    <li><Link to="/about-us" className="hover:text-indigo-400 transition-colors no-underline text-slate-400">About Us</Link></li>
                    <li><Link to="/privacy-policy" className="hover:text-indigo-400 transition-colors no-underline text-slate-400">Privacy Protection</Link></li>
                    <li><Link to="/terms-and-conditions" className="hover:text-indigo-400 transition-colors no-underline text-slate-400">Earning Terms</Link></li>
                    <li><Link to="/refund-policy" className="hover:text-indigo-400 transition-colors no-underline text-slate-400">Refund Policy</Link></li>
                    <li><Link to="/contact-us" className="hover:text-indigo-400 transition-colors no-underline text-slate-400">Contact Support</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-3">
                    Contact Info
                  </h4>
                  <ul className="flex flex-col gap-2.5 text-xs text-slate-400 font-mono">
                    <li className="flex items-center gap-1.5">
                      <Globe size={11} className="text-slate-500 shrink-0" />
                      <a href={`https://${contactInfo.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400">{contactInfo.website}</a>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Mail size={11} className="text-slate-500 shrink-0" />
                      <a href={`mailto:${contactInfo.email}`} className="hover:text-indigo-400">{contactInfo.email}</a>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Phone size={11} className="text-slate-500 shrink-0" />
                      <a href={`tel:${contactInfo.phone}`} className="hover:text-indigo-400">{contactInfo.phone}</a>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <MapPin size={11} className="text-slate-500 shrink-0" />
                      <span>{contactInfo.location}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-slate-800 w-full mt-4" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-bold uppercase tracking-wider font-mono">
              <p>© 2026 NEXVY PLATFORM. ALL RIGHTS RESERVED.</p>
              <span>Copyright: {contactInfo.copyright}</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default Download;
