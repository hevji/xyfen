import { useState, useEffect } from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * WarningModal Component
 * Displays a fullscreen warning about copyright before allowing site access
 */
const WarningModal = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  const handleEnterSite = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("warningAccepted", "true");
    }, 600);
  };

  useEffect(() => {
    const accepted = sessionStorage.getItem("warningAccepted");
    if (accepted === "true") {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-center p-4 transition-all duration-600 ${
        isFading ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="glass-strong rounded-3xl p-8 md:p-10 max-w-lg w-full text-center space-y-8 animate-scale-in relative">
        {/* Warning Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-slow" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <AlertTriangle className="w-9 h-9 text-primary" />
          </div>
        </div>

        {/* Warning Title */}
        <h2 className="font-display text-3xl font-bold text-foreground">
          ⚠️ Warning ⚠️
        </h2>

        {/* Warning Text */}
        <p className="text-muted-foreground leading-relaxed text-lg">
          This site allows downloading content from YouTube. Make sure you
          respect copyright laws and YouTube's terms of service.
        </p>

        {/* Enter Site Button */}
        <Button
          variant="hero"
          size="xl"
          onClick={handleEnterSite}
          className="w-full gap-3 group"
        >
          Enter Site
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default WarningModal;