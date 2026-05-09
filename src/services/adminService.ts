import { 
  collection, 
  getDocs, 
  query, 
  where, 
  getCountFromServer, 
  limit, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  setDoc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Task, Submission, Withdrawal, User, AppSettings, AdSettings } from '../types';

export const adminService = {
  // Activity Logs
  logAction: async (adminId: string, action: string, details: string) => {
    if (!db) return;
    try {
      await addDoc(collection(db, 'logs'), {
        adminId,
        action,
        details,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error('Failed to log action:', e);
    }
  },

  // Stats
  getDashboardStats: async () => {
    if (!db) return null;
    
    const [
      totalUsers,
      totalTasks,
      totalSubmissions,
      pendingSubmissions,
      totalWithdrawals,
      pendingWithdrawals,
      totalQuiz,
    ] = await Promise.all([
      getCountFromServer(collection(db, 'users')),
      getCountFromServer(collection(db, 'tasks')),
      getCountFromServer(collection(db, 'submissions')),
      getCountFromServer(query(collection(db, 'submissions'), where('status', '==', 'pending'))),
      getCountFromServer(collection(db, 'withdrawals')),
      getCountFromServer(query(collection(db, 'withdrawals'), where('status', '==', 'pending'))),
      getCountFromServer(collection(db, 'quiz')),
    ]);

    return {
      totalUsers: totalUsers.data().count,
      totalTasks: totalTasks.data().count,
      totalSubmissions: totalSubmissions.data().count,
      pendingSubmissions: pendingSubmissions.data().count,
      totalWithdrawals: totalWithdrawals.data().count,
      pendingWithdrawals: pendingWithdrawals.data().count,
      totalQuiz: totalQuiz.data().count,
      totalRevenue: 24500, // Simulated
      dailyTraffic: 1250, // Simulated
    };
  },

  // User Management
  getUsers: async (limitCount = 50) => {
    if (!db) return [];
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), uid: d.id } as User));
  },

  searchUsers: async (searchTerm: string) => {
    if (!db) return [];
    const q = query(collection(db, 'users'), where('email', '>=', searchTerm), where('email', '<=', searchTerm + '\uf8ff'), limit(20));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), uid: d.id } as User));
  },

  updateUser: async (uid: string, data: Partial<User>) => {
    if (!db) return;
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, data);
  },

  deleteUser: async (uid: string) => {
    if (!db) return;
    await deleteDoc(doc(db, 'users', uid));
  },

  // Task Management
  getTasks: async () => {
    if (!db) return [];
    const snap = await getDocs(collection(db, 'tasks'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as Task));
  },

  createTask: async (task: Omit<Task, 'id' | 'createdAt'>) => {
    if (!db) return;
    return await addDoc(collection(db, 'tasks'), {
      ...task,
      createdAt: serverTimestamp()
    });
  },

  updateTask: async (id: string, data: Partial<Task>) => {
    if (!db) return;
    await updateDoc(doc(db, 'tasks', id), data);
  },

  deleteTask: async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, 'tasks', id));
  },

  // Submissions
  getSubmissions: async (status?: string) => {
    if (!db) return [];
    const coll = collection(db, 'submissions');
    const q = status ? query(coll, where('status', '==', status), orderBy('submittedAt', 'desc')) : query(coll, orderBy('submittedAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as Submission));
  },

  reviewSubmission: async (id: string, status: 'approved' | 'rejected', reason?: string) => {
    if (!db) return;
    const ref = doc(db, 'submissions', id);
    const subSnap = await getDoc(ref);
    const subData = subSnap.data() as Submission;

    await updateDoc(ref, {
      status,
      rejectionReason: reason || null,
      reviewedAt: serverTimestamp()
    });

    // Award coins to user
    const taskSnap = await getDoc(doc(db, 'tasks', subData.taskId));
    const taskData = taskSnap.data() as Task;

    if (status === 'approved') {
      const userRef = doc(db, 'users', subData.userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data() as User;
      
      await updateDoc(userRef, {
        coins: (userData.coins || 0) + (taskData.rewardCoins || 0)
      });
    }

    // Log the review
    await adminService.logAction(
      'SUPER_ADMIN', 
      'SUBMISSION_REVIEW', 
      `${status.toUpperCase()} submission ${id} for user ${subData.userId}. Reward: ${taskData?.rewardCoins || 0}`
    );
  },

  getLogs: async (limitCount = 100) => {
    if (!db) return [];
    const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  },

  // Settings
  getSettings: async () => {
    if (!db) return null;
    const snap = await getDoc(doc(db, 'settings', 'general'));
    return snap.exists() ? snap.data() as AppSettings : null;
  },

  updateSettings: async (data: Partial<AppSettings>) => {
    if (!db) return;
    await setDoc(doc(db, 'settings', 'general'), data, { merge: true });
  }
};
