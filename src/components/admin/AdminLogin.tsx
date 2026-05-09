import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { LogIn, ShieldCheck, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../../types';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('ranarajendar930@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupMode, setSetupMode] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setLoading(true);
    setError(null);

    try {
      // 0. Strict Pre-filter
      if (email.toLowerCase() !== 'ranarajendar930@gmail.com') {
        setError('Access Denied: Only the authorized Super Admin may access this portal.');
        setLoading(false);
        return;
      }

      // 1. Initial login attempt
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        // If user doesn't exist and it's the default admin email, try to register
        // User provided the password @Rajendar022 in the latest prompt
        if (err.code === 'auth/user-not-found' && email === 'ranarajendar930@gmail.com' && (password === '@Rajendar022' || password === '@Rajendar02')) {
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
          setSetupMode(true);
        } else {
          throw err;
        }
      }

      const uid = userCredential.user.uid;

      // 2. Role Check
      const adminDocRef = doc(db, 'admins', uid);
      const adminSnap = await getDoc(adminDocRef);

      if (!adminSnap.exists()) {
        // Create admin role ONLY for the authorized email
        if (email === 'ranarajendar930@gmail.com') {
          await setDoc(adminDocRef, {
            email: email,
            role: UserRole.SUPER_ADMIN,
            isSuperAdmin: true,
            createdAt: serverTimestamp()
          });
          
          // Also create user doc if missing
          const userDocRef = doc(db, 'users', uid);
          const userSnap = await getDoc(userDocRef);
          if (!userSnap.exists()) {
            await setDoc(userDocRef, {
              username: 'Super Admin',
              email: email,
              coins: 999999,
              level: 100,
              isBanned: false,
              role: UserRole.SUPER_ADMIN,
              createdAt: serverTimestamp()
            });
          }
        } else {
          setError('Access denied. Unrecognized admin authorization.');
          setLoading(false);
          return;
        }
      }

      // 3. Activity Log
      await adminService.logAction(uid, 'ADMIN_LOGIN', `Super Admin logged in successfully.`);

      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden"
      >
        {/* Abstract Background Accents */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>

        <div className="relative text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600/20 rounded-2.5xl mb-6 ring-1 ring-purple-500/30">
            <ShieldCheck className="text-purple-400" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Nexvy Panel</h1>
          <p className="text-slate-400">Secure entry for Nexvy Administrators</p>
        </div>

        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm"
          >
            <AlertCircle size={18} className="shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 relative">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={20} />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-slate-600"
                placeholder="admin@nexvy.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Secure Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={20} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={22} />
            ) : (
              <>
                <LogIn size={22} className="group-hover:translate-x-1 transition-transform" />
                Access Panel
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>© 2026 Nexvy Earning Platform. Internal use only.</p>
        </div>
      </motion.div>
    </div>
  );
};
