import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '6a016eac001c0af48909';

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

// Configuration check
if (import.meta.env.DEV) {
    console.log('[APPWRITE] Initialized with endpoint:', endpoint);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export { client };

export const APPWRITE_CONFIG = {
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || '67d163d8000b08051772',
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
        uploads: (import.meta as any).env.VITE_APPWRITE_STORAGE_BUCKET_ID
    }
};
