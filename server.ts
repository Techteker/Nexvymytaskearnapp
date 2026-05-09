import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import * as admin from "firebase-admin";

// Configuration & Validation
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  console.error("[FATAL] JWT_SECRET is required in production environment.");
  process.exit(1);
}
const SAFE_JWT_SECRET = JWT_SECRET || "nexvy-dev-secret-key-456";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// Initialize Firebase Admin with robust error handling
let firebaseAdmin: admin.app.App | null = null;
try {
  if (!admin.apps.length) {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountVar && serviceAccountVar.trim() !== "") {
      try {
        const serviceAccount = JSON.parse(serviceAccountVar);
        firebaseAdmin = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        console.log("[SERVER] Firebase Admin initialized with Service Account.");
      } catch (parseError) {
        console.error("[SERVER] FIREBASE_SERVICE_ACCOUNT is set but invalid JSON. Please check your environment variables.");
      }
    } else {
      // If no service account, try application default (works in some Cloud environments)
      try {
        firebaseAdmin = admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
        console.log("[SERVER] Firebase Admin initialized using Application Default Credentials.");
      } catch (defaultError) {
        // This is expected if running outside of GCP or if no service account is provided
        console.log("[SERVER] Firebase Admin: No credentials provided. Running in local-only mode (Firestore sync disabled).");
      }
    }
  } else {
    firebaseAdmin = admin.app();
  }
} catch (e) {
  console.log("[SERVER] Firebase Admin not available:", e instanceof Error ? e.message : "Initialization failed");
}

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) : null;
const DB_PATH = path.join(process.cwd(), "db.json");

// Define a unified User type to ensure consistency
interface AppUser {
  id: string;
  uid?: string;
  email: string;
  name: string;
  username?: string;
  password?: string;
  coins: number;
  level: number;
  referralCode?: string;
  referredBy?: string;
  createdAt: string;
  lastLogin: string;
  joinedAt?: string;
  role: string;
  isBanned: boolean;
  googleId?: string;
  firebase?: boolean;
  completedTasks?: string[];
  withdrawals?: any[];
  quizzes?: any[];
  streak?: number;
  lastDailyClaim?: string | null;
}

// Database Layer
let dbCache: any = null;
let lastSync = 0;
const SYNC_INTERVAL = 60000; // 60 seconds sync interval

async function getDB() {
  if (dbCache && (Date.now() - lastSync < SYNC_INTERVAL)) {
    return dbCache;
  }
  
  const localDB = await getLocalDB();
  
  if (firebaseAdmin) {
    try {
      const fdb = firebaseAdmin.firestore();
      
      // Limit sync for performance
      const usersSnap = await fdb.collection("users").limit(100).get();
      if (!usersSnap.empty) {
        const firestoreUsers: AppUser[] = [];
        usersSnap.forEach(doc => {
          firestoreUsers.push({ ...doc.data() as any, id: doc.id });
        });
        
        const mergedUsers = [...localDB.users];
        firestoreUsers.forEach(fUser => {
          const idx = mergedUsers.findIndex(u => u.id === fUser.id || u.email === fUser.email);
          if (idx !== -1) {
            mergedUsers[idx] = { ...mergedUsers[idx], ...fUser };
          } else {
            mergedUsers.push(fUser);
          }
        });
        localDB.users = mergedUsers;
      }
      
      // Sync tasks only if empty
      if (localDB.tasks.length === 0) {
        const tasksSnap = await fdb.collection("tasks").get();
        if (!tasksSnap.empty) {
          localDB.tasks = tasksSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        }
      }

      dbCache = localDB;
      lastSync = Date.now();
      return dbCache;
    } catch (e) {
      console.error("[SERVER] Firestore sync failure:", e);
    }
  }
  
  dbCache = localDB;
  lastSync = Date.now();
  return dbCache;
}

async function getLocalDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    const db = JSON.parse(data);
    return {
      users: db.users || [],
      tasks: db.tasks || [],
      withdrawals: db.withdrawals || [],
      completedQuizzes: db.completedQuizzes || [],
      referrals: db.referrals || [],
      submissions: db.submissions || [],
      logs: db.logs || [],
      notifications: db.notifications || [],
      settings: db.settings || {
        commissionRate: 10,
        referralBonus: 500,
        signupBonus: 100,
        dailyFreeSpins: 2,
        minWithdrawal: 1000,
        adMobId: "",
        rewardedAdId: "",
        interstitialAdId: "",
        bannerAdId: "",
        appName: "Nexvy",
        maintenanceMode: false
      }
    };
  } catch (e) {
    return { 
      users: [], 
      tasks: [], 
      referrals: [], 
      withdrawals: [], 
      completedQuizzes: [], 
      submissions: [], 
      logs: [],
      settings: {
        commissionRate: 10,
        referralBonus: 500,
        signupBonus: 100,
        dailyFreeSpins: 2,
        minWithdrawal: 1000,
        adMobId: "",
        rewardedAdId: "",
        interstitialAdId: "",
        bannerAdId: "",
        appName: "Nexvy",
        maintenanceMode: false
      }
    };
  }
}

async function saveDB(db: any) {
  try {
    dbCache = db; // Update cache immediately
    lastSync = Date.now();
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error("[SERVER] Failed to save local DB:", e);
  }
}

async function syncUserToFirestore(uid: string, data: Partial<AppUser>) {
  if (!firebaseAdmin) return;
  try {
    const db = firebaseAdmin.firestore();
    await db.collection("users").doc(uid).set(data, { merge: true });
  } catch (e) {
    console.error(`[SERVER] Firestore sync failed for user ${uid}:`, e);
  }
}

// Authentication Middleware
const authenticate = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or malformed token" });
  }

  const token = authHeader.split(" ")[1];

  // Strategy 1: Firebase Auth
  if (firebaseAdmin && token.length > 50) { // Simple heuristic for Firebase tokens
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      req.user = { id: decodedToken.uid, email: decodedToken.email, firebase: true };
      
      const db = await getDB();
      const user = db.users.find((u: any) => u.id === decodedToken.uid || u.uid === decodedToken.uid);
      if (user) req.user.role = user.role;
      
      return next();
    } catch (e) {
      // If verification fails, we don't return 401 yet, might be a legacy JWT
    }
  }

  // Strategy 2: Internal JWT
  try {
    const decoded = jwt.verify(token, SAFE_JWT_SECRET) as any;
    req.user = { ...decoded, firebase: false };
    
    const db = await getDB();
    const user = db.users.find((u: any) => u.id === decoded.id);
    if (user) req.user.role = user.role;
    
    next();
  } catch (e) {
    res.status(401).json({ error: "Unauthorized: Invalid or expired access token" });
  }
};

const adminOnly = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  next();
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });

  // Logging
  app.use((req, _res, next) => {
    if (req.url !== "/api/health") {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
  });

  // Health
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      firebaseReady: !!firebaseAdmin
    });
  });

  // Maintenance Middleware
  app.use(async (req, res, next) => {
    if (req.path.startsWith('/api') && !req.path.startsWith('/api/health') && !req.path.startsWith('/api/auth')) {
      const db = await getDB();
      if (db.settings?.maintenanceMode) {
        // Allow admins to bypass maintenance
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
          try {
            const token = authHeader.split(" ")[1];
            let decoded: any;
            if (firebaseAdmin && token.length > 50) {
              decoded = await firebaseAdmin.auth().verifyIdToken(token);
            } else {
              decoded = jwt.verify(token, SAFE_JWT_SECRET);
            }
            const user = db.users.find((u: any) => u.id === (decoded.uid || decoded.id));
            if (user?.role === 'admin' || user?.role === 'super_admin') {
              return next();
            }
          } catch (e) {}
        }
        return res.status(503).json({ 
          error: "Maintenance Mode", 
          message: "The platform is currently undergoing maintenance. Please try again later."
        });
      }
    }
    next();
  });

  // Consolidated User Access
  const getOrCreateUser = async (reqUser: any): Promise<{ db: any, userIndex: number }> => {
    const db = await getDB();
    let userIndex = db.users.findIndex((u: any) => u.id === reqUser.id || u.uid === reqUser.id);
    
    if (userIndex === -1 && reqUser.firebase) {
      const newUser: AppUser = {
        id: reqUser.id,
        uid: reqUser.id,
        email: reqUser.email,
        name: reqUser.email?.split('@')[0] || "User",
        coins: (reqUser.email === 'ranarajendar930@gmail.com' || reqUser.email === 'ranarajendar999@gmail.com') ? 999999 : 0,
        level: (reqUser.email === 'ranarajendar930@gmail.com' || reqUser.email === 'ranarajendar999@gmail.com') ? 100 : 1,
        role: (reqUser.email === 'ranarajendar930@gmail.com' || reqUser.email === 'ranarajendar999@gmail.com') ? "super_admin" : "user",
        isBanned: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        firebase: true
      };
      db.users.push(newUser);
      await saveDB(db);
      userIndex = db.users.length - 1;
      await syncUserToFirestore(reqUser.id, newUser);
    }
    
    return { db, userIndex };
  };

  // Auth Routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, username, password } = req.body;
      if (!email || !password || !username) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const db = await getDB();
      if (db.users.find((u: any) => u.email === email)) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser: AppUser = {
        id: Date.now().toString(),
        uid: Date.now().toString(),
        email,
        name: username,
        password: hashedPassword,
        coins: 0,
        level: 1,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        referredBy: '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        role: (email === 'ranarajendar930@gmail.com' || email === 'ranarajendar999@gmail.com') ? 'super_admin' : 'user',
        isBanned: false
      };

      db.users.push(newUser);
      await saveDB(db);
      
      const token = jwt.sign({ id: newUser.id, email: newUser.email }, SAFE_JWT_SECRET, { expiresIn: '7d' });
      res.json({ 
        token, 
        user: { 
          id: newUser.id, 
          email: newUser.email, 
          name: newUser.name, 
          coins: 0, 
          level: 1,
          role: newUser.role
        } 
      });
    } catch (e) {
      res.status(500).json({ error: "Internal server error during signup" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const db = await getDB();
      const user = db.users.find((u: any) => u.email === email);
      
      if (!user || user.isBanned) {
        return res.status(401).json({ error: "Authentication failed" });
      }
      
      if (!user.password || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Authentication failed" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, SAFE_JWT_SECRET, { expiresIn: '7d' });
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          uid: user.uid || user.id,
          email: user.email, 
          name: user.name, 
          coins: user.coins, 
          level: user.level,
          role: user.role || 'user'
        } 
      });
    } catch (e) {
      res.status(500).json({ error: "Internal server error during login" });
    }
  });

  // User Features
  app.get("/api/user/me", authenticate, async (req: any, res) => {
    const { db, userIndex } = await getOrCreateUser(req.user);
    if (userIndex === -1) return res.status(404).json({ error: "User profile not found" });
    
    const user = db.users[userIndex];
    const { password, ...safeUser } = user;
    
    // Calculate rank
    const sortedUsers = [...db.users]
      .filter(u => !u.isBanned)
      .sort((a, b) => b.coins - a.coins);
    const rank = sortedUsers.findIndex(u => u.id === req.user.id) + 1;
    
    // Calculate invites
    const inviteCount = db.users.filter((u: any) => u.referredBy === req.user.id).length;

    res.json({ 
      ...safeUser, 
      rank, 
      inviteCount,
      settings: {
        minWithdrawal: db.settings?.minWithdrawal || 1000,
        referralBonus: db.settings?.referralBonus || 500,
        appName: db.settings?.appName || "Nexvy"
      }
    });
  });

  app.post("/api/user/spin", authenticate, async (req: any, res) => {
    const { bet } = req.body;
    const { db, userIndex } = await getOrCreateUser(req.user);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });
    
    if (db.users[userIndex].coins < bet || bet < 0) {
      return res.status(400).json({ error: "Invalid bet or insufficient coins" });
    }

    db.users[userIndex].coins -= bet;

    const rand = Math.random();
    let multiplier = 0;
    if (rand <= 0.01) multiplier = 10;
    else if (rand <= 0.05) multiplier = 5;
    else if (rand <= 0.15) multiplier = 2;
    else if (rand <= 0.50) multiplier = 1;
    else multiplier = 0;

    const win = Math.floor(bet * multiplier);
    db.users[userIndex].coins += win;
    
    await saveDB(db);
    await syncUserToFirestore(req.user.id, { coins: db.users[userIndex].coins });
    res.json({ coins: db.users[userIndex].coins, multiplier, win });
  });

  app.post("/api/user/withdraw", authenticate, async (req: any, res) => {
    const { amount, method, details } = req.body;
    const { db, userIndex } = await getOrCreateUser(req.user);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });
    
    if (db.users[userIndex].coins < amount || amount < 1000) {
      return res.status(400).json({ error: "Insufficient balance (Min: 1000)" });
    }
    
    db.users[userIndex].coins -= amount;
    
    const withdrawal = {
      id: "WDR-" + Date.now().toString(),
      userId: req.user.id,
      email: db.users[userIndex].email,
      amount,
      method,
      details,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    if (!db.withdrawals) db.withdrawals = [];
    db.withdrawals.push(withdrawal);

    await saveDB(db);
    await syncUserToFirestore(req.user.id, { coins: db.users[userIndex].coins });
    res.json({ success: true, newBalance: db.users[userIndex].coins, withdrawal });
  });

  app.get("/api/user/withdrawals", authenticate, async (req: any, res) => {
    const db = await getDB();
    const userWithdrawals = (db.withdrawals || []).filter((w: any) => w.userId === req.user.id);
    res.json(userWithdrawals);
  });

  app.get("/api/user/submissions", authenticate, async (req: any, res) => {
    const db = await getDB();
    const userSubmissions = (db.submissions || []).filter((s: any) => s.userId === req.user.id);
    res.json(userSubmissions);
  });

  app.get("/api/user/daily-gift/status", authenticate, async (req: any, res) => {
    const { db, userIndex } = await getOrCreateUser(req.user);
    if (userIndex === -1) return res.status(404).json({ error: "User profile not found" });

    const user = db.users[userIndex];
    if (!user.streak) user.streak = 0;
    if (!user.lastDailyClaim) user.lastDailyClaim = null;

    const now = new Date();
    const lastClaim = user.lastDailyClaim ? new Date(user.lastDailyClaim) : null;
    
    let isClaimable = false;
    if (!lastClaim) {
      isClaimable = true;
    } else {
      const diffHours = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
      if (diffHours >= 24) isClaimable = true;
      if (diffHours >= 48) user.streak = 0; // Streak broken
    }

    res.json({
      streak: user.streak,
      lastClaim: user.lastDailyClaim,
      isClaimable
    });
  });

  app.post("/api/user/daily-gift", authenticate, async (req: any, res) => {
    const { db, userIndex } = await getOrCreateUser(req.user);
    if (userIndex === -1) return res.status(404).json({ error: "User profile not found" });

    const user = db.users[userIndex];
    const now = new Date();
    const lastClaim = user.lastDailyClaim ? new Date(user.lastDailyClaim) : null;
    
    if (lastClaim) {
      const diffHours = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
      if (diffHours < 24) return res.status(400).json({ error: "Already claimed today" });
      if (diffHours >= 48) user.streak = 0;
    }

    user.streak = (user.streak || 0) + 1;
    if (user.streak > 7) user.streak = 1;
    
    const REWARDS = [100, 200, 300, 400, 500, 600, 1000];
    const reward = REWARDS[user.streak - 1];
    
    user.coins += reward;
    user.lastDailyClaim = now.toISOString();

    await saveDB(db);
    await syncUserToFirestore(req.user.id, { 
      coins: user.coins, 
      streak: user.streak, 
      lastDailyClaim: user.lastDailyClaim 
    });

    res.json({ success: true, reward, streak: user.streak });
  });

  app.get("/api/tasks", async (req, res) => {
    const db = await getDB();
    res.json(db.tasks || []);
  });

  app.post("/api/tasks/submit", authenticate, async (req: any, res) => {
    const { taskId, proof, details } = req.body;
    const { db, userIndex } = await getOrCreateUser(req.user);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });

    const task = db.tasks.find((t: any) => t.id === taskId);
    if (!task) return res.status(404).json({ error: "Task expired or invalid" });

    if (!db.users[userIndex].completedTasks) db.users[userIndex].completedTasks = [];
    if (db.users[userIndex].completedTasks.includes(taskId)) {
      return res.status(400).json({ error: "Task reward already claimed" });
    }

    db.users[userIndex].completedTasks.push(taskId);
    
    if (!db.submissions) db.submissions = [];
    db.submissions.push({
      id: "SUB-" + Date.now().toString(),
      userId: req.user.id,
      taskId,
      proof,
      reward: task.reward,
      status: 'pending',
      submittedAt: new Date().toISOString()
    });

    await saveDB(db);
    await syncUserToFirestore(req.user.id, { 
      completedTasks: db.users[userIndex].completedTasks
    });
    res.json({ success: true, status: 'pending' });
  });

  app.get("/api/leaderboard", async (req, res) => {
    const db = await getDB();
    const topUsers = [...db.users]
      .filter(u => !u.isBanned)
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 50)
      .map(u => ({
        id: u.id,
        name: u.name || u.username,
        coins: u.coins,
        level: u.level,
        role: u.role
      }));
    res.json(topUsers);
  });

  app.post("/api/user/referral", authenticate, async (req: any, res) => {
    const { code } = req.body;
    const { db, userIndex } = await getOrCreateUser(req.user);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });

    if (db.users[userIndex].referredBy) {
      return res.status(400).json({ error: "You have already been referred" });
    }

    const referrer = db.users.find((u: any) => u.referralCode === code);
    if (!referrer) return res.status(404).json({ error: "Invalid referral code" });
    if (referrer.id === req.user.id) return res.status(400).json({ error: "Cannot refer yourself" });

    db.users[userIndex].referredBy = referrer.id;
    
    // Initial reward
    const REWARD = 500;
    db.users[userIndex].coins += REWARD;
    
    await saveDB(db);
    await syncUserToFirestore(req.user.id, { 
      referredBy: referrer.id,
      coins: db.users[userIndex].coins 
    });
    
    res.json({ success: true, reward: REWARD });
  });

  app.get("/api/user/referrals", authenticate, async (req: any, res) => {
    const db = await getDB();
    const referredUsers = db.users.filter((u: any) => u.referredBy === req.user.id);
    
    const results = referredUsers.map((u: any) => ({
      name: u.name,
      email: u.email,
      date: u.createdAt.split('T')[0],
      earnings: u.coins,
      commission: Math.floor(u.coins * 0.1),
      status: u.isBanned ? 'Banned' : (Date.now() - new Date(u.lastLogin).getTime() < 86400000 ? 'Active' : 'Inactive')
    }));
    
    res.json(results);
  });

  app.get("/api/user/referral/stats", authenticate, async (req: any, res) => {
    const db = await getDB();
    const referredUsers = db.users.filter((u: any) => u.referredBy === req.user.id);
    
    const totalCommission = referredUsers.reduce((acc: number, u: any) => acc + Math.floor(u.coins * 0.1), 0);
    const activeToday = referredUsers.filter((u: any) => Date.now() - new Date(u.lastLogin).getTime() < 86400000).length;
    
    res.json({
      invitedCount: referredUsers.length,
      activeToday,
      totalCommission,
      withdrawable: totalCommission
    });
  });

  // Admin Routes
  app.get("/api/admin/users", authenticate, adminOnly, async (req, res) => {
    const db = await getDB();
    res.json(db.users);
  });

  app.post("/api/admin/users/:id/ban", authenticate, adminOnly, async (req, res) => {
    const { id } = req.params;
    const { banned } = req.body;
    const db = await getDB();
    const idx = db.users.findIndex((u: any) => u.id === id);
    if (idx !== -1) {
      db.users[idx].isBanned = banned;
      await saveDB(db);
      await syncUserToFirestore(id, { isBanned: banned });
    }
    res.json({ success: true });
  });

  app.get("/api/admin/submissions", authenticate, adminOnly, async (req, res) => {
    const db = await getDB();
    res.json(db.submissions || []);
  });

  app.post("/api/admin/submissions/:id/approve", authenticate, adminOnly, async (req, res) => {
    const { id } = req.params;
    const db = await getDB();
    const subIdx = db.submissions.findIndex((s: any) => s.id === id);
    if (subIdx === -1) return res.status(404).json({ error: "Submission not found" });
    
    if (db.submissions[subIdx].status !== 'pending') {
      return res.status(400).json({ error: "Already processed" });
    }

    db.submissions[subIdx].status = 'approved';
    const userId = db.submissions[subIdx].userId;
    const userIdx = db.users.findIndex((u: any) => u.id === userId);
    const reward = db.submissions[subIdx].reward;
    
    if (userIdx !== -1) {
      db.users[userIdx].coins += reward;
      
      // Real Referral Commission
      const referrerId = db.users[userIdx].referredBy;
      if (referrerId) {
        const referrerIdx = db.users.findIndex((u: any) => u.id === referrerId);
        if (referrerIdx !== -1) {
          const rate = db.settings?.commissionRate || 10;
          const commission = Math.floor(reward * (rate / 100));
          if (commission > 0) {
            db.users[referrerIdx].coins += commission;
            // Log it
            if (!db.logs) db.logs = [];
            db.logs.push({
              id: Date.now().toString(),
              type: 'referral_commission',
              userId: referrerId,
              amount: commission,
              fromUser: userId,
              timestamp: new Date().toISOString()
            });
            await syncUserToFirestore(referrerId, { coins: db.users[referrerIdx].coins });
          }
        }
      }
      
      await syncUserToFirestore(userId, { coins: db.users[userIdx].coins });
    }

    await saveDB(db);
    res.json({ success: true });
  });

  app.post("/api/admin/submissions/:id/reject", authenticate, adminOnly, async (req, res) => {
    const { id } = req.params;
    const db = await getDB();
    const subIdx = db.submissions.findIndex((s: any) => s.id === id);
    if (subIdx === -1) return res.status(404).json({ error: "Submission not found" });
    
    db.submissions[subIdx].status = 'rejected';
    await saveDB(db);
    res.json({ success: true });
  });

  app.get("/api/admin/withdrawals", authenticate, adminOnly, async (req, res) => {
    const db = await getDB();
    res.json(db.withdrawals || []);
  });

  app.post("/api/admin/withdrawals/:id/update", authenticate, adminOnly, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const db = await getDB();
    const idx = db.withdrawals.findIndex((w: any) => w.id === id);
    if (idx !== -1) {
      db.withdrawals[idx].status = status;
      await saveDB(db);
    }
    res.json({ success: true });
  });

  app.post("/api/admin/tasks", authenticate, adminOnly, async (req, res) => {
    const task = req.body;
    if (!task.id) task.id = "TASK-" + Date.now().toString();
    const db = await getDB();
    db.tasks.push(task);
    await saveDB(db);
    res.json(task);
  });

  app.post("/api/admin/tasks/:id", authenticate, adminOnly, async (req, res) => {
    const { id } = req.params;
    const taskData = req.body;
    const db = await getDB();
    const idx = db.tasks.findIndex((t: any) => t.id === id);
    if (idx !== -1) {
      db.tasks[idx] = { ...db.tasks[idx], ...taskData };
      await saveDB(db);
      res.json(db.tasks[idx]);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  });

  app.post("/api/admin/tasks/:id/delete", authenticate, adminOnly, async (req, res) => {
    const { id } = req.params;
    const db = await getDB();
    db.tasks = db.tasks.filter((t: any) => t.id !== id);
    await saveDB(db);
    res.json({ success: true });
  });

  app.get("/api/admin/logs", authenticate, adminOnly, async (req, res) => {
    const db = await getDB();
    const limit = parseInt(req.query.limit as string) || 50;
    const logs = [...(db.logs || [])].reverse().slice(0, limit);
    res.json(logs);
  });

  app.post("/api/admin/logs", authenticate, adminOnly, async (req, res) => {
    const log = {
      ...req.body,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    const db = await getDB();
    if (!db.logs) db.logs = [];
    db.logs.push(log);
    await saveDB(db);
    res.json(log);
  });

  app.get("/api/notifications", async (req, res) => {
    const db = await getDB();
    res.json(db.notifications || []);
  });
  
  app.post("/api/admin/notifications", authenticate, adminOnly, async (req, res) => {
    const notification = {
      id: "NOTIF-" + Date.now().toString(),
      ...req.body,
      timestamp: new Date().toISOString()
    };
    const db = await getDB();
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift(notification);
    await saveDB(db);
    res.json(notification);
  });
  
  app.get("/api/admin/settings", authenticate, adminOnly, async (req, res) => {
    const db = await getDB();
    res.json(db.settings || {});
  });

  app.post("/api/admin/settings", authenticate, adminOnly, async (req, res) => {
    const db = await getDB();
    db.settings = { ...db.settings, ...req.body };
    await saveDB(db);
    res.json({ success: true, settings: db.settings });
  });

  // OAuth logic
  app.get("/api/auth/google/url", (req, res) => {
    if (!googleClient) return res.status(500).json({ error: "Google logic misconfigured" });
    const redirectUri = GOOGLE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/auth/callback`;
    const url = googleClient.generateAuthUrl({
      access_type: "offline",
      scope: ["profile", "email"],
      redirect_uri: redirectUri
    });
    res.json({ url });
  });

  // Static Assets Fallback
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `Not Found: ${req.method} ${req.url}` });
  });

  app.get("/auth/callback", async (req, res) => {
    const { code } = req.query;
    if (!code || !googleClient) {
      return res.send(`<html><body><script>window.close();</script></body></html>`);
    }

    try {
      const redirectUri = GOOGLE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/auth/callback`;
      const { tokens } = await googleClient.getToken({
        code: code as string,
        redirect_uri: redirectUri
      });
      
      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token!,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) throw new Error("OAuth invalid payload");

      const db = await getDB();
      let user = db.users.find((u: any) => u.email === payload.email);

      if (!user) {
        user = {
          id: Date.now().toString(),
          email: payload.email,
          name: payload.name || payload.email?.split('@')[0] || "User",
          coins: 0,
          level: 1,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          role: payload.email === 'ranarajendar930@gmail.com' ? 'super_admin' : "user",
          isBanned: false,
          googleId: payload.sub
        };
        db.users.push(user);
        await saveDB(db);
      }

      const token = jwt.sign({ id: user.id, email: user.email }, SAFE_JWT_SECRET, { expiresIn: '7d' });

      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ 
                type: 'OAUTH_AUTH_SUCCESS', 
                token: '${token}', 
                user: ${JSON.stringify({ 
                  id: user.id, 
                  email: user.email, 
                  name: user.name, 
                  coins: user.coins, 
                  level: user.level,
                  role: user.role
                })} 
              }, '*');
              window.close();
            </script>
          </body>
        </html>
      `);
    } catch (e) {
      console.error("[SERVER] OAuth Error:", e);
      res.send(`<html><body><p>Auth Failed. Please try again.</p><script>setTimeout(() => window.close(), 3000);</script></body></html>`);
    }
  });

  // Client App
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("[SERVER] Unhandled Exception:", err);
    res.status(500).json({ error: "Something went wrong on our end. Please try again later." });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Nexvy Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[FATAL] Startup failure:", err);
  process.exit(1);
});
