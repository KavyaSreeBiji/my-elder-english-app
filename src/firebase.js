import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

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

try {
  // Only initialize if we have a config (prevents crashing if .env is missing)
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    console.warn("Firebase config is missing in .env. Remote saving will be disabled.");
  }
} catch (error) {
  console.error("Error initializing Firebase", error);
}

export { app, db };

/**
 * Saves user progress to Firestore
 */
export const saveUserProgress = async (username, data) => {
  if (!db || !username) return;
  try {
    const userRef = doc(db, 'users', username.toLowerCase());
    await setDoc(userRef, data, { merge: true });
  } catch (error) {
    console.error("Error saving progress:", error);
  }
};

/**
 * Loads user progress from Firestore
 */
export const loadUserProgress = async (username) => {
  if (!db || !username) return null;
  try {
    const userRef = doc(db, 'users', username.toLowerCase());
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (error) {
    console.error("Error loading progress:", error);
  }
  return null;
};
