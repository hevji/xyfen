import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeFirebase, onAuthStateChanged, getCurrentUser } from "@/lib/firebase";
import { isLoginSubdomain } from "@/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const loginSubdomain = isLoginSubdomain();

  useEffect(() => {
    initializeFirebase();

    const unsubscribe = onAuthStateChanged((user) => {
      if (!user && !loginSubdomain) {
        // Redirect only if not logged in and NOT on login subdomain
        window.location.href = "https://login.example.com/login";
      }
      setIsCheckingAuth(false);
    });

    return unsubscribe;
  }, [loginSubdomain]);

  if (isCheckingAuth) {
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
