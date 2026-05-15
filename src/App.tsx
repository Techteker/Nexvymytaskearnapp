import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { RealtimeProvider } from './context/RealtimeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Lazy load screens
const Home = lazy(() => import('./screens/Home').then(m => ({ default: m.Home })));
const Tasks = lazy(() => import('./screens/Tasks').then(m => ({ default: m.Tasks })));
const Spinner = lazy(() => import('./screens/Spinner').then(m => ({ default: m.Spinner })));
const DailyGift = lazy(() => import('./screens/DailyGift').then(m => ({ default: m.DailyGift })));
const Withdraw = lazy(() => import('./screens/Withdraw').then(m => ({ default: m.Withdraw })));
const Leaderboard = lazy(() => import('./screens/Leaderboard').then(m => ({ default: m.Leaderboard })));
const Referral = lazy(() => import('./screens/Referral').then(m => ({ default: m.Referral })));
const QuizList = lazy(() => import('./screens/QuizList').then(m => ({ default: m.QuizList })));
const QuizGame = lazy(() => import('./screens/QuizGame').then(m => ({ default: m.QuizGame })));
const TaskDetails = lazy(() => import('./screens/TaskDetails').then(m => ({ default: m.TaskDetails })));
const Auth = lazy(() => import('./screens/Auth').then(m => ({ default: m.Auth })));
const Profile = lazy(() => import('./screens/Account'));
const ShopEarnHome = lazy(() => import('./screens/ShopEarnHome').then(m => ({ default: m.ShopEarnHome })));
const OfferDetails = lazy(() => import('./screens/OfferDetails').then(m => ({ default: m.OfferDetails })));

// Admin Lazy loads
const AdminRoute = lazy(() => import('./components/AdminRoute').then(m => ({ default: m.AdminRoute })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const Dashboard = lazy(() => import('./components/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const UserManagement = lazy(() => import('./components/admin/UserManagement').then(m => ({ default: m.UserManagement })));
const TaskManagement = lazy(() => import('./components/admin/TaskManagement').then(m => ({ default: m.TaskManagement })));
const Submissions = lazy(() => import('./components/admin/Submissions').then(m => ({ default: m.Submissions })));
const Withdrawals = lazy(() => import('./components/admin/Withdrawals').then(m => ({ default: m.Withdrawals })));
const NotificationCenter = lazy(() => import('./components/admin/NotificationCenter').then(m => ({ default: m.NotificationCenter })));
const AffiliateManagement = lazy(() => import('./components/admin/AffiliateManagement').then(m => ({ default: m.AffiliateManagement })));
const AffiliateClaims = lazy(() => import('./components/admin/AffiliateClaims').then(m => ({ default: m.AffiliateClaims })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
  </div>
);

import { SplashScreen } from './components/SplashScreen';
import { useAuth } from './context/AuthContext';

const AppContent = () => {
  const { authReady } = useAuth();

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

        {/* User Routes */}
        <Route path="/login" element={<Auth />} />
        <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Layout><Tasks /></Layout></ProtectedRoute>} />
        <Route path="/spinner" element={<ProtectedRoute><Layout><Spinner /></Layout></ProtectedRoute>} />
        <Route path="/daily-gift" element={<ProtectedRoute><Layout><DailyGift /></Layout></ProtectedRoute>} />
        <Route path="/withdraw" element={<ProtectedRoute><Layout><Withdraw /></Layout></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Layout><Leaderboard /></Layout></ProtectedRoute>} />
        <Route path="/referral" element={<ProtectedRoute><Layout><Referral /></Layout></ProtectedRoute>} />
        <Route path="/quizzes" element={<ProtectedRoute><Layout><QuizList /></Layout></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute><Layout><QuizGame /></Layout></ProtectedRoute>} />
        <Route path="/task/:id" element={<ProtectedRoute><Layout><TaskDetails /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/shop-earn" element={<ProtectedRoute><Layout><ShopEarnHome /></Layout></ProtectedRoute>} />
        <Route path="/shop-earn/:id" element={<ProtectedRoute><Layout><OfferDetails /></Layout></ProtectedRoute>} />
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
