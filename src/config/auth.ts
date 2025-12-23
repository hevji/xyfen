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
 * Replace these values with your Firebase project credentials.
 * You can find these in your Firebase Console:
 * Project Settings > General > Your apps > Firebase SDK snippet
 * 
 * IMPORTANT: Add your deployment domains to Firebase Console:
 * Authentication > Settings > Authorized domains
 * Add: localhost, your-app.lovable.app, and any custom domains
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
