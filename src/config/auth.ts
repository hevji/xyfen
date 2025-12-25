/**
 * Authentication Configuration
 * 
 * Set LOGIN_ENABLED to true to show the login screen,
 * or false to skip directly to the main content.
 */
export const LOGIN_ENABLED = true;

/**
 * Firebase Configuration
 * 
 * Uses environment variables for security. Set these in your .env file:
 * VITE_FIREBASE_API_KEY=your-api-key
 * VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
 * VITE_FIREBASE_PROJECT_ID=your-project-id
 * VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
 * VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
 * VITE_FIREBASE_APP_ID=your-app-id
 * 
 * IMPORTANT: Add your deployment domains to Firebase Console:
 * Authentication > Settings > Authorized domains
 * Add: localhost, your-app.lovable.app, and any custom domains
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
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

/**
 * NOTE: Authorized Domains Setup
 * 
 * For Firebase Authentication to work on all deployment URLs:
 * 1. Go to Firebase Console (https://console.firebase.google.com)
 * 2. Select your project
 * 3. Navigate to: Authentication > Settings > Authorized domains
 * 4. Add the following domains:
 *    - localhost (for local development)
 *    - your-app.lovable.app (your Lovable preview URL)
 *    - Any custom domains you've configured
 * 
 * Without adding these domains, Firebase will reject authentication
 * requests from those origins.
 */
