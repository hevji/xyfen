'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const clearError = () => setError(null);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      clearError();
      setLoading(true);
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName) {
        await updateProfile(newUser, { displayName });
      }
      
      setUser(newUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign up';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      clearError();
      setLoading(true);
      const { user: signedInUser } = await signInWithEmailAndPassword(auth, email, password);
      setUser(signedInUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign in';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      clearError();
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const { user: googleUser } = await signInWithPopup(auth, provider);
      setUser(googleUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during Google sign in';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    try {
      clearError();
      setLoading(true);
      const provider = new GithubAuthProvider();
      const { user: githubUser } = await signInWithPopup(auth, provider);
      setUser(githubUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during GitHub sign in';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      clearError();
      setLoading(true);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign out';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      clearError();
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while sending password reset email';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: { displayName?: string; photoURL?: string }) => {
    try {
      clearError();
      if (!user) throw new Error('No user is currently signed in');
      
      setLoading(true);
      await updateProfile(user, updates);
      setUser({ ...user, ...updates });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    signOutUser,
    resetPassword,
    updateUserProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
