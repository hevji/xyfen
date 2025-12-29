// auth.ts
export const LOGIN_ENABLED = true;

// Firebase config placeholders
export const firebaseConfig = {
  apiKey: "AIzaSyAwOMlhpq7m7mGND1r7hcPrQY-T1XxtpZ4",
  authDomain: "xyfen-12af2.firebaseapp.com",
  projectId: "xyfen-12af2",
  storageBucket: "xyfen-12af2.firebasestorage.app",
  messagingSenderId: "549286651712",
  appId: "1:549286651712:web:c3c84a37b5c62942353ca5"
};

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return !!(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);
};

// Check if we are on the login subdomain
export const isLoginSubdomain = (): boolean => {
  return window.location.hostname.startsWith("login.");
};
