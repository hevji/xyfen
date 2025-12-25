import { useState, useEffect } from "react";
import { Flame, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  signInWithEmail,
  registerWithEmail,
  onAuthStateChanged,
  type FirebaseUser,
} from "@/lib/firebase";
import { getAuth, sendPasswordResetEmail } from "firebase/auth"; // <-- Added

const LOGIN_ENABLED = true;

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen = ({ onLoginSuccess }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const { toast } = useToast();

  const auth = getAuth(); // Firebase auth instance

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user: FirebaseUser | null) => {
      if (user) {
        toast({ title: "Welcome Back", description: `Logged in as ${user.email}` });
        onLoginSuccess();
      }
      setIsCheckingAuth(false);
    });
    return unsubscribe;
  }, [onLoginSuccess, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || (isRegistering && !confirmPassword.trim())) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }

    if (isRegistering && password !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }

    if (isRegistering && !agreed) {
      toast({ title: "You must agree to the Terms of Service", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        const result = await registerWithEmail(email, password);
        toast({ title: "Account Created!", description: `Welcome ${result.user.email}` });
      } else {
        const result = await signInWithEmail(email, password);
        toast({ title: "Login Successful", description: `Welcome back ${result.user.email}` });
      }
      onLoginSuccess();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }

    setIsLoading(false);
  };

  // New: handle password reset
  const handlePasswordReset = async () => {
    if (!email.trim()) {
      toast({ title: "Enter your email first", variant: "destructive" });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Password reset email sent!", description: "Check your inbox." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (!LOGIN_ENABLED) {
    onLoginSuccess();
    return null;
  }

  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-muted-foreground">Checking authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/10">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <Flame className="w-10 h-10 text-primary animate-pulse" />
              <div className="absolute inset-0 w-10 h-10 bg-primary/30 blur-xl rounded-full" />
            </div>
            <span className="text-3xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Xyfen
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {isRegistering ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {isRegistering ? "Register to continue" : "Sign in to continue"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                  autoComplete="new-password"
                />
              </div>

              {/* NEW: Forgot password link */}
              {!isRegistering && (
                <p className="text-sm text-right mt-1">
                  <span
                    className="text-blue-600 underline cursor-pointer"
                    onClick={handlePasswordReset}
                  >
                    Forgot Password?
                  </span>
                </p>
              )}
            </div>

            {/* Confirm Password (Register) */}
            {isRegistering && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            {/* Terms */}
            {isRegistering && (
              <div className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span>
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setTermsModalOpen(true)}
                    className="underline text-primary"
                  >
                    Terms of Service
                  </button>
                </span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || (isRegistering && !agreed)}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>{isRegistering ? "Registering..." : "Signing in..."}</span>
                </div>
              ) : isRegistering ? (
                "Register"
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Bottom toggle */}
          <p className="text-center text-sm mt-4">
            {isRegistering ? (
              <>
                Already have an account?{" "}
                <button onClick={() => setIsRegistering(false)} className="text-primary underline">
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button onClick={() => setIsRegistering(true)} className="text-primary underline">
                  Register
                </button>
              </>
            )}
          </p>

          {/* Terms modal & footer remain unchanged */}
          {termsModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              {/* ... */}
            </div>
          )}

          <p className="mt-6 text-xs text-center text-muted-foreground">Secured by Firebase</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
