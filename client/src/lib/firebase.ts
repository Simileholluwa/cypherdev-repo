import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDQPjchdIEDAmXTpjnsxCXg03AUtdH_QIs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cypherdev-repo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cypherdev-repo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cypherdev-repo.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "745989411736",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:745989411736:web:ebeeb88310c91cf6c291ed"
};

// Validate configuration
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "undefined") {
  console.warn("Firebase API key is not properly configured. Please check your environment variables.");
}

// Initialize Firebase - prevent duplicate initialization
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  // If there's an error, try to get the existing app
  console.warn('Firebase initialization error:', error);
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();

export default app;