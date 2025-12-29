import { useState, useEffect } from "react";
import { Flame, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { isLoginSubdomain } from "@/lib/auth";
import { signInWithEmail, onAuthStateChanged, getCurrentUser } from "@/lib/firebase";

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen = ({ onLoginSuccess }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { toast } = useToast();

  const loginSubdomain = isLoginSubdomain();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        toast({ title: "Welcome Back", description: `Logged in as ${user.email}` });
        onLoginSuccess();
        window.location.href = "https://app.example.com"; // redirect after login
      }
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, [onLoginSuccess, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithEmail(email, password);
      toast({ title: "Login Successful", description: `Welcome back ${result.user.email}` });
      window.location.href = "https://app.example.com"; // redirect after login
    } catch (err: any) {
      toast({ title: "Login Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="relative">
            <Flame className="w-9 h-9 text-primary animate-pulse" />
            <div className="absolute inset-0 w-9 h-9 bg-primary/30 blur-xl rounded-full" />
          </div>
          <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Xyfen
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11" />
            </div>
          </div>

          <div>
            <label>Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
