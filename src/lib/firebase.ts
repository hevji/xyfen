import { firebaseConfig, isFirebaseConfigured } from "@/config/auth";

// Extend Window interface for Firebase globals from CDN
declare global {
  interface Window {
    firebase: {
      initializeApp: (config: typeof firebaseConfig) => void;
      auth: () => {
        signInWithEmailAndPassword: (email: string, password: string) => Promise<{ user: FirebaseUser }>;
        createUserWithEmailAndPassword: (email: string, password: string) => Promise<{ user: FirebaseUser }>;
        signOut: () => Promise<void>;
        onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => () => void;
        currentUser: FirebaseUser | null;
      };
      grecaptcha: {
        execute: (key: string, options?: { action: string }) => Promise<string>;
      };
    };
  }
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

let initialized = false;

/**
 * Check if Firebase is ready to use
 */
export const isFirebaseReady = (): boolean => {
  return initialized && !!window.firebase;
};

/**
 * Initialize Firebase app (only once)
 */
export const initializeFirebase = (): boolean => {
  if (initialized) return true;
  if (!window.firebase) return false;

  if (!isFirebaseConfigured()) {
    console.warn("Firebase is not configured. Please set environment variables.");
    return false;
  }

  try {
    window.firebase.initializeApp(firebaseConfig);
    initialized = true;
    return true;
  } catch (error) {
    console.log("Firebase already initialized");
    initialized = true;
    return true;
  }
};

/**
 * Get Firebase Auth instance (safe version)
 */
export const getAuth = () => {
  if (!window.firebase) {
    return null;
  }
  if (!initialized) {
    initializeFirebase();
  }
  return window.firebase.auth();
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  const auth = getAuth();
  if (!auth) {
    throw new Error("Firebase is not available. Please try again.");
  }
  return auth.signInWithEmailAndPassword(email, password);
};

/**
 * Register user with email and password
 */
export const registerWithEmail = async (email: string, password: string) => {
  const auth = getAuth();
  if (!auth) {
    throw new Error("Firebase is not available. Please try again.");
  }
  return auth.createUserWithEmailAndPassword(email, password);
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  const auth = getAuth();
  if (!auth) {
    throw new Error("Firebase is not available.");
  }
  return auth.signOut();
};

/**
 * Subscribe to auth state changes (safe version)
 */
export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  const auth = getAuth();
  if (!auth) {
    // Return a no-op unsubscribe function if Firebase isn't ready
    callback(null);
    return () => {};
  }
  return auth.onAuthStateChanged(callback);
};

/**
 * Get current user
 */
export const getCurrentUser = (): FirebaseUser | null => {
  try {
    const auth = getAuth();
    return auth?.currentUser || null;
  } catch {
    return null;
  }
};
