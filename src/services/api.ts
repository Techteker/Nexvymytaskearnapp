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
    const headers = await getHeaders();
    const res = await fetch('/api/user/spin', {
      method: 'POST',
      headers,
      body: JSON.stringify({ bet }),
    });
    return res.json();
  },

  async withdraw(amount: number, method: string, details: string) {
    const headers = await getHeaders();
    const res = await fetch('/api/user/withdraw', {
      method: 'POST',
      headers,
      body: JSON.stringify({ amount, method, details }),
    });
    return res.json();
  },

  async getLeaderboard() {
    const res = await fetch('/api/leaderboard');
    return res.json();
  },

  async getMe() {
    const headers = await getHeaders();
    const res = await fetch('/api/user/me', {
      headers,
    });
    return res.json();
  },

  async getTasks() {
    const res = await fetch('/api/tasks');
    return res.json();
  },

  async submitTask(taskId: string, details: string, proof: string = 'screenshot.jpg') {
    const headers = await getHeaders();
    const res = await fetch('/api/tasks/submit', {
      method: 'POST',
      headers,
      body: JSON.stringify({ taskId, details, proof }),
    });
    return res.json();
  },

  async claimReferral(code: string) {
    const headers = await getHeaders();
    const res = await fetch('/api/user/referral', {
      method: 'POST',
      headers,
      body: JSON.stringify({ code }),
    });
    return res.json();
  },

  async completeQuiz(score: number, total: number) {
    const headers = await getHeaders();
    const res = await fetch('/api/user/quiz/complete', {
      method: 'POST',
      headers,
      body: JSON.stringify({ score, total }),
    });
    return res.json();
  },

  async claimDailyReward() {
    const headers = await getHeaders();
    const res = await fetch('/api/user/daily-gift', {
      method: 'POST',
      headers,
    });
    return res.json();
  },

  async login(credentials: any) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  async signup(data: any) {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
};
