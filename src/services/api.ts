import { account, databases, storage, APPWRITE_CONFIG } from '../lib/appwrite';
import { ID, Query, Permission, Role } from 'appwrite';
import { EARNING_CONFIG } from '../constants';

const cache: { [key: string]: { data: any, timestamp: number } } = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCache(key: string) {
  const item = cache[key];
  if (item && Date.now() - item.timestamp < CACHE_TTL) {
    return item.data;
  }
  return null;
}

function setCache(key: string, data: any) {
  cache[key] = { data, timestamp: Date.now() };
}

export const apiService = {
  async getAppSettings() {
    const cached = getCache('settings');
    if (cached) return cached;

    try {
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        'settings',
        [Query.limit(1)]
      );
      const settings = res.documents.length > 0 ? res.documents[0] : { siteName: "Nexvy", active: true };
      setCache('settings', settings);
      return settings;
    } catch (e) {
      return { siteName: "Nexvy", active: true };
    }
  },

  async getSpinHistory() {
    try {
      const user = await account.get();
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        'spin_history',
        [Query.equal('userId', user.$id), Query.orderDesc('timestamp'), Query.limit(20)]
      );
      return res.documents;
    } catch (e) {
      return [];
    }
  },

  async spin(bet: number) {
    try {
      const user = await account.get();
      const profile = await databases.getDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        user.$id
      );

      // Anti-fraud: Cooldown check
      const lastSpin = profile.lastSpin ? new Date(profile.lastSpin).getTime() : 0;
      const now = Date.now();
      if (now - lastSpin < EARNING_CONFIG.MIN_TIME_BETWEEN_SPINS_SEC * 1000) {
        return { error: `Please wait ${EARNING_CONFIG.MIN_TIME_BETWEEN_SPINS_SEC} seconds between spins` };
      }

      // Anti-fraud: Daily limit check
      const today = new Date().toISOString().split('T')[0];
      const spinCountToday = profile.spinDate === today ? (profile.spinCount || 0) : 0;
      if (spinCountToday >= EARNING_CONFIG.MAX_SPINS_PER_DAY) {
        return { error: 'Daily spin limit reached' };
      }

      if (profile.coins < bet) return { error: 'Insufficient balance' };

      const win = Math.random() > 0.8; 
      const multiplier = win ? (Math.random() * 10 + 2) : 0;
      const winAmount = Math.floor(bet * multiplier);
      const newCoins = (profile.coins || 0) - bet + winAmount;

      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        profile.$id,
        { 
          coins: newCoins,
          lastSpin: new Date().toISOString(),
          spinCount: spinCountToday + 1,
          spinDate: today
        }
      );

      // Record history
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId!,
        'spin_history',
        ID.unique(),
        {
          userId: user.$id,
          bet,
          win: winAmount,
          multiplier: multiplier,
          timestamp: new Date().toISOString()
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.create(Role.user(user.$id)),
        ]
      );

      return { coins: newCoins, multiplier, win: winAmount, historyId: ID.unique() };
    } catch (e: any) {
      return { error: e.message || 'Operation failed' };
    }
  },

  async withdraw(amount: number, method: string, details: string) {
    try {
      const user = await account.get();
      const profile = await databases.getDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        user.$id
      );

      if (amount < EARNING_CONFIG.MIN_WITHDRAWAL_COINS) {
        return { error: `Minimum withdrawal is ${EARNING_CONFIG.MIN_WITHDRAWAL_COINS.toLocaleString()} Coins ($${EARNING_CONFIG.MIN_WITHDRAWAL_USD})` };
      }

      if (profile.coins < amount) return { error: 'Insufficient balance' };

      const newCoins = profile.coins - amount;
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        profile.$id,
        { coins: newCoins }
      );

      const withdrawal = await databases.createDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.withdrawals,
        ID.unique(),
        {
          userId: user.$id,
          amount,
          method,
          paymentDetails: details,
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.create(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.read(Role.any()),
        ]
      );

      return { success: true, newBalance: newCoins, withdrawalId: withdrawal.$id };
    } catch (e: any) {
      return { error: e.message || 'Withdrawal failed' };
    }
  },

  async getLeaderboard() {
    const cached = getCache('leaderboard');
    if (cached) return cached;

    try {
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        [Query.orderDesc('coins'), Query.limit(10)]
      );
      const leaderboard = res.documents.map(u => ({ id: u.$id, username: u.username, coins: u.coins, level: Math.floor((u.coins || 0) / 1000) + 1 }));
      setCache('leaderboard', leaderboard);
      return leaderboard;
    } catch (e) {
      return [];
    }
  },

  async getMe() {
    try {
      const user = await account.get();
      const profile = await databases.getDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        user.$id
      );
      return { ...profile, uid: user.$id, email: user.email };
    } catch (e: any) {
      if (e.code !== 401) {
        console.error('[API] getMe failed:', e);
      }
      return { error: e.code === 401 ? 'Unauthorized' : (e.message || 'Failed to fetch user') };
    }
  },

  async getTasks(filters: any = {}) {
    try {
      const queries = [Query.equal('status', 'active'), Query.orderDesc('createdAt'), Query.limit(100)];
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.tasks,
        queries
      );
      
      // Client-side visibility & requirement filtering for robustness
      const user = await this.getMe();
      if ('error' in user) return res.documents;

      return res.documents.filter((task: any) => {
        // Parse visibility if it's a string
        const visibility = typeof task.visibility === 'string' ? JSON.parse(task.visibility) : task.visibility;
        
        if (!visibility) return true;
        
        // Premium check
        if (visibility.premiumOnly && !user.isPremium) return false;
        
        // Region check
        if (visibility.regions?.length > 0 && !visibility.regions.includes(user.region || 'global')) return false;
        
        // Selected users check
        if (visibility.selectedUserIds?.length > 0 && !visibility.selectedUserIds.includes(user.uid)) return false;
        
        return true;
      });
    } catch (e) {
      return [];
    }
  },

  async startTask(taskId: string) {
    try {
      const user = await account.get();
      const progress = await databases.createDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.task_progress || 'user_task_progress',
        ID.unique(),
        {
          userId: user.$id,
          taskId,
          status: 'started',
          startedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
          timeSpentSeconds: 0
        },
        [
          Permission.read(Role.user(user.$id)), 
          Permission.create(Role.user(user.$id)),
          Permission.update(Role.user(user.$id))
        ]
      );

      // Increment joined count (optimistic or actual)
      const task = await databases.getDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.tasks, taskId);
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.tasks,
        taskId,
        { usersJoined: (task.usersJoined || 0) + 1 }
      );

      return { success: true, progressId: progress.$id };
    } catch (e: any) {
      return { error: e.message || 'Failed to start task' };
    }
  },

  async submitTaskProof(taskId: string, proofs: any) {
    try {
      const user = await account.get();
      const task = await databases.getDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.tasks, taskId);
      
      // Update progress record
      const progressRes = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.task_progress || 'user_task_progress',
        [Query.equal('userId', user.$id), Query.equal('taskId', taskId), Query.limit(1)]
      );

      if (progressRes.documents.length > 0) {
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId!,
          APPWRITE_CONFIG.collections.task_progress || 'user_task_progress',
          progressRes.documents[0].$id,
          { status: 'submitted', lastActiveAt: new Date().toISOString() }
        );
      }

      const submission = await databases.createDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.submissions,
        ID.unique(),
        {
          userId: user.$id,
          taskId,
          status: 'pending',
          proofs: JSON.stringify(proofs), // Store as JSON string
          submittedAt: new Date().toISOString(),
          rewardAmount: task.rewardCoins || 0
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.create(Role.user(user.$id)),
          Permission.read(Role.any())
        ]
      );

      return { success: true, submissionId: submission.$id };
    } catch (e: any) {
      return { error: e.message || 'Submission failed' };
    }
  },

  async getUserTaskProgress() {
    try {
      const user = await account.get();
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.task_progress || 'user_task_progress',
        [Query.equal('userId', user.$id)]
      );
      return res.documents;
    } catch (e) {
      return [];
    }
  },

  async claimReferral(code: string) {
    try {
      const user = await account.get();
      const profile = await databases.getDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        user.$id
      );

      if (profile.referredBy) return { error: 'Already referred' };

      const referrerRes = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        [Query.equal('referralCode', code)]
      );

      if (referrerRes.documents.length === 0) return { error: 'Invalid code' };
      const referrer = referrerRes.documents[0];

      if (referrer.$id === user.$id) return { error: 'Self-referral not allowed' };

      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        profile.$id,
        { referredBy: referrer.$id, coins: (profile.coins || 0) + EARNING_CONFIG.REFERRAL_REWARD_REFERRED }
      );

      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        referrer.$id,
        { coins: (referrer.coins || 0) + EARNING_CONFIG.REFERRAL_REWARD_REFERRER }
      );

      return { success: true, reward: EARNING_CONFIG.REFERRAL_REWARD_REFERRED };
    } catch (e: any) {
      return { error: e.message || 'Referral failed' };
    }
  },

  async getReferralStats() {
    try {
      const user = await account.get();
      const referrals = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        [Query.equal('referredBy', user.$id)]
      );
      return {
        invitedCount: referrals.total,
        activeToday: Math.floor(referrals.total * 0.3),
        totalCommission: referrals.total * 200,
        withdrawable: referrals.total * 200
      };
    } catch (e) {
      return { invitedCount: 0, activeToday: 0, totalCommission: 0, withdrawable: 0 };
    }
  },

  async getReferralList() {
    try {
      const user = await account.get();
      const referrals = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        [Query.equal('referredBy', user.$id)]
      );
      return referrals.documents.map(u => ({ 
        id: u.$id, 
        username: u.username, 
        email: u.email,
        status: u.isBanned ? 'Banned' : 'Active', 
        earnings: u.coins,
        commission: Math.floor(u.coins * 0.1),
        date: new Date(u.$createdAt).toLocaleDateString()
      }));
    } catch (e) {
      return [];
    }
  },

  async getQuizzes() {
    try {
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.quizzes
      );
      return res.documents;
    } catch (e) {
      return [];
    }
  },

  async submitQuiz(quizId: string, score: number, answers: any[]) {
    try {
      const user = await account.get();
      const profile = await databases.getDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        user.$id
      );

      const reward = Math.floor(score * 1);
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        profile.$id,
        { coins: profile.coins + reward }
      );

      return { success: true, reward, score, message: 'Quiz completed!' };
    } catch (e: any) {
      return { error: e.message || 'Quiz submission failed' };
    }
  },

  async getDailyGiftStatus() {
    try {
      const user = await account.get();
      const profile = await databases.getDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        user.$id
      );

      // Logic for claimable: once per 24h
      const lastClaim = profile.lastClaim;
      const isClaimable = !lastClaim || (new Date().getTime() - new Date(lastClaim).getTime() > 24 * 60 * 60 * 1000);

      return {
        streak: profile.streak || 0,
        isClaimable,
        lastClaim
      };
    } catch (e) {
      return { streak: 0, isClaimable: false, lastClaim: null };
    }
  },

  async claimDailyGift() {
    try {
      const user = await account.get();
      const profile = await databases.getDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        user.$id
      );

      const lastClaim = profile.lastClaim;
      const isClaimable = !lastClaim || (new Date().getTime() - new Date(lastClaim).getTime() > 24 * 60 * 60 * 1000);

      if (!isClaimable) throw new Error('Already claimed today');

      const reward = EARNING_CONFIG.DAILY_REWARD_BASE + (profile.streak * EARNING_CONFIG.STREAK_BONUS);
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        profile.$id,
        { 
          coins: (profile.coins || 0) + reward, 
          streak: (profile.streak || 0) + 1,
          lastClaim: new Date().toISOString()
        }
      );

      return { success: true, reward, streak: (profile.streak || 0) + 1 };
    } catch (e: any) {
      return { error: e.message || 'Daily gift failed' };
    }
  },

  async login(credentials: any) {
    try {
      try {
        await account.deleteSession('current');
      } catch (e) {}
      const session = await account.createEmailPasswordSession(credentials.email, credentials.password);
      const user = await account.get();
      localStorage.setItem('token', session.$id);
      return { token: session.$id, user };
    } catch (e: any) {
      return { error: e.message || 'Login failed' };
    }
  },

  async signup(data: any) {
    try {
      try {
        await account.deleteSession('current');
      } catch (e) {}

      let user;
      try {
        user = await account.create(ID.unique(), data.email, data.password, data.username);
      } catch (createErr: any) {
        // If user already exists, try to login instead
        if (createErr.code === 409) {
          return this.login({ email: data.email, password: data.password });
        }
        throw createErr;
      }

      // Create session immediately
      await account.createEmailPasswordSession(data.email, data.password);
      
      // Create user profile document
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        user.$id, // Use session.$id as document ID
        {
          email: user.email,
          username: user.name || user.email.split('@')[0],
          coins: 0,
          referralCode: referralCode,
          streak: 0
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );

      return { success: true, user };
    } catch (e: any) {
      return { error: e.message || 'Signup failed' };
    }
  },

  async uploadFile(file: File) {
    try {
      const res = await storage.createFile(
        APPWRITE_CONFIG.buckets.uploads!,
        ID.unique(),
        file,
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      const url = storage.getFileView(APPWRITE_CONFIG.buckets.uploads!, res.$id);
      return url.toString();
    } catch (e: any) {
      throw new Error(e.message || 'Upload failed');
    }
  },

  async getWithdrawals() {
    try {
      const user = await account.get();
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.withdrawals,
        [Query.equal('userId', user.$id)]
      );
      return res.documents;
    } catch (e) {
      return [];
    }
  },

  async getSubmissions() {
    try {
      const user = await account.get();
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.submissions,
        [Query.equal('userId', user.$id)]
      );
      return res.documents;
    } catch (e) {
      return [];
    }
  },

  async toggleUserBan(userId: string, banned: boolean) {
    try {
      await databases.updateDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.users,
        userId,
        { isBanned: banned }
      );
      return true;
    } catch (e) {
      return false;
    }
  },

  async approveSubmission(id: string) {
    try {
      const sub = await databases.getDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.submissions, id);
      await databases.updateDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.submissions, id, { status: 'approved' });
      
      try {
        const profile = await databases.getDocument(
          APPWRITE_CONFIG.databaseId!,
          APPWRITE_CONFIG.collections.users,
          sub.userId
        );
        await databases.updateDocument(
          APPWRITE_CONFIG.databaseId!,
          APPWRITE_CONFIG.collections.users,
          profile.$id,
          { coins: profile.coins + 100 }
        );
      } catch (profileError) {
        console.error('Failed to update coins for user:', sub.userId);
      }
      return true;
    } catch (e) {
      return false;
    }
  },

  async rejectSubmission(id: string) {
    try {
      await databases.updateDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.submissions, id, { status: 'rejected' });
      return true;
    } catch (e) {
      return false;
    }
  },

  async updateWithdrawalStatus(id: string, status: string) {
    try {
      await databases.updateDocument(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.withdrawals, id, { status });
      return true;
    } catch (e) {
      return false;
    }
  },

  async createAdminTask(task: any) {
    try {
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId!,
        APPWRITE_CONFIG.collections.tasks,
        ID.unique(),
        { ...task, status: 'active', createdAt: new Date().toISOString() },
        [
          Permission.read(Role.any()),
        ]
      );
      return { success: true };
    } catch (e: any) {
      return { error: e.message || 'Failed' };
    }
  },

  async getNotifications() {
    try {
      const res = await databases.listDocuments(APPWRITE_CONFIG.databaseId!, APPWRITE_CONFIG.collections.notifications);
      return res.documents;
    } catch (e) {
      return [];
    }
  }
};


