import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegistrationCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const LoginScreen: React.FC = () => {
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [loginLoading, setLoginLoading] = useState(false);

  // Registration form state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerErrors, setRegisterErrors] = useState<FormErrors>({});
  const [registerLoading, setRegisterLoading] = useState(false);

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return undefined;
  };

  const validateLoginForm = (): boolean => {
    const errors: FormErrors = {};
    const emailError = validateEmail(loginEmail);
    const passwordError = validatePassword(loginPassword);

    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegistrationForm = (): boolean => {
    const errors: FormErrors = {};
    const emailError = validateEmail(registerEmail);
    const passwordError = validatePassword(registerPassword);

    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;

    if (!registerConfirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (registerPassword !== registerConfirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Login handler
  const handleLogin = async () => {
    if (!validateLoginForm()) return;

    setLoginLoading(true);
    try {
      // TODO: Replace with actual authentication API call
      const credentials: LoginCredentials = {
        email: loginEmail,
        password: loginPassword,
      };

      // Simulated API call - replace with actual backend call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success
      Alert.alert('Success', 'Login successful!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to home screen or next screen
            console.log('Login successful:', credentials);
          },
        },
      ]);

      // Clear form
      setLoginEmail('');
      setLoginPassword('');
      setLoginErrors({});
    } catch (error) {
      Alert.alert('Login Failed', 'An error occurred during login. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Registration handler
  const handleRegister = async () => {
    if (!validateRegistrationForm()) return;

    setRegisterLoading(true);
    try {
      // TODO: Replace with actual registration API call
      const credentials: RegistrationCredentials = {
        email: registerEmail,
        password: registerPassword,
        confirmPassword: registerConfirmPassword,
      };

      // Simulated API call - replace with actual backend call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success
      Alert.alert('Success', 'Registration successful! You can now log in.', [
        {
          text: 'OK',
          onPress: () => {
            // Close modal and clear form
            setShowRegistrationModal(false);
            setRegisterEmail('');
            setRegisterPassword('');
            setRegisterConfirmPassword('');
            setRegisterErrors({});
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', 'An error occurred during registration. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  const closeRegistrationModal = () => {
    setShowRegistrationModal(false);
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    setRegisterErrors({});
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Log in to your account</Text>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, loginErrors.email && styles.inputError]}
            placeholder="Enter your email"
            value={loginEmail}
            onChangeText={setLoginEmail}
            editable={!loginLoading}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
          {loginErrors.email && (
            <Text style={styles.errorText}>{loginErrors.email}</Text>
          )}
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, loginErrors.password && styles.inputError]}
            placeholder="Enter your password"
            value={loginPassword}
            onChangeText={setLoginPassword}
            editable={!loginLoading}
            secureTextEntry
            placeholderTextColor="#999"
          />
          {loginErrors.password && (
            <Text style={styles.errorText}>{loginErrors.password}</Text>
          )}
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, styles.loginButton, loginLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loginLoading}
        >
          <Text style={styles.buttonText}>
            {loginLoading ? 'Logging in...' : 'Log In'}
          </Text>
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerLinkContainer}>
          <Text style={styles.registerLinkText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => setShowRegistrationModal(true)}>
            <Text style={styles.registerLink}>Register here</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Registration Modal */}
      <Modal
        visible={showRegistrationModal}
        transparent
        animationType="slide"
        onRequestClose={closeRegistrationModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeRegistrationModal}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Create Account</Text>
                <View style={{ width: 30 }} />
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, registerErrors.email && styles.inputError]}
                  placeholder="Enter your email"
                  value={registerEmail}
                  onChangeText={setRegisterEmail}
                  editable={!registerLoading}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor="#999"
                />
                {registerErrors.email && (
                  <Text style={styles.errorText}>{registerErrors.email}</Text>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[styles.input, registerErrors.password && styles.inputError]}
                  placeholder="Enter your password"
                  value={registerPassword}
                  onChangeText={setRegisterPassword}
                  editable={!registerLoading}
                  secureTextEntry
                  placeholderTextColor="#999"
                />
                {registerErrors.password && (
                  <Text style={styles.errorText}>{registerErrors.password}</Text>
                )}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={[styles.input, registerErrors.confirmPassword && styles.inputError]}
                  placeholder="Confirm your password"
                  value={registerConfirmPassword}
                  onChangeText={setRegisterConfirmPassword}
                  editable={!registerLoading}
                  secureTextEntry
                  placeholderTextColor="#999"
                />
                {registerErrors.confirmPassword && (
                  <Text style={styles.errorText}>{registerErrors.confirmPassword}</Text>
                )}
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.registerButton,
                  registerLoading && styles.buttonDisabled,
                ]}
                onPress={handleRegister}
                disabled={registerLoading}
              >
                <Text style={styles.buttonText}>
                  {registerLoading ? 'Creating Account...' : 'Register'}
                </Text>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.registerLinkContainer}>
                <Text style={styles.registerLinkText}>Already have an account? </Text>
                <TouchableOpacity onPress={closeRegistrationModal}>
                  <Text style={styles.registerLink}>Log in here</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loginContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: '#007AFF',
  },
  registerButton: {
    backgroundColor: '#34C759',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerLinkText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    fontSize: 28,
    color: '#666',
    fontWeight: '300',
  },
});

export default LoginScreen;