import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Download from "./pages/Download";
import BackendSetup from "./pages/BackendSetup";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import WarningModal from "./components/WarningModal";
import MobileBlockModal from "./components/MobileBlockModal";
import LoginScreen from "./components/LoginScreen";
import { LOGIN_ENABLED } from "./config/auth";
import { initializeFirebase } from "./lib/firebase";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("xyfen_authenticated") === "true";
  });

  // Initialize Firebase
  useEffect(() => {
    const initFirebase = () => {
      if (window.firebase) {
        initializeFirebase();
      } else {
        setTimeout(initFirebase, 100);
      }
    };
    initFirebase();
  }, []);

  // Called when login/register succeeds
  const handleLoginSuccess = () => {
    sessionStorage.setItem("xyfen_authenticated", "true");
    setIsAuthenticated(true);
  };

  // Show login screen if enabled and not authenticated
  const showLogin = LOGIN_ENABLED && !isAuthenticated;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <MobileBlockModal />
        {showLogin ? (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            <WarningModal />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/download" element={<Download />} />
                <Route path="/backend-setup" element={<BackendSetup />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
