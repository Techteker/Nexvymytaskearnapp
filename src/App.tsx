/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Layout } from './components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Auth } from './screens/Auth';

// Admin Imports
import { AdminRoute } from './components/AdminRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { Dashboard } from './components/admin/Dashboard';
import { UserManagement } from './components/admin/UserManagement';
import { TaskManagement } from './components/admin/TaskManagement';
import { QuizGenerator } from './components/admin/QuizGenerator';
import { Submissions } from './components/admin/Submissions';
import { Withdrawals } from './components/admin/Withdrawals';
import { SpinManagement } from './components/admin/SpinManagement';
import { ReferralManagement } from './components/admin/ReferralManagement';
import { NotificationCenter } from './components/admin/NotificationCenter';
import { ActivityLogs } from './components/admin/ActivityLogs';
import { SettingsPanel } from './components/admin/SettingsPanel';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminLayout><UserManagement /></AdminLayout></AdminRoute>} />
          <Route path="/admin/tasks" element={<AdminRoute><AdminLayout><TaskManagement /></AdminLayout></AdminRoute>} />
          <Route path="/admin/quiz-gen" element={<AdminRoute><AdminLayout><QuizGenerator /></AdminLayout></AdminRoute>} />
          <Route path="/admin/submissions" element={<AdminRoute><AdminLayout><Submissions /></AdminLayout></AdminRoute>} />
          <Route path="/admin/withdrawals" element={<AdminRoute><AdminLayout><Withdrawals /></AdminLayout></AdminRoute>} />
          <Route path="/admin/ads" element={<AdminRoute><AdminLayout><SettingsPanel /></AdminLayout></AdminRoute>} />
          <Route path="/admin/spin" element={<AdminRoute><AdminLayout><SpinManagement /></AdminLayout></AdminRoute>} />
          <Route path="/admin/referrals" element={<AdminRoute><AdminLayout><ReferralManagement /></AdminLayout></AdminRoute>} />
          <Route path="/admin/notifications" element={<AdminRoute><AdminLayout><NotificationCenter /></AdminLayout></AdminRoute>} />
          <Route path="/admin/branding" element={<AdminRoute><AdminLayout><SettingsPanel /></AdminLayout></AdminRoute>} />
          <Route path="/admin/logs" element={<AdminRoute><AdminLayout><ActivityLogs /></AdminLayout></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminLayout><SettingsPanel /></AdminLayout></AdminRoute>} />

          {/* User Routes */}
          <Route path="/auth" element={<Auth />} />
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
        </Routes>
      </AuthProvider>
    </Router>
  );
}
