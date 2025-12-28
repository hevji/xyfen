import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

import Index from "./pages/Index";
import Download from "./pages/Download";
import BackendSetup from "./pages/BackendSetup";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WarningModal from "./components/WarningModal";
import MobileBlockModal from "./components/MobileBlockModal";
import AnalyticsModal from "./components/AnalyticsModal";

import { LOGIN_ENABLED } from "./config/auth";
import { initializeFirebase } from "./lib/firebase";

const queryClient = new QueryClient();

const MainApp = () => {
  const location = useLocation();
  const [isAuthenticated] = useState(() => {
    return (
      sessionStorage.getItem("xyfen_authenticated") === "true" ||
      localStorage.getItem("xyfen_authenticated") === "true"
    );
  });
  const [analyticsAccepted, setAnalyticsAccepted] = useState(false);

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

  useEffect(() => {
    if (analyticsAccepted) {
      ReactGA.initialize("G-L0SXBVTSSB");
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }
  }, [analyticsAccepted]);

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/register") {
      return;
    }

    if (!isAuthenticated && LOGIN_ENABLED) {
      window.location.href = "/login";
    }
  }, [isAuthenticated, location.pathname]);

  if (location.pathname === "/login" || location.pathname === "/register") {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  if (!isAuthenticated && LOGIN_ENABLED) {
    return null;
  }

  return (
    <>
      <WarningModal />
      <MobileBlockModal />
      <AnalyticsModal onAccept={() => setAnalyticsAccepted(true)} />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/download" element={<Download />} />
        <Route path="/backend-setup" element={<BackendSetup />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
