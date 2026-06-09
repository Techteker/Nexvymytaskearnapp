import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  FileText, 
  Lock, 
  CheckCircle, 
  ArrowLeft, 
  Eye, 
  ShieldAlert, 
  Award, 
  AlertTriangle, 
  Key, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';

type TabType = 'terms' | 'privacy' | 'security' | 'support';

export const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('privacy');

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

  return (
    <>
      <SEO 
        title="Privacy Policy & Terms: Security and Trust - Nexvy" 
        description="Read Nexvy's terms and privacy rules. Learn how we handle your wallet info safely and secure your coin rewards with state-of-the-art encryption."
        keywords="privacy policy nexvy, earn money safety terms, rewards app rules india, safe online earning, trusted wallet nexvy"
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
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Nexvy Trust Center
                </h1>
                <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">
                  Legal Protocols & Transparency
                </p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2.5 py-1 rounded-full font-bold">
                v2.4 Stable
              </span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Secure</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-1">
          
          {/* Hero Banner Banner Section */}
          <div className="relative mb-8 p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-[32px] overflow-hidden shadow-xl border border-white/10">
            <div className="absolute -right-10 -bottom-10 opacity-10 text-white">
              <Shield size={220} />
            </div>
            <div className="absolute right-6 top-6 w-3 h-3 bg-indigo-500 rounded-full opacity-40" />
            <div className="absolute left-1/3 top-1/4 w-2 h-2 bg-purple-500 rounded-full opacity-40" />

            <div className="relative z-10 max-w-xl flex flex-col gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 w-fit">
                <Sparkles size={11} className="text-amber-400" />
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 font-mono">
                  Nexvy Protection Seal
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter leading-none uppercase">
                Privacy, Safety & Terms
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium mt-1">
                Your trust is our absolute priority. We employ end-to-end industry security protocols to keep your account, referrals, and coin distributions completely private and protected.
              </p>
            </div>
          </div>

          {/* Interactive Dynamic Grid Area */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Quick Tab Selector (Col Span 4) */}
            <div className="md:col-span-4 flex flex-col gap-3">
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">
                  Navigation Docs
                </p>
                
                {[
                  { id: 'privacy', label: 'Privacy Policy', icon: Eye, desc: 'What data we protect & collect' },
                  { id: 'terms', label: 'Terms of Service', icon: FileText, desc: 'Earning & game regulations' },
                  { id: 'security', label: 'Security & Integrity', icon: ShieldAlert, desc: 'Fraud prevention rules' },
                  { id: 'support', label: 'Contact & Support', icon: Globe, desc: 'Inquiries & legal address' }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full group text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between border-0 cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]'
                          : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-colors ${
                          isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                        }`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-none">{tab.label}</p>
                          <p className={`text-[9px] mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {tab.desc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={14} className={isActive ? 'text-white' : 'text-slate-300'} />
                    </button>
                  );
                })}
              </div>

              {/* Direct Support Overview Cards */}
              <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100/40 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-black text-indigo-950 uppercase tracking-tight flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  Your Data Rights
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-2">
                  Under local guidelines, you can request access to your profile logs, delete your ledger metrics, or revoke payout credentials at any given second.
                </p>
                <div className="mt-4 flex gap-2">
                  <a 
                    href="mailto:help@nexvy.in"
                    className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                  >
                    Send Request <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>

            {/* Document Content Display Area (Col Span 8) */}
            <div className="md:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm min-h-[440px] relative">
              <AnimatePresence mode="wait">
                {activeTab === 'privacy' && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <span className="text-[9px] font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        Document A1
                      </span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight uppercase font-display mt-3">
                        General Privacy Shield Policy
                      </h3>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                        How Nexvy collects, encodes, and handles data parameters securely.
                      </p>
                    </div>

                    <div className="h-[1px] bg-slate-100 w-full" />

                    <div className="grid grid-cols-1 gap-5">
                      <div className="flex gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl h-fit shrink-0">
                          <Eye size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                            1. Minimal Profile Archival
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                            We only utilize user logs, profile identification markers, coin logs, and transaction hashes required to ensure fair distributions. We never store personal identification documents or raw private keys.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl h-fit shrink-0">
                          <CheckCircle size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                            2. Safe Cookie Allocation
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                            We deploy strict browser storage buffers (local storage and session cookies) to track active authenticated logins and prevent malicious account switching. We do not use persistent advertising trackers.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl h-fit shrink-0">
                          <Lock size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                            3. Encrypted Payout Verification
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                            Your payment links, Paytm/UPI numbers, and transactional queries are processed through high-security database paths to shield them from exposure or cross-domain leaks.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'terms' && (
                  <motion.div
                    key="terms"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <span className="text-[9px] font-mono font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        Document B2
                      </span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight uppercase font-display mt-3">
                        Terms of Service & Rules
                      </h3>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                        General system-wide guidelines and gaming codes of conduct.
                      </p>
                    </div>

                    <div className="h-[1px] bg-slate-100 w-full" />

                    <div className="grid grid-cols-1 gap-5">
                      <div className="flex gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl h-fit shrink-0 animate-pulse">
                          <Award size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                            1. Single Account Benchmark
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                            Only one active Nexvy profile per device/IP is authorized. Attempting to exploit spins, complete matching tasks with duplicate clone platforms, or trigger bulk system bots leads to automatic termination.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl h-fit shrink-0">
                          <AlertTriangle size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                            2. Referral Integrity
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                            Invitations must originate from organic user actions. Running referral link schemes with burner email networks or mechanical click simulators triggers direct cash-out bans.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl h-fit shrink-0">
                          <CheckCircle size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                            3. Coin Value Adjustments
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                            All coins hold non-proprietary values redeemable solely in accordance with threshold lists. Cash distributions are calculated matching state tax policies where required.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <span className="text-[9px] font-mono font-black text-red-700 bg-red-50 border border-red-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        Document C3
                      </span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight uppercase font-display mt-3">
                        Anti-Cheat & Security Protocols
                      </h3>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                        Active server-side telemetry designed to safeguard the coin supply.
                      </p>
                    </div>

                    <div className="h-[1px] bg-slate-100 w-full" />

                    <div className="grid grid-cols-1 gap-5">
                      <div className="flex gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl h-fit shrink-0">
                          <Key size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                            1. Direct SSL Endpoint Safeguards
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                            All API interactions, verification snapshots, and quiz inputs are sealed via Secure Socket Layers to prevent packet interception or mid-session user injects.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl h-fit shrink-0">
                          <ShieldAlert size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                            2. Live Multi-Layered Auditing
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                            Our active anti-cheat monitoring analyses spin delays, fast task completions, referral counts, and country IP flags. Exploitative sessions are flag-quarantined on the fly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'support' && (
                  <motion.div
                    key="support"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <span className="text-[9px] font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        Document D4
                      </span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight uppercase font-display mt-3">
                        Support Channels & Contact Points
                      </h3>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                        Reach out directly to Nexvy developers for data requests and queries.
                      </p>
                    </div>

                    <div className="h-[1px] bg-slate-100 w-full" />

                    <div className="grid grid-cols-1 gap-4">
                      
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                          <Globe size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Official Domain</p>
                          <a href={`https://${contactInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-black text-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-1.5 mt-0.5">
                            {contactInfo.website}
                            <ExternalLink size={12} className="text-slate-400" />
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                          <Mail size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Support Mailbox</p>
                          <a href={`mailto:${contactInfo.email}`} className="text-sm font-black text-slate-800 hover:text-purple-600 transition-colors flex items-center gap-1.5 mt-0.5">
                            {contactInfo.email}
                            <ExternalLink size={12} className="text-slate-400" />
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                          <Phone size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hotline Assistance</p>
                          <a href={`tel:${contactInfo.phone}`} className="text-sm font-black text-slate-800 hover:text-emerald-600 transition-colors flex items-center gap-1.5 mt-0.5">
                            {contactInfo.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Headquarters Location</p>
                          <p className="text-sm font-black text-slate-800 mt-0.5">
                            {contactInfo.location}
                          </p>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Timestamp footer */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-medium">
                  Last Updated: June 4, 2026
                </span>
                <span className="font-mono text-[9px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-500">
                  SECURE-LEDGER-V1
                </span>
              </div>

            </div>

          </div>

        </main>

        {/* Dynamic Trust and Company Info Footer - Privacy Policy screen only */}
        <footer className="bg-[#0b0f19] text-white border-t border-slate-800 mt-16 pt-12 pb-8 px-4">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">
            
            {/* Top Footer Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-start">
              
              {/* Branding (Col 6) */}
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

              {/* Website Info List (Col 6) */}
              <div className="sm:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Legal Block */}
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

                {/* Contact Points */}
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

            {/* Bottom Footer Panel */}
            <div className="h-[1px] bg-slate-800 w-full mt-4" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-bold uppercase tracking-wider font-mono">
              <p>
                © 2026 NEXVY PLATFORM. ALL RIGHTS RESERVED.
              </p>
              <div className="flex items-center gap-4">
                <span>Copyright: {contactInfo.copyright}</span>
              </div>
            </div>

          </div>
        </footer>

      </div>
    </>
  );
};

export default PrivacyPolicy;
