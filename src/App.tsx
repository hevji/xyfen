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
    // sessionStorage first, then localStorage fallback
    return (
      sessionStorage.getItem("xyfen_authenticated") === "true" ||
      localStorage.getItem("xyfen_authenticated") === "true"
    );
  });

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [analyticsAccepted, setAnalyticsAccepted] = useState(false);

  // Initialize Firebase and check any "open modal" flags set by /login or /register pages
  useEffect(() => {
    const initFirebase = () => {
      if (window.firebase) {
        initializeFirebase();
      } else {
        setTimeout(initFirebase, 100);
      }
    };
    initFirebase();

    // If a route requested opening the modal, honor it and clear the flag
    const openLogin = localStorage.getItem("xyfen_open_login");
    const openRegister = localStorage.getItem("xyfen_open_register");
    if (openLogin === "true") {
      localStorage.removeItem("xyfen_open_login");
      setShowLogin(true);
    } else if (openRegister === "true") {
      localStorage.removeItem("xyfen_open_register");
      setShowRegister(true);
    } else if (!isAuthenticated && LOGIN_ENABLED) {
      // default behavior: show login modal if auth required and not authed
      setShowLogin(true);
    }
    // NOTE: dependency intentionally empty — only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize GA after consent
  useEffect(() => {
    if (analyticsAccepted) {
      ReactGA.initialize("G-L0SXBVTSSB"); // <-- replace with your GA4 ID
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }
  }, [analyticsAccepted]);

  const handleLoginSuccess = () => {
    sessionStorage.setItem("xyfen_authenticated", "true");
    localStorage.setItem("xyfen_authenticated", "true");
    setIsAuthenticated(true);
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleRegisterSuccess = () => {
    sessionStorage.setItem("xyfen_authenticated", "true");
    localStorage.setItem("xyfen_authenticated", "true");
    setIsAuthenticated(true);
    setShowRegister(false);
    setShowLogin(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <MobileBlockModal />

        {/* Analytics notice overlay in bottom-right (non-blocking) */}
        <AnalyticsModal onAccept={() => setAnalyticsAccepted(true)} />

        {/* Login/Register modals are rendered by App only.
            Wrapping with a pointer-events wrapper forces non-blocking background interaction
            even if the internal component tries to use full-screen styles. */}
        {!isAuthenticated && LOGIN_ENABLED && (
          <>
            {showLogin && (
              <div className="fixed inset-0 z-50 pointer-events-none">
                <div className="pointer-events-auto flex items-center justify-center min-h-screen px-4">
                  <LoginScreen
                    onLoginSuccess={handleLoginSuccess}
                    onSwitchToRegister={() => {
                      setShowLogin(false);
                      setShowRegister(true);
                    }}
                  />
                </div>
              </div>
            )}

            {showRegister && (
              <div className="fixed inset-0 z-50 pointer-events-none">
                <div className="pointer-events-auto flex items-center justify-center min-h-screen px-4">
                  <RegisterScreen
                    onRegisterSuccess={handleRegisterSuccess}
                    onSwitchToLogin={() => {
                      setShowRegister(false);
                      setShowLogin(true);
                    }}
                  />
                </div>
              </div>
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
            {/* keep /login and /register routes — they simply toggle the modal via localStorage and navigate home */}
            <Route path="/login" element={<></>} />
            <Route path="/register" element={<></>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
