/**
 * Authentication Configuration
 */
export const LOGIN_ENABLED = true;

/**
 * Firebase Configuration
 * 
 * Just replace the values below with your Firebase project info.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyAwOMlhpq7m7mGND1r7hcPrQY-T1XxtpZ4",
  authDomain: "xyfen-12af2.firebaseapp.com",
  projectId: "xyfen-12af2",
  storageBucket: "xyfen-12af2.firebasestorage.app",
  messagingSenderId: "549286651712",
  appId: "1:549286651712:web:c3c84a37b5c62942353ca5"
};

/**
 * Validate that Firebase config is present
 */
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
};
