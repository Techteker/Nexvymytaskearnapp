import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signOut, getAuth, Auth } from 'firebase/auth';
import { doc, onSnapshot, getDoc, getFirestore, Firestore, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth as initialAuth, db as initialDb, waitForFirebase } from '../lib/firebase';
import { UserRole } from '../types';

interface UserData {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  coins: number;
  level: number;
  referralCode?: string;
  referredBy?: string;
  role: UserRole;
  isBanned: boolean;
  createdAt?: any;
  lastLogin?: any;
}

interface AuthContextType {
  user: UserData | null;
  firebaseUser: FirebaseUser | null;
  isAdmin: boolean;
  logout: () => Promise<void>;
  loading: boolean;
  authReady: boolean;
  auth: Auth | null;
  db: Firestore | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [currentAuth, setCurrentAuth] = useState(initialAuth);
  const [currentDb, setCurrentDb] = useState(initialDb);

  useEffect(() => {
    const init = async () => {
      const app = await waitForFirebase();
      if (app) {
        const authInstance = getAuth(app);
        const dbInstance = getFirestore(app);
        setCurrentAuth(authInstance);
        setCurrentDb(dbInstance);
        setAuthReady(true);
      } else {
        // Fallback for local auth if Firebase failed to provision
        const token = localStorage.getItem('token');
        if (token) {
          try {
            console.log("Attempting local auth sync...");
            const res = await fetch('/api/user/me', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              setUser({
                uid: data.id,
                email: data.email,
                name: data.username || data.name,
                coins: data.coins || 0,
                level: data.level || 1,
                role: data.role || UserRole.USER,
                isBanned: data.isBanned || false,
                referralCode: data.referralCode,
                referredBy: data.referredBy,
              });
            } else if (res.status === 401) {
              localStorage.removeItem('token');
            }
          } catch (e) {
            console.warn("Local auth check failed (network/server error):", e);
            // Don't log out if it's just a network error, try again later via refreshUser
          }
        }
        setAuthReady(true);
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!currentAuth) return;

    const unsubscribeAuth = onAuthStateChanged(currentAuth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser && currentDb) {
        // Update last login
        const userDocRef = doc(currentDb, 'users', fUser.uid);
        try {
          await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
        } catch (e) {
          console.error("Failed to update last login:", e);
        }
      }
      if (!fUser) {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [currentAuth]);

  useEffect(() => {
    if (!firebaseUser || !currentDb) return;

    setLoading(true);
    let unsubscribeUser: (() => void) | undefined;

    const setupUserSubscription = async () => {
      const userDocRef = doc(currentDb, 'users', firebaseUser.uid);
      const adminDocRef = doc(currentDb, 'admins', firebaseUser.uid);

      try {
        // Check if user is admin FIRST
        const adminSnap = await getDoc(adminDocRef);
        const isAdmin = adminSnap.exists();

        unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: data.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              photoURL: data.photoURL || firebaseUser.photoURL || '',
              coins: data.coins || 0,
              level: data.level || 1,
              referralCode: data.referralCode || '',
              referredBy: data.referredBy || '',
              role: isAdmin ? (adminSnap.data()?.role || UserRole.ADMIN) : UserRole.USER,
              isBanned: data.isBanned || false,
              createdAt: data.createdAt,
              lastLogin: data.lastLogin
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              photoURL: firebaseUser.photoURL || '',
              coins: 0,
              level: 1,
              referralCode: '',
              referredBy: '',
              role: isAdmin ? (adminSnap.data()?.role || UserRole.ADMIN) : UserRole.USER,
              isBanned: false
            });
          }
          setLoading(false);
        }, (error) => {
           console.error("Firestore user sub error:", error);
           setLoading(false);
        });
      } catch (e) {
        console.error("error setting up user subscription:", e);
        setLoading(false);
      }
    };

    setupUserSubscription();

    return () => {
      if (unsubscribeUser) unsubscribeUser();
    };
  }, [firebaseUser, currentDb]);

  const logout = async () => {
    if (currentAuth) {
      try {
        await signOut(currentAuth);
      } catch (e) {
        console.error("Firebase signout error:", e);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setFirebaseUser(null);
  };

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  const refreshUser = async () => {
    if (firebaseUser && currentDb) {
      try {
        const userDocRef = doc(currentDb, 'users', firebaseUser.uid);
        const adminDocRef = doc(currentDb, 'admins', firebaseUser.uid);
        
        const [userSnap, adminSnap] = await Promise.all([
          getDoc(userDocRef),
          getDoc(adminDocRef)
        ]);

        if (userSnap.exists()) {
          const data = userSnap.data();
          const isUserAdmin = adminSnap.exists();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: data.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            photoURL: data.photoURL || firebaseUser.photoURL || '',
            coins: data.coins || 0,
            level: data.level || 1,
            referralCode: data.referralCode || '',
            referredBy: data.referredBy || '',
            role: isUserAdmin ? (adminSnap.data()?.role || UserRole.ADMIN) : UserRole.USER,
            isBanned: data.isBanned || false,
            createdAt: data.createdAt,
            lastLogin: data.lastLogin
          });
        }
      } catch (e) {
        console.error("Refresh User Error:", e);
      }
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('/api/user/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser({
              uid: data.id,
              email: data.email,
              name: data.username || data.name,
              coins: data.coins || 0,
              level: data.level || 1,
              role: data.role || UserRole.USER,
              isBanned: data.isBanned || false,
              referralCode: data.referralCode,
              referredBy: data.referredBy,
            });
          }
        } catch (e) {
          console.error("Local refreshUser failed:", e);
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser, 
      isAdmin, 
      logout, 
      loading, 
      authReady,
      auth: currentAuth,
      db: currentDb,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
