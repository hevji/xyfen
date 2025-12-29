import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { auth } from './config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// Layout Components
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

/**
 * Protected Route Component
 * Checks if user is authenticated before allowing access to protected routes
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    // Redirect to /auth subdomain for login
    return <Navigate to="/auth/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

/**
 * Public Route Component
 * Redirects authenticated users away from auth pages
 */
interface PublicRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  isAuthenticated,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </AuthLayout>
    );
  }

  if (isAuthenticated) {
    // Redirect authenticated users to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthLayout>{children}</AuthLayout>;
};

/**
 * Main App Component
 * Manages authentication state and routes
 */
const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  /**
   * Initialize Firebase authentication listener
   * Sets up auth state change handler on component mount
   */
  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      try {
        setCurrentUser(user);
        setAuthError(null);
      } catch (error) {
        console.error('Auth state change error:', error);
        setAuthError(
          error instanceof Error ? error.message : 'Authentication error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isAuthenticated,
        authError,
      }}
    >
      <Router>
        <Routes>
          {/* Public Routes - Auth Pages */}
          <Route
            path="/auth/login"
            element={
              <PublicRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/auth/register"
            element={
              <PublicRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/auth/forgot-password"
            element={
              <PublicRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/auth/verify-email"
            element={
              <PublicRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <VerifyEmail />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Public Pages */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <MainLayout>
                  <Home />
                </MainLayout>
              )
            }
          />

          {/* 404 Not Found */}
          <Route
            path="*"
            element={
              <MainLayout>
                <NotFound />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
