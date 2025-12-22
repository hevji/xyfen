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
      // Check if device is a mobile phone (not tablet)
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice =
        /android.*mobile|iphone|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        );
      
      // Additional check for touch capability and small screen
      const isSmallScreen = window.innerWidth < 768;
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      
      setIsMobile(isMobileDevice || (isSmallScreen && hasTouch));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-background flex items-center justify-center p-6">
      <div className="glass-strong rounded-2xl p-8 max-w-sm w-full text-center space-y-6 animate-fade-in">
        {/* Mobile Icon */}
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
          <Smartphone className="w-10 h-10 text-muted-foreground" />
        </div>

        {/* Message */}
        <p className="text-foreground leading-relaxed text-lg">
          This website is not available on your type of telephone, we are
          working on it. Sorry for the inconvenience.
        </p>
      </div>
    </div>
  );
};

export default MobileBlockModal;