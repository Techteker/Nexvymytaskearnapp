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

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/spinner" element={<Spinner />} />
          <Route path="/daily-gift" element={<DailyGift />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/referral" element={<Referral />} />
        </Routes>
      </Layout>
    </Router>
  );
}
