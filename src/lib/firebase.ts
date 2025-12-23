import { firebaseConfig } from "@/config/auth";

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
 * Initialize Firebase app (only once)
 */
export const initializeFirebase = () => {
  if (initialized || !window.firebase) return;

  try {
    window.firebase.initializeApp(firebaseConfig);
    initialized = true;
  } catch (error) {
    console.log("Firebase already initialized");
  }
};

/**
 * Get Firebase Auth instance
 */
export const getAuth = () => {
  if (!window.firebase) {
    throw new Error("Firebase SDK not loaded");
  }
  initializeFirebase();
  return window.firebase.auth();
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  const auth = getAuth();
  return auth.signInWithEmailAndPassword(email, password);
};

/**
 * Register user with email and password + optional reCAPTCHA token
 */
export const registerWithEmail = async (email: string, password: string, recaptchaToken?: string) => {
  const auth = getAuth();

  // Optional: send reCAPTCHA token to your backend for verification
  if (recaptchaToken) {
    // Example:
    // await fetch("/api/verify-recaptcha", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ token: recaptchaToken }),
    // });
  }

  return auth.createUserWithEmailAndPassword(email, password);
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  const auth = getAuth();
  return auth.signOut();
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  const auth = getAuth();
  return auth.onAuthStateChanged(callback);
};

/**
 * Get current user
 */
export const getCurrentUser = (): FirebaseUser | null => {
  try {
    const auth = getAuth();
    return auth.currentUser;
  } catch {
    return null;
  }
};

