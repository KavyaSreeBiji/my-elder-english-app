import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app;
let db;
let auth;

try {
  // Only initialize if we have a config (prevents crashing if .env is missing)
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } else {
    console.warn("Firebase config is missing in .env. Remote saving will be disabled.");
  }
} catch (error) {
  console.error("Error initializing Firebase", error);
}

export { app, db, auth };

/**
 * Saves user progress to Firestore
 */
export const saveUserProgress = async (userId, data) => {
  if (!db || !userId) return;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, data, { merge: true });
  } catch (error) {
    console.error("Error saving progress:", error);
  }
};

/**
 * Loads user progress from Firestore with a 3.5 second timeout
 */
export const loadUserProgress = async (userId) => {
  if (!db || !userId) return null;

  const timeoutPromise = new Promise((resolve) => 
    setTimeout(() => {
      console.warn("loadUserProgress timed out");
      resolve(null);
    }, 3500)
  );

  const fetchPromise = (async () => {
    try {
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
    return null;
  })();

  return Promise.race([fetchPromise, timeoutPromise]);
};
