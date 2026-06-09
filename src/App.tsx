import React, { Suspense, lazy, useEffect } from 'react';
import { motion } from 'motion/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RealtimeProvider } from './context/RealtimeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Static load screens for solid, reliable loading
import { Home } from './screens/Home';
import { Tasks } from './screens/Tasks';
import { Spinner } from './screens/Spinner';
import { DailyGift } from './screens/DailyGift';
import { Withdraw } from './screens/Withdraw';
import { Leaderboard } from './screens/Leaderboard';
import { Referral } from './screens/Referral';
import { QuizList } from './screens/QuizList';
import { QuizGame } from './screens/QuizGame';
import { TaskDetails } from './screens/TaskDetails';
import { Welcome } from './screens/Welcome';
import { Auth } from './screens/Auth';
import Profile from './screens/Account';
import { PrivacyPolicy } from './screens/PrivacyPolicy';
import { AboutUs } from './screens/AboutUs';
import { TermsConditions } from './screens/TermsConditions';
import { ContactUs } from './screens/ContactUs';
import { RefundPolicy } from './screens/RefundPolicy';
import { NotFound } from './screens/NotFound';
import { Download } from './screens/Download';
import { ShopEarnHome } from './screens/ShopEarnHome';
import { OfferDetails } from './screens/OfferDetails';
import { apiService } from './services/api';

// Admin static loads
import { AdminRoute } from './components/AdminRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { Dashboard } from './components/admin/Dashboard';
import { UserManagement } from './components/admin/UserManagement';
import { TaskManagement } from './components/admin/TaskManagement';
import { Submissions } from './components/admin/Submissions';
import { Withdrawals } from './components/admin/Withdrawals';
import { NotificationCenter } from './components/admin/NotificationCenter';
import { AffiliateManagement } from './components/admin/AffiliateManagement';
import { AffiliateClaims } from './components/admin/AffiliateClaims';
import { LogoManagement } from './components/admin/LogoManagement';

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDD835]">
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={{ 
          y: [0, -40, 0],
        }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="w-12 h-12 bg-[#2D2D2D] rounded-full relative z-10"
      >
        <div className="absolute top-2 left-2 w-3 h-2 bg-white/30 rounded-full rotate-[-30deg]" />
      </motion.div>
      <div className="w-14 h-3 bg-black/10 rounded-[100%] mt-[-5px] blur-[2px]" />
      <p className="mt-6 text-[#2D2D2D] font-display font-black text-xs uppercase tracking-widest animate-pulse">
        Loading...
      </p>
    </div>
  </div>
);

import { SplashScreen } from './components/SplashScreen';
import { useAuth } from './context/AuthContext';

const AppContent = () => {
  const { authReady } = useAuth();

  useEffect(() => {
    // Capture URL referral code dynamically on land and store it in local storage
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      localStorage.setItem('referredBy', refCode.trim().toUpperCase());
      console.log('[REFERRAL] Captured and saved referral code:', refCode.trim().toUpperCase());
    }

    // 1. Fetch and synchronize brand logo from the persistent cloud database first
    const syncLogoFromCloud = async () => {
      try {
        const settings = await apiService.getAppSettings();
        if (settings && settings.appLogo && settings.appLogo !== '/input_file_0.png') {
          const current = localStorage.getItem('app_logo');
          if (current !== settings.appLogo) {
            localStorage.setItem('app_logo', settings.appLogo);
            window.dispatchEvent(new Event('app_logo_changed'));
          }
          return true;
        }
      } catch (err) {
        console.warn('[LOGO-SYNC] Cloud load bypassed or offline:', err);
      }
      return false;
    };

    // 2. Perform synchronization
    syncLogoFromCloud().then((synchronized) => {
      if (!synchronized) {
        // Fallback to Express server config if cloud document has no custom appLogo
        fetch('/api/get-logo')
          .then(res => res.json())
          .then(data => {
            if (data && data.logoUrl) {
              const current = localStorage.getItem('app_logo');
              if (current !== data.logoUrl) {
                localStorage.setItem('app_logo', data.logoUrl);
                window.dispatchEvent(new Event('app_logo_changed'));
              }
            }
          })
          .catch(e => console.warn('[LOGO-SYNC] Server-side fallback bypassed:', e));
      }
    });
  }, []);

  if (!authReady) {
    return <SplashScreen />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminLayout><UserManagement /></AdminLayout></AdminRoute>} />
        <Route path="/admin/tasks" element={<AdminRoute><AdminLayout><TaskManagement /></AdminLayout></AdminRoute>} />
        <Route path="/admin/submissions" element={<AdminRoute><AdminLayout><Submissions /></AdminLayout></AdminRoute>} />
        <Route path="/admin/withdrawals" element={<AdminRoute><AdminLayout><Withdrawals /></AdminLayout></AdminRoute>} />
        <Route path="/admin/notifications" element={<AdminRoute><AdminLayout><NotificationCenter /></AdminLayout></AdminRoute>} />
        <Route path="/admin/affiliate" element={<AdminRoute><AdminLayout><AffiliateManagement /></AdminLayout></AdminRoute>} />
        <Route path="/admin/affiliate/claims" element={<AdminRoute><AdminLayout><AffiliateClaims /></AdminLayout></AdminRoute>} />
        <Route path="/admin/logo" element={<AdminRoute><AdminLayout><LogoManagement /></AdminLayout></AdminRoute>} />

        {/* User Routes */}
        <Route path="/login" element={<Welcome />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Layout><Tasks /></Layout></ProtectedRoute>} />
        <Route path="/spinner" element={<ProtectedRoute><Layout><Spinner /></Layout></ProtectedRoute>} />
        <Route path="/daily-gift" element={<ProtectedRoute><Layout><DailyGift /></Layout></ProtectedRoute>} />
        <Route path="/withdraw" element={<ProtectedRoute><Layout><Withdraw /></Layout></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Layout><Leaderboard /></Layout></ProtectedRoute>} />
        <Route path="/referral" element={<ProtectedRoute><Layout><Referral /></Layout></ProtectedRoute>} />
        <Route path="/survey" element={<ProtectedRoute><Layout wide={true}><QuizList /></Layout></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute><Layout><QuizGame /></Layout></ProtectedRoute>} />
        <Route path="/task/:id" element={<ProtectedRoute><Layout><TaskDetails /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/download" element={<Download />} />
        <Route path="/shop-earn" element={<ProtectedRoute><Layout><ShopEarnHome /></Layout></ProtectedRoute>} />
        <Route path="/shop-earn/:id" element={<ProtectedRoute><Layout><OfferDetails /></Layout></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <RealtimeProvider>
            <AppContent />
          </RealtimeProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}
