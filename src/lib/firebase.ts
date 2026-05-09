import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// We try to load from the generated config file
let firebaseApp: FirebaseApp | null = null;

const initFirebase = () => {
  if (getApps().length > 0) {
    return getApps()[0];
  }
  
  try {
    // In some environments, we might be able to import this synchronously
    // But since it's generated, dynamic import is often safer.
    // However, for this fix, we'll return null and let the context handle it.
    return null;
  } catch (e) {
    return null;
  }
};

firebaseApp = initFirebase();

export const auth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null;
export const db: Firestore | null = firebaseApp ? getFirestore(firebaseApp) : null;
export const storage: FirebaseStorage | null = firebaseApp ? getStorage(firebaseApp) : null;

export async function testConnection() {
  const currentApp = getApps().length > 0 ? getApps()[0] : null;
  if (!currentApp) return;
  const currentDb = getFirestore(currentApp);
  try {
    await getDocFromServer(doc(currentDb, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// This function will be used by the AuthProvider to wait for initialization
export const waitForFirebase = async (): Promise<FirebaseApp | null> => {
  if (getApps().length > 0) return getApps()[0];
  
  // Timeout for initialization
  const timeoutPromise = new Promise<null>((resolve) => 
    setTimeout(() => resolve(null), 5000)
  );

  const initPromise = (async () => {
    try {
      // @ts-ignore
      const config = await import(/* @vite-ignore */ '../../firebase-applet-config.json');
      const actualConfig = (config.default || config) as any;
      if (actualConfig && actualConfig.apiKey) {
        const app = initializeApp(actualConfig);
        await testConnection();
        return app;
      }
    } catch (e) {
      console.error('Firebase configuration failed:', e);
    }
    return null;
  })();

  return Promise.race([initPromise, timeoutPromise]);
};
