// firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged as fbOnAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";
import { firebaseConfig, isFirebaseConfigured } from "./auth";

let auth: ReturnType<typeof getAuth> | null = null;

export const initializeFirebase = () => {
  if (!isFirebaseConfigured()) throw new Error("Firebase is not configured.");
  if (!getApps().length) initializeApp(firebaseConfig);
  auth = getAuth();
};

// Listen to auth changes
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  if (!auth) throw new Error("Firebase not initialized.");
  return fbOnAuthStateChanged(auth, callback);
};

// Sign in with email/password
export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) throw new Error("Firebase not initialized.");
  return await signInWithEmailAndPassword(auth, email, password);
};

// Check if user is logged in (synchronous)
export const getCurrentUser = (): User | null => {
  return auth?.currentUser || null;
};
