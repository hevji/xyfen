import { useState, useEffect } from "react";
import { Smartphone } from "lucide-react";

/**
 * MobileBlockModal Component
 * Displays a non-dismissible modal when accessing from mobile devices
 */
const MobileBlockModal = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice =
        /android.*mobile|iphone|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        );
      
      const isSmallScreen = window.innerWidth < 768;
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      
      setIsMobile(isMobileDevice || (isSmallScreen && hasTouch));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ Lock body scroll when modal is open
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-background flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="glass-strong rounded-3xl p-8 max-w-sm w-full text-center space-y-6 animate-fade-in relative">
        {/* Mobile Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-muted rounded-full blur-lg" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center border border-border/50">
            <Smartphone className="w-9 h-9 text-muted-foreground" />
          </div>
        </div>

        {/* Message */}
        <p className="text-foreground leading-relaxed text-lg font-medium">
          This website is not available on phone, we are
          working on it. Sorry for the inconvenience.
        </p>
      </div>
    </div>
  );
};

export default MobileBlockModal;
