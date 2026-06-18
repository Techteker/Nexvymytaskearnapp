import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { UserRole } from '../types';
import { account, databases, client, APPWRITE_CONFIG } from '../lib/appwrite';
import { Query, ID, Models, Permission, Role } from 'appwrite';

const AUTHORIZED_ADMIN_EMAILS = ['ranarajendar930@gmail.com', 'ranarajendar999@gmail.com'];

const isNetworkError = (e: any) => {
  const msg = String(e?.message || e).toLowerCase();
  return msg.includes('failed to fetch') || msg.includes('network error') || msg.includes('load failed');
};

interface UserData {
  uid: string;
  email: string;
  username: string;
  photoURL?: string;
  coins: number;
  level: number;
  referralCode?: string;
  referredBy?: string;
  role: UserRole;
  isBanned: boolean;
  createdAt?: any;
  lastLogin?: any;
  streak: number;
}

const isProjectPausedError = (e: any) => {
  const msg = String(e?.message || e).toLowerCase();
  return msg.includes('project is paused') || 
         msg.includes('paused due to inactivity') || 
         msg.includes('inactive project');
};

const getSimulatedUser = (): UserData => {
  const localCoins = localStorage.getItem('simulated_coins');
  const coinsNum = localCoins ? parseInt(localCoins, 10) : 5250;
  const username = localStorage.getItem('simulated_username') || 'NexvyDemoUser';
  return {
    uid: 'simulated_user_123',
    email: 'ranarajendar999@gmail.com',
    username: username,
    coins: coinsNum,
    level: Math.floor(coinsNum / 1000) + 1,
    role: UserRole.ADMIN,
    isBanned: false,
    referralCode: 'SIM2026',
    referredBy: '',
    streak: 3,
    photoURL: ''
  };
};

interface AuthContextType {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  isAdmin: boolean;
  logout: () => Promise<void>;
  loading: boolean;
  authReady: boolean;
  refreshUser: () => Promise<void>;
  isSimulationMode: boolean;
  setIsSimulationMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(() => {
    return localStorage.getItem('simulation_mode_active') === 'true';
  });
  const unsubRef = useRef<(() => void) | null>(null);

  const fetchUserSession = React.useCallback(async () => {
    try {
      console.log('[AUTH] Fetching session...');
      setLoading(true);
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }

      if (localStorage.getItem('simulation_mode_active') === 'true' || isSimulationMode) {
        console.log('[AUTH] Simulation Mode Active. Skipping cloud login.');
        setIsSimulationMode(true);
        setUser(getSimulatedUser());
        setAuthReady(true);
        setLoading(false);
        return;
      }
      
      const session = await account.get();
      console.log('[AUTH] Session confirmed:', session?.$id);
      if (session) {
        // Fetch custom user profile from database
        try {
          console.log('[AUTH] Fetching DB profile...');
          const doc = await databases.getDocument(
            APPWRITE_CONFIG.databaseId!,
            APPWRITE_CONFIG.collections.users,
            session.$id
          ) as unknown as UserData & Models.Document;
          console.log('[AUTH] DB Profile loaded:', doc.username);


          const isAdminEmail = AUTHORIZED_ADMIN_EMAILS.includes(session.email);
          const calculatedRole = doc.role || (isAdminEmail ? UserRole.ADMIN : UserRole.USER);

          const localPhoto = localStorage.getItem(`user_photoURL_${session.$id}`) || '';
          setUser({
            uid: session.$id,
            email: session.email,
            username: doc.username || (doc as any).username || session.name || session.email.split('@')[0],
            coins: doc.coins || 0,
            level: Math.floor((doc.coins || 0) / 1000) + 1, // Synthetic level calculated from coins
            role: calculatedRole as UserRole,
            isBanned: doc.isBanned || false,
            referralCode: doc.referralCode || '',
            referredBy: doc.referredBy,
            streak: doc.streak || 0,
            photoURL: doc.photoURL || localPhoto || '',
          });

        } catch (dbError: any) {
          const isNotFound = dbError.code === 404 || dbError.message?.includes('not be found') || dbError.type === 'document_not_found';
          
          if (isNotFound) {
            console.log('[AUTH] Profile not found, this is a new user. Creating profile...');
            // First time login - create profile
            try {
              const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
              const isAdminEmail = AUTHORIZED_ADMIN_EMAILS.includes(session.email);
              
              await databases.createDocument(
                APPWRITE_CONFIG.databaseId!,
                APPWRITE_CONFIG.collections.users,
                session.$id, // Use session.$id as document ID
                {
                  email: session.email,
                  username: session.name || session.email.split('@')[0],
                  coins: 0,
                  referralCode: referralCode,
                  streak: 0,
                  role: isAdminEmail ? 'admin' : 'user',
                  isBanned: false,
                },
                [
                  Permission.read(Role.any()),
                  Permission.update(Role.user(session.$id)),
                  Permission.delete(Role.user(session.$id)),
                ]
              );

              setUser({
                uid: session.$id,
                email: session.email,
                username: session.name || session.email.split('@')[0],
                coins: 0,
                role: isAdminEmail ? UserRole.ADMIN : UserRole.USER,
                isBanned: false,
                referralCode,
                streak: 0,
                level: 1
              });
              console.log('[AUTH] New profile created successfully');
            } catch (createErr: any) {
              if (isNetworkError(createErr)) {
                console.warn('[AUTH] Failed to create user profile due to connection/API issues:', createErr.message || createErr);
              } else {
                console.error('[AUTH] Failed to create user profile:', createErr);
              }
              // Final fallback to session info only to allow navigation to proceed
              setUser({
                uid: session.$id,
                email: session.email,
                username: session.name || session.email.split('@')[0],
                coins: 0,
                level: 1,
                role: UserRole.USER,
                isBanned: false,
                referralCode: '',
                streak: 0
              });
            }
          } else {
            if (isNetworkError(dbError)) {
              console.warn('[AUTH] DB Fetch network / connection error (likely API unreachable/offline):', dbError.message || dbError);
            } else {
              console.error('[AUTH] DB Fetch error:', dbError);
            }
            // Fallback for non-404 errors so users can still see limited dashboard
            setUser({
              uid: session.$id,
              email: session.email,
              username: session.name || session.email.split('@')[0],
              coins: 0,
              level: 1,
              role: UserRole.USER,
              isBanned: false,
              referralCode: '',
              streak: 0
            });
          }
        }
      } else {
        console.log('[AUTH] Session check: No session found');
        setUser(null);
      }
    } catch (e: any) {
      if (isProjectPausedError(e)) {
        console.warn('[AUTH] Session fetch encountered paused project. Activating Simulation Mode.');
        localStorage.setItem('simulation_mode_active', 'true');
        setIsSimulationMode(true);
        setUser(getSimulatedUser());
      } else {
        // 401 is normal for guests, don't log as error
        if (e.code === 401 || e.type?.includes('unauthorized') || e.message?.includes('missing scopes')) {
          console.log('[AUTH] Session: Guest');
        } else if (isNetworkError(e)) {
          console.warn('[AUTH] Session fetch failed due to lack of connection/API unreachable:', e.message || e);
        } else {
          console.error('[AUTH] Session fetch failed:', e);
        }
        setUser(null);
      }
    } finally {
      setAuthReady(true);
      setLoading(false);
    }
  }, [isSimulationMode]);

  useEffect(() => {
    fetchUserSession();
  }, [fetchUserSession]);

  useEffect(() => {
    const handleSimActivated = () => {
      console.log('[AUTH-EVENT] Simulation mode activated event received');
      localStorage.setItem('simulation_mode_active', 'true');
      setIsSimulationMode(true);
      setUser(getSimulatedUser());
    };
    window.addEventListener('simulation_activated', handleSimActivated);
    return () => {
      window.removeEventListener('simulation_activated', handleSimActivated);
    };
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
      try {
        await account.deleteSession('current');
      } catch (err) {}
      localStorage.clear();
      setIsSimulationMode(false);
      setUser(null);
    } catch (e) {
      console.error('[AUTH] Logout failed:', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = React.useMemo(() => 
    user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN,
  [user?.role]);

  const refreshUser = React.useCallback(async () => {
    await fetchUserSession();
  }, [fetchUserSession]);

  const value = React.useMemo(() => ({ 
    user, 
    setUser,
    isAdmin, 
    logout, 
    loading, 
    authReady,
    refreshUser,
    isSimulationMode,
    setIsSimulationMode
  }), [user, isAdmin, logout, loading, authReady, refreshUser, isSimulationMode]);

  return (
    <AuthContext.Provider value={value}>
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
