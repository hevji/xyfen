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
