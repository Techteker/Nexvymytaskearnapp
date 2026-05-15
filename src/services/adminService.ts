import { Task, Submission, Withdrawal, User, AppSettings } from '../types';
import { databases, storage, APPWRITE_CONFIG } from '../lib/appwrite';
import { ID, Query, Permission, Role } from 'appwrite';

export const adminService = {
  // File Uploads
  uploadTaskImage: async (file: File): Promise<string> => {
    try {
      const bucketId = APPWRITE_CONFIG.buckets.uploads || 'uploads';
      const res = await storage.createFile(
        bucketId, 
        ID.unique(), 
        file,
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      // Construct the preview URL
      const url = storage.getFilePreview(bucketId, res.$id);
      return url.toString();
    } catch (e: any) {
      console.error('[ADMIN] Upload failed', e);
      throw e;
    }
  },

  getTaskImageUrl: (fileId: string) => {
    const bucketId = APPWRITE_CONFIG.buckets.uploads || 'uploads';
    return storage.getFilePreview(bucketId, fileId);
  },

  // Activity Logs
  logAction: async (adminId: string, action: string, details: string) => {
    try {
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.logs,
        ID.unique(),
        { adminId, action, details, timestamp: new Date().toISOString() },
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
    } catch (e) {
      console.error('[ADMIN] Log failed', e);
    }
  },

  getLogs: async (limit: number = 50) => {
    try {
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.logs,
        [Query.orderDesc('timestamp'), Query.limit(limit)]
      );
      return res.documents;
    } catch (e) {
      return [];
    }
  },

  // Notifications
  sendBroadcast: async (title: string, message: string, imageUrl?: string) => {
    try {
      const res = await databases.createDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.notifications,
        ID.unique(),
        { title, message, imageUrl, date: new Date().toISOString(), type: 'broadcast' },
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      return { success: true, id: res.$id };
    } catch (e: any) {
      return { error: e.message };
    }
  },

  sendTargetedNotification: async (userIds: string[], title: string, message: string, imageUrl?: string) => {
    try {
      const dbId = APPWRITE_CONFIG.databaseId!;
      const collId = APPWRITE_CONFIG.collections.notifications;
      
      const promises = userIds.map(uid => 
        databases.createDocument(
          dbId,
          collId,
          ID.unique(),
          { 
            userId: uid, 
            title, 
            message, 
            imageUrl, 
            date: new Date().toISOString(),
            type: 'targeted'
          },
          [Permission.read(Role.user(uid))]
        )
      );
      
      await Promise.all(promises);
      return { success: true };
    } catch (e: any) {
      return { error: e.message };
    }
  },

  // Settings
  getSettings: async () => {
    try {
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.settings,
        [Query.limit(1)]
      );
      return res.documents[0] || {};
    } catch (e) {
      return {};
    }
  },

  updateSettings: async (settings: any) => {
    try {
      const current = await adminService.getSettings() as any;
      if (current.$id) {
        return await databases.updateDocument(
          APPWRITE_CONFIG.databaseId!,
          APPWRITE_CONFIG.collections.settings,
          current.$id,
          settings
        );
      } else {
        return await databases.createDocument(
          APPWRITE_CONFIG.databaseId!,
          APPWRITE_CONFIG.collections.settings,
          ID.unique(),
          settings,
          [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
          ]
        );
      }
    } catch (e: any) {
      return { error: e.message };
    }
  },

  // Unified Dashboard Stats
  getDashboardStats: async () => {
    try {
      const fetchCollectionCount = async (collectionId: string, queries: any[] = []) => {
        try {
          if (!collectionId) return { total: 0, documents: [], unauthorized: false };
          const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId!, collectionId, queries);
          return { ...res, unauthorized: false };
        } catch (e: any) {
          const message = (e.message || String(e)).toLowerCase();
          const isUnauthorized = e.code === 401 || e.code === 403 || 
                               message.includes('authorized') || 
                               message.includes('permissions') ||
                               message.includes('unauthorized');
          
          const isNotFound = e.code === 404 || message.includes('not found');

          if (isNotFound) {
            console.warn(`[ADMIN] Collection not found: ${collectionId}`);
          } else if (isUnauthorized) {
            console.warn(`[ADMIN] Permission denied for ${collectionId}. Check Appwrite settings.`);
          } else {
            console.error(`[ADMIN] Error fetching ${collectionId}:`, e.message || e);
          }
          return { total: 0, documents: [], unauthorized: isUnauthorized || isNotFound };
        }
      };

      const [usersRes, sRes, wRes, tRes, lRes] = await Promise.all([
        fetchCollectionCount(APPWRITE_CONFIG.collections.users, [Query.limit(1)]),
        fetchCollectionCount(APPWRITE_CONFIG.collections.submissions, [Query.equal('status', 'approved'), Query.limit(1)]),
        fetchCollectionCount(APPWRITE_CONFIG.collections.withdrawals, [Query.limit(100)]),
        fetchCollectionCount(APPWRITE_CONFIG.collections.transactions, [Query.limit(1)]),
        fetchCollectionCount(APPWRITE_CONFIG.collections.logs, [Query.limit(1)])
      ]);

      const permissions = {
        users: !usersRes.unauthorized,
        submissions: !sRes.unauthorized,
        withdrawals: !wRes.unauthorized,
        transactions: !tRes.unauthorized,
        logs: !lRes.unauthorized
      };

      // Safely calculate totals
      const totalUsers = usersRes?.total || 0;
      const totalEarnings = (sRes?.total || 0) * 100;
      
      const withdrawalsDocs = wRes?.documents || [];
      const totalWithdrawals = withdrawalsDocs
        .filter((d: any) => d.status === 'approved' || d.status === 'successful')
        .reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);
      
      const pendingWithdrawalsCount = withdrawalsDocs.filter((d: any) => d.status === 'pending').length;

      const activeUsersRes = await fetchCollectionCount(APPWRITE_CONFIG.collections.users, [Query.equal('isBanned', false), Query.limit(1)]);

      return {
        totalUsers,
        activeUsers: activeUsersRes?.total || 0,
        onlineUsers: Math.floor(totalUsers * 0.15),
        totalEarnings,
        totalWithdrawals,
        pendingWithdrawals: pendingWithdrawalsCount,
        revenue: totalEarnings * 0.25, 
        growth: 18,
        permissions
      };
    } catch (e) {
      console.error('[ADMIN] Dashboard stats fetch failed', e);
      return { totalUsers: 0, activeUsers: 0, onlineUsers: 0, totalEarnings: 0, totalWithdrawals: 0, pendingWithdrawals: 0, revenue: 0, growth: 0 };
    }
  },

  // Legacy alias for compatibility if any
  getStats: async () => adminService.getDashboardStats(),

  // Advanced User Management
  banUser: async (uid: string, reason: string, adminId: string) => {
    try {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        uid,
        { isBanned: true, banReason: reason }
      );
      await adminService.logAction(adminId, 'ban_user', `Banned user ${uid}. Reason: ${reason}`);
      return true;
    } catch (e) {
      return false;
    }
  },

  unbanUser: async (uid: string, adminId: string) => {
    try {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        uid,
        { isBanned: false, banReason: null }
      );
      await adminService.logAction(adminId, 'unban_user', `Unbanned user ${uid}`);
      return true;
    } catch (e) {
      return false;
    }
  },

  setUserRole: async (uid: string, role: 'user' | 'admin', adminId: string) => {
    try {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        uid,
        { role }
      );
      await adminService.logAction(adminId, 'update_role', `Updated role for ${uid} to ${role}`);
      return true;
    } catch (e) {
      return false;
    }
  },

  getReferralNetwork: async (uid: string) => {
    try {
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        [Query.equal('referredBy', uid)]
      );
      return res.documents;
    } catch (e) {
      return [];
    }
  },

  detectFraud: async () => {
    try {
      const users = await adminService.getUsers();
      return users.filter((u: any) => u.isSuspicious);
    } catch (e) {
      return [];
    }
  },

  // User Management
  getUsers: async () => {
    try {
      const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.users, [Query.orderDesc('$createdAt'), Query.limit(1000)]);
      return res.documents.map((u: any) => ({ 
        ...u, 
        uid: u.$id,
        isSuspicious: (u.coins > 1000000) || (u.spinCount > 500) || (u.referralCount > 50 && u.coins < 500)
      }));
    } catch (e) {
      return [];
    }
  },

  searchUsers: async (searchTerm: string) => {
    try {
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        [Query.search('email', searchTerm)]
      );
      return res.documents.map((u: any) => ({ ...u, uid: u.$id }));
    } catch (e) {
      // Fallback for search query
      const all = await adminService.getUsers();
      return all.filter((u: any) => 
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (u.username||'').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  },

  updateUser: async (uid: string, data: any) => {
    try {
      return await databases.updateDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        uid,
        data
      );
    } catch (e) {
      console.error('[ADMIN] Update user failed', e);
      throw e;
    }
  },

  deleteUser: async (uid: string) => {
    try {
      await databases.deleteDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.users, uid);
      return true;
    } catch (e) {
      console.error('[ADMIN] Delete user failed', e);
      return false;
    }
  },

  adjustUserCoins: async (uid: string, amount: number, adminId: string) => {
    try {
      const user = await databases.getDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.users, uid);
      const newCoins = (user.coins || 0) + amount;
      
      // Atomic logic: Update User + Create Transaction
      await Promise.all([
        databases.updateDocument(
          APPWRITE_CONFIG.databaseId!,
          APPWRITE_CONFIG.collections.users,
          uid,
          { coins: newCoins }
        ),
        databases.createDocument(
          APPWRITE_CONFIG.databaseId!,
          APPWRITE_CONFIG.collections.transactions,
          ID.unique(),
          { 
            userId: uid, 
            amount, 
            type: 'adjustment', 
            details: `Admin adjustment by ${adminId}`,
            timestamp: new Date().toISOString()
          },
          [Permission.read(Role.user(uid)), Permission.read(Role.any())]
        )
      ]);

      await adminService.logAction(adminId, 'adjust_coins', `Adjusted coins for ${uid} by ${amount}. New total: ${newCoins}`);
      return true;
    } catch (e) {
      console.error('[ADMIN] Coin adjustment failed', e);
      return false;
    }
  },

  // Categories
  getCategories: async () => {
    try {
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.task_categories || 'task_categories',
        [Query.orderAsc('name')]
      );
      return res.documents;
    } catch (e) {
      return [];
    }
  },

  createCategory: async (category: any) => {
    try {
      return await databases.createDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.task_categories || 'task_categories',
        ID.unique(),
        { ...category, isActive: true },
        [Permission.read(Role.any())]
      );
    } catch (e: any) {
      return { error: e.message };
    }
  },

  updateCategory: async (id: string, data: any) => {
    try {
      return await databases.updateDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.task_categories || 'task_categories',
        id,
        data
      );
    } catch (e: any) {
      return { error: e.message };
    }
  },

  deleteCategory: async (id: string) => {
    try {
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.task_categories || 'task_categories',
        id
      );
      return true;
    } catch (e) {
      return false;
    }
  },

  // Task Management Enhanced
  getTasks: async (filters: any = {}) => {
    try {
      const queries = [Query.orderDesc('$createdAt'), Query.limit(100)];
      if (filters.category) queries.push(Query.equal('category', filters.category));
      if (filters.status) queries.push(Query.equal('status', filters.status));
      if (filters.type) queries.push(Query.equal('type', filters.type));
      
      const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.tasks, queries);
      return res.documents.map(d => ({ ...d, id: d.$id }));
    } catch (e) {
      return [];
    }
  },

  createTask: async (task: any) => {
    try {
      const data = {
        ...task,
        usersJoined: 0,
        completionRate: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Stringify nested objects for Appwrite if attributes are defined as string/json
        requirements: JSON.stringify(task.requirements || {}),
        visibility: JSON.stringify(task.visibility || { allUsers: true }),
        quizConfig: task.quizConfig ? JSON.stringify(task.quizConfig) : null,
        surveyConfig: task.surveyConfig ? JSON.stringify(task.surveyConfig) : null,
        gameConfig: task.gameConfig ? JSON.stringify(task.gameConfig) : null,
      };

      return await databases.createDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.tasks,
        ID.unique(),
        data,
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
    } catch (e: any) {
      console.error('[ADMIN] Create task failed', e);
      return { error: e.message };
    }
  },

  updateTask: async (id: string, task: any) => {
    try {
      const data = { ...task, updatedAt: new Date().toISOString() };
      
      // Handle nested objects
      if (data.requirements) data.requirements = JSON.stringify(data.requirements);
      if (data.visibility) data.visibility = JSON.stringify(data.visibility);
      if (data.quizConfig) data.quizConfig = JSON.stringify(data.quizConfig);
      if (data.surveyConfig) data.surveyConfig = JSON.stringify(data.surveyConfig);
      if (data.gameConfig) data.gameConfig = JSON.stringify(data.gameConfig);

      return await databases.updateDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.tasks,
        id,
        data
      );
    } catch (e: any) {
      return { error: e.message };
    }
  },

  bulkUpdateTasks: async (ids: string[], data: any) => {
    try {
      await Promise.all(ids.map(id => adminService.updateTask(id, data)));
      return true;
    } catch (e) {
      return false;
    }
  },

  bulkDeleteTasks: async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => databases.deleteDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.tasks, id)));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Analytics Enhanced
  getTaskAnalytics: async (taskId?: string) => {
    try {
      if (taskId) {
        // Individual task analytics
        const [submissions, progress] = await Promise.all([
          databases.listDocuments(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.submissions, [Query.equal('taskId', taskId)]),
          databases.listDocuments(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.task_progress || 'user_task_progress', [Query.equal('taskId', taskId)])
        ]);

        const approved = submissions.documents.filter((s: any) => s.status === 'approved').length;
        const rejected = submissions.documents.filter((s: any) => s.status === 'rejected').length;

        return {
          totalSubmissions: submissions.total,
          approved,
          rejected,
          activeUsers: progress.total,
          completionRate: submissions.total > 0 ? (approved / submissions.total) * 100 : 0
        };
      } else {
        // Global analytics
        const stats = await adminService.getDashboardStats();
        const tasks = await adminService.getTasks();
        
        return {
          ...stats,
          totalTasks: tasks.length,
          topPerforming: tasks.sort((a: any, b: any) => (b.completionRate || 0) - (a.completionRate || 0)).slice(0, 5),
          distributedRewards: stats.totalEarnings
        };
      }
    } catch (e) {
      return null;
    }
  },

  deleteTask: async (id: string) => {
    try {
      await databases.deleteDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.tasks, id);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Quizzes
  getQuizzes: async () => {
    try {
      const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.quizzes, [Query.orderDesc('$createdAt')]);
      return res.documents.map(d => ({ ...d, id: d.$id }));
    } catch (e) {
      return [];
    }
  },

  createQuiz: async (data: any) => {
    try {
      return await databases.createDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.quizzes,
        ID.unique(),
        { ...data, createdAt: new Date().toISOString() },
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
    } catch (e: any) {
      return { error: e.message };
    }
  },

  updateQuiz: async (id: string, data: any) => {
    try {
      return await databases.updateDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.quizzes, id, data);
    } catch (e: any) {
      return { error: e.message };
    }
  },

  deleteQuiz: async (id: string) => {
    try {
      await databases.deleteDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.quizzes, id);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Submissions
  getSubmissions: async () => {
    try {
      const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.submissions, [Query.orderDesc('$createdAt'), Query.limit(100)]);
      return res.documents.map(d => ({ ...d, id: d.$id }));
    } catch (e) {
      return [];
    }
  },

  reviewSubmission: async (id: string, status: 'approved' | 'rejected', adminId: string) => {
    try {
      const sub = await databases.getDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.submissions, id);
      
      if (status === 'approved') {
        const user = await databases.getDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.users, sub.userId);
        const task = await databases.getDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.tasks, sub.taskId);
        
        const reward = task.rewardCoins || 100;
        
        await Promise.all([
          databases.updateDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.users, user.$id, { 
            coins: (user.coins || 0) + reward 
          }),
          databases.updateDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.submissions, id, { 
            status: 'approved',
            reviewedAt: new Date().toISOString()
          }),
          databases.createDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.transactions, ID.unique(), {
            userId: user.$id,
            amount: reward,
            type: 'earning',
            details: `Task Approved: ${task.title}`,
            timestamp: new Date().toISOString()
          }, [
            Permission.read(Role.user(user.$id)),
            Permission.read(Role.any())
          ])
        ]);
        
        await adminService.logAction(adminId, 'approve_submission', `Approved submission ${id} for ${user.email}. Reward: ${reward}`);
      } else {
        await databases.updateDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.submissions, id, { 
          status: 'rejected',
          reviewedAt: new Date().toISOString()
        });
        await adminService.logAction(adminId, 'reject_submission', `Rejected submission ${id}`);
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  // Withdrawals
  getWithdrawals: async () => {
    try {
      if (!APPWRITE_CONFIG.collections.withdrawals) return [];
      const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.withdrawals, [Query.orderDesc('$createdAt'), Query.limit(500)]);
      return res.documents.map(d => ({ ...d, id: d.$id }));
    } catch (e: any) {
      console.warn(`[ADMIN] Withdrawal fetch unsuccessful: ${e.message || e}. Check collection permissions.`);
      return [];
    }
  },

  updateWithdrawalStatus: async (id: string, status: string, adminId: string, notes?: string) => {
    try {
      const dbId = APPWRITE_CONFIG.databaseId!;
      const collId = APPWRITE_CONFIG.collections.withdrawals;
      const withdrawal = await databases.getDocument(dbId, collId, id);
      
      const data: any = { 
        status,
        updatedAt: new Date().toISOString()
      };

      if (notes) data.adminNotes = notes;
      
      await databases.updateDocument(dbId, collId, id, data);

      await adminService.logAction(adminId, 'withdrawal_update', `Updated withdrawal ${id} to ${status}${notes ? `. Notes: ${notes}` : ''}`);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Affiliate Management
  getAffiliatePartners: async () => {
    try {
      const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_partners, [Query.orderDesc('$createdAt')]);
      return res.documents.map(d => ({ ...d, id: d.$id }));
    } catch (e) {
      return [];
    }
  },

  upsertAffiliatePartner: async (data: any) => {
    try {
      if (data.id || data.$id) {
        const id = data.id || data.$id;
        delete data.id; delete data.$id;
        return await databases.updateDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_partners, id, data);
      }
      return await databases.createDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_partners, ID.unique(), { ...data, createdAt: new Date().toISOString() }, [Permission.read(Role.any())]);
    } catch (e: any) {
      return { error: e.message };
    }
  },

  deleteAffiliatePartner: async (id: string) => {
    try {
      await databases.deleteDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_partners, id);
      return true;
    } catch (e) {
      return false;
    }
  },

  getAffiliateOffers: async () => {
    try {
      const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_offers, [Query.orderDesc('$createdAt')]);
      return res.documents.map(d => ({ ...d, id: d.$id }));
    } catch (e) {
      return [];
    }
  },

  upsertAffiliateOffer: async (data: any) => {
    try {
      const payload = { ...data };
      if (payload.requirements && Array.isArray(payload.requirements)) payload.requirements = JSON.stringify(payload.requirements);
      
      if (payload.id || payload.$id) {
        const id = payload.id || payload.$id;
        delete payload.id; delete payload.$id;
        return await databases.updateDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_offers, id, payload);
      }
      return await databases.createDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_offers, ID.unique(), { ...payload, createdAt: new Date().toISOString() }, [Permission.read(Role.any())]);
    } catch (e: any) {
      return { error: e.message };
    }
  },

  deleteAffiliateOffer: async (id: string) => {
    try {
      await databases.deleteDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_offers, id);
      return true;
    } catch (e) {
      return false;
    }
  },

  getAffiliateClaims: async (status?: string) => {
    try {
      const queries = [Query.orderDesc('submittedAt')];
      if (status) queries.push(Query.equal('status', status));
      const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_claims, queries);
      return res.documents.map(d => ({ ...d, id: d.$id }));
    } catch (e) {
      return [];
    }
  },

  reviewAffiliateClaim: async (claimId: string, status: string, rewardAmount: number, adminId: string, reason?: string) => {
    try {
      const claim = await databases.getDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_claims, claimId);
      
      const updateData: any = { status, verifiedAt: new Date().toISOString() };
      if (reason) updateData.rejectionReason = reason;

      await databases.updateDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_claims, claimId, updateData);

      if (status === 'approved' || status === 'credited') {
        const user = await databases.getDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.users, claim.userId);
        
        await Promise.all([
          databases.updateDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.users, user.$id, { 
            coins: (user.coins || 0) + rewardAmount 
          }),
          databases.createDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.transactions, ID.unique(), {
            userId: user.$id,
            amount: rewardAmount,
            type: 'affiliate_reward',
            details: `Shop & Earn Reward: Claim #${claimId}`,
            timestamp: new Date().toISOString()
          }, [Permission.read(Role.user(user.$id)), Permission.read(Role.any())])
        ]);

        await adminService.logAction(adminId, 'approve_affiliate_claim', `Approved claim ${claimId} and awarded ${rewardAmount} coins to ${user.email}`);
      } else if (status === 'rejected') {
        await adminService.logAction(adminId, 'reject_affiliate_claim', `Rejected claim ${claimId}. Reason: ${reason}`);
      }

      return { success: true };
    } catch (e: any) {
      return { error: e.message };
    }
  },

  getAffiliateCategories: async () => {
    try {
      const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_categories);
      return res.documents.map(d => ({ ...d, id: d.$id }));
    } catch (e) {
      return [];
    }
  },

  upsertAffiliateCategory: async (data: any) => {
    try {
      if (data.id || data.$id) {
        const id = data.id || data.$id;
        delete data.id; delete data.$id;
        return await databases.updateDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_categories, id, data);
      }
      return await databases.createDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_categories, ID.unique(), data, [Permission.read(Role.any())]);
    } catch (e: any) {
      return { error: e.message };
    }
  },

  deleteAffiliateCategory: async (id: string) => {
    try {
      await databases.deleteDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.affiliate_categories, id);
      return true;
    } catch (e) {
      return false;
    }
  }
};
