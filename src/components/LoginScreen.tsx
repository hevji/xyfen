import { useState, useEffect } from "react";
import { Flame, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { initializeFirebase, signInWithEmail, onAuthStateChanged } from "@/lib/firebase";
import { isLoginSubdomain } from "@/lib/auth";

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onSwitchToRegister?: () => void;
}

const LoginScreen = ({ onLoginSuccess, onSwitchToRegister }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);
  const { toast } = useToast();

  const loginSubdomain = isLoginSubdomain();

  // Initialize Firebase
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

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!firebaseLoaded) return;

    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        if (!loginSubdomain) {
          window.location.href = "https://app.example.com"; // redirect to main app
        } else {
          toast({ title: "Welcome Back", description: `Logged in as ${user.email}` });
          onLoginSuccess();
        }
      }
      setIsCheckingAuth(false);
    });

    return unsubscribe;
  }, [firebaseLoaded, loginSubdomain, onLoginSuccess, toast]);

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
      window.location.href = "https://app.example.com"; // redirect after login
    } catch (err: any) {
      const message = err.code === "auth/invalid-credential" ? "Invalid email or password" : err.message;
      toast({ title: "Login Failed", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!firebaseLoaded || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  // The rest of your LoginScreen JSX stays the same (inputs, buttons, modal styling)
  return (
    <div className="w-full max-w-md mx-auto">
      {/* ...Your modal JSX here, identical to your previous LoginScreen */}
    </div>
  );
};

export default LoginScreen;
