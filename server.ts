import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import * as admin from "firebase-admin";

const JWT_SECRET = process.env.JWT_SECRET || "nexvy-secret-key-123";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Initialize Firebase Admin
let firebaseAdmin: admin.app.App | null = null;
try {
  // If running in AI Studio, we might have service account or default credentials
  if (!admin.apps.length) {
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } else {
    firebaseAdmin = admin.app();
  }
} catch (e) {
  console.warn("Firebase Admin failed to initialize with default credentials. Some features may be limited.");
}

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) : null;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const DB_PATH = path.join(process.cwd(), "db.json");

// Helper to handle DB (Now uses Firestore primarily if available)
async function getDB() {
  const localDB = await getLocalDB();
  
  if (firebaseAdmin) {
    try {
      const db = firebaseAdmin.firestore();
      
      // Sync users from Firestore to local cache
      const usersSnap = await db.collection("users").get();
      if (!usersSnap.empty) {
        const firestoreUsers: any[] = [];
        usersSnap.forEach(doc => {
          firestoreUsers.push({ ...doc.data(), id: doc.id });
        });
        
        // Merge strategy: keep local users that aren't in Firestore yet
        // OR prefer Firestore as truth for overlapping IDs
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
      
      // Sync tasks
      const tasksSnap = await db.collection("tasks").get();
      if (!tasksSnap.empty) {
        const tasks: any[] = [];
        tasksSnap.forEach(doc => {
          tasks.push({ ...doc.data(), id: doc.id });
        });
        localDB.tasks = tasks;
      }

      return localDB;
    } catch (e) {
      console.error("Firestore sync failed, falling back to local DB:", e);
    }
  }
  
  return localDB;
}

async function getLocalDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    const db = JSON.parse(data);
    if (!db.users) db.users = [];
    if (!db.tasks) db.tasks = [];
    if (!db.withdrawals) db.withdrawals = [];
    if (!db.completedQuizzes) db.completedQuizzes = [];
    return db;
  } catch (e) {
    return { users: [], tasks: [], referrals: [], withdrawals: [], completedQuizzes: [] };
  }
}

async function saveDB(db: any) {
  // Save locally
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  
  // Sync changed data to Firestore if possible
  // Note: For simplicity and speed, we only sync certain things back
}

// Helper to update Firestore user data
async function syncUserToFirestore(uid: string, data: any) {
  if (!firebaseAdmin) return;
  try {
    const db = firebaseAdmin.firestore();
    await db.collection("users").doc(uid).set(data, { merge: true });
  } catch (e) {
    console.error("Failed to sync user to Firestore:", e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Auth Middleware (Handles both JWT and Firebase Tokens)
  const authenticate = async (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    // Try Firebase Token first
    if (firebaseAdmin) {
      try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        req.user = { id: decodedToken.uid, email: decodedToken.email, firebase: true };
        return next();
      } catch (e) {
        // Fallback to JWT if Firebase fails
      }
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = { ...decoded, firebase: false };
      next();
    } catch (e) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // Helper to ensure user exists in our local storage (synced from Firebase if needed)
  const getOrCreateUser = async (reqUser: any) => {
    const db = await getDB();
    let userIndex = db.users.findIndex((u: any) => u.id === reqUser.id);
    
    if (userIndex === -1 && reqUser.firebase) {
      // User is authenticated via Firebase but not in our db.json yet
      const newUser = {
        id: reqUser.id,
        email: reqUser.email,
        username: reqUser.email?.split('@')[0] || "User",
        coins: 0,
        level: 1,
        joinedAt: new Date().toISOString(),
        firebase: true
      };
      db.users.push(newUser);
      await saveDB(db);
      userIndex = db.users.length - 1;
    }
    
    return { db, userIndex };
  };

  // API Routes
  app.post("/api/auth/signup", async (req, res) => {
    const { email, username, password } = req.body;
    const db = await getDB();
    if (db.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(),
      email,
      username,
      password: hashedPassword,
      coins: 0,
      level: 1,
      joinedAt: new Date().toISOString()
    };
    db.users.push(newUser);
    await saveDB(db);
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET);
    res.json({ token, user: { id: newUser.id, email, username, coins: 0, level: 1 } });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const db = await getDB();
    const user = db.users.find((u: any) => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email, username: user.username, coins: user.coins, level: user.level } });
  });

  app.get("/api/user/me", authenticate, async (req: any, res) => {
    const { db, userIndex } = await getOrCreateUser(req.user);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });
    const user = db.users[userIndex];
    const { password, ...safeUser } = user;
    res.json(safeUser);
  });

  app.post("/api/user/spin", authenticate, async (req: any, res) => {
    const { bet } = req.body;
    const { db, userIndex } = await getOrCreateUser(req.user);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });
    
    if (db.users[userIndex].coins < bet) {
      return res.status(400).json({ error: "Insufficient coins" });
    }

    // Deduct bet
    db.users[userIndex].coins -= bet;

    // Spin logic (Probability)
    const rand = Math.random();
    let multiplier = 0;
    if (rand <= 0.01) multiplier = 5;
    else if (rand <= 0.03) multiplier = 4;
    else if (rand <= 0.05) multiplier = 3;
    else if (rand <= 0.10) multiplier = 2;
    else if (rand <= 0.40) multiplier = 1;
    else multiplier = 0;

    const win = bet * multiplier;
    db.users[userIndex].coins += win;
    
    await saveDB(db);
    await syncUserToFirestore(req.user.id, { coins: db.users[userIndex].coins });
    res.json({ coins: db.users[userIndex].coins, multiplier, win });
  });

  app.post("/api/user/withdraw", authenticate, async (req: any, res) => {
    const { amount, method, details } = req.body;
    const { db, userIndex } = await getOrCreateUser(req.user);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });
    
    if (db.users[userIndex].coins < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    
    db.users[userIndex].coins -= amount;
    
    // Log withdrawal
    if (!db.withdrawals) db.withdrawals = [];
    const withdrawal = {
      id: Date.now().toString(),
      userId: req.user.id,
      email: db.users[userIndex].email,
      amount,
      method,
      details,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    db.withdrawals.push(withdrawal);

    await saveDB(db);
    await syncUserToFirestore(req.user.id, { coins: db.users[userIndex].coins });
    res.json({ success: true, newBalance: db.users[userIndex].coins, withdrawal });
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
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Mark as completed by user
    if (!db.users[userIndex].completedTasks) db.users[userIndex].completedTasks = [];
    if (db.users[userIndex].completedTasks.includes(taskId)) {
      return res.status(400).json({ error: "Task already completed" });
    }

    db.users[userIndex].completedTasks.push(taskId);
    db.users[userIndex].coins += task.reward;
    
    // Log submission
    if (!db.submissions) db.submissions = [];
    db.submissions.push({
      id: Date.now().toString(),
      userId: req.user.id,
      taskId,
      proof,
      details,
      reward: task.reward,
      status: 'approved',
      submittedAt: new Date().toISOString()
    });

    await saveDB(db);
    await syncUserToFirestore(req.user.id, { 
      coins: db.users[userIndex].coins,
      completedTasks: db.users[userIndex].completedTasks
    });
    res.json({ success: true, reward: task.reward, coins: db.users[userIndex].coins });
  });

  app.post("/api/user/daily-gift", authenticate, async (req: any, res) => {
    const { db, userIndex } = await getOrCreateUser(req.user);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });
    const user = db.users[userIndex];
    
    const now = new Date();
    if (user.lastDailyReward && new Date(user.lastDailyReward).toDateString() === now.toDateString()) {
      return res.status(400).json({ error: "Reward already claimed today" });
    }

    const reward = 100; // Standard daily reward
    db.users[userIndex].coins += reward;
    db.users[userIndex].lastDailyReward = now.toISOString();
    
    await saveDB(db);
    await syncUserToFirestore(req.user.id, { 
      coins: db.users[userIndex].coins,
      lastDailyReward: db.users[userIndex].lastDailyReward
    });
    res.json({ coins: db.users[userIndex].coins, reward });
  });

  app.post("/api/user/referral", authenticate, async (req: any, res) => {
    const { code } = req.body;
    const { db, userIndex } = await getOrCreateUser(req.user);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });
    
    if (db.users[userIndex].referralUsed) {
      return res.status(400).json({ error: "Referral already used" });
    }

    const reward = 500;
    db.users[userIndex].coins += reward;
    db.users[userIndex].referralUsed = true;
    
    await saveDB(db);
    await syncUserToFirestore(req.user.id, { 
      coins: db.users[userIndex].coins,
      referralUsed: true
    });
    res.json({ coins: db.users[userIndex].coins, reward });
  });

  app.post("/api/user/quiz/complete", authenticate, async (req: any, res) => {
    const { score, total } = req.body;
    const { db, userIndex } = await getOrCreateUser(req.user);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });
    
    const reward = Math.round((score / total) * 200);
    db.users[userIndex].coins += reward;
    
    if (!db.completedQuizzes) db.completedQuizzes = [];
    db.completedQuizzes.push({
      userId: req.user.id,
      score,
      total,
      reward,
      completedAt: new Date().toISOString()
    });

    await saveDB(db);
    await syncUserToFirestore(req.user.id, { coins: db.users[userIndex].coins });
    res.json({ coins: db.users[userIndex].coins, reward });
  });

  app.get("/api/leaderboard", async (req, res) => {
    const db = await getDB();
    const topUsers = [...db.users]
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 100)
      .map(u => ({
        id: u.id,
        name: u.username,
        coins: u.coins,
        level: u.level,
        status: "online"
      }));
    res.json(topUsers);
  });

  app.get("/api/auth/google/url", (req, res) => {
    if (!googleClient) {
      return res.status(500).json({ error: "Google OAuth not configured" });
    }
    const redirectUri = GOOGLE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/auth/callback`;
    const url = googleClient.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
      redirect_uri: redirectUri
    });
    res.json({ url });
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
      googleClient.setCredentials(tokens);

      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token!,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) throw new Error("Invalid payload");

      const db = await getDB();
      let user = db.users.find((u: any) => u.email === payload.email);

      if (!user) {
        user = {
          id: Date.now().toString(),
          email: payload.email,
          username: payload.name || payload.email?.split('@')[0],
          coins: 0,
          level: 1,
          joinedAt: new Date().toISOString(),
          googleId: payload.sub
        };
        db.users.push(user);
        await saveDB(db);
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ 
                type: 'OAUTH_AUTH_SUCCESS', 
                token: '${token}', 
                user: ${JSON.stringify({ id: user.id, email: user.email, username: user.username, coins: user.coins, level: user.level })} 
              }, '*');
              window.close();
            </script>
            <p>Authentication successful. Closing window...</p>
          </body>
        </html>
      `);
    } catch (e) {
      console.error(e);
      res.send(`<html><body><p>Authentication failed.</p><script>setTimeout(() => window.close(), 3000);</script></body></html>`);
    }
  });

  // Vite setup
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Running on http://0.0.0.0:${PORT}`);
    console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((err) => {
  console.error("[FATAL] Server failed to start:", err);
  process.exit(1);
});
