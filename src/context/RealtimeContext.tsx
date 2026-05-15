import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { client, databases, APPWRITE_CONFIG } from '../lib/appwrite';
import { Query } from 'appwrite';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { UserRole } from '../types';

interface RealtimeContextType {
  lastUpdate: number;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lastUpdate, setLastUpdate] = React.useState(Date.now());
  const { showToast } = useToast();
  const { user, setUser, authReady } = useAuth();
  const unsubscribeRef = React.useRef<(() => void) | null>(null);
  const channelsRef = React.useRef<string>('');

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  const userId = user?.uid;

  useEffect(() => {
    if (!authReady || !userId) {
      if (unsubscribeRef.current) {
        console.log('[REALTIME] Cleaning up: No active user session');
        unsubscribeRef.current();
        unsubscribeRef.current = null;
        channelsRef.current = '';
      }
      return;
    }

    let isMounted = true;
    
    const initSubscriptions = async () => {
      if (!isMounted) return;

      const dbId = APPWRITE_CONFIG.databaseId;
      const userColl = APPWRITE_CONFIG.collections.users;
      
      if (!dbId || !userColl || dbId === 'undefined' || userColl === 'undefined') {
        console.warn('[REALTIME] Missing or invalid configuration, skipping subscription');
        return;
      }

      const channels: string[] = [];
      
      // 1. Personal Document - Highest Priority, usually permitted for self
      channels.push(`databases.${dbId}.collections.${userColl}.documents.${userId}`);

      // 2. Public / Shared Channels (only if they exist and are likely permitted)
      if (APPWRITE_CONFIG.collections.notifications) {
          channels.push(`databases.${dbId}.collections.${APPWRITE_CONFIG.collections.notifications}.documents`);
      }

      // 3. Admin-only monitors
      if (isAdmin) {
        const adminColls = [
          APPWRITE_CONFIG.collections.submissions,
          APPWRITE_CONFIG.collections.withdrawals,
          APPWRITE_CONFIG.collections.affiliate_claims
        ];
        for (const collId of adminColls) {
          if (collId && collId !== 'undefined') {
            channels.push(`databases.${dbId}.collections.${collId}.documents`);
          }
        }
      }

      if (channels.length === 0) return;

      const channelString = channels.sort().join(',');
      if (channelString === channelsRef.current && unsubscribeRef.current) {
        return; 
      }

      if (unsubscribeRef.current) {
        try {
          unsubscribeRef.current();
        } catch (e) {
          // ignore
        }
        unsubscribeRef.current = null;
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (!isMounted) return;

      try {
        console.log('[REALTIME] Syncing connection...');
        channelsRef.current = channelString;
        
        // Use a persistent reference for the unsubscribe function
        const unsubscribe = client.subscribe(channels, (response) => {
          if (!isMounted) return;
          
          setLastUpdate(Date.now());

          // Profile Update via user document
          if (response.events.some(e => e.includes(userColl)) && 
              response.events.some(e => e.includes(`.documents.${userId}`))) {
            
            if (response.events.some(e => e.includes('.update'))) {
              const updatedDoc = response.payload as any;
              setUser(prev => {
                if (!prev) return null;
                const newCoins = updatedDoc.coins ?? prev.coins;
                if (newCoins === prev.coins && updatedDoc.role === prev.role && updatedDoc.username === prev.username) return prev;
                
                return {
                  ...prev,
                  username: updatedDoc.username || prev.username,
                  coins: newCoins,
                  level: Math.floor((newCoins || 0) / 1000) + 1,
                  role: updatedDoc.role || prev.role,
                  isBanned: updatedDoc.isBanned ?? prev.isBanned,
                  streak: updatedDoc.streak ?? prev.streak,
                };
              });
            }
          }

          // Notification toast
          if (response.events.some(e => e.includes('.create'))) {
            if (response.events.some(e => e.includes(APPWRITE_CONFIG.collections.notifications))) {
              showToast(`${(response.payload as any).title}`, 'info');
            }
          }
        });

        if (isMounted) {
          unsubscribeRef.current = unsubscribe;
        } else {
          unsubscribe();
        }
      } catch (err) {
        console.warn('[REALTIME] Connection failed:', err);
        channelsRef.current = '';
      }
    };

    const debounce = setTimeout(() => {
      initSubscriptions();
    }, 1500);

    return () => {
      isMounted = false;
      clearTimeout(debounce);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [userId, isAdmin, authReady]);

  return (
    <RealtimeContext.Provider value={{ lastUpdate }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => useContext(RealtimeContext);
