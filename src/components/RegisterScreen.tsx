import { useState, useEffect } from "react";
import { Flame, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  registerWithEmail,
  onAuthStateChanged,
  initializeFirebase,
  type FirebaseUser,
} from "@/lib/firebase";

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterScreen = ({ onRegisterSuccess, onSwitchToLogin }: RegisterScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const { toast } = useToast();

  // Wait for Firebase to load
  useEffect(() => {
    const checkFirebase = () => {
      if (window.firebase) {
        initializeFirebase();
        setFirebaseLoaded(true);
      } else {
        setTimeout(checkFirebase, 100);
      }
    };
    checkFirebase();
  }, []);

  // Check auth state after Firebase loads
  useEffect(() => {
    if (!firebaseLoaded) return;

    const unsubscribe = onAuthStateChanged((user: FirebaseUser | null) => {
      if (user) {
        toast({ title: "Welcome!", description: `Logged in as ${user.email}` });
        onRegisterSuccess();
      }
      setIsCheckingAuth(false);
    });
    return unsubscribe;
  }, [firebaseLoaded, onRegisterSuccess, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }

    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    if (!agreed) {
      toast({ title: "You must agree to the Terms of Service", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerWithEmail(email, password);
      toast({ title: "Account Created!", description: `Welcome ${result.user.email}` });
      onRegisterSuccess();
    } catch (err: any) {
      const message = err.code === "auth/email-already-in-use"
        ? "An account with this email already exists"
        : err.message;
      toast({ title: "Registration Failed", description: message, variant: "destructive" });
    }

    setIsLoading(false);
  };

  if (isCheckingAuth && !firebaseLoaded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading...</span>
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
            <h1 className="text-2xl font-semibold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">Register to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                  autoComplete="new-password"
                />
              </div>
            </div>

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
                  className="underline text-primary hover:text-primary/80"
                >
                  Terms of Service
                </button>
              </span>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !agreed || !firebaseLoaded}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            {onSwitchToLogin ? (
              <button onClick={onSwitchToLogin} className="text-primary underline hover:text-primary/80">
                Sign In
              </button>
            ) : (
              <Link to="/login" className="text-primary underline hover:text-primary/80">
                Sign In
              </Link>
            )}
          </p>

          {/* Terms Modal */}
          {termsModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-card p-6 rounded-xl max-w-lg w-full mx-4 relative max-h-[80vh] overflow-hidden flex flex-col">
                <button
                  onClick={() => setTermsModalOpen(false)}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
                <h2 className="text-xl font-semibold mb-4">Terms of Service</h2>
                <div className="overflow-y-auto flex-1 space-y-2 text-sm pr-2">
                  <p>Terms of Service</p>
                  <p>Effective Date: December 23, 2025</p>
                  <p>
                    Welcome to Xyfen. By accessing or using our website, you agree to comply with
                    and be bound by these Terms of Service ("Terms"). If you do not agree to these
                    Terms, do not use the Service.
                  </p>
                  <p>
                    <strong>1. Use of the Service</strong>
                  </p>
                  <p>
                    Xyfen provides a tool that allows users to download content from online sources
                    for personal use. You agree to use the Service only for lawful purposes and in
                    compliance with all applicable laws.
                  </p>
                  <p>
                    <strong>2. Intellectual Property and Copyright</strong>
                  </p>
                  <p>You acknowledge that content available through the Service may be protected by copyright or other intellectual property laws. You agree not to:</p>
                  <ul className="pl-4 list-disc">
                    <li>Download content that you do not have the right to access.</li>
                    <li>Distribute, repost, sell, or share downloaded content without permission.</li>
                    <li>Use the Service for any illegal or unauthorized purpose.</li>
                    <li>The Service is intended for personal, non-commercial use only.</li>
                  </ul>
                  <p>
                    <strong>3. Prohibited Conduct</strong>
                  </p>
                  <ul className="pl-4 list-disc">
                    <li>Violate any applicable laws or regulations.</li>
                    <li>Upload, post, or distribute any content that infringes on intellectual property rights.</li>
                    <li>Use the Service to harass, abuse, or harm others.</li>
                    <li>Attempt to interfere with the proper functioning of the Service.</li>
                  </ul>
                  <p>
                    <strong>4. Disclaimer</strong>
                  </p>
                  <p>
                    The Service is provided "as-is" and we make no warranties regarding its
                    availability, accuracy, or legality of downloaded content. You assume all
                    responsibility for your use of the Service and the consequences of your actions.
                  </p>
                  <p>
                    <strong>5. Limitation of Liability</strong>
                  </p>
                  <p>
                    Xyfen is not liable for any direct, indirect, incidental, or consequential
                    damages arising from your use of the Service, including but not limited to
                    copyright infringement or misuse of downloaded content.
                  </p>
                  <p>
                    <strong>6. Changes to Terms</strong>
                  </p>
                  <p>
                    We may update these Terms at any time. Continued use of the Service constitutes
                    your acceptance of the revised Terms.
                  </p>
                  <p>
                    For questions or concerns about these Terms, please contact us at
                    tnzruho@gmail.com.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Button onClick={() => setTermsModalOpen(false)} className="w-full">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

          <p className="mt-6 text-xs text-center text-muted-foreground">Secured by Firebase</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
