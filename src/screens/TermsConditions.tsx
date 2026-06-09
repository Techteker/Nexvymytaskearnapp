import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  ArrowLeft, 
  Shield, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Globe,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  Lock,
  UserCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';

export const TermsConditions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const menuItems = [
    { label: 'About Us', path: '/about-us' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms-and-conditions', active: true },
    { label: 'Refund Policy', path: '/refund-policy' },
    { label: 'Contact Us', path: '/contact-us' }
  ];

  return (
    <>
      <SEO 
        title="Terms and Conditions - Nexvy Platform Guidelines" 
        description="Review Nexvy's terms and conditions. Learn about the single account policy, device verification guidelines, task rules, and secure coins redemption terms."
        keywords="terms and conditions nexvy, nexvy agreement, task rules, reward wallet terms, india cash app guidelines"
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
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Nexvy Terms & Rules
                </h1>
                <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">
                  Agreement of Play & Task Logs
                </p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2.5 py-1 rounded-full font-bold">
                v1.8 Revised
              </span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Enforced</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-1">
          
          {/* Hero Banner Banner Section */}
          <div className="relative mb-8 p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-[32px] overflow-hidden shadow-xl border border-white/10">
            <div className="absolute -right-10 -bottom-10 opacity-10 text-white">
              <FileText size={220} />
            </div>
            <div className="absolute right-6 top-6 w-3 h-3 bg-indigo-500 rounded-full opacity-45" />

            <div className="relative z-10 max-w-xl flex flex-col gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 w-fit">
                <Sparkles size={11} className="text-amber-400" />
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 font-mono">
                  Enforce Integrity
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter leading-none uppercase">
                Terms of Service
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium mt-1">
                By entering Nexvy, you agree to fulfill challenges organically. Cheat bots, auto-clickers, and duplicate emulator networks are strictly banned to protect the ecosystem.
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
                    className={`w-full group text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between border-0 cursor-pointer text-sm no-underline ${
                      item.active
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]'
                        : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-xs font-bold leading-none">{item.label}</span>
                    <ChevronRight size={14} className={item.active ? 'text-white' : 'text-slate-300'} />
                  </Link>
                ))}
              </div>

              {/* Security Box */}
              <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100/40 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-black text-indigo-950 uppercase tracking-tight flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  Fair Distribution
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-2">
                  Nexvy coins have non-cash properties till redeemed at official thresholds. We enforce strict IP auditing at withdrawal time to confirm legitimate, live claims.
                </p>
              </div>
            </div>

            {/* Document Content Display Area (Col Span 8) */}
            <div className="md:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm min-h-[440px] relative">
              <div className="flex flex-col gap-6">
                <div>
                  <span className="text-[9px] font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Official Guidelines
                  </span>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight uppercase font-display mt-3">
                    Terms & User Commitments
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                    Last modified: June 5, 2026. Please read this agreement completely.
                  </p>
                </div>

                <div className="h-[1px] bg-slate-100 w-full" />

                <div className="grid grid-cols-1 gap-6">
                  <div className="flex gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl h-fit shrink-0">
                      <UserCheck size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                        1. Account Eligibility & IP Integrity
                      </h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                        Users must be at least 18 years or have parental guidance. Registering duplicate emails, generating bulk bots on a single IP address, or hiding proxy networks behind VPN nodes triggers systematic ban protocol with instant ledger balance forfeiture.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl h-fit shrink-0">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                        2. Proof of Submission Verification
                      </h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                        When completing third-party tasks (e.g. app signups, surveys, brand comments), you must upload clear and unaltered PNG/JPG screenshots. Fabricating results or submitting fake cropped proof results is considered breach of contract.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl h-fit shrink-0">
                      <Shield size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                        3. Reward Valuation Amendments
                      </h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                        Coin levels on Nexvy depend on active sponsor payouts and are subject to currency adjustments. We reserve the absolute right to reset accounts, verify balances, or process payments on up to 7 business days terms.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium">
                    Corporate Entity: Nexvy Network
                  </span>
                  <span className="font-mono text-[9px] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-indigo-600 font-bold uppercase">
                    ENFORCED-V1
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

export default TermsConditions;
