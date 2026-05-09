import { auth } from '../lib/firebase';

const getHeaders = async () => {
  const user = auth?.currentUser;
  const token = user ? await user.getIdToken() : localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const apiService = {
  async spin(bet: number) {
    try {
      const headers = await getHeaders();
      const res = await fetch('/api/user/spin', {
        method: 'POST',
        headers,
        body: JSON.stringify({ bet }),
      });
      if (!res.ok) {
        const text = await res.text();
        try { return JSON.parse(text); } catch (e) { return { error: 'Server Error' }; }
      }
      return res.json();
    } catch (e) {
      return { error: 'Connection to server failed' };
    }
  },

  async withdraw(amount: number, method: string, details: string) {
    try {
      const headers = await getHeaders();
      const res = await fetch('/api/user/withdraw', {
        method: 'POST',
        headers,
        body: JSON.stringify({ amount, method, details }),
      });
      if (!res.ok) {
        const text = await res.text();
        try { return JSON.parse(text); } catch (e) { return { error: 'Server Error' }; }
      }
      return res.json();
    } catch (e) {
      return { error: 'Connection to server failed' };
    }
  },

  async getLeaderboard() {
    try {
      const res = await fetch('/api/leaderboard');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getMe() {
    try {
      const headers = await getHeaders();
      const res = await fetch('/api/user/me', {
        headers,
      });
      if (!res.ok) {
        const text = await res.text();
        try {
          const errJson = JSON.parse(text);
          return { error: errJson.error || 'Failed to fetch user' };
        } catch (e) {
          return { error: 'Session expired or Server error' };
        }
      }
      return res.json();
    } catch (e) {
      return { error: 'Cannot connect to server. Please refresh the page.' };
    }
  },

  async getTasks() {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async submitTask(taskId: string, details: string, proof: string = 'screenshot.jpg') {
    try {
      const headers = await getHeaders();
      const res = await fetch('/api/tasks/submit', {
        method: 'POST',
        headers,
        body: JSON.stringify({ taskId, details, proof }),
      });
      if (!res.ok) {
        const text = await res.text();
        try { return JSON.parse(text); } catch (e) { return { error: 'Server Error' }; }
      }
      return res.json();
    } catch (e) {
      return { error: 'Connection to server failed' };
    }
  },

  async claimReferral(code: string) {
    try {
      const headers = await getHeaders();
      const res = await fetch('/api/user/referral', {
        method: 'POST',
        headers,
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const text = await res.text();
        try { return JSON.parse(text); } catch (e) { return { error: 'Server Error' }; }
      }
      return res.json();
    } catch (e) {
      return { error: 'Connection to server failed' };
    }
  },

  async getReferralStats() {
    try {
      const headers = await getHeaders();
      const res = await fetch('/api/user/referral/stats', { headers });
      if (!res.ok) return { invitedCount: 0, activeToday: 0, totalCommission: 0, withdrawable: 0 };
      return await res.json();
    } catch (e) {
      return { invitedCount: 0, activeToday: 0, totalCommission: 0, withdrawable: 0 };
    }
  },

  async getReferralList() {
    try {
      const headers = await getHeaders();
      const res = await fetch('/api/user/referrals', { headers });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async completeQuiz(score: number, total: number) {
    try {
      const headers = await getHeaders();
      const res = await fetch('/api/user/quiz/complete', {
        method: 'POST',
        headers,
        body: JSON.stringify({ score, total }),
      });
      if (!res.ok) {
        const text = await res.text();
        try { return JSON.parse(text); } catch (e) { return { error: 'Server Error' }; }
      }
      return res.json();
    } catch (e) {
      return { error: 'Connection to server failed' };
    }
  },

  async claimDailyReward() {
    try {
      const headers = await getHeaders();
      const res = await fetch('/api/user/daily-gift', {
        method: 'POST',
        headers,
      });
      if (!res.ok) {
        const text = await res.text();
        try { return JSON.parse(text); } catch (e) { return { error: 'Server Error' }; }
      }
      return res.json();
    } catch (e) {
      return { error: 'Connection to server failed' };
    }
  },

  async login(credentials: any) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const text = await res.text();
        try {
          const errJson = JSON.parse(text);
          return { error: errJson.error || 'Login failed' };
        } catch (e) {
          return { error: `Server Error: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}` };
        }
      }
      return res.json();
    } catch (e) {
      return { error: 'Network error. Please try again.' };
    }
  },

  async getWithdrawals() {
    const headers = await getHeaders();
    const res = await fetch('/api/user/withdrawals', { headers });
    return res.ok ? res.json() : [];
  },

  async getSubmissions() {
    const headers = await getHeaders();
    const res = await fetch('/api/user/submissions', { headers });
    return res.ok ? res.json() : [];
  },

  async signup(data: any) {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const text = await res.text();
        try {
          const errJson = JSON.parse(text);
          return { error: errJson.error || 'Signup failed' };
        } catch (e) {
          return { error: `Server Error: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}` };
        }
      }
      return res.json();
    } catch (e) {
      return { error: 'Network error. Please try again.' };
    }
  },

  // Admin Methods
  async getAdminUsers() {
    const headers = await getHeaders();
    const res = await fetch('/api/admin/users', { headers });
    return res.ok ? res.json() : [];
  },

  async toggleUserBan(userId: string, banned: boolean) {
    const headers = await getHeaders();
    const res = await fetch(`/api/admin/users/${userId}/ban`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ banned })
    });
    return res.ok;
  },

  async getAdminSubmissions() {
    const headers = await getHeaders();
    const res = await fetch('/api/admin/submissions', { headers });
    return res.ok ? res.json() : [];
  },

  async approveSubmission(id: string) {
    const headers = await getHeaders();
    const res = await fetch(`/api/admin/submissions/${id}/approve`, { method: 'POST', headers });
    return res.ok;
  },

  async rejectSubmission(id: string) {
    const headers = await getHeaders();
    const res = await fetch(`/api/admin/submissions/${id}/reject`, { method: 'POST', headers });
    return res.ok;
  },

  async getAdminWithdrawals() {
    const headers = await getHeaders();
    const res = await fetch('/api/admin/withdrawals', { headers });
    return res.ok ? res.json() : [];
  },

  async updateWithdrawalStatus(id: string, status: string) {
    const headers = await getHeaders();
    const res = await fetch(`/api/admin/withdrawals/${id}/update`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ status })
    });
    return res.ok;
  },

  async createAdminTask(task: any) {
    const headers = await getHeaders();
    const res = await fetch('/api/admin/tasks', {
      method: 'POST',
      headers,
      body: JSON.stringify(task)
    });
    return res.ok ? res.json() : { error: 'Failed' };
  },

  async getNotifications() {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  }
};
