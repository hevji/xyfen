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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check session first, then localStorage for incognito fallback
    return (
      sessionStorage.getItem("xyfen_authenticated") === "true" ||
      localStorage.getItem("xyfen_authenticated") === "true"
    );
  });

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

    if (!isAuthenticated && LOGIN_ENABLED) {
      setShowLogin(true);
    }
  }, [isAuthenticated]);

  // Initialize GA after consent
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

        {/* Analytics notice overlay in bottom-right */}
        <AnalyticsModal onAccept={() => setAnalyticsAccepted(true)} />

        {/* Login/Register modals as centered overlay */}
        {!isAuthenticated && LOGIN_ENABLED && (
          <>
            {showLogin && (
              <LoginScreen
                onLoginSuccess={handleLoginSuccess}
                onSwitchToRegister={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
              />
            )}
            {showRegister && (
              <RegisterScreen
                onRegisterSuccess={handleRegisterSuccess}
                onSwitchToLogin={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              />
            )}
          </>
        )}

        {/* Main website always visible */}
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
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
