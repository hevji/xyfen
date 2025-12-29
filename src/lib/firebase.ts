// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged as fbOnAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";
import { firebaseConfig, isFirebaseConfigured } from "./auth";

if (!isFirebaseConfigured()) throw new Error("Firebase not configured");

// Initialize app only once
if (!getApps().length) initializeApp(firebaseConfig);

const auth = getAuth();

// Auth helpers
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return fbOnAuthStateChanged(auth, callback);
};

export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, password);
};

export const getCurrentUser = (): User | null => auth.currentUser || null;
