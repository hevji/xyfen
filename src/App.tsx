import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import Index from "./pages/Index";
import Download from "./pages/Download";
import BackendSetup from "./pages/BackendSetup";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

import WarningModal from "./components/WarningModal";
import MobileBlockModal from "./components/MobileBlockModal";

const queryClient = new QueryClient();

const MainApp = () => {
  return (
    <>
      <WarningModal />
      <MobileBlockModal />

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
  // 🔥 Hide and remove Lovable badge instantly
  useEffect(() => {
    // 1️⃣ Inject CSS to hide any badge immediately
    const style = document.createElement("style");
    style.innerHTML = `
      [id*="lovable"], .lovable-badge {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // 2️⃣ JS to remove badge completely after it loads
    const removeBadge = () => {
      const badge = document.querySelector('[id*="lovable"], .lovable-badge');
      if (badge) badge.remove();
    };

    removeBadge(); // try removing immediately

    const observer = new MutationObserver(removeBadge);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.head.removeChild(style);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainApp />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
