import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthError,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import '../styles/LoginScreen.css';

interface FirebaseErrorResponse extends AuthError {
  code: string;
  message: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const LoginScreen: React.FC = () => {
  // Login form state
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // UI state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Firebase error message mapping
  const getFirebaseErrorMessage = (errorCode: string): string => {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'Invalid email address format',
      'auth/user-disabled': 'This user account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many login attempts. Please try again later',
      'auth/email-already-in-use': 'An account with this email already exists',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled',
      'auth/invalid-credential': 'Invalid email or password',
      'auth/network-request-failed': 'Network error. Please check your connection',
    };

    return errorMessages[errorCode] || 'An error occurred. Please try again';
  };

  // Login form handlers
  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLoginError('');
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess(false);

    // Validation
    if (!loginForm.email || !loginForm.password) {
      setLoginError('Please fill in all fields');
      return;
    }

    setIsLoginLoading(true);

    try {
      await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      setLoginSuccess(true);
      setLoginForm({ email: '', password: '' });
      // You can add navigation logic here after successful login
      console.log('Login successful');
    } catch (error) {
      const firebaseError = error as FirebaseErrorResponse;
      const errorMessage = getFirebaseErrorMessage(firebaseError.code);
      setLoginError(errorMessage);
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Register form handlers
  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setRegisterError('');
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterError('');

    // Validation
    if (!registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      setRegisterError('Please fill in all fields');
      return;
    }

    if (registerForm.password.length < 6) {
      setRegisterError('Password must be at least 6 characters');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    setIsRegisterLoading(true);

    try {
      await createUserWithEmailAndPassword(
        auth,
        registerForm.email,
        registerForm.password
      );
      setRegisterForm({ email: '', password: '', confirmPassword: '' });
      setShowRegisterModal(false);
      setLoginSuccess(true);
      // Auto-fill email in login form
      setLoginForm((prev) => ({
        ...prev,
        email: registerForm.email,
      }));
      // You can add navigation logic here after successful registration
      console.log('Registration successful');
    } catch (error) {
      const firebaseError = error as FirebaseErrorResponse;
      const errorMessage = getFirebaseErrorMessage(firebaseError.code);
      setRegisterError(errorMessage);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setRegisterForm({ email: '', password: '', confirmPassword: '' });
    setRegisterError('');
  };

  return (
    <div className="login-screen-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to Xyfen</h1>
          <p>Sign in to your account</p>
        </div>

        {/* Success Message */}
        {loginSuccess && (
          <div className="success-message">
            <span className="success-icon">✓</span>
            Authentication successful! Redirecting...
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginInputChange}
              placeholder="Enter your email"
              disabled={isLoginLoading}
              className={loginError ? 'input-error' : ''}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginInputChange}
              placeholder="Enter your password"
              disabled={isLoginLoading}
              className={loginError ? 'input-error' : ''}
              required
            />
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="error-message">
              <span className="error-icon">!</span>
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isLoginLoading}
          >
            {isLoginLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Register Button */}
        <div className="register-section">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="register-link-button"
              onClick={() => setShowRegisterModal(true)}
              disabled={isLoginLoading}
            >
              Register here
            </button>
          </p>
        </div>

        {/* Forgot Password Link (Optional) */}
        <div className="forgot-password-section">
          <button type="button" className="forgot-password-link">
            Forgot password?
          </button>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={closeRegisterModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Account</h2>
              <button
                type="button"
                className="close-button"
                onClick={closeRegisterModal}
                aria-label="Close registration modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleRegister} className="register-form">
              <div className="form-group">
                <label htmlFor="register-email">Email Address</label>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterInputChange}
                  placeholder="Enter your email"
                  disabled={isRegisterLoading}
                  className={registerError ? 'input-error' : ''}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterInputChange}
                  placeholder="Create a password (min 6 characters)"
                  disabled={isRegisterLoading}
                  className={registerError ? 'input-error' : ''}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterInputChange}
                  placeholder="Confirm your password"
                  disabled={isRegisterLoading}
                  className={registerError ? 'input-error' : ''}
                  required
                />
              </div>

              {/* Error Message */}
              {registerError && (
                <div className="error-message">
                  <span className="error-icon">!</span>
                  {registerError}
                </div>
              )}

              <button
                type="submit"
                className="register-button"
                disabled={isRegisterLoading}
              >
                {isRegisterLoading ? (
                  <>
                    <span className="spinner"></span>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={closeRegisterModal}
                disabled={isRegisterLoading}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
