// src/components/AuthGuard.tsx
import { useEffect, useState } from "react";
import { isLoginSubdomain } from "@/lib/auth";
import { getCurrentUser, onAuthStateChanged } from "@/lib/firebase";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const loginSubdomain = isLoginSubdomain();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (!user && !loginSubdomain) {
        window.location.href = "https://login.example.com/login";
      }
      setCheckingAuth(false);
    });
    return unsubscribe;
  }, [loginSubdomain]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
