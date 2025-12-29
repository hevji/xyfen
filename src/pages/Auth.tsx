import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/cookies";
import { LOGIN_ENABLED } from "@/config/auth";

/**
 * Auth page - redirects based on login status
 */
const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If login is disabled, go straight to home
    if (!LOGIN_ENABLED) {
      navigate("/", { replace: true });
      return;
    }

    // Check authentication status
    const authenticated = isAuthenticated() || 
      sessionStorage.getItem("xyfen_authenticated") === "true" ||
      localStorage.getItem("xyfen_authenticated") === "true";

    if (authenticated) {
      navigate("/", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <span className="text-muted-foreground">Checking authentication...</span>
      </div>
    </div>
  );
};

export default Auth;
