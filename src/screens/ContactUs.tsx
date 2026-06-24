import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  ArrowLeft, 
  Shield, 
  Sparkles,
  ChevronRight,
  Globe,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Keyboard
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';

export const ContactUs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    category: 'withdrawal',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict sanitization helper
    const cleanStr = (val: string) => {
      if (!val) return '';
      return val
        .replace(/<[^>]*>/g, '') // Strip HTML tags
        .replace(/javascript:/gi, '') // Block schema execution
        .replace(/['"`;]/g, '') // Strip escape sequences
        .trim();
    };

    const sanitizedEmail = cleanStr(form.email);
    const sanitizedMessage = cleanStr(form.message);
    const sanitizedName = cleanStr(form.name);

    if (!sanitizedEmail || !sanitizedMessage) {
      setError('Please provide both registered email and descriptions.');
      return;
    }
    setError('');
    setLoading(true);

    // Simulate network submission duration
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({
        name: user?.name || '',
        email: user?.email || '',
        category: 'withdrawal',
        message: ''
      });
    }, 1500);
  };

  const menuItems = [
    { label: 'About Us', path: '/about-us' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms-and-conditions' },
    { label: 'Refund Policy', path: '/refund-policy' },
    { label: 'Contact Us', path: '/contact-us', active: true }
  ];

  return (
    <>
      <SEO 
        title="Contact Us - 24/7 Nexvy Support Desk" 
        description="Get in touch with the Nexvy reward network team. Open an inquiry about coin postbacks, withdrawal review status, or brand affiliate setups."
        keywords="contact nexvy, nexvy support email, refund coins, appwrite database status help, coin reward problem"
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
                  <Mail className="w-5 h-5 text-indigo-600" />
                  Nexvy Support
                </h1>
                <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">
                  Active Member Assistance
                </p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2.5 py-1 rounded-full font-bold">
                Online Chat 24/7
              </span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Live</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-1">
          
          {/* Hero Banner Banner Section */}
          <div className="relative mb-8 p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-[32px] overflow-hidden shadow-xl border border-white/10">
            <div className="absolute -right-10 -bottom-10 opacity-10 text-white">
              <Mail size={220} />
            </div>
            <div className="absolute right-6 top-6 w-3 h-3 bg-indigo-500 rounded-full opacity-45" />

            <div className="relative z-10 max-w-xl flex flex-col gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 w-fit">
                <Sparkles size={11} className="text-amber-400" />
                <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 font-mono">
                  SLA response
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter leading-none uppercase">
                Contact Desk
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium mt-1">
                Have a coin lag, failed task proof, or standard affiliate claim clarification? Fill out our secure form, and a verified admin will reach out to you within 24 hours.
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

              {/* Direct Support Overview Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100/40 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-black text-indigo-950 uppercase tracking-tight flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                  Need Fast Help?
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-2">
                  Please make sure to write down the exact transaction hash or registration email registered in your profile to speed up audit lookup times!
                </p>
              </div>
            </div>

            {/* Document Content Display Area (Col Span 8) */}
            <div className="md:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm relative">
              <div className="flex flex-col gap-5">
                <div>
                  <span className="text-[9px] font-mono font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Inquiry Desk
                  </span>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight uppercase font-display mt-3">
                    Submit Support Ticket
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                    Provide real details. All tickets are matched against our user database.
                  </p>
                </div>

                <div className="h-[1px] bg-slate-100 w-full" />

                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-6 bg-emerald-55 border border-emerald-100 rounded-2xl flex flex-col items-center text-center gap-3.5"
                    >
                      <CheckCircle2 size={44} className="text-emerald-500" />
                      <div>
                        <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">Ticket Lodged Successfully</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                          Thank you for contacting us. Ticket Reference: <strong className="font-mono text-indigo-600">NXV-{Math.floor(100000 + Math.random() * 900000)}</strong>. We will check the log metrics and write back to your inbox.
                        </p>
                      </div>
                      <button 
                        onClick={() => setSuccess(false)}
                        className="mt-2 px-5 py-2 rounded-xl bg-slate-950 text-white font-display font-black text-[10px] tracking-wider uppercase border-0 cursor-pointer hover:bg-slate-800 transition-colors"
                      >
                        Submit Another Inquiry
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      onSubmit={handleSubmit} 
                      className="flex flex-col gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-xs text-red-600 font-medium">
                          <AlertCircle size={14} className="shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Registered Name</label>
                          <input 
                            type="text"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-semibold"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Registered Email *</label>
                          <input 
                            type="email"
                            required
                            placeholder="help@nexvy.in"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-semibold"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Inquiry Category</label>
                        <select 
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-black tracking-normal uppercase"
                        >
                          <option value="withdrawal">Withdrawal Status Delay</option>
                          <option value="task_completion">Task Proof Verification</option>
                          <option value="cpx_postback">CPX Postback Coins Missing</option>
                          <option value="spin_and_earn">Lucky Spin & Quiz Dispute</option>
                          <option value="affiliate_claim">Affiliate Partner Commissions</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Describe your issue completely *</label>
                        <textarea 
                          rows={4}
                          required
                          placeholder="Provide all facts. Example: My withdrawal ID is wd_8271. I verified my Paytm/UPI info and completed 3 tasks, but..."
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 font-medium leading-relaxed"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 bg-indigo-600 text-white font-display font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 active:scale-98 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Submitting ticket...</span>
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            <span>Submit Support Ticket</span>
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium">
                    Support Ticket Portal
                  </span>
                  <span className="font-mono text-[9px] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-emerald-600 font-bold uppercase">
                    v2.0 ONLINE
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

export default ContactUs;
