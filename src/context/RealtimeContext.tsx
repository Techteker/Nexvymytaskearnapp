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
  const isConnectingRef = React.useRef<boolean>(false);
  const lastUpdateRef = React.useRef<number>(0);
  const reconnectAttemptsRef = React.useRef<number>(0);

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  const userId = user?.uid;

  useEffect(() => {
    let isMounted = true;

    if (!authReady || !userId) {
      if (unsubscribeRef.current) {
        console.log('[REALTIME] Cleaning up: No active user session');
        try {
          unsubscribeRef.current();
        } catch (e) {
          console.debug('[REALTIME] Unsubscribe error:', e);
        }
        unsubscribeRef.current = null;
        channelsRef.current = '';
      }
      return;
    }
    
    const initSubscriptions = async () => {
      if (!isMounted || isConnectingRef.current) return;

      const dbId = APPWRITE_CONFIG.databaseId;
      const userColl = APPWRITE_CONFIG.collections.users;
      
      if (!dbId || !userColl || dbId === 'undefined' || userColl === 'undefined') {
        console.warn('[REALTIME] Missing or invalid configuration, skipping subscription');
        return;
      }

      const channels: string[] = [];
      
      // 1. Personal Document - Highest Priority
      channels.push(`databases.${dbId}.collections.${userColl}.documents.${userId}`);

      // 2. Public / Shared Channels
      if (APPWRITE_CONFIG.collections.notifications && APPWRITE_CONFIG.collections.notifications !== 'undefined') {
          channels.push(`databases.${dbId}.collections.${APPWRITE_CONFIG.collections.notifications}.documents`);
      }

      // Add tasks collection subscription so normal users receive tasks created by admins in real-time
      if (APPWRITE_CONFIG.collections.tasks && APPWRITE_CONFIG.collections.tasks !== 'undefined') {
          channels.push(`databases.${dbId}.collections.${APPWRITE_CONFIG.collections.tasks}.documents`);
      }

      // 3. Admin-only monitors
      if (isAdmin) {
        const adminColls = [
          APPWRITE_CONFIG.collections.submissions,
          APPWRITE_CONFIG.collections.withdrawals,
          APPWRITE_CONFIG.collections.affiliate_claims,
          APPWRITE_CONFIG.collections.affiliate_offers
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
        console.debug('[REALTIME] Subscriptions already active for these channels');
        return; 
      }

      isConnectingRef.current = true;
      console.log('[REALTIME] Initiating connection to:', channels.length, 'channels');

      // Cleanup previous
      if (unsubscribeRef.current) {
        try {
          console.log('[REALTIME] Cleaning up existing subscription...');
          unsubscribeRef.current();
          unsubscribeRef.current = null;
          // Wait for SDK cleanup
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
          console.debug('[REALTIME] Cleanup error:', e);
        }
      }

      if (!isMounted) {
        isConnectingRef.current = false;
        return;
      }

      try {
        channelsRef.current = channelString;
        
        const unsubscribe = client.subscribe(channels, (response) => {
          if (!isMounted) return;
          
          // Debug incoming events
          if (import.meta.env.DEV) {
            console.debug('[REALTIME] Event received:', response.events[0]);
          }

          // Debounce total state update
          const now = Date.now();
          if (now - lastUpdateRef.current >= 1500) {
            lastUpdateRef.current = now;
            setLastUpdate(now);
          }

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
      } catch (err: any) {
        const errorMsg = (err?.message || String(err)).toLowerCase();
        if (errorMsg.includes('connecting state') || errorMsg.includes('websocket') || errorMsg.includes('closed')) {
          const backoff = Math.min(10000, 2000 * Math.pow(2, reconnectAttemptsRef.current));
          console.warn(`[REALTIME] WebSocket state busy or disconnected. Backing off for ${backoff}ms...`);
          channelsRef.current = ''; 
          reconnectAttemptsRef.current++;
          setTimeout(() => {
            if (isMounted) initSubscriptions();
          }, backoff);
        } else {
          console.error('[REALTIME] Connection error:', err);
          channelsRef.current = '';
        }
      } finally {
        isConnectingRef.current = false;
      }
    };

    const debounceTime = reconnectAttemptsRef.current > 0 ? 5000 : 3500;
    const debounce = setTimeout(() => {
      initSubscriptions();
    }, debounceTime);

    return () => {
      isMounted = false;
      clearTimeout(debounce);
      // We only want to unsubscribe if we are TRULY unmounting or if the effect is restarting with different values
      // But since we have a channels check inside initSubscriptions, we can be less aggressive here
      // However, to be safe with React strict mode and unmounting, we should still handle cleanup
    };
  }, [userId, isAdmin, authReady]);

  // Handle cleanup on genuine unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        console.log('[REALTIME] Final cleanup on unmount');
        try {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
          channelsRef.current = '';
        } catch (e) {
          console.debug('[REALTIME] Cleanup error:', e);
        }
      }
    };
  }, []);

  // Listen to custom browser-wide events to sync components instantly
  useEffect(() => {
    const handleSync = () => {
      const now = Date.now();
      lastUpdateRef.current = now;
      setLastUpdate(now);
      console.log('[REALTIME] Executed client-wide real-time component updates trigger.');
    };
    window.addEventListener('nexvy_realtime_update', handleSync);
    window.addEventListener('local_submission_added', handleSync);
    return () => {
      window.removeEventListener('nexvy_realtime_update', handleSync);
      window.removeEventListener('local_submission_added', handleSync);
    };
  }, []);

  // Bulletproof fallback polling Sync loop to fetch updates from the database safely in the background.
  // This automatically updates lastUpdate every 8 seconds, ensuring real-time behavior even if WS transitions are blocked.
  useEffect(() => {
    if (!userId) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      lastUpdateRef.current = now;
      setLastUpdate(now);
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [userId]);

  return (
    <RealtimeContext.Provider value={{ lastUpdate }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => useContext(RealtimeContext);
