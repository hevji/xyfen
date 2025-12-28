import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";

import Index from "./pages/Index";
import Download from "./pages/Download";
import BackendSetup from "./pages/BackendSetup";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import WarningModal from "./components/WarningModal";
import MobileBlockModal from "./components/MobileBlockModal";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import AnalyticsModal from "./components/AnalyticsModal";

import { LOGIN_ENABLED } from "./config/auth";
import { initializeFirebase } from "./lib/firebase";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [analyticsAccepted, setAnalyticsAccepted] = useState(false);

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

    // Check session/localStorage for authentication
    const auth = sessionStorage.getItem("xyfen_authenticated") || localStorage.getItem("xyfen_authenticated");
    if (auth === "true") setIsAuthenticated(true);
    else if (LOGIN_ENABLED) setShowLogin(true);
  }, []);

  // Initialize GA only after consent
  useEffect(() => {
    if (analyticsAccepted) {
      ReactGA.initialize("G-XXXXXXXXXX"); // replace with your GA4 ID
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }
  }, [analyticsAccepted]);

  const handleLoginSuccess = () => {
    sessionStorage.setItem("xyfen_authenticated", "true");
    localStorage.setItem("xyfen_authenticated", "true");
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleRegisterSuccess = () => {
    sessionStorage.setItem("xyfen_authenticated", "true");
    localStorage.setItem("xyfen_authenticated", "true");
    setIsAuthenticated(true);
    setShowRegister(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <MobileBlockModal />
        <AnalyticsModal onAccept={() => setAnalyticsAccepted(true)} />

        {!isAuthenticated && LOGIN_ENABLED && (
          <>
            {showLogin && <LoginScreen onLoginSuccess={handleLoginSuccess} />}
            {showRegister && <RegisterScreen onRegisterSuccess={handleRegisterSuccess} />}
          </>
        )}

        {isAuthenticated && analyticsAccepted && (
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
