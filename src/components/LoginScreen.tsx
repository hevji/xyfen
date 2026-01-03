import { useState, useEffect } from "react";
import { Flame, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  signInWithEmail,
  onAuthStateChanged,
  type FirebaseUser,
} from "@/lib/firebase";

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
  onSwitchToRegister?: () => void;
}

const LoginScreen = ({ onLoginSuccess, onSwitchToRegister }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user: FirebaseUser | null) => {
      if (user) {
        toast({ title: "Welcome Back", description: `Logged in as ${user.email}` });
        onLoginSuccess(user.email);
      }
      setIsCheckingAuth(false);
    });
    return unsubscribe;
  }, [onLoginSuccess, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signInWithEmail(email, password);
      toast({ title: "Login Successful", description: `Welcome back ${result.user.email}` });
      onLoginSuccess(result.user.email);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="relative">
            <Flame className="w-9 h-9 text-primary animate-pulse" />
            <div className="absolute inset-0 w-9 h-9 bg-primary/30 blur-xl rounded-full" />
          </div>
          <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Xyfen
          </span>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-xl font-semibold text-foreground mb-1">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue</p>
        </div>

        {isCheckingAuth && (
          <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span>Checking authentication...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-sm font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          {onSwitchToRegister ? (
            <button onClick={onSwitchToRegister} className="text-primary underline">
              Register
            </button>
          ) : (
            <a href="/register" className="text-primary underline">
              Register
            </a>
          )}
        </p>

        <p className="mt-4 text-xs text-center text-muted-foreground">Secured by Firebase</p>
      </div>
    </div>
  );
};

export default LoginScreen;
