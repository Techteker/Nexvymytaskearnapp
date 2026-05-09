import { Task, Submission, Withdrawal, User, AppSettings } from '../types';

const getHeaders = async () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const adminService = {
  // Activity Logs
  logAction: async (adminId: string, action: string, details: string) => {
    const headers = await getHeaders();
    await fetch('/api/admin/logs', {
      method: 'POST',
      headers,
      body: JSON.stringify({ adminId, action, details })
    });
  },

  getLogs: async (limit: number = 50) => {
    const headers = await getHeaders();
    const res = await fetch(`/api/admin/logs?limit=${limit}`, { headers });
    return await res.json();
  },

  // Notifications
  sendBroadcast: async (title: string, message: string) => {
    const headers = await getHeaders();
    const res = await fetch('/api/admin/notifications', {
      method: 'POST',
      headers,
      body: JSON.stringify({ title, message, type: 'broadcast' })
    });
    return await res.json();
  },

  // Settings
  getSettings: async () => {
    const headers = await getHeaders();
    const res = await fetch('/api/admin/settings', { headers });
    return await res.json();
  },

  updateSettings: async (settings: any) => {
    const headers = await getHeaders();
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers,
      body: JSON.stringify(settings)
    });
    return await res.json();
  },

  // Stats
  getDashboardStats: async () => {
    try {
      const headers = await getHeaders();
      const [users, tasks, submissions, withdrawals] = await Promise.all([
        fetch('/api/admin/users', { headers }).then(r => r.json()),
        fetch('/api/tasks').then(r => r.json()),
        fetch('/api/admin/submissions', { headers }).then(r => r.json()),
        fetch('/api/admin/withdrawals', { headers }).then(r => r.json()),
      ]);

      return {
        totalUsers: users.length,
        totalTasks: tasks.length,
        totalSubmissions: submissions.length,
        pendingSubmissions: submissions.filter((s: any) => s.status === 'pending').length,
        totalWithdrawals: withdrawals.length,
        pendingWithdrawals: withdrawals.filter((w: any) => w.status === 'pending').length,
        totalQuiz: 0, // Could be derived if needed
        totalRevenue: withdrawals.reduce((acc: number, w: any) => acc + (w.status === 'completed' ? w.amount : 0), 0),
        dailyTraffic: 0,
      };
    } catch (e) {
      return null;
    }
  },

  // User Management
  getUsers: async () => {
    const headers = await getHeaders();
    const res = await fetch('/api/admin/users', { headers });
    const data = await res.json();
    return (data || []).map((u: any) => ({ ...u, uid: u.id }));
  },

  searchUsers: async (searchTerm: string) => {
    const users = await adminService.getUsers();
    return users.filter((u: any) => 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  updateUser: async (uid: string, data: any) => {
    const headers = await getHeaders();
    if (data.isBanned !== undefined) {
      await fetch(`/api/admin/users/${uid}/ban`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ banned: data.isBanned })
      });
    }
  },

  deleteUser: async (uid: string) => {
    // Implement delete if needed, for now just ban
    await adminService.updateUser(uid, { isBanned: true });
  },

  // Task Management
  getTasks: async () => {
    const res = await fetch('/api/tasks');
    return await res.json();
  },

  createTask: async (task: any) => {
    const headers = await getHeaders();
    const res = await fetch('/api/admin/tasks', {
      method: 'POST',
      headers,
      body: JSON.stringify(task)
    });
    return await res.json();
  },

  updateTask: async (id: string, data: any) => {
    const headers = await getHeaders();
    const res = await fetch(`/api/admin/tasks/${id}`, {
      method: 'POST', // or PATCH/PUT, server uses POST for updates in other places
      headers,
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  deleteTask: async (id: string) => {
    const headers = await getHeaders();
    const res = await fetch(`/api/admin/tasks/${id}/delete`, {
      method: 'POST',
      headers
    });
    return res.ok;
  },

  // Submissions
  getSubmissions: async () => {
    const headers = await getHeaders();
    const res = await fetch('/api/admin/submissions', { headers });
    return await res.json();
  },

  reviewSubmission: async (id: string, status: 'approved' | 'rejected') => {
    const headers = await getHeaders();
    const res = await fetch(`/api/admin/submissions/${id}/${status}`, {
      method: 'POST',
      headers
    });
    return res.ok;
  },

  // Withdrawals
  getWithdrawals: async () => {
    const headers = await getHeaders();
    const res = await fetch('/api/admin/withdrawals', { headers });
    return await res.json();
  },

  updateWithdrawalStatus: async (id: string, status: string) => {
    const headers = await getHeaders();
    const res = await fetch(`/api/admin/withdrawals/${id}/update`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ status })
    });
    return res.ok;
  }
};
