import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { UserRole } from '../types';
import { account, databases, client, APPWRITE_CONFIG } from '../lib/appwrite';
import { Query, ID, Models, Permission, Role } from 'appwrite';

const AUTHORIZED_ADMIN_EMAILS = ['ranarajendar930@gmail.com', 'ranarajendar999@gmail.com'];

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

interface AuthContextType {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  isAdmin: boolean;
  logout: () => Promise<void>;
  loading: boolean;
  authReady: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  const fetchUserSession = React.useCallback(async () => {
    try {
      console.log('[AUTH] Fetching session...');
      setLoading(true);
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
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
          });

        } catch (dbError: any) {
          const isNotFound = dbError.code === 404 || dbError.message?.includes('not be found') || dbError.type === 'document_not_found';
          
          if (isNotFound) {
            console.log('[AUTH] Profile not found, this is a new user. Creating profile...');
            // First time login - create profile
            try {
              const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
              
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
                },
                [
                  Permission.read(Role.any()),
                  Permission.update(Role.user(session.$id)),
                  Permission.delete(Role.user(session.$id)),
                ]
              );

              const isAdminEmail = AUTHORIZED_ADMIN_EMAILS.includes(session.email);

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
              console.error('[AUTH] Failed to create user profile:', createErr);
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
            console.error('[AUTH] DB Fetch error:', dbError);
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
      // 401 is normal for guests, don't log as error
      if (e.code === 401 || e.type?.includes('unauthorized') || e.message?.includes('missing scopes')) {
        console.log('[AUTH] Session: Guest');
      } else {
        console.error('[AUTH] Session fetch failed:', e);
      }
      setUser(null);
    } finally {
      setAuthReady(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserSession();
  }, [fetchUserSession]);

  const logout = async () => {
    try {
      setLoading(true);
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
      await account.deleteSession('current');
      localStorage.clear();
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
  }, []);

  const value = React.useMemo(() => ({ 
    user, 
    setUser,
    isAdmin, 
    logout, 
    loading, 
    authReady,
    refreshUser
  }), [user, isAdmin, logout, loading, authReady, refreshUser]);

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
