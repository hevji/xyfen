import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Auth,
  User,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

/**
 * Interface for the Authentication Context
 */
interface AuthContextType {
  // User state
  user: User | null;
  loading: boolean;
  error: string | null;

  // Authentication methods
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
  clearError: () => void;
}

/**
 * Create the Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props for AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode;
  auth: Auth;
}

/**
 * AuthProvider Component
 * Wraps your app to provide authentication context to all child components
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children, auth }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize authentication persistence and listen to auth state changes
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Set persistence to LOCAL so user stays logged in across sessions
        await setPersistence(auth, browserLocalPersistence);

        // Listen to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize authentication';
        setError(errorMessage);
        setLoading(false);
      }
    };

    initializeAuth();
  }, [auth]);

  /**
   * Sign up with email and password
   */
  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<User> => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update profile with display name if provided
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
        // Refresh user to get updated profile
        result.user.reload();
      }

      setUser(result.user);
      return result.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Sign in with email and password
   */
  const signInWithEmail = async (email: string, password: string): Promise<User> => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      return result.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Sign in with Google
   */
  const signInWithGoogle = async (): Promise<User> => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      return result.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign in failed';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Log out the current user
   */
  const logout = async (): Promise<void> => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Update user profile information
   */
  const updateUserProfile = async (updates: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> => {
    try {
      setError(null);
      if (!user) {
        throw new Error('No user is currently logged in');
      }

      await updateProfile(user, updates);
      // Refresh user to get updated profile
      await user.reload();
      setUser(auth.currentUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Clear error state
   */
  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the AuthContext
 * Must be used within an AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

/**
 * Higher-order component to protect routes
 * Usage: <ProtectedRoute component={MyComponent} />
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { user, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return <div>Please log in to access this page</div>;
    }

    return <Component {...props} />;
  };
};
