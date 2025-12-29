import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged as fbOnAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";
import { firebaseConfig, isFirebaseConfigured } from "./auth";

let auth: ReturnType<typeof getAuth> | null = null;

// Initialize Firebase immediately if not already initialized
export const initializeFirebase = () => {
  if (!isFirebaseConfigured()) throw new Error("Firebase not configured");
  if (!getApps().length) initializeApp(firebaseConfig);
  if (!auth) auth = getAuth();
};

// Listen for auth state changes
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  if (!auth) throw new Error("Firebase not initialized. Call initializeFirebase first.");
  return fbOnAuthStateChanged(auth, callback);
};

// Sign in with email/password
export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) throw new Error("Firebase not initialized. Call initializeFirebase first.");
  return await signInWithEmailAndPassword(auth, password);
};

// Get current user synchronously
export const getCurrentUser = (): User | null => auth?.currentUser || null;
