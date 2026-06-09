import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

// Patch native WebSocket to avoid InvalidStateError crashes in libraries (like Appwrite SDK’s Realtime client)
// that call .send() while the connection is still in CONNECTING state.
if (typeof window !== 'undefined' && window.WebSocket) {
    const NativeWebSocket = window.WebSocket;

    // Use a robust proxy-like factory wrapper of the native WebSocket class
    function PatchedWebSocket(this: any, url: string | URL, protocols?: string | string[]) {
        const instance = new NativeWebSocket(url, protocols);
        const originalInstanceSend = instance.send;

        instance.send = function(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
            if (instance.readyState === 0 /* CONNECTING */ || instance.readyState === NativeWebSocket.CONNECTING) {
                console.debug('[WEBSOCKET-PATCH] Instance-level queueing send() payload - socket is CONNECTING');
                const handleDelayedSend = function() {
                    try {
                        if (instance.readyState === 1 /* OPEN */ || instance.readyState === NativeWebSocket.OPEN) {
                            originalInstanceSend.call(instance, data);
                        }
                    } catch (err: any) {
                        console.debug('[WEBSOCKET-PATCH] Delayed send suppressed:', err.message || err);
                    } finally {
                        instance.removeEventListener('open', handleDelayedSend);
                    }
                };
                instance.addEventListener('open', handleDelayedSend);
                return;
            }

            try {
                return originalInstanceSend.call(instance, data);
            } catch (err: any) {
                if (err.name === 'InvalidStateError' || (err.message && String(err.message).includes('CONNECTING'))) {
                    console.warn('[WEBSOCKET-PATCH] Suppressed instance-level send during invalid state:', err.message);
                    return;
                }
                throw err;
            }
        };

        return instance;
    }

    // Preserve the native prototype chain and properties for instanceof checks and static fields
    PatchedWebSocket.prototype = NativeWebSocket.prototype;
    
    // Copy all static fields from the original WebSocket class (like CONNECTING, OPEN, CLOSING, CLOSED)
    Object.keys(NativeWebSocket).forEach((key) => {
        (PatchedWebSocket as any)[key] = (NativeWebSocket as any)[key];
    });
    
    // Explicitly guarantee prototype constants are mapped
    (PatchedWebSocket as any).CONNECTING = 0;
    (PatchedWebSocket as any).OPEN = 1;
    (PatchedWebSocket as any).CLOSING = 2;
    (PatchedWebSocket as any).CLOSED = 3;

    // Also patch the prototype directly in case references to the original prototype are cached
    const originalSend = NativeWebSocket.prototype.send;
    NativeWebSocket.prototype.send = function(this: WebSocket, data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        if (this.readyState === 0 || this.readyState === NativeWebSocket.CONNECTING) {
            console.debug('[WEBSOCKET-PATCH] Prototype-level queueing send() payload - socket is CONNECTING');
            const socket = this;
            const handleDelayedSend = function() {
                try {
                    if (socket.readyState === 1 || socket.readyState === NativeWebSocket.OPEN) {
                        originalSend.call(socket, data);
                    }
                } catch (err: any) {
                    console.debug('[WEBSOCKET-PATCH] Prototype delayed send suppressed:', err.message || err);
                } finally {
                    socket.removeEventListener('open', handleDelayedSend);
                }
            };
            socket.addEventListener('open', handleDelayedSend);
            return;
        }

        try {
            return originalSend.call(this, data);
        } catch (err: any) {
            if (err.name === 'InvalidStateError' || (err.message && String(err.message).includes('CONNECTING'))) {
                console.warn('[WEBSOCKET-PATCH] Suppressed prototype-level send during invalid state:', err.message);
                return;
            }
            throw err;
        }
    };

    // Replace the global WebSocket constructor safely with fallback handling
    try {
        (window as any).WebSocket = PatchedWebSocket;
    } catch (e: any) {
        try {
            Object.defineProperty(window, 'WebSocket', {
                value: PatchedWebSocket,
                configurable: true,
                writable: true
            });
        } catch (innerErr: any) {
            console.warn('[WEBSOCKET-PATCH] Could not redefine window.WebSocket constructor. Falling back entirely to prototype-level patching.', innerErr.message);
        }
    }
}

// Silence specific Appwrite SDK internal WebSocket connection messages to keep the developer console clean
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: any[]) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('Realtime got disconnected')) {
        console.debug('[APPWRITE-REALTIME] Connection idle or disconnected, auto-retry scheduled.');
        return;
    }
    originalConsoleError.apply(console, args);
};

console.warn = (...args: any[]) => {
    if (args[0] && typeof args[0] === 'string' && (
        args[0].includes('WebSocket state busy') || 
        args[0].includes('Appwrite is using localStorage') ||
        args[0].includes('Warning: ')
    )) {
        return;
    }
    originalConsoleWarn.apply(console, args);
};

const getLocalStorageItem = (key: string, defaultValue: string): string => {
    try {
        return localStorage.getItem(key) || defaultValue;
    } catch (e) {
        return defaultValue;
    }
};

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || getLocalStorageItem('VITE_APPWRITE_ENDPOINT', 'https://fra.cloud.appwrite.io/v1');
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || getLocalStorageItem('VITE_APPWRITE_PROJECT_ID', '6a016eac001c0af48909');
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || getLocalStorageItem('VITE_APPWRITE_DATABASE_ID', '67d163d8000b08051772');
const bucketId = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID || getLocalStorageItem('VITE_APPWRITE_STORAGE_BUCKET_ID', '67d16b1c000c19b02a9e');

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

// Configuration check
if (import.meta.env.DEV) {
    console.log('[APPWRITE] Initialized dynamically with endpoint:', endpoint);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export { client };

export const APPWRITE_CONFIG = {
    databaseId: databaseId,
    collections: {
        users: 'users',
        tasks: 'tasks',
        task_categories: 'task_categories',
        task_submissions: 'submissions',
        task_progress: 'user_task_progress',
        task_analytics: 'task_analytics',
        task_reports: 'task_reports',
        quizzes: 'quizzes', // Legacy or combined
        submissions: 'submissions',
        withdrawals: 'withdrawals',
        notifications: 'notifications',
        leaderboard: 'leaderboard',
        transactions: 'transactions',
        referrals: 'referrals',
        settings: 'settings',
        logs: 'logs',
        activity: 'activity',
        affiliate_partners: 'affiliate_partners',
        affiliate_offers: 'affiliate_offers',
        affiliate_clicks: 'affiliate_clicks',
        affiliate_claims: 'affiliate_claims',
        affiliate_categories: 'affiliate_categories'
    },
    buckets: {
        uploads: bucketId
    }
};
