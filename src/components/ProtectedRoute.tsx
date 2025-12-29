import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isLoading?: boolean;
}

/**
 * ProtectedRoute component that wraps routes and redirects unauthenticated users to /login
 * 
 * @param isAuthenticated - Boolean indicating if user is authenticated
 * @param isLoading - Optional boolean indicating if authentication state is still loading
 * @param children - The component to render if authenticated
 * @returns The protected component or a redirect to /login
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  isLoading = false,
}) => {
  // While loading, you might want to show a loading spinner or null
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
