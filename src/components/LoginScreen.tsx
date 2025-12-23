import { useState, useEffect } from "react";
import { Flame, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmail, registerWithEmail, onAuthStateChanged, type FirebaseUser } from "@/lib/firebase";

// Toggle login screen
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
  const { toast } = useToast();

  // Check if user is already logged in
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
      toast({ title: "Missing Fields", description: "Fill all required fields.", variant: "destructive" });
      return;
    }
    if (isRegistering && password !== confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    // Generate reCAPTCHA token if registering
    let recaptchaToken = "";
    if (isRegistering) {
      if (!window.grecaptcha) {
        toast({ title: "reCAPTCHA Not Loaded", description: "Try again in a moment.", variant: "destructive" });
        return;
      }
      recaptchaToken = await window.grecaptcha.execute("YOUR_RECAPTCHA_KEY", { action: "register" });
    }

    setIsLoading(true);
    try {
      if (isRegistering) {
        const result = await registerWithEmail(email, password, recaptchaToken);
        toast({ title: "Registration Successful", description: `Account created for ${result.user.email}. Check your email to verify.` });
      } else {
        const result = await signInWithEmail(email, password);
        toast({ title: "Login Successful", description: `Welcome back, ${result.user.email}!` });
        onLoginSuccess();
      }
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      let errorMessage = firebaseError.message || "An error occurred.";
      toast({ title: isRegistering ? "Registration Failed" : "Login Failed", description: errorMessage, variant: "destructive" });
    }
    setIsLoading(false);
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
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Login/Register card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl shadow-primary/10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <Flame className="w-10 h-10 text-primary animate-pulse" />
              <div className="absolute inset-0 w-10 h-10 bg-primary/30 blur-xl rounded-full" />
            </div>
            <span className="text-3xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Xyfen
            </span>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">{isRegistering ? "Create Account" : "Welcome Back"}</h1>
            <p className="text-muted-foreground">{isRegistering ? "Register to access Xyfen" : "Sign in to continue to Xyfen"}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
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

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                  autoComplete={isRegistering ? "new-password" : "current-password"}
                />
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</label>
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>{isRegistering ? "Registering..." : "Signing in..."}</span>
                </div>
              ) : (
                isRegistering ? "Register" : "Sign In"
              )}
            </Button>
          </form>

          {/* Toggle login/register */}
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-primary underline"
            >
              {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Register"}
            </Button>
          </div>

          {/* Firebase / reCAPTCHA note */}
          <p className="mt-6 text-xs text-center text-muted-foreground">
            Secured by Firebase and protected with reCAPTCHA
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
